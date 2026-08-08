"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TabBar } from "@/components/ui/tab-bar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { Dropdown } from "@/components/ui/dropdown";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import { Container } from "@/components/ui/container";
import { VStack, HStack } from "@/components/ui/stack";
import { Icon } from "@/components/icon";
import { toast } from "@/components/ui/toast";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useNotes } from "./notes-context";
import type { FolderId } from "@/lib/examples/notes-data";

export function FolderNav() {
  const sizeClass = useSizeClass();
  const isCompact = sizeClass === "compact";
  const { folders, activeFolder, setActiveFolder, folderCount } = useNotes();
  const router = useRouter();

  const items = folders.map((folder) => ({
    icon: folder.icon,
    label: folder.label,
    value: folder.id,
    badge: folderCount(folder.id),
  }));

  return (
    <div className="flex h-full flex-col bg-bg-primary">
      <TabBar
        items={items}
        value={activeFolder}
        onValueChange={(value) => {
          setActiveFolder(value as FolderId);
          router.push("/examples/notes");
        }}
      />
      {!isCompact && (
        <>
          <div className="min-h-0 flex-1" />
          <AccountFooter />
        </>
      )}
    </div>
  );
}

function AccountFooter() {
  const { syncing, iCloudSyncEnabled, setICloudSyncEnabled } = useNotes();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="border-t border-separator px-(--space-3) py-(--space-3)">
      <HStack align="center" gap="2" container={false}>
        <Dropdown
          trigger={
            <button type="button" aria-label="Account menu" className="relative shrink-0 rounded-full outline-none focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))]">
              <Avatar name="Jordan Lee" size="sm" />
              <Badge dot className="absolute -bottom-0.5 -right-0.5 ring-2 ring-bg-primary" />
            </button>
          }
          side="top"
          align="start"
          items={[
            { type: "label", text: "Jordan Lee" },
            { type: "action", icon: "user", label: "View Profile", onSelect: () => toast({ title: "Profile (demo only)" }) },
            { type: "action", icon: "settings", label: "Settings", onSelect: () => setSettingsOpen(true) },
            { type: "separator" },
            {
              type: "action",
              icon: "external-link",
              label: "Sign Out",
              role: "destructive",
              onSelect: () => toast({ title: "Signed out (demo only)", variant: "destructive" }),
            },
          ]}
        />
        <VStack gap="0" container={false} className="min-w-0 flex-1">
          <Text textStyle="footnote" weight="medium" truncate>
            Jordan Lee
          </Text>
          <Tooltip content={syncing ? "Syncing changes…" : "All changes synced"}>
            <span tabIndex={0} className="inline-flex w-fit items-center gap-1 outline-none">
              {syncing ? (
                <Progress size="sm" label="Syncing" />
              ) : (
                <Icon name="circle-check" size="xs" className="text-label-tertiary" />
              )}
              <Text as="span" textStyle="caption-2" color="tertiary">
                {syncing ? "Syncing…" : "Synced"}
              </Text>
            </span>
          </Tooltip>
        </VStack>
      </HStack>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen} title="Settings">
        <SheetContent>
          <SheetHeader>
            <Text textStyle="headline">Settings</Text>
          </SheetHeader>
          <Container variant="content">
            <VStack gap="section" className="py-(--space-4)">
              <Switch checked={iCloudSyncEnabled} onCheckedChange={setICloudSyncEnabled} label="Sync with iCloud" />
              <VStack gap="2">
                <HStack justify="between">
                  <Text textStyle="footnote" color="secondary">
                    iCloud Storage
                  </Text>
                  <Text textStyle="footnote" color="secondary">
                    4.1 GB of 5 GB
                  </Text>
                </HStack>
                <Progress variant="linear" value={82} color="tint" label="iCloud storage used" />
              </VStack>
            </VStack>
          </Container>
        </SheetContent>
      </Sheet>
    </div>
  );
}
