"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs, durations } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Flex } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { HStack, VStack, Stack } from "@/components/ui/stack";
import type { StackDirection } from "@/components/ui/stack";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { List } from "@/components/ui/list";
import { ListItem } from "@/components/ui/list";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SearchField } from "@/components/ui/search-field";
import type { SearchFieldResult } from "@/components/ui/search-field";
import { NavBar } from "@/components/ui/nav-bar";
import { TabBar } from "@/components/ui/tab-bar";
import type { TabBarItem } from "@/components/ui/tab-bar";
import { Sidebar } from "@/components/ui/sidebar";
import type { SidebarItem } from "@/components/ui/sidebar";
import { Toolbar } from "@/components/ui/toolbar";
import { Dropdown } from "@/components/ui/dropdown";
import type { DropdownItemDef } from "@/components/ui/dropdown";
import { ContextMenu } from "@/components/ui/context-menu";
import { Popover } from "radix-ui";
import { Icon, iconNames } from "@/components/icon";
import { DocsCodeBlock } from "@/components/docs/docs-ui";
import { SizeClassPreview } from "@/components/docs/docs-size-class-preview";
import { Alert } from "@/components/ui/alert";
import { Toaster, toast } from "@/components/ui/toast";
import type { ToastInput, ToastPosition } from "@/components/ui/toast";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Demo registry -- each component slug maps to a list of small, titled
// examples. Every example pairs a live render of the real Contour component
// with a copy-pasteable code snippet, so related cases (variants, sizes,
// states...) show up as separate, scannable blocks instead of one big
// kitchen-sink render. Only rendered on /docs/components/[slug] for
// status === "complete".
// ---------------------------------------------------------------------------

interface DemoExample {
  title: string;
  description?: string;
  code: string;
  Component: () => ReactNode;
  /** Wraps the demo in a compact/regular toggle for components whose rendering depends on useSizeClass(). */
  sizeClassPreview?: boolean;
}

// ---------------------------------------------------------------------------
// Shared demo-only helpers (not part of the public component API -- kept out
// of the "code" strings shown to readers, which show idiomatic usage with
// plain placeholder children instead).
// ---------------------------------------------------------------------------

function ScrollBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("h-64 overflow-y-auto rounded-lg border border-separator", className)}>
      {children}
    </div>
  );
}

function ScrollFiller({ count = 12 }: { count?: number }) {
  return (
    <VStack gap="4" className="p-(--space-4)">
      {Array.from({ length: count }, (_, i) => (
        <Text key={i} textStyle="footnote" color="secondary">
          Scroll to see the bar react to scroll position -- line {i + 1}.
        </Text>
      ))}
    </VStack>
  );
}

