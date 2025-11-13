'use client';

interface TextHighlightProps {
  text: string;
  highlight: string;
  className?: string;
  highlightClassName?: string;
}

export function TextHighlight({
  text,
  highlight,
  className = '',
  highlightClassName = 'bg-yellow-200 font-semibold',
}: TextHighlightProps) {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}
