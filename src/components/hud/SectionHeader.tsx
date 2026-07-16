interface SectionHeaderProps {
  index: string;
  title: string;
  onEdit?: () => void;
}

/** "01 // TITLE ————" header line; shows an EDIT chip when admin passes onEdit. */
export function SectionHeader({ index, title, onEdit }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <span className="index">{index} //</span>
      <h2>{title}</h2>
      <span className="rule" />
      {onEdit && (
        <button className="edit-chip" onClick={onEdit}>
          Edit
        </button>
      )}
    </div>
  );
}
