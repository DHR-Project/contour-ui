import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/stack";

export function Elevation() {
  return (
    <HStack gap="4" wrap="wrap">
      <Card elevation="flat" className="w-48">
        <Text textStyle="headline">Flat</Text>
        <Text textStyle="footnote" color="secondary">
          Border, no shadow
        </Text>
      </Card>
      <Card elevation="raised" className="w-48">
        <Text textStyle="headline">Raised</Text>
        <Text textStyle="footnote" color="secondary">
          Adds shadow-sm
        </Text>
      </Card>
    </HStack>
  );
}

export function CornerAndPadding() {
  return (
    <Card corner="squircle" padding="6" as="article" className="w-full max-w-96">
      <Text textStyle="headline">Squircle, custom padding</Text>
      <Text textStyle="footnote" color="secondary">
        corner=&quot;squircle&quot; with a fixed padding=&quot;6&quot; instead of the
        responsive default
      </Text>
    </Card>
  );
}
