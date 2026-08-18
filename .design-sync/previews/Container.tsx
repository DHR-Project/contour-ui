import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";

export function Page() {
  return (
    <div className="rounded-md border border-dashed border-separator">
      <Container variant="page">
        <Text textStyle="footnote" color="secondary">
          variant=&quot;page&quot; applies full-width edge margin + safe-area insets.
        </Text>
      </Container>
    </div>
  );
}

export function Content() {
  return (
    <div className="rounded-md border border-dashed border-separator">
      <Container variant="content">
        <Text textStyle="footnote" color="secondary">
          variant=&quot;content&quot; centers this text in a 720px reading column with
          responsive edge margin.
        </Text>
      </Container>
    </div>
  );
}
