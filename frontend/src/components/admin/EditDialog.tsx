import { useMemo, useState } from 'react';
import type { PortfolioData, SectionKey } from '../../../shared/types';
import { usePortfolio } from '../../context/PortfolioContext';
import { Dialog } from './Dialog';
import { applyInputString, toInputString } from './fieldValues';
import { SECTION_SCHEMAS } from './schemas';
import type { FieldSpec } from './schemas';

type AnyRecord = Record<string, unknown>;

interface EditDialogProps {
  section: SectionKey;
  onClose: () => void;
}

function FieldInputs({
  fields,
  values,
  onChange,
}: {
  fields: FieldSpec[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <>
      {fields.map((field) => (
        <div key={field.key}>
          <label htmlFor={`field-${field.key}`}>{field.label}</label>
          {field.type === 'textarea' || field.type === 'lines' || field.type === 'pairs' ? (
            <textarea
              id={`field-${field.key}`}
              value={values[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          ) : field.type === 'boolean' ? (
            <select
              id={`field-${field.key}`}
              value={values[field.key] ?? 'no'}
              onChange={(e) => onChange(field.key, e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          ) : (
            <input
              id={`field-${field.key}`}
              type={field.type === 'number' ? 'number' : 'text'}
              value={values[field.key] ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          )}
          {field.hint && <div className="hint">{field.hint}</div>}
        </div>
      ))}
    </>
  );
}

function itemToStrings(item: AnyRecord, fields: FieldSpec[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, toInputString(item, f)]));
}

function stringsToItem(base: AnyRecord, fields: FieldSpec[], values: Record<string, string>): AnyRecord {
  const item = structuredClone(base);
  for (const field of fields) applyInputString(item, field, values[field.key] ?? '');
  return item;
}

/**
 * Schema-driven editor for any portfolio section. Object sections (profile)
 * render a flat form; collection sections render a reorderable item list with
 * a per-item form.
 */
export function EditDialog({ section, onClose }: EditDialogProps) {
  const { data, saveSection } = usePortfolio();
  const schema = SECTION_SCHEMAS[section];

  const initialItems = useMemo<AnyRecord[]>(() => {
    if (schema.kind !== 'collection' || !data) return [];
    return structuredClone(data[section] as unknown as AnyRecord[]);
  }, [schema.kind, data, section]);

  // Object-section form state.
  const [objectValues, setObjectValues] = useState<Record<string, string>>(() =>
    schema.kind === 'object' && data ? itemToStrings(data[section] as unknown as AnyRecord, schema.fields) : {},
  );

  // Collection-section state.
  const [items, setItems] = useState<AnyRecord[]>(initialItems);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [itemValues, setItemValues] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!data) return null;

  const save = async (value: unknown) => {
    setSaving(true);
    setError(null);
    try {
      await saveSection(section, value as PortfolioData[SectionKey]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setSaving(false);
    }
  };

  if (schema.kind === 'object') {
    return (
      <Dialog title={schema.title} onClose={onClose}>
        <FieldInputs
          fields={schema.fields}
          values={objectValues}
          onChange={(key, value) => setObjectValues((v) => ({ ...v, [key]: value }))}
        />
        {error && <div className="error">{error}</div>}
        <div className="dialog-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn primary"
            disabled={saving}
            onClick={() => save(stringsToItem(data[section] as unknown as AnyRecord, schema.fields, objectValues))}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </Dialog>
    );
  }

  // --- Collection editing ---

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setItemValues(itemToStrings(items[index], schema.fields));
  };

  const addItem = () => {
    const fresh: AnyRecord = { id: `${schema.idPrefix}-${Date.now()}` };
    setItems((list) => [...list, fresh]);
    setEditingIndex(items.length);
    setItemValues(itemToStrings(fresh, schema.fields));
  };

  const applyItem = () => {
    if (editingIndex === null) return;
    setItems((list) =>
      list.map((item, i) => (i === editingIndex ? stringsToItem(item, schema.fields, itemValues) : item)),
    );
    setEditingIndex(null);
  };

  const removeItem = (index: number) => {
    setItems((list) => list.filter((_, i) => i !== index));
  };

  const move = (index: number, delta: -1 | 1) => {
    setItems((list) => {
      const target = index + delta;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <Dialog title={schema.title} onClose={onClose}>
      {editingIndex === null ? (
        <>
          <div className="item-list">
            {items.map((item, i) => (
              <div className="item-row" key={String(item.id ?? i)}>
                <span className="item-title">{String(item[schema.labelKey] ?? '(new item)')}</span>
                <button className="mini" onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
                <button className="mini" onClick={() => move(i, 1)} disabled={i === items.length - 1}>▼</button>
                <button className="mini" onClick={() => startEdit(i)}>Edit</button>
                <button className="mini danger" onClick={() => removeItem(i)}>Del</button>
              </div>
            ))}
            {items.length === 0 && <div className="hint">No entries yet — add one below.</div>}
          </div>
          <button className="btn magenta" onClick={addItem}>+ Add entry</button>
          {error && <div className="error">{error}</div>}
          <div className="dialog-actions">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" disabled={saving} onClick={() => save(items)}>
              {saving ? 'Saving…' : 'Save all'}
            </button>
          </div>
        </>
      ) : (
        <>
          <FieldInputs
            fields={schema.fields}
            values={itemValues}
            onChange={(key, value) => setItemValues((v) => ({ ...v, [key]: value }))}
          />
          <div className="dialog-actions">
            <button className="btn" onClick={() => setEditingIndex(null)}>Back</button>
            <button className="btn primary" onClick={applyItem}>Apply</button>
          </div>
        </>
      )}
    </Dialog>
  );
}
