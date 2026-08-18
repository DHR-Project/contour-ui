import { Progress } from "@/components/ui/progress";
import { HStack, VStack } from "@/components/ui/stack";

export function Circular() {
  return (
    <HStack gap="6" align="center">
      {/* Indeterminate */}
      <Progress label="Loading, small" size="sm" />
      <Progress label="Loading" size="md" />
      <Progress label="Loading, large" size="lg" />
      {/* Determinate */}
      <Progress value={25} label="25%" />
      <Progress value={75} label="75%" />
    </HStack>
  );
}

export function Linear() {
  return (
    <VStack gap="4" className="w-full max-w-xs">
      <Progress variant="linear" value={40} label="40%" />
      <Progress variant="linear" value={75} label="75%" color="success" />
      <Progress variant="linear" value={90} label="90%" color="warning" />
    </VStack>
  );
}
