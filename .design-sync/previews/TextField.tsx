import { useState } from "react";
import { TextField } from "@/components/ui/text-field";

export function LeadingIcon() {
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

export function TrailingIcon() {
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

export function ErrorState() {
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

export function Disabled() {
  return (
    <div className="w-full max-w-72">
      <TextField value="Read-only value" onValueChange={() => {}} disabled />
    </div>
  );
}
