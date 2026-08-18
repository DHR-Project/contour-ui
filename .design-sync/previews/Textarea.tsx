import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/stack";

export function Basic() {
  const [value, setValue] = useState("");
  return (
    <div className="w-full max-w-80">
      <Textarea value={value} onValueChange={setValue} placeholder="Write a message…" />
    </div>
  );
}

export function Counter() {
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
      <Textarea value={warning} onValueChange={setWarning} placeholder="Short bio" maxLength={100} />
    </VStack>
  );
}

export function ErrorAndDisabled() {
  const [value, setValue] = useState("");
  return (
    <VStack gap="4" className="w-full max-w-80">
      <Textarea
        value={value}
        onValueChange={setValue}
        placeholder="Description"
        error="This field is required"
      />
      <Textarea value="Cannot edit this content." onValueChange={() => {}} disabled />
    </VStack>
  );
}
