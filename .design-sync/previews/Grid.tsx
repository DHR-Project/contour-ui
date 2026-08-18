import { Flex } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";

function Tile({ label }: { label: string }) {
  return (
    <Flex align="center" justify="center" className="h-16 rounded-md bg-fill-secondary">
      <Text textStyle="footnote" color="secondary">
        {label}
      </Text>
    </Flex>
  );
}

export function Fixed() {
  return (
    <Grid columns={3} gap="3">
      {Array.from({ length: 6 }, (_, i) => (
        <Tile key={i} label={String(i + 1)} />
      ))}
    </Grid>
  );
}

export function AutoFit() {
  return (
    <div className="max-w-sm">
      <Grid columns="auto-fit" minItemWidth="sm" gap="3">
        {Array.from({ length: 5 }, (_, i) => (
          <Tile key={i} label={`Auto ${i + 1}`} />
        ))}
      </Grid>
    </div>
  );
}