function Tile({ label, className }: { label: string; className?: string }) {
  return (
    <Flex
      align="center"
      justify="center"
      className={cn("h-16 rounded-md bg-fill-secondary", className)}
    >
      <Text textStyle="footnote" color="secondary">
        {label}
      </Text>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Flex
// ---------------------------------------------------------------------------

function FlexRowDemo() {
  return (
    <Flex gap="3">
      <Tile label="1" />
      <Tile label="2" />
      <Tile label="3" />
    </Flex>
  );
}

function FlexColumnDemo() {
  return (
    <Flex direction="column" gap="2" className="max-w-40">
      <Tile label="Column A" />
      <Tile label="Column B" />
    </Flex>
  );
}

function FlexJustifyDemo() {
  return (
    <Flex justify="between" align="center" gap="2">
      <Tile label="Start" />
      <Tile label="End" />
    </Flex>
  );
}

function FlexWrapDemo() {
  return (
    <Flex wrap="wrap" gap="2" className="max-w-48">
      {Array.from({ length: 4 }, (_, i) => (
        <Tile key={i} label={String(i + 1)} className="w-20" />
      ))}
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

function GridFixedDemo() {
  return (
    <Grid columns={3} gap="3">
      {Array.from({ length: 6 }, (_, i) => (
        <Tile key={i} label={String(i + 1)} />
      ))}
    </Grid>
  );
}

function GridAutoFitDemo() {
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

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------

function StackAliasesDemo() {
  return (
    <VStack gap="3">
      <HStack gap="3">
        <Tile label="A" />
        <Tile label="B" />
      </HStack>
      <Tile label="C" />
    </VStack>
  );
}

function StackConditionalDirectionDemo() {
  const [direction, setDirection] = useState<StackDirection>("horizontal");
  return (
    <VStack gap="4">
      <div className="max-w-64">
        <SegmentedControl
          value={direction}
          onValueChange={(v) => setDirection(v as StackDirection)}
          options={[
            { value: "horizontal", label: "Horizontal" },
            { value: "vertical", label: "Vertical" },
          ]}
        />
      </div>
      <Stack direction={direction} gap="3">
        <Tile label="A" />
        <Tile label="B" />
        <Tile label="C" />
      </Stack>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------

function ContainerPageDemo() {
  return (
    <div className="rounded-md border border-dashed border-separator">
      <Container variant="page">
        <Text textStyle="footnote" color="secondary">
          variant=&quot;page&quot; applies full-width edge margin + safe-area
          insets.
        </Text>
      </Container>
    </div>
  );
}

function ContainerContentDemo() {
  return (
    <div className="rounded-md border border-dashed border-separator">
      <Container variant="content">
        <Text textStyle="footnote" color="secondary">
          variant=&quot;content&quot; centers this text in a 720px reading
          column with responsive edge margin.
        </Text>
      </Container>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NavBar
// ---------------------------------------------------------------------------

function NavBarCompactDemo() {
  return (
    <ScrollBox>
      <NavBar
        title="Inbox"
        largeTitleMode={false}
        leadingAction={{
          icon: "chevron-left",
          label: "Back",
          onClick: () => {},
        }}
        trailingActions={[
          { icon: "search", label: "Search", onClick: () => {} },
          { icon: "settings", label: "Settings", onClick: () => {} },
        ]}
      />
      <ScrollFiller />
    </ScrollBox>
  );
}

function NavBarLargeTitleDemo() {
  return (
    <ScrollBox>
      <NavBar title="Inbox" largeTitleMode />
      <ScrollFiller />
    </ScrollBox>
  );
}

function NavBarDefaultDemo() {
  return (
    <ScrollBox>
      <NavBar title="Inbox" />
      <ScrollFiller />
    </ScrollBox>
  );
}

// ---------------------------------------------------------------------------
// TabBar
// ---------------------------------------------------------------------------

function TabBarDemo() {
  const items: TabBarItem[] = [
    { icon: "home", label: "Home" },
    { icon: "search", label: "Search" },
    { icon: "bell", label: "Alerts", badge: 3 },
    { icon: "user", label: "Profile" },
  ];
  const [value, setValue] = useState("Home");
  return (
    // Short filler, on purpose: the "top" pill variant is sticky-positioned,
    // and a scrolling container's scrollHeight doesn't fully account for a
    // stuck sticky element's box, which clips it a few px past the fold.
    // Keeping content short enough to avoid overflow sidesteps that instead
    // of fighting it -- both position variants are visible without scrolling.
    <ScrollBox>
      <Flex direction="column" justify="between" className="h-full">
        <ScrollFiller count={4} />
        <TabBar items={items} value={value} onValueChange={setValue} />
      </Flex>
    </ScrollBox>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function SidebarDemo() {
  const items: SidebarItem[] = [
    { value: "home", icon: "home", label: "Home" },
    { value: "search", icon: "search", label: "Search" },
    { value: "alerts", icon: "bell", label: "Alerts", badge: 3 },
    { value: "profile", icon: "user", label: "Profile" },
  ];
  const [value, setValue] = useState("home");
  return (
    <div className="h-80 w-64 overflow-hidden rounded-md border border-separator">
      <Sidebar items={items} value={value} onValueChange={setValue} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

function ToolbarBottomDemo() {
  return (
    <ScrollBox>
      <ScrollFiller />
      <Toolbar
        actions={[
          { icon: "share", label: "Share", onClick: () => {} },
          { icon: "star", label: "Favorite", onClick: () => {} },
          { icon: "trash", label: "Delete", onClick: () => {} },
        ]}
      />
    </ScrollBox>
  );
}

function ToolbarTopIconOnlyDemo() {
  return (
    <ScrollBox>
      <Toolbar
        position="top"
        actions={[
          { icon: "search", onClick: () => {} },
          { icon: "settings", onClick: () => {} },
        ]}
      />
      <ScrollFiller />
    </ScrollBox>
  );
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

function ButtonVariantsDemo() {
  return (
    <HStack gap="3" wrap="wrap">
      <Button variant="filled">Filled</Button>
      <Button variant="tinted">Tinted</Button>
      <Button variant="plain">Plain</Button>
    </HStack>
  );
}

function ButtonRolesStatesDemo() {
  return (
    <HStack gap="3" wrap="wrap">
      <Button variant="filled" role="destructive">
        Delete
      </Button>
      <Button variant="tinted" leadingIcon="share">
        Share
      </Button>
      <Button variant="plain" loading>
        Loading
      </Button>
      <Button variant="filled" disabled>
        Disabled
      </Button>
    </HStack>
  );
}

function ButtonSizesDemo() {
  return (
    <HStack gap="3" wrap="wrap" align="center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </HStack>
  );
}

function ButtonIconsShapeDemo() {
  return (
    <HStack gap="3" wrap="wrap" align="center">
      <Button trailingIcon="chevron-right">Next</Button>
      <Button corner="squircle" variant="tinted">
        Squircle
      </Button>
      <Button aria-label="Favorite" leadingIcon="star" variant="plain" />
    </HStack>
  );
}

function ButtonFullWidthDemo() {
  return (
    <Button fullWidth className="max-w-64">
      Full width
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

function CheckboxStatesDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <HStack gap="4" align="center" wrap="wrap">
      <Checkbox
        label="Remember me"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Checkbox checked="indeterminate" label="Indeterminate" />
      <Checkbox disabled label="Disabled" />
      <Checkbox disabled checked label="Disabled, checked" />
    </HStack>
  );
}

function CheckboxSizeAccessibleDemo() {
  return (
    <HStack gap="4" align="center">
      <Checkbox size="sm" checked label="Small" />
      <Checkbox aria-label="Unlabeled checkbox" checked />
    </HStack>
  );
}

// ---------------------------------------------------------------------------
// Radio
// ---------------------------------------------------------------------------

function RadioHorizontalDemo() {
  const [value, setValue] = useState("day");
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      direction="horizontal"
      options={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
    />
  );
}

function RadioVerticalSmallDemo() {
  const [value, setValue] = useState("email");
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      size="sm"
      options={[
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
        { value: "push", label: "Push (disabled)", disabled: true },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------

function SwitchOnOffDemo() {
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(false);
  return (
    <HStack gap="4" align="center" wrap="wrap">
      <Switch label="Wi-Fi" checked={checked} onCheckedChange={setChecked} />
      <Switch
        label="Bluetooth"
        checked={checked2}
        onCheckedChange={setChecked2}
      />
    </HStack>
  );
}

function SwitchDisabledDemo() {
  return (
    <HStack gap="4" align="center" wrap="wrap">
      <Switch
        label="Disabled, off"
        checked={false}
        disabled
        onCheckedChange={() => {}}
      />
      <Switch
        aria-label="Unlabeled switch"
        checked
        disabled
        onCheckedChange={() => {}}
      />
    </HStack>
  );
}

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

function SliderSingleDemo() {
  const [value, setValue] = useState<number>(40);
  return (
    <div className="w-full max-w-72">
      <Slider
        value={value}
        onValueChange={(v) => setValue(v as number)}
        thumbLabel="Volume"
      />
    </div>
  );
}

function SliderRangeDemo() {
  const [range, setRange] = useState<number[]>([20, 70]);
  return (
    <div className="w-full max-w-72">
      <Slider
        value={range}
        onValueChange={(v) => setRange(v as number[])}
        thumbLabel={["Min price", "Max price"]}
      />
    </div>
  );
}

function SliderDisabledDemo() {
  return (
    <div className="w-full max-w-72">
      <Slider
        value={60}
        onValueChange={() => {}}
        disabled
        thumbLabel="Disabled"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SegmentedControl
// ---------------------------------------------------------------------------

function SegmentedControlDefaultDemo() {
  const [value, setValue] = useState("day");
  return (
    <div className="w-full max-w-80">
      <SegmentedControl
        value={value}
        onValueChange={setValue}
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
      />
    </div>
  );
}

function SegmentedControlIconOnlyDemo() {
  const [theme, setTheme] = useState("system");
  return (
    <div className="w-full max-w-56">
      <SegmentedControl
        value={theme}
        onValueChange={setTheme}
        size="small"
        iconOnly
        options={[
          { value: "light", label: "Light", icon: "sun" },
          { value: "dark", label: "Dark", icon: "moon" },
          { value: "system", label: "System", icon: "monitor" },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

function BadgeCounterDemo() {
  return (
    <HStack gap="4" align="center">
      <Badge count={1} />
      <Badge count={9} />
      <Badge count={42} />
      <Badge count={999} />
      <Badge dot />
    </HStack>
  );
}

function BadgeStatusDemo() {
  return (
    <VStack gap="3">
      <HStack gap="3" align="center">
        <Badge variant="status" label="New" color="tint" />
        <Badge variant="status" label="Beta" color="warning" />
        <Badge variant="status" label="Error" color="destructive" />
        <Badge variant="status" label="Done" color="success" />
      </HStack>
      <HStack gap="3" align="center">
        <Badge variant="status" label="New" color="tint" tone="tinted" />
        <Badge variant="status" label="Beta" color="warning" tone="tinted" />
        <Badge variant="status" label="Error" color="destructive" tone="tinted" />
        <Badge variant="status" label="Done" color="success" tone="tinted" />
      </HStack>
    </VStack>
  );
}

function BadgePositionedDemo() {
  return (
    <HStack gap="6" align="center">
      <div className="relative inline-block">
        <Icon name="bell" size="lg" />
        <Badge count={3} className="absolute -top-1 -right-1" />
      </div>
      <div className="relative inline-block">
        <Icon name="circle-check" size="lg" />
        <Badge count={42} className="absolute -top-1 -right-1" />
      </div>
      <div className="relative inline-block">
        <Icon name="bell" size="lg" />
        <Badge dot className="absolute -top-0.5 -right-0.5" />
      </div>
    </HStack>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function AvatarSizesDemo() {
  return (
    <HStack gap="4" align="center">
      <Avatar name="Alice Johnson" size="xs" />
      <Avatar name="Bob Smith" size="sm" />
      <Avatar name="Carol White" size="md" />
      <Avatar name="David Lee" size="lg" />
      <Avatar name="Eve Kim" size="xl" />
    </HStack>
  );
}

function AvatarFallbackDemo() {
  return (
    <HStack gap="4" align="center">
      {/* No props — icon fallback */}
      <Avatar size="md" />
      {/* Name only — initials + deterministic color */}
      <Avatar name="Alice Johnson" size="md" />
      <Avatar name="Bob Smith" size="md" />
      <Avatar name="Carol White" size="md" />
      {/* With broken src — falls back to initials after delayMs=600 */}
      <Avatar
        src="https://example.com/broken.jpg"
        alt="Broken"
        name="Nguyễn Văn A"
        size="md"
      />
    </HStack>
  );
}

function AvatarShapesDemo() {
  return (
    <HStack gap="4" align="center">
      <Avatar name="Alice Johnson" size="lg" shape="circle" />
      <Avatar name="Alice Johnson" size="lg" shape="squircle" />
    </HStack>
  );
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

function ProgressCircularDemo() {
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

function ProgressLinearDemo() {
  const [value, setValue] = useState(0);
  return (
    <VStack gap="4" className="w-full max-w-xs">
      <Progress variant="linear" value={value} label={`${value}%`} />
      <HStack gap="3">
        <button
          onClick={() => setValue((v) => Math.min(100, v + 20))}
          className="text-tint text-footnote"
        >
          +20%
        </button>
        <button
          onClick={() => setValue(0)}
          className="text-label-secondary text-footnote"
        >
          Reset
        </button>
      </HStack>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// TextField
// ---------------------------------------------------------------------------

function TextFieldLeadingIconDemo() {
  const [email, setEmail] = useState("");
  return (
    <div className="w-full max-w-72">
      <TextField
        value={email}
        onValueChange={setEmail}
        placeholder="Email"
        type="email"
        leadingIcon="user"
      />
    </div>
  );
}

function TextFieldTrailingIconDemo() {
  const [password, setPassword] = useState("secret123");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full max-w-72">
      <TextField
        value={password}
        onValueChange={setPassword}
        type={showPassword ? "text" : "password"}
        trailingIcon={showPassword ? "eye-off" : "eye"}
        onTrailingIconClick={() => setShowPassword((prev) => !prev)}
        trailingIconLabel={showPassword ? "Hide password" : "Show password"}
      />
    </div>
  );
}

function TextFieldErrorDemo() {
  return (
    <div className="w-full max-w-72">
      <TextField
        value=""
        onValueChange={() => {}}
        placeholder="Required field"
        error="This field is required"
      />
    </div>
  );
}

function TextFieldDisabledDemo() {
  return (
    <div className="w-full max-w-72">
      <TextField value="Read-only value" onValueChange={() => {}} disabled />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------

function TextareaBasicDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="w-full max-w-80">
      <Textarea
        value={value}
        onValueChange={setValue}
        placeholder="Write a message…"
      />
    </div>
  );
}

function TextareaCounterDemo() {
  const [normal, setNormal] = useState("");
  const [warning, setWarning] = useState("a".repeat(92));
  return (
    <VStack gap="4" className="w-full max-w-80">
      <Textarea
        value={normal}
        onValueChange={setNormal}
        placeholder="Bio (max 200 chars)"
        maxLength={200}
      />
      <Textarea
        value={warning}
        onValueChange={setWarning}
        placeholder="Short bio"
        maxLength={100}
      />
    </VStack>
  );
}

function TextareaErrorDisabledDemo() {
  const [value, setValue] = useState("");
  return (
    <VStack gap="4" className="w-full max-w-80">
      <Textarea
        value={value}
        onValueChange={setValue}
        placeholder="Description"
        error="This field is required"
      />
      <Textarea
        value="Cannot edit this content."
        onValueChange={() => {}}
        disabled
      />
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

function TextScaleDemo() {
  return (
    <VStack gap="2">
      <Text textStyle="large-title">Large Title</Text>
      <Text textStyle="title-1">Title 1</Text>
      <Text textStyle="title-2">Title 2</Text>
      <Text textStyle="title-3">Title 3</Text>
      <Text textStyle="headline">Headline</Text>
      <Text textStyle="body">Body</Text>
      <Text textStyle="callout">Callout</Text>
      <Text textStyle="subheadline">Subheadline</Text>
      <Text textStyle="footnote">Footnote</Text>
      <Text textStyle="caption-1">Caption 1</Text>
      <Text textStyle="caption-2">Caption 2</Text>
    </VStack>
  );
}

function TextWeightColorDemo() {
  return (
    <VStack gap="2">
      <Text textStyle="body" color="secondary">
        Body text in secondary color.
      </Text>
      <Text textStyle="footnote" color="tertiary">
        Footnote in tertiary color.
      </Text>
      <Text textStyle="caption-1" color="quaternary">
        Caption 1 in quaternary color.
      </Text>
      <Text textStyle="body" weight="bold" color="tint">
        Body text with a bold weight and tint color override.
      </Text>
    </VStack>
  );
}

function TextTruncateDemo() {
  return (
    <Text textStyle="body" truncate className="max-w-40">
      This line truncates with an ellipsis once it overflows its container
      width.
    </Text>
  );
}

// ---------------------------------------------------------------------------
// SearchField
// ---------------------------------------------------------------------------

function SearchFieldBasicDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="w-72">
      <SearchField value={value} onValueChange={setValue} />
    </div>
  );
}

const SEARCH_FIELD_DEMO_ITEMS: SearchFieldResult[] = [
  { id: "button", label: "Button", icon: "star" },
  { id: "checkbox", label: "Checkbox", icon: "check" },
  { id: "dropdown", label: "Dropdown", icon: "chevron-down" },
  { id: "search-field", label: "SearchField", icon: "search" },
  { id: "slider", label: "Slider", icon: "settings" },
];

function SearchFieldResultsDemo() {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const results =
    value.trim() === ""
      ? undefined
      : SEARCH_FIELD_DEMO_ITEMS.filter((item) =>
          item.label.toLowerCase().includes(value.toLowerCase()),
        );

  return (
    <VStack gap="2" className="w-80">
      <SearchField
        value={value}
        onValueChange={setValue}
        results={results}
        onResultSelect={setSelected}
        placeholder="Search components"
      />
      <Text textStyle="footnote" color="secondary">
        {selected ? `Selected: ${selected}` : "No selection yet"}
      </Text>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------

function IconColorsDemo() {
  return (
    <HStack gap="4" align="center">
      <Icon name="bell" size="lg" />
      <Icon name="search" size="lg" color="tint" />
      <Icon name="trash" size="lg" color="destructive" />
      <Icon name="circle-check" size="lg" color="success" />
    </HStack>
  );
}

function IconSizesDemo() {
  return (
    <HStack gap="4" align="center">
      <Icon name="star" size="xs" />
      <Icon name="star" size="sm" />
      <Icon name="star" size="md" />
      <Icon name="star" size="xl" />
    </HStack>
  );
}

function IconAccessibleDemo() {
  return (
    <Icon
      name="triangle-alert"
      size="md"
      color="warning"
      decorative={false}
      aria-label="Warning"
    />
  );
}

function IconGalleryDemo() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? iconNames.filter((name) => name.includes(normalizedQuery))
    : iconNames;

  return (
    <VStack gap="4">
      <div className="max-w-xs">
        <SearchField
          value={query}
          onValueChange={setQuery}
          placeholder="Search icons"
          aria-label="Search icons"
        />
      </div>

      {filtered.length === 0 ? (
        <Text textStyle="footnote" color="secondary">
          No icons match &ldquo;{query}&rdquo;.
        </Text>
      ) : (
        <Grid columns="auto-fit" minItemWidth="xs" gap="1">
          {filtered.map((name) => (
            <Popover.Root key={name}>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className="flex flex-col items-center gap-(--space-2) rounded-md p-(--space-3) transition-colors duration-(--duration-fast) hover-fine:bg-fill-secondary focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))]"
                >
                  <Icon name={name} size="lg" />
                  <Text
                    textStyle="caption-2"
                    color="secondary"
                    truncate
                    className="max-w-full"
                  >
                    {name}
                  </Text>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  sideOffset={8}
                  // Fixed width (rather than shrink-to-fit) keeps every
                  // icon's card the same size and gives DocsCodeBlock a
                  // stable box to apply its own overflow-x-auto against.
                  // max-h/overflow-y-auto + contour-material: same "fits on
                  // screen with its own scroll" + frosted-glass rule as
                  // every other floating surface (Dropdown, SearchField).
                  className="w-64 z-(--z-dropdown) max-h-(--radix-popover-content-available-height) overflow-y-auto rounded-lg border border-separator contour-material p-(--space-4) shadow-md data-[state=open]:animate-[contour-scale-fade-in_var(--duration-fast)_var(--ease-spring-out)] data-[state=closed]:animate-[contour-scale-fade-out_var(--duration-fast)_var(--ease-standard)]"
                >
                  {/* container={false} -- see Flex's ContainerGotcha story:
                      container-type: inline-size on this VStack would stop
                      it (and DocsCodeBlock inside it) from reporting a
                      normal preferred width, which is what let the code
                      block spill past the card's edges here before. */}
                  <VStack gap="3" align="center" container={false}>
                    <Icon name={name} size="xl" />
                    <Text textStyle="footnote" weight="semibold">
                      {name}
                    </Text>
                    <DocsCodeBlock
                      lang="tsx"
                      copyable
                    >{`<Icon name="${name}" />`}</DocsCodeBlock>
                  </VStack>
                  {/* fill matches contour-material's own background (a translucent
                      rgb(...  / alpha), not a plain design-token color) so the
                      arrow doesn't read as a solid, out-of-place wedge. */}
                  <Popover.Arrow style={{ fill: "var(--material-regular)" }} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ))}
        </Grid>
      )}
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

function CardElevationDemo() {
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

function CardCornerPaddingDemo() {
  return (
    <Card
      corner="squircle"
      padding="6"
      as="article"
      className="w-full max-w-96"
    >
      <Text textStyle="headline">Squircle, custom padding</Text>
      <Text textStyle="footnote" color="secondary">
        corner=&quot;squircle&quot; with a fixed padding=&quot;6&quot; instead
        of the responsive default
      </Text>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

function ListPlainDemo() {
  return (
    <List>
      <ListItem
        key="1"
        leadingIcon="bell"
        title="Notifications"
        subtitle="On for messages and calls"
        onClick={() => {}}
      />
      <ListItem
        key="2"
        leadingIcon="user"
        title="Account"
        trailingIcon="chevron-right"
        onClick={() => {}}
      />
      <ListItem
        key="3"
        leadingIcon="settings"
        title="Settings"
        trailingText="3 updates"
        onClick={() => {}}
      />
    </List>
  );
}

function ListSwipeActionsDemo() {
  return (
    <List style="grouped">
      <ListItem
        key="a"
        leadingIcon="calendar"
        title="Team sync"
        subtitle="Swipe (touch) or hover (desktop) to reveal actions"
        onClick={() => {}}
        leadingAction={{
          icon: "check",
          label: "Done",
          color: "tint",
          onAction: () => {},
        }}
        trailingActions={[
          {
            icon: "circle-alert",
            label: "Flag",
            color: "warning",
            onAction: () => {},
          },
          {
            icon: "trash",
            label: "Delete",
            color: "destructive",
            onAction: () => {},
          },
        ]}
      />
    </List>
  );
}

function ListContextMenuDemo() {
  return (
    <List style="grouped">
      <ListItem
        key="b"
        leadingIcon="user"
        title="Contact"
        subtitle="Long-press or right-click for options"
        contextMenuItems={[
          {
            type: "action",
            icon: "copy",
            label: "Duplicate",
            onSelect: () => {},
          },
          { type: "separator" },
          {
            type: "action",
            icon: "trash",
            label: "Delete",
            role: "destructive",
            onSelect: () => {},
          },
        ]}
      />
    </List>
  );
}

// ---------------------------------------------------------------------------
// Dropdown
// ---------------------------------------------------------------------------

// Long enough to overflow the menu's own max-height (dropdownContentClassName/
// contextMenuContentClassName's own --radix-<family>-content-available-height
// cap, menu-core.tsx) on most viewports, so the content scrolls internally --
// with the submenu row placed after it,
// reaching it at compact size requires scrolling to the bottom first. Shared
// by both Dropdown's and ContextMenu's "Long list" demos below since they're
// exercising the same compact-mode scroll-to-top-then-slide behavior
// (compact-menu.tsx's useMenuStack, shared by both components).
const LONG_LIST_ITEMS: DropdownItemDef[] = [
  ...Array.from({ length: 24 }, (_, index) => ({
    type: "action" as const,
    label: `Row ${index + 1}`,
    onSelect: () => {},
  })),
  { type: "separator" },
  {
    type: "submenu",
    icon: "download",
    label: "More options",
    items: [
      { type: "action", label: "Export as PDF", onSelect: () => {} },
      { type: "action", label: "Export as CSV", onSelect: () => {} },
      { type: "action", label: "Print", onSelect: () => {} },
    ],
  },
];

function DropdownActionsDemo() {
  return (
    <Dropdown
      trigger={
        <Button variant="plain" trailingIcon="chevron-down">
          Actions
        </Button>
      }
      items={[
        {
          type: "action",
          icon: "copy",
          label: "Duplicate",
          onSelect: () => {},
        },
        { type: "action", icon: "share", label: "Share", onSelect: () => {} },
        { type: "separator" },
        {
          type: "action",
          icon: "trash",
          label: "Delete",
          role: "destructive",
          onSelect: () => {},
        },
      ]}
    />
  );
}

function DropdownCheckboxRadioSubmenuDemo() {
  const [showGrid, setShowGrid] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  return (
    <Dropdown
      trigger={
        <Button variant="plain" trailingIcon="chevron-down">
          View options
        </Button>
      }
      items={[
        {
          type: "checkbox",
          label: "Show grid",
          checked: showGrid,
          onCheckedChange: setShowGrid,
        },
        { type: "separator" },
        { type: "label", text: "Sort by" },
        {
          type: "radio-group",
          value: sortBy,
          onValueChange: setSortBy,
          options: [
            { value: "name", label: "Name" },
            { value: "date", label: "Date" },
          ],
        },
        { type: "separator" },
        {
          type: "submenu",
          icon: "download",
          label: "Export",
          items: [
            { type: "action", label: "PDF", onSelect: () => {} },
            { type: "action", label: "CSV", onSelect: () => {} },
          ],
        },
      ]}
    />
  );
}

function DropdownLongListDemo() {
  return (
    <Dropdown
      trigger={
        <Button variant="plain" trailingIcon="chevron-down">
          Long list
        </Button>
      }
      items={LONG_LIST_ITEMS}
    />
  );
}

// ---------------------------------------------------------------------------
// ContextMenu
// ---------------------------------------------------------------------------

function ContextMenuBasicDemo() {
  return (
    <ContextMenu
      items={[
        {
          type: "action",
          icon: "copy",
          label: "Duplicate",
          onSelect: () => {},
        },
        { type: "action", icon: "share", label: "Share", onSelect: () => {} },
        { type: "separator" },
        {
          type: "action",
          icon: "trash",
          label: "Delete",
          role: "destructive",
          onSelect: () => {},
        },
      ]}
    >
      <Flex
        align="center"
        justify="center"
        className="h-32 w-full rounded-md border border-dashed border-separator"
      >
        <Text textStyle="footnote" color="secondary">
          Right-click this area
        </Text>
      </Flex>
    </ContextMenu>
  );
}

function ContextMenuSubmenuDemo() {
  return (
    <ContextMenu
      items={[
        {
          type: "submenu",
          icon: "download",
          label: "Export",
          items: [
            { type: "action", label: "PDF", onSelect: () => {} },
            { type: "action", label: "CSV", onSelect: () => {} },
          ],
        },
        { type: "separator" },
        {
          type: "action",
          icon: "trash",
          label: "Delete",
          role: "destructive",
          onSelect: () => {},
        },
      ]}
    >
      <Flex
        align="center"
        justify="center"
        className="h-32 w-full rounded-md border border-dashed border-separator"
      >
        <Text textStyle="footnote" color="secondary">
          Right-click this area
        </Text>
      </Flex>
    </ContextMenu>
  );
}

function ContextMenuLongListDemo() {
  return (
    <ContextMenu items={LONG_LIST_ITEMS}>
      <Flex
        align="center"
        justify="center"
        className="h-32 w-full rounded-md border border-dashed border-separator"
      >
        <Text textStyle="footnote" color="secondary">
          Right-click this area
        </Text>
      </Flex>
    </ContextMenu>
  );
}

// ---------------------------------------------------------------------------
// Registry -- keyed by component-registry slug. Kept module-private -- a
// Server Component that imports and indexes a plain object exported from a
// "use client" file gets `undefined` back (only function/component exports
// survive the RSC client-reference boundary), so the lookup has to happen
// inside a client component instead. See ComponentDemo below.
// ---------------------------------------------------------------------------

function AlertDemoSingleAction() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4 flex justify-center">
      <Button onClick={() => setOpen(true)}>Check for Updates</Button>
      <Alert
        open={open}
        onOpenChange={setOpen}
        title="You're up to date"
        description="Contour 2.4 is currently the newest version available."
        actions={[{ label: "OK", role: "cancel", onClick: () => {} }]}
      />
    </div>
  );
}

function AlertDemoTwoActions() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4 flex justify-center">
      <Button onClick={() => setOpen(true)}>Show Alert</Button>
      <Alert
        open={open}
        onOpenChange={setOpen}
        title="Delete this item?"
        description="This action cannot be undone."
        actions={[
          { label: "Cancel", role: "cancel", onClick: () => {} },
          { label: "Delete", role: "destructive", emphasized: true, onClick: () => {} }
        ]}
      />
    </div>
  );
}

function AlertDemoThreeActions() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4 flex justify-center">
      <Button onClick={() => setOpen(true)}>Save Changes</Button>
      <Alert
        open={open}
        onOpenChange={setOpen}
        title="Save changes before closing?"
        description="Your edits will be lost if you don't save them."
        actions={[
          { label: "Discard Changes", role: "destructive", onClick: () => {} },
          { label: "Save", emphasized: true, onClick: () => {} },
          { label: "Cancel", role: "cancel", onClick: () => {} },
        ]}
      />
    </div>
  );
}

function AlertDemoTitleOnly() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4 flex justify-center">
      <Button onClick={() => setOpen(true)}>Copy Link</Button>
      <Alert
        open={open}
        onOpenChange={setOpen}
        title="Link copied to clipboard"
        actions={[{ label: "OK", role: "cancel", onClick: () => {} }]}
      />
    </div>
  );
}

// The three Toast examples below deliberately share the single <Toaster />
// mounted by ToastDemoPlacement -- a real app mounts exactly one at the root,
// and every demo on this page is rendered at the same time, so the buttons in
// the other two examples feed that same stack.
function ToastDemoBasic() {
  return (
    <div className="p-4 flex gap-2 flex-wrap justify-center">
      <Button onClick={() => toast({ title: "Copied to clipboard" })}>Default</Button>
      <Button onClick={() => toast({ title: "Saved successfully", variant: "success" })}>Success</Button>
      <Button onClick={() => toast({ title: "Disk almost full", variant: "warning" })}>Warning</Button>
      <Button onClick={() => toast({ title: "Upload failed", variant: "destructive" })}>Destructive</Button>
    </div>
  );
}

const TOAST_STACK_SAMPLES: ToastInput[] = [
  { title: "Message sent", description: "Delivered to Design team." },
  { title: "Backup finished", variant: "success" },
  { title: "Storage almost full", description: "90% of your quota is used.", variant: "warning" },
  { title: "Upload failed", description: "Check your connection.", variant: "destructive" },
  { title: "3 files renamed" },
  { title: "Sync complete", variant: "success" },
  { title: "Invite accepted", description: "Alex joined the workspace." },
];

function ToastDemoStack() {
  const fire = (count: number) => {
    TOAST_STACK_SAMPLES.slice(0, count).forEach((sample, index) => {
      setTimeout(() => toast({ ...sample, duration: 30000 }), index * 220);
    });
  };

  return (
    <div className="p-4 flex gap-2 flex-wrap justify-center">
      <Button onClick={() => fire(3)}>Send 3 toasts</Button>
      <Button variant="tinted" onClick={() => fire(7)}>Send 7 toasts</Button>
    </div>
  );
}

const TOAST_POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

function ToastDemoPlacement() {
  const [position, setPosition] = useState<ToastPosition>("bottom-right");

  return (
    <VStack gap="4" className="p-4">
      <Grid columns={3} gap="2">
        {TOAST_POSITIONS.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={value === position ? "filled" : "tinted"}
            onClick={() => setPosition(value)}
          >
            {value}
          </Button>
        ))}
      </Grid>
      <Button
        onClick={() =>
          TOAST_STACK_SAMPLES.slice(0, 4).forEach((sample, index) =>
            setTimeout(() => toast({ ...sample, duration: 30000 }), index * 220)
          )
        }
      >
        Send toasts to {position}
      </Button>
      <Toaster position={position} />
    </VStack>
  );
}

function SheetDemoBasic() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4 flex justify-center">
      <Button onClick={() => setOpen(true)}>Open Sheet</Button>
      <Sheet open={open} onOpenChange={setOpen} title="Shipping details">
        <SheetContent>
          <SheetHeader>
            <Text textStyle="headline">Shipping details</Text>
          </SheetHeader>
          <Container variant="content">
            <VStack gap="section" className="py-4">
              <Text>
                Touch presents this as a draggable Bottom Sheet; a mouse or trackpad presents it as
                a centered Modal instead -- same markup either way.
              </Text>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </VStack>
          </Container>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// SS7: a Sheet opened from inside another Sheet's content recedes the one
// underneath it (scale down, shift up, dim, pointer-events: none) -- and
// only the base (outer) Sheet dims the page, the nested one stays
// transparent so the two don't stack dim on top of dim.
function SheetDemoNested() {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  return (
    <div className="p-4 flex justify-center">
      <Button onClick={() => setParentOpen(true)}>Open Category Picker</Button>
      <Sheet open={parentOpen} onOpenChange={setParentOpen} title="Choose a category">
        <SheetContent>
          <SheetHeader>
            <Text textStyle="headline">Choose a category</Text>
          </SheetHeader>
          <Container variant="content">
            <VStack gap="section" className="py-4">
              <Text color="secondary">
                Opening the nested Sheet recedes this one -- scaled down, dimmed, inert.
              </Text>
              <Button onClick={() => setChildOpen(true)}>New category...</Button>
            </VStack>
          </Container>
        </SheetContent>
      </Sheet>

      <Sheet open={childOpen} onOpenChange={setChildOpen} title="New category">
        <SheetContent>
          <SheetHeader>
            <Text textStyle="headline">New category</Text>
          </SheetHeader>
          <Container variant="content">
            <VStack gap="section" className="py-4">
              <Text color="secondary">This Sheet sits above the receded one (--z-sheet + depth * 20).</Text>
              <Button onClick={() => setChildOpen(false)}>Done</Button>
            </VStack>
          </Container>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SheetDemoSnapPoints() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4 flex justify-center">
      <Button onClick={() => setOpen(true)}>Open with Snap Points</Button>
      <Sheet open={open} onOpenChange={setOpen} snapPoints={[0.4, 0.9]} title="Filters">
        <SheetContent>
          <SheetHeader>
            <Text textStyle="headline">Filters</Text>
          </SheetHeader>
          <Container variant="content">
            <VStack gap="section" className="py-4">
              <Text color="secondary">
                On touch, drag between 40% and 90% height, or drag past 40% to dismiss. With a
                mouse/trackpad, snapPoints has no effect -- it always presents as a fixed Modal.
              </Text>
            </VStack>
          </Container>
        </SheetContent>
      </Sheet>
    </div>
  );
}

const COMPONENT_DEMOS: Record<string, DemoExample[]> = {
  alert: [
    {
      title: "Single action",
      description:
        "1 action stacks full-width -- no row layout with just one button.",
      code: `<Alert\n  open={open}\n  onOpenChange={setOpen}\n  title="You're up to date"\n  description="Contour 2.4 is currently the newest version available."\n  actions={[{ label: "OK", role: "cancel", onClick: () => {} }]}\n/>`,
      Component: AlertDemoSingleAction,
    },
    {
      title: "Two actions",
      description:
        "2 actions lay out side by side, split 50/50 with a vertical separator. The cancel action always sits on the right.",
      code: `<Alert\n  open={open}\n  onOpenChange={setOpen}\n  title="Delete this item?"\n  description="This action cannot be undone."\n  actions={[\n    { label: "Cancel", role: "cancel", onClick: () => {} },\n    { label: "Delete", role: "destructive", emphasized: true, onClick: () => {} }\n  ]}\n/>`,
      Component: AlertDemoTwoActions,
    },
    {
      title: "Three actions",
      description:
        "3+ actions stack in a column instead of a row. The cancel action always sits at the bottom regardless of its position in the actions array.",
      code: `<Alert\n  open={open}\n  onOpenChange={setOpen}\n  title="Save changes before closing?"\n  description="Your edits will be lost if you don't save them."\n  actions={[\n    { label: "Discard Changes", role: "destructive", onClick: () => {} },\n    { label: "Save", emphasized: true, onClick: () => {} },\n    { label: "Cancel", role: "cancel", onClick: () => {} },\n  ]}\n/>`,
      Component: AlertDemoThreeActions,
    },
    {
      title: "Title only",
      description: "description is optional -- omit it for a title-only alert.",
      code: `<Alert\n  open={open}\n  onOpenChange={setOpen}\n  title="Link copied to clipboard"\n  actions={[{ label: "OK", role: "cancel", onClick: () => {} }]}\n/>`,
      Component: AlertDemoTitleOnly,
    },
  ],
  toast: [
    {
      title: "Toast Variants",
      description:
        "Default, success, warning, and destructive variants. Every example on this page feeds the one <Toaster> mounted under Placement below -- an app mounts exactly one, at the root.",
      code: `toast({ title: "Saved successfully", variant: "success" })`,
      Component: ToastDemoBasic,
    },
    {
      title: "Grouped stack",
      description:
        "Multiple toasts collapse into a paper stack. Hover it with a mouse to preview the list; click or tap it to pin it open. Either way a Show Less button and a Clear button sit at the anchored edge -- one stacks the list back up, the other dismisses every toast (one click with a mouse; on touch the X expands into its label first). The list may use the full page height, and scrolls beyond that -- anchored so the newest toast stays in view, with the clipped edge faded by scroll-mask-y.",
      code: `// Any number of toasts can be active -- the stack collapses them\ntoast({ title: "Message sent" })\ntoast({ title: "Backup finished", variant: "success" })\ntoast({ title: "Storage almost full", variant: "warning" })`,
      Component: ToastDemoStack,
    },
    {
      title: "Placement",
      description:
        "position accepts one of the six anchors, or a per-size-class pair. The stacking direction, the direction the list expands and the enter animation all follow the anchor: a bottom-anchored stack rises from below and expands upward, a top-anchored one drops from above and expands downward.",
      code: `// Fixed anchor\n<Toaster position="top-right" />\n\n// Adaptive (the default)\n<Toaster position={{ compact: "top-center", regular: "bottom-right" }} />`,
      Component: ToastDemoPlacement,
    },
  ],
  flex: [
    {
      title: "Row (default)",
      code: `<Flex gap="3">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</Flex>`,
      Component: FlexRowDemo,
    },
    {
      title: "Column",
      code: `<Flex direction="column" gap="2">\n  <div>Column A</div>\n  <div>Column B</div>\n</Flex>`,
      Component: FlexColumnDemo,
    },
    {
      title: "Justify & align",
      code: `<Flex justify="between" align="center" gap="2">\n  <div>Start</div>\n  <div>End</div>\n</Flex>`,
      Component: FlexJustifyDemo,
    },
    {
      title: "Wrap",
      code: `<Flex wrap="wrap" gap="2" className="max-w-48">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n  <div>4</div>\n</Flex>`,
      Component: FlexWrapDemo,
    },
  ],

  grid: [
    {
      title: "Fixed columns",
      code: `<Grid columns={3} gap="3">\n  {items.map((item) => (\n    <div key={item.id}>{item.label}</div>\n  ))}\n</Grid>`,
      Component: GridFixedDemo,
    },
    {
      title: "Auto-fit",
      description:
        'columns="auto-fit" with minItemWidth picks the column count automatically.',
      code: `<Grid columns="auto-fit" minItemWidth="sm" gap="3">\n  {items.map((item) => (\n    <div key={item.id}>{item.label}</div>\n  ))}\n</Grid>`,
      Component: GridAutoFitDemo,
    },
  ],

  stack: [
    {
      title: "HStack / VStack",
      description:
        "The common case -- direction is locked and immediately clear from the name.",
      code: `<VStack gap="3">\n  <HStack gap="3">\n    <div>A</div>\n    <div>B</div>\n  </HStack>\n  <div>C</div>\n</VStack>`,
      Component: StackAliasesDemo,
    },
    {
      title: "Conditional direction",
      description:
        "Stack itself takes a direction prop directly, for the case where it varies at runtime.",
      code: `<Stack direction={isCompact ? "vertical" : "horizontal"} gap="3">\n  <div>A</div>\n  <div>B</div>\n  <div>C</div>\n</Stack>`,
      Component: StackConditionalDirectionDemo,
    },
  ],

  container: [
    {
      title: 'variant="page"',
      code: `<Container variant="page">\n  <p>Full-width edge margin + safe-area insets.</p>\n</Container>`,
      Component: ContainerPageDemo,
    },
    {
      title: 'variant="content"',
      code: `<Container variant="content">\n  <p>Centered in a 720px reading column with responsive edge margin.</p>\n</Container>`,
      Component: ContainerContentDemo,
    },
  ],

  "nav-bar": [
    {
      title: "Compact, with actions",
      code: `<NavBar\n  title="Inbox"\n  largeTitleMode={false}\n  leadingAction={{ icon: "chevron-left", label: "Back", onClick: goBack }}\n  trailingActions={[\n    { icon: "search", label: "Search", onClick: openSearch },\n    { icon: "settings", label: "Settings", onClick: openSettings },\n  ]}\n/>`,
      Component: NavBarCompactDemo,
    },
    {
      title: "Large title",
      description:
        "Scroll the box below to see the title collapse into a compact centered title.",
      code: `<NavBar title="Inbox" largeTitleMode />`,
      Component: NavBarLargeTitleDemo,
    },
    {
      title: "Default title mode",
      description:
        "largeTitleMode defaults to the current size class: large title on compact, compact centered title on regular+.",
      code: `<NavBar title="Inbox" />`,
      Component: NavBarDefaultDemo,
      sizeClassPreview: true,
    },
  ],

  "tab-bar": [
    {
      title: "Bottom tab bar",
      code: `<TabBar\n  items={[\n    { icon: "home", label: "Home" },\n    { icon: "search", label: "Search" },\n    { icon: "bell", label: "Alerts", badge: 3 },\n    { icon: "user", label: "Profile" },\n  ]}\n  value={value}\n  onValueChange={setValue}\n/>`,
      Component: TabBarDemo,
      sizeClassPreview: true,
    },
  ],

  sidebar: [
    {
      title: "Navigation column",
      code: `<Sidebar\n  items={[\n    { value: "home", icon: "home", label: "Home" },\n    { value: "search", icon: "search", label: "Search" },\n    { value: "alerts", icon: "bell", label: "Alerts", badge: 3 },\n    { value: "profile", icon: "user", label: "Profile" },\n  ]}\n  value={value}\n  onValueChange={setValue}\n/>`,
      Component: SidebarDemo,
    },
  ],

  toolbar: [
    {
      title: "Bottom, labeled actions",
      code: `<Toolbar\n  actions={[\n    { icon: "share", label: "Share", onClick: onShare },\n    { icon: "star", label: "Favorite", onClick: onFavorite },\n    { icon: "trash", label: "Delete", onClick: onDelete },\n  ]}\n/>`,
      Component: ToolbarBottomDemo,
    },
    {
      title: "Top, icon-only actions",
      code: `<Toolbar\n  position="top"\n  actions={[\n    { icon: "search", onClick: onSearch },\n    { icon: "settings", onClick: onSettings },\n  ]}\n/>`,
      Component: ToolbarTopIconOnlyDemo,
    },
  ],

  button: [
    {
      title: "Variants",
      code: `<Button variant="filled">Filled</Button>\n<Button variant="tinted">Tinted</Button>\n<Button variant="plain">Plain</Button>`,
      Component: ButtonVariantsDemo,
    },
    {
      title: "Roles & states",
      code: `<Button variant="filled" role="destructive">Delete</Button>\n<Button variant="tinted" leadingIcon="share">Share</Button>\n<Button variant="plain" loading>Loading</Button>\n<Button variant="filled" disabled>Disabled</Button>`,
      Component: ButtonRolesStatesDemo,
    },
    {
      title: "Sizes",
      code: `<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>`,
      Component: ButtonSizesDemo,
    },
    {
      title: "Icons & shape",
      code: `<Button trailingIcon="chevron-right">Next</Button>\n<Button corner="squircle" variant="tinted">Squircle</Button>\n<Button aria-label="Favorite" leadingIcon="star" variant="plain" />`,
      Component: ButtonIconsShapeDemo,
    },
    {
      title: "Full width",
      code: `<Button fullWidth>Full width</Button>`,
      Component: ButtonFullWidthDemo,
    },
  ],

  checkbox: [
    {
      title: "States",
      code: `<Checkbox label="Remember me" checked={checked} onCheckedChange={setChecked} />\n<Checkbox checked="indeterminate" label="Indeterminate" />\n<Checkbox disabled label="Disabled" />\n<Checkbox disabled checked label="Disabled, checked" />`,
      Component: CheckboxStatesDemo,
    },
    {
      title: "Size & accessible label",
      code: `<Checkbox size="sm" checked label="Small" />\n<Checkbox aria-label="Unlabeled checkbox" checked />`,
      Component: CheckboxSizeAccessibleDemo,
    },
  ],

  radio: [
    {
      title: "Horizontal",
      code: `<RadioGroup\n  value={value}\n  onValueChange={setValue}\n  direction="horizontal"\n  options={[\n    { value: "day", label: "Day" },\n    { value: "week", label: "Week" },\n    { value: "month", label: "Month" },\n  ]}\n/>`,
      Component: RadioHorizontalDemo,
    },
    {
      title: "Vertical, small, disabled option",
      description: 'direction defaults to "vertical".',
      code: `<RadioGroup\n  value={value}\n  onValueChange={setValue}\n  size="sm"\n  options={[\n    { value: "email", label: "Email" },\n    { value: "sms", label: "SMS" },\n    { value: "push", label: "Push (disabled)", disabled: true },\n  ]}\n/>`,
      Component: RadioVerticalSmallDemo,
    },
  ],

  switch: [
    {
      title: "On / off",
      code: `<Switch label="Wi-Fi" checked={checked} onCheckedChange={setChecked} />\n<Switch label="Bluetooth" checked={checked2} onCheckedChange={setChecked2} />`,
      Component: SwitchOnOffDemo,
    },
    {
      title: "Disabled",
      code: `<Switch label="Disabled, off" checked={false} disabled onCheckedChange={() => {}} />\n<Switch aria-label="Unlabeled switch" checked disabled onCheckedChange={() => {}} />`,
      Component: SwitchDisabledDemo,
    },
  ],

  slider: [
    {
      title: "Single thumb",
      code: `<Slider value={value} onValueChange={setValue} thumbLabel="Volume" />`,
      Component: SliderSingleDemo,
    },
    {
      title: "Range (multi-thumb)",
      description:
        "Pass an array for value/onValueChange to get a multi-thumb range slider.",
      code: `<Slider\n  value={range}\n  onValueChange={setRange}\n  thumbLabel={["Min price", "Max price"]}\n/>`,
      Component: SliderRangeDemo,
    },
    {
      title: "Disabled",
      code: `<Slider value={60} onValueChange={() => {}} disabled thumbLabel="Disabled" />`,
      Component: SliderDisabledDemo,
    },
  ],

  "segmented-control": [
    {
      title: "Default",
      code: `<SegmentedControl\n  value={value}\n  onValueChange={setValue}\n  options={[\n    { value: "day", label: "Day" },\n    { value: "week", label: "Week" },\n    { value: "month", label: "Month" },\n  ]}\n/>`,
      Component: SegmentedControlDefaultDemo,
    },
    {
      title: "Small, icon-only",
      code: `<SegmentedControl\n  value={theme}\n  onValueChange={setTheme}\n  size="small"\n  iconOnly\n  options={[\n    { value: "light", label: "Light", icon: "sun" },\n    { value: "dark", label: "Dark", icon: "moon" },\n    { value: "system", label: "System", icon: "monitor" },\n  ]}\n/>`,
      Component: SegmentedControlIconOnlyDemo,
    },
  ],

  "text-field": [
    {
      title: "Leading icon",
      code: `<TextField value={email} onValueChange={setEmail} placeholder="Email" type="email" leadingIcon="user" />`,
      Component: TextFieldLeadingIconDemo,
    },
    {
      title: "Interactive trailing icon",
      description:
        "onTrailingIconClick + trailingIconLabel make the trailing icon a real (accessible) button.",
      code: `<TextField\n  value={password}\n  onValueChange={setPassword}\n  type={showPassword ? "text" : "password"}\n  trailingIcon={showPassword ? "eye-off" : "eye"}\n  onTrailingIconClick={() => setShowPassword((v) => !v)}\n  trailingIconLabel={showPassword ? "Hide password" : "Show password"}\n/>`,
      Component: TextFieldTrailingIconDemo,
    },
    {
      title: "Error state",
      code: `<TextField value={value} onValueChange={setValue} placeholder="Required field" error="This field is required" />`,
      Component: TextFieldErrorDemo,
    },
    {
      title: "Disabled",
      code: `<TextField value="Read-only value" onValueChange={() => {}} disabled />`,
      Component: TextFieldDisabledDemo,
    },
  ],

  textarea: [
    {
      title: "Basic auto-resize",
      description:
        "Type multiple lines to see the textarea grow up to maxRows (default 10) then scroll internally.",
      code: `<Textarea value={value} onValueChange={setValue} placeholder="Write a message…" />`,
      Component: TextareaBasicDemo,
    },
    {
      title: "Character counter",
      description:
        "Counter appears when maxLength is set. The bottom example has typed past the 90 % threshold (counterThreshold default), turning it red.",
      code: `<Textarea\n  value={value}\n  onValueChange={setValue}\n  maxLength={200}\n  placeholder="Bio"\n/>`,
      Component: TextareaCounterDemo,
    },
    {
      title: "Error & disabled states",
      code: `<Textarea value={value} onValueChange={setValue} error="This field is required" />\n<Textarea value="Cannot edit." onValueChange={() => {}} disabled />`,
      Component: TextareaErrorDisabledDemo,
    },
  ],

  "search-field": [
    {
      title: "Basic",
      code: `<SearchField value={value} onValueChange={setValue} />`,
      Component: SearchFieldBasicDemo,
    },
    {
      title: "With results popover",
      description:
        "results filters as you type; onResultSelect fires when a row is picked. Try arrow keys + Enter.",
      code: `<SearchField\n  value={value}\n  onValueChange={setValue}\n  results={results}\n  onResultSelect={(id) => console.log(id)}\n  placeholder="Search components"\n/>`,
      Component: SearchFieldResultsDemo,
    },
  ],

  badge: [
    {
      title: "Counter",
      description: "count > 99 shows \"99+\". Use dot=true for a plain notification dot.",
      code: `<Badge count={3} />\n<Badge count={42} />\n<Badge count={999} />\n<Badge dot />`,
      Component: BadgeCounterDemo,
    },
    {
      title: "Status — solid & tinted",
      description:
        "solid (default) is safe on any background. tinted is opt-in — only use on controlled surfaces.",
      code: `<Badge variant="status" label="New" color="tint" />\n<Badge variant="status" label="Beta" color="warning" tone="tinted" />`,
      Component: BadgeStatusDemo,
    },
    {
      title: "Positioned over an icon",
      description: "Badge has no built-in positioning — wrap with position: relative and place it with className.",
      code: `<div className="relative inline-block">\n  <Icon name="bell" />\n  <Badge count={3} className="absolute -top-1 -right-1" />\n</div>`,
      Component: BadgePositionedDemo,
    },
  ],

  avatar: [
    {
      title: "Sizes",
      code: `<Avatar name="Alice Johnson" size="xs" />\n<Avatar name="Bob Smith" size="sm" />\n<Avatar name="Carol White" size="md" />\n<Avatar name="David Lee" size="lg" />\n<Avatar name="Eve Kim" size="xl" />`,
      Component: AvatarSizesDemo,
    },
    {
      title: "Fallback chain",
      description:
        "Avatar falls back through: image → initials (name) → generic icon. Initials color is deterministic — the same name always yields the same color.",
      code: `<Avatar />\n<Avatar name="Alice Johnson" />\n<Avatar src="..." alt="..." name="Nguyen Van A" />`,
      Component: AvatarFallbackDemo,
    },
    {
      title: "Shapes",
      code: `<Avatar name="Alice Johnson" size="lg" shape="circle" />\n<Avatar name="Alice Johnson" size="lg" shape="squircle" />`,
      Component: AvatarShapesDemo,
    },
  ],

  progress: [
    {
      title: "Circular",
      description:
        "Omit value for indeterminate (spinning). Pass value 0-100 for determinate. prefers-reduced-motion switches the indeterminate spinner to a pulse.",
      code: `<Progress label="Loading" />\n<Progress value={75} label="75%" />`,
      Component: ProgressCircularDemo,
    },
    {
      title: "Linear",
      description: "Linear is always determinate — value is required. Full-width by default.",
      code: `<Progress variant="linear" value={40} label="40%" />`,
      Component: ProgressLinearDemo,
    },
  ],

  text: [
    {
      title: "Type scale",
      code: `<Text textStyle="large-title">Large Title</Text>\n<Text textStyle="title-1">Title 1</Text>\n<Text textStyle="title-2">Title 2</Text>\n<Text textStyle="title-3">Title 3</Text>\n<Text textStyle="headline">Headline</Text>\n<Text textStyle="body">Body</Text>\n<Text textStyle="callout">Callout</Text>\n<Text textStyle="subheadline">Subheadline</Text>\n<Text textStyle="footnote">Footnote</Text>\n<Text textStyle="caption-1">Caption 1</Text>\n<Text textStyle="caption-2">Caption 2</Text>`,
      Component: TextScaleDemo,
    },
    {
      title: "Weight & color override",
      code: `<Text color="secondary">Body text in secondary color.</Text>\n<Text textStyle="footnote" color="tertiary">Footnote in tertiary color.</Text>\n<Text textStyle="caption-1" color="quaternary">Caption 1 in quaternary color.</Text>\n<Text weight="bold" color="tint">Bold weight, tint color override.</Text>`,
      Component: TextWeightColorDemo,
    },
    {
      title: "Truncate",
      code: `<Text truncate className="max-w-40">\n  This line truncates with an ellipsis once it overflows its container width.\n</Text>`,
      Component: TextTruncateDemo,
    },
  ],

  icon: [
    {
      title: "Colors",
      code: `<Icon name="bell" size="lg" />\n<Icon name="search" size="lg" color="tint" />\n<Icon name="trash" size="lg" color="destructive" />\n<Icon name="circle-check" size="lg" color="success" />`,
      Component: IconColorsDemo,
    },
    {
      title: "Sizes",
      code: `<Icon name="star" size="xs" />\n<Icon name="star" size="sm" />\n<Icon name="star" size="md" />\n<Icon name="star" size="xl" />`,
      Component: IconSizesDemo,
    },
    {
      title: "Accessible icon",
      description:
        "decorative={false} + aria-label when the icon carries meaning on its own.",
      code: `<Icon name="triangle-alert" color="warning" decorative={false} aria-label="Warning" />`,
      Component: IconAccessibleDemo,
    },
    {
      title: "All icons",
      description:
        "Every registered icon. Search by name, then click one to see its name and code.",
      code: `<Icon name="check" />`,
      Component: IconGalleryDemo,
    },
  ],

  card: [
    {
      title: "Elevation",
      code: `<Card elevation="flat">\n  <Text textStyle="headline">Flat</Text>\n  <Text color="secondary">Border, no shadow</Text>\n</Card>\n<Card elevation="raised">\n  <Text textStyle="headline">Raised</Text>\n  <Text color="secondary">Adds shadow-sm</Text>\n</Card>`,
      Component: CardElevationDemo,
    },
    {
      title: "Corner & padding",
      code: `<Card corner="squircle" padding="6" as="article">\n  <Text textStyle="headline">Squircle, custom padding</Text>\n  <Text color="secondary">Fixed padding="6" instead of the responsive default</Text>\n</Card>`,
      Component: CardCornerPaddingDemo,
    },
  ],

  list: [
    {
      title: "Plain",
      code: `<List>\n  <ListItem leadingIcon="bell" title="Notifications" subtitle="On for messages and calls" onClick={onOpen} />\n  <ListItem leadingIcon="user" title="Account" trailingIcon="chevron-right" onClick={onOpen} />\n  <ListItem leadingIcon="settings" title="Settings" trailingText="3 updates" onClick={onOpen} />\n</List>`,
      Component: ListPlainDemo,
    },
    {
      title: "Grouped, with swipe actions",
      description:
        "Swipe (touch) or hover the row (desktop) to reveal leadingAction/trailingActions.",
      code: `<List style="grouped">\n  <ListItem\n    leadingIcon="calendar"\n    title="Team sync"\n    onClick={onOpen}\n    leadingAction={{ icon: "check", label: "Done", color: "tint", onAction: onDone }}\n    trailingActions={[\n      { icon: "circle-alert", label: "Flag", color: "warning", onAction: onFlag },\n      { icon: "trash", label: "Delete", color: "destructive", onAction: onDelete },\n    ]}\n  />\n</List>`,
      Component: ListSwipeActionsDemo,
    },
    {
      title: "Context menu",
      description:
        "Long-press (touch) or right-click (desktop) a row with contextMenuItems set.",
      code: `<List style="grouped">\n  <ListItem\n    leadingIcon="user"\n    title="Contact"\n    contextMenuItems={[\n      { type: "action", icon: "copy", label: "Duplicate", onSelect: onDuplicate },\n      { type: "separator" },\n      { type: "action", icon: "trash", label: "Delete", role: "destructive", onSelect: onDelete },\n    ]}\n  />\n</List>`,
      Component: ListContextMenuDemo,
    },
  ],

  dropdown: [
    {
      title: "Actions & destructive",
      code: `<Dropdown\n  trigger={<Button variant="plain" trailingIcon="chevron-down">Actions</Button>}\n  items={[\n    { type: "action", icon: "copy", label: "Duplicate", onSelect: onDuplicate },\n    { type: "action", icon: "share", label: "Share", onSelect: onShare },\n    { type: "separator" },\n    { type: "action", icon: "trash", label: "Delete", role: "destructive", onSelect: onDelete },\n  ]}\n/>`,
      Component: DropdownActionsDemo,
    },
    {
      title: "Checkbox, radio & submenu",
      description:
        "checkbox/radio-group items keep the menu open across selections. Open the Export submenu to compare: compact pushes a new screen with a Back action, regular+ cascades a Radix flyout.",
      code: `<Dropdown\n  trigger={<Button variant="plain" trailingIcon="chevron-down">View options</Button>}\n  items={[\n    { type: "checkbox", label: "Show grid", checked: showGrid, onCheckedChange: setShowGrid },\n    { type: "separator" },\n    { type: "label", text: "Sort by" },\n    {\n      type: "radio-group",\n      value: sortBy,\n      onValueChange: setSortBy,\n      options: [\n        { value: "name", label: "Name" },\n        { value: "date", label: "Date" },\n      ],\n    },\n    { type: "separator" },\n    {\n      type: "submenu",\n      icon: "download",\n      label: "Export",\n      items: [\n        { type: "action", label: "PDF", onSelect: onExportPdf },\n        { type: "action", label: "CSV", onSelect: onExportCsv },\n      ],\n    },\n  ]}\n/>`,
      Component: DropdownCheckboxRadioSubmenuDemo,
      sizeClassPreview: true,
    },
    {
      title: "Long list (scroll)",
      description:
        "24 rows plus a submenu at the very bottom, past the menu's own max-height. Switch to Compact below, scroll to the bottom, then open the submenu -- it scrolls back to the top before sliding in, instead of the incoming screen starting pre-scrolled.",
      code: `<Dropdown\n  trigger={<Button variant="plain" trailingIcon="chevron-down">Long list</Button>}\n  items={[\n    { type: "action", label: "Row 1", onSelect: onSelectRow },\n    { type: "action", label: "Row 2", onSelect: onSelectRow },\n    // ...\n    { type: "action", label: "Row 24", onSelect: onSelectRow },\n    { type: "separator" },\n    {\n      type: "submenu",\n      icon: "download",\n      label: "More options",\n      items: [\n        { type: "action", label: "Export as PDF", onSelect: onExportPdf },\n        { type: "action", label: "Export as CSV", onSelect: onExportCsv },\n        { type: "action", label: "Print", onSelect: onPrint },\n      ],\n    },\n  ]}\n/>`,
      Component: DropdownLongListDemo,
      sizeClassPreview: true,
    },
  ],

  "context-menu": [
    {
      title: "Basic",
      code: `<ContextMenu\n  items={[\n    { type: "action", icon: "copy", label: "Duplicate", onSelect: onDuplicate },\n    { type: "action", icon: "share", label: "Share", onSelect: onShare },\n    { type: "separator" },\n    { type: "action", icon: "trash", label: "Delete", role: "destructive", onSelect: onDelete },\n  ]}\n>\n  <div>Right-click this area</div>\n</ContextMenu>`,
      Component: ContextMenuBasicDemo,
    },
    {
      title: "With submenu",
      code: `<ContextMenu\n  items={[\n    {\n      type: "submenu",\n      icon: "download",\n      label: "Export",\n      items: [\n        { type: "action", label: "PDF", onSelect: onExportPdf },\n        { type: "action", label: "CSV", onSelect: onExportCsv },\n      ],\n    },\n    { type: "separator" },\n    { type: "action", icon: "trash", label: "Delete", role: "destructive", onSelect: onDelete },\n  ]}\n>\n  <div>Right-click this area</div>\n</ContextMenu>`,
      Component: ContextMenuSubmenuDemo,
    },
    {
      title: "Long list (scroll)",
      description:
        "Same 24 rows + trailing submenu as Dropdown's long-list demo, and the same shared scroll-to-top-then-slide behavior (compact-menu.tsx's useMenuStack). Switch to Compact below, right-click the area, scroll to the bottom, then open the submenu.",
      code: `<ContextMenu\n  items={[\n    { type: "action", label: "Row 1", onSelect: onSelectRow },\n    { type: "action", label: "Row 2", onSelect: onSelectRow },\n    // ...\n    { type: "action", label: "Row 24", onSelect: onSelectRow },\n    { type: "separator" },\n    {\n      type: "submenu",\n      icon: "download",\n      label: "More options",\n      items: [\n        { type: "action", label: "Export as PDF", onSelect: onExportPdf },\n        { type: "action", label: "Export as CSV", onSelect: onExportCsv },\n        { type: "action", label: "Print", onSelect: onPrint },\n      ],\n    },\n  ]}\n>\n  <div>Right-click this area</div>\n</ContextMenu>`,
      Component: ContextMenuLongListDemo,
      sizeClassPreview: true,
    },
  ],

  sheet: [
    {
      title: "Basic Sheet",
      description: "Adaptive Presentation -- Bottom Sheet on touch, centered Modal with a mouse/trackpad.",
      code: `<Sheet open={open} onOpenChange={setOpen} title="Shipping details">\n  <SheetContent>\n    <SheetHeader>\n      <Text textStyle="headline">Shipping details</Text>\n    </SheetHeader>\n    <Container variant="content">\n      <VStack gap="section">...</VStack>\n    </Container>\n  </SheetContent>\n</Sheet>`,
      Component: SheetDemoBasic,
    },
    {
      title: "Snap points",
      description: "snapPoints only applies to the draggable Bottom Sheet (touch) presentation.",
      code: `<Sheet open={open} onOpenChange={setOpen} snapPoints={[0.4, 0.9]} title="Filters">\n  <SheetContent>...</SheetContent>\n</Sheet>`,
      Component: SheetDemoSnapPoints,
    },
    {
      title: "Nested sheets",
      description:
        "A Sheet opened from inside another Sheet's content recedes the one underneath it -- scaled down, dimmed, inert.",
      code: `<Sheet open={parentOpen} onOpenChange={setParentOpen} title="Choose a category">\n  <SheetContent>\n    <SheetHeader>\n      <Text textStyle="headline">Choose a category</Text>\n    </SheetHeader>\n    <Container variant="content">\n      <Button onClick={() => setChildOpen(true)}>New category...</Button>\n    </Container>\n  </SheetContent>\n</Sheet>\n\n<Sheet open={childOpen} onOpenChange={setChildOpen} title="New category">\n  <SheetContent>...</SheetContent>\n</Sheet>`,
      Component: SheetDemoNested,
    },
  ],
};

// ---------------------------------------------------------------------------
// Presentation -- one titled block per example: preview on top, an
// expandable code snippet below.
// ---------------------------------------------------------------------------

function ExampleBlock({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description?: string;
  code: string;
  children: ReactNode;
}) {
  const [showCode, setShowCode] = useState(false);
  const reducedMotion = useReducedMotion();
  const panelTransition = reducedMotion ? { duration: 0 } : springs.smooth;
  const labelTransition = reducedMotion
    ? { duration: 0 }
    : { duration: durations.fast };

  return (
    <div className="flex flex-col gap-(--space-3)">
      <div
        id={title}
        aria-labelledby={title ? `${title}-heading` : undefined}
        className="flex flex-col gap-(--space-1)"
      >
        <Text
          id={title ? `${title}-heading` : undefined}
          as="h3"
          textStyle="headline"
          weight="semibold"
        >
          {title}
        </Text>
        {description && (
          <Text textStyle="footnote" color="secondary">
            {description}
          </Text>
        )}
      </div>

      <div className="rounded-lg border border-separator bg-bg-secondary p-(--space-6)">
        {children}
      </div>

      <div>
        <Button
          variant="plain"
          size="sm"
          trailingIcon={showCode ? "chevron-up" : "chevron-down"}
          aria-expanded={showCode}
          onClick={() => setShowCode((prev) => !prev)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={showCode ? "hide" : "show"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={labelTransition}
            >
              {showCode ? "Hide code" : "Show code"}
            </motion.span>
          </AnimatePresence>
        </Button>
        {/* height: 0 <-> "auto" -- Framer Motion measures the real pixel
            height on mount/unmount for this, so the reveal animates smoothly
            instead of the panel just popping in/out. */}
        <AnimatePresence initial={false}>
          {showCode && (
            <motion.div
              key="code"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={panelTransition}
              className="overflow-hidden"
            >
              <div className="mt-(--space-2)">
                <DocsCodeBlock lang="tsx" copyable>
                  {code}
                </DocsCodeBlock>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ComponentDemo({ slug }: { slug: string }) {
  const examples = COMPONENT_DEMOS[slug];
  if (!examples) return null;

  return (
    <div className="flex flex-col gap-(--space-8)">
      {examples.map((example) => {
        const { Component } = example;
        return (
          <ExampleBlock
            key={example.title}
            title={example.title}
            description={example.description}
            code={example.code}
          >
            {example.sizeClassPreview ? (
              <SizeClassPreview>
                <Component />
              </SizeClassPreview>
            ) : (
              <Component />
            )}
          </ExampleBlock>
        );
      })}
    </div>
  );
}
