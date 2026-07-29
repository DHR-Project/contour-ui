export interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-md bg-fill-tertiary p-4">
      <code className="font-mono text-footnote text-label-primary">{code}</code>
    </pre>
  );
}
