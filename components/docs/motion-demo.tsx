"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/stack";
import { Divider } from "@/components/ui/divider";
import { durations, springs, type DurationName, type SpringName } from "@/lib/motion";

const durationItems: { name: DurationName; usage: string }[] = [
  { name: "instant", usage: "press feedback" },
  { name: "fast", usage: "hover" },
  { name: "normal", usage: "fade, color" },
  { name: "slow", usage: "sheet, modal" },
  { name: "slower", usage: "page transition" },
];

const springItems: { name: SpringName; usage: string }[] = [
  { name: "snappy", usage: "button, toggle" },
  { name: "smooth", usage: "sheet, modal" },
  { name: "gentle", usage: "push navigation" },
  { name: "bouncy", usage: "drag release" },
];

/**
 * Plays a short slide using a plain CSS transition, so the duration value
 * can be felt rather than just read as a number.
 */
function DurationRow({ name, usage }: { name: DurationName; usage: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <Text as="span" variant="footnote" className="font-mono">
          duration-{name}
        </Text>
        <Text as="span" variant="caption2" color="tertiary">
          {durations[name]}ms - {usage}
        </Text>
      </div>
      <div className="h-8 w-32 shrink-0 overflow-hidden rounded-md bg-fill-tertiary px-1">
        <div
          className="mt-1 h-6 w-6 rounded-sm bg-tint"
          style={{
            transitionProperty: "transform",
            transitionDuration: `${durations[name]}ms`,
            transitionTimingFunction: "ease-out",
            transform: active ? "translateX(88px)" : "translateX(0px)",
          }}
        />
      </div>
      <Button
        variant="gray"
        size="sm"
        className="shrink-0"
        onClick={() => setActive((value) => !value)}
      >
        Play
      </Button>
    </div>
  );
}

/**
 * Plays the same slide using a Framer Motion spring, so stiffness/damping
 * differences between tokens are visible side by side with the duration list.
 */
function SpringRow({ name, usage }: { name: SpringName; usage: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <Text as="span" variant="footnote" className="font-mono">
          springs.{name}
        </Text>
        <Text as="span" variant="caption2" color="tertiary">
          stiffness {springs[name].stiffness}, damping {springs[name].damping} - {usage}
        </Text>
      </div>
      <div className="h-8 w-32 shrink-0 overflow-hidden rounded-md bg-fill-tertiary px-1">
        <motion.div
          className="mt-1 h-6 w-6 rounded-sm bg-tint"
          animate={{ x: active ? 88 : 0 }}
          transition={springs[name]}
        />
      </div>
      <Button
        variant="gray"
        size="sm"
        className="shrink-0"
        onClick={() => setActive((value) => !value)}
      >
        Play
      </Button>
    </div>
  );
}

/**
 * Interactive walkthrough of the motion tokens - a small box slides on
 * click so each duration/spring can be compared by feel, not just by value.
 */
export function MotionDemo() {
  return (
    <VStack gap="4" className="rounded-lg border border-separator p-6">
      <VStack gap="2">
        <Text variant="subheadline" className="font-semibold">
          Duration
        </Text>
        <Text variant="caption2" color="tertiary">
          Plain CSS transitions. Press Play to compare timing.
        </Text>
        {durationItems.map((item) => (
          <DurationRow key={item.name} name={item.name} usage={item.usage} />
        ))}
      </VStack>

      <Divider />

      <VStack gap="2">
        <Text variant="subheadline" className="font-semibold">
          Framer Motion springs
        </Text>
        <Text variant="caption2" color="tertiary">
          Import from lib/motion, pass to the transition prop. Press Play to compare feel.
        </Text>
        {springItems.map((item) => (
          <SpringRow key={item.name} name={item.name} usage={item.usage} />
        ))}
      </VStack>
    </VStack>
  );
}
