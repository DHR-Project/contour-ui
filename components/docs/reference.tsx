import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";

export interface DocsReferenceLink {
  label: string;
  href: string;
}

export interface DocsReferenceProps {
  /** Name of the underlying library this component is built on, e.g. "Radix Switch". */
  library: string;
  links: DocsReferenceLink[];
}

/**
 * Credits and links to the underlying library a component wraps. Only add
 * this section to components whose core behavior comes from a third-party
 * primitive (e.g. Switch on Radix Switch) - not to components that merely
 * use a small utility from one (e.g. Button's asChild via Radix Slot).
 */
export function DocsReference({ library, links }: DocsReferenceProps) {
  return (
    <div id="reference" className="flex scroll-mt-6 flex-col gap-3">
      <Text variant="title3">Reference</Text>
      <Text variant="footnote" color="tertiary">
        Built on {library}. This component styles and configures it - behavior, accessibility,
        and prop details beyond what is shown above are documented upstream.
      </Text>
      <div className="flex flex-col gap-2 rounded-lg border border-separator p-4">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-tint hover:underline"
          >
            <Text as="span" variant="body">
              {link.label}
            </Text>
            <Icon name="external-link" size={14} />
          </a>
        ))}
      </div>
    </div>
  );
}
