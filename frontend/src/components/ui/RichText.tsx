/**
 * Renders the lightweight markup used in long-form content fields:
 * blank line = paragraph, "## " prefix = heading, "- " lines = bullet list.
 */
export function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        if (block.startsWith('## ')) {
          return <h2 key={i}>{block.slice(3)}</h2>;
        }
        return <p key={i}>{block}</p>;
      })}
    </>
  );
}
