import type { ReactNode } from 'react';

/** Renders **bold** runs as <strong>; everything else passes through as text. */
function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

const ORDERED = /^\d+[.)] /;

/**
 * Renders the lightweight markup used in long-form content fields:
 * blank line = paragraph, "## " prefix = heading, "- " lines = bullet list,
 * "1. " lines = numbered list, **text** = bold.
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
                <li key={j}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => ORDERED.test(l))) {
          return (
            <ol key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(ORDERED, ''))}</li>
              ))}
            </ol>
          );
        }
        if (block.startsWith('## ')) {
          return <h2 key={i}>{inline(block.slice(3))}</h2>;
        }
        return <p key={i}>{inline(block)}</p>;
      })}
    </>
  );
}
