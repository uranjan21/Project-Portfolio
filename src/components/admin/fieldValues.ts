import type { FieldSpec } from './schemas';

// Conversion between typed section values and the string form shown in inputs.

type AnyRecord = Record<string, unknown>;

function getPath(obj: AnyRecord, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => (acc as AnyRecord | undefined)?.[key], obj);
}

function setPath(obj: AnyRecord, path: string, value: unknown): void {
  const keys = path.split('.');
  let cursor = obj;
  for (const key of keys.slice(0, -1)) {
    if (typeof cursor[key] !== 'object' || cursor[key] === null) cursor[key] = {};
    cursor = cursor[key] as AnyRecord;
  }
  cursor[keys[keys.length - 1]] = value;
}

export function toInputString(item: AnyRecord, field: FieldSpec): string {
  const raw = getPath(item, field.key);
  switch (field.type) {
    case 'tags':
      return Array.isArray(raw) ? raw.join(', ') : '';
    case 'lines':
      return Array.isArray(raw) ? raw.join('\n') : '';
    case 'pairs':
      return Array.isArray(raw)
        ? (raw as { label: string; value: string }[]).map((p) => `${p.label} | ${p.value}`).join('\n')
        : '';
    case 'number':
      return raw === undefined || raw === null ? '' : String(raw);
    case 'boolean':
      return raw ? 'yes' : 'no';
    default:
      return typeof raw === 'string' ? raw : '';
  }
}

export function applyInputString(item: AnyRecord, field: FieldSpec, input: string): void {
  switch (field.type) {
    case 'tags':
      setPath(item, field.key, input.split(',').map((s) => s.trim()).filter(Boolean));
      break;
    case 'lines':
      setPath(item, field.key, input.split('\n').map((s) => s.trim()).filter(Boolean));
      break;
    case 'pairs':
      setPath(
        item,
        field.key,
        input
          .split('\n')
          .map((line) => {
            const [label = '', value = ''] = line.split('|').map((s) => s.trim());
            return { label, value };
          })
          .filter((p) => p.label && p.value),
      );
      break;
    case 'number': {
      const n = Number(input);
      setPath(item, field.key, Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0);
      break;
    }
    case 'boolean':
      setPath(item, field.key, input === 'yes');
      break;
    default:
      setPath(item, field.key, input.trim());
  }
}
