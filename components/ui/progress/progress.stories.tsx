import { useState } from "react";
import type { Story } from "@ladle/react";
import { Progress } from "./progress";
import { HStack, VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components / Progress",
};

export default meta;

export const CircularIndeterminate: Story = () => (
  <HStack gap="6" align="center">
    <Progress label="Loading, small" size="sm" />
    <Progress label="Loading" size="md" />
    <Progress label="Loading, large" size="lg" />
  </HStack>
);

export const CircularDeterminate: Story = () => (
  <HStack gap="6" align="center">
    <Progress value={0} label="0%" />
    <Progress value={25} label="25%" />
    <Progress value={60} label="60%" />
    <Progress value={100} label="100%" />
  </HStack>
);

export const CircularColors: Story = () => (
  <HStack gap="6" align="center">
    <Progress label="Tint" color="tint" value={75} />
    <Progress label="Success" color="success" value={75} />
    <Progress label="Warning" color="warning" value={75} />
    <Progress label="Destructive" color="destructive" value={75} />
  </HStack>
);

export const LinearDeterminate: Story = () => (
  <VStack gap="4" className="w-full max-w-xs">
    <Progress variant="linear" value={0} label="0%" />
    <Progress variant="linear" value={30} label="30%" />
    <Progress variant="linear" value={70} label="70%" />
    <Progress variant="linear" value={100} label="Done" />
  </VStack>
);

export const LinearColors: Story = () => (
  <VStack gap="4" className="w-full max-w-xs">
    <Progress variant="linear" value={60} color="tint" label="Uploading" />
    <Progress variant="linear" value={60} color="success" label="Done" />
    <Progress variant="linear" value={60} color="warning" label="Warning" />
    <Progress variant="linear" value={60} color="destructive" label="Error" />
  </VStack>
);

export const LiveProgress: Story = () => {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(false);

  function start() {
    setRunning(true);
    setValue(0);
    let v = 0;
    const interval = setInterval(() => {
      v = Math.min(100, v + Math.random() * 12);
      setValue(Math.round(v));
      if (v >= 100) {
        clearInterval(interval);
        setRunning(false);
      }
    }, 200);
  }

  return (
    <VStack gap="4" className="w-full max-w-xs">
      <HStack gap="3" align="center">
        <Progress value={value} label={`${value}%`} />
        <Progress variant="linear" value={value} label={`${value}%`} />
        <Text textStyle="footnote" color="secondary">{value}%</Text>
      </HStack>
      <Button size="sm" disabled={running} onClick={start}>
        {running ? "Running…" : "Start"}
      </Button>
    </VStack>
  );
};

export const DiameterEscapeHatch: Story = () => (
  <HStack gap="4" align="center">
    <Progress value={65} diameter={48} strokeWidth={4} label="Custom 48px" />
    <Progress value={65} diameter={64} strokeWidth={5} label="Custom 64px" />
  </HStack>
);
