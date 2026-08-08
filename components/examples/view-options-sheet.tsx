"use client";

import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import { Container } from "@/components/ui/container";
import { VStack, HStack } from "@/components/ui/stack";
import { RadioGroup } from "@/components/ui/radio";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useNotes } from "./notes-context";

export interface ViewOptionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showAttachments: boolean;
  onShowAttachmentsChange: (value: boolean) => void;
}

export function ViewOptionsSheet({ open, onOpenChange, showAttachments, onShowAttachmentsChange }: ViewOptionsSheetProps) {
  const { sortBy, setSortBy, viewMode, setViewMode, sortCheckedToBottom, setSortCheckedToBottom, textScale, setTextScale } =
    useNotes();

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="View Options">
      <SheetContent>
        <SheetHeader>
          <Text textStyle="headline">View Options</Text>
        </SheetHeader>
        <Container variant="content">
          <VStack gap="section" className="py-(--space-4)">
            <VStack gap="2">
              <Text textStyle="footnote" weight="semibold" color="secondary">
                Layout
              </Text>
              <SegmentedControl
                value={viewMode}
                onValueChange={(value) => setViewMode(value as "list" | "grid")}
                options={[
                  { value: "list", label: "List", icon: "layers" },
                  { value: "grid", label: "Grid", icon: "layout-grid" },
                ]}
              />
            </VStack>

            <VStack gap="2">
              <Text textStyle="footnote" weight="semibold" color="secondary">
                Sort By
              </Text>
              <RadioGroup
                value={sortBy}
                onValueChange={(value) => setSortBy(value as typeof sortBy)}
                options={[
                  { value: "updated", label: "Date Edited" },
                  { value: "created", label: "Date Created" },
                  { value: "title", label: "Title" },
                ]}
              />
            </VStack>

            <VStack gap="3">
              <HStack justify="between">
                <Text textStyle="footnote" weight="semibold" color="secondary">
                  Text Size
                </Text>
                <Text textStyle="footnote" color="tertiary">
                  {textScale}%
                </Text>
              </HStack>
              <Slider
                value={textScale}
                onValueChange={(value) => setTextScale(value as number)}
                min={80}
                max={140}
                step={10}
                thumbLabel="Text size"
              />
            </VStack>

            <VStack gap="3">
              <Switch
                checked={sortCheckedToBottom}
                onCheckedChange={setSortCheckedToBottom}
                label="Sort checked items to bottom"
              />
              <Checkbox
                checked={showAttachments}
                onCheckedChange={onShowAttachmentsChange}
                label="Show attachment previews in list"
              />
            </VStack>
          </VStack>
        </Container>
      </SheetContent>
    </Sheet>
  );
}
