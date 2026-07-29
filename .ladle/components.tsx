import type { GlobalProvider } from "@ladle/react";
import "../app/globals.css";

export const Provider: GlobalProvider = ({ children, globalState }) => {
  const isDark = globalState.theme === "dark";
  return (
    <div className={isDark ? "dark" : ""} style={{ padding: "1.5rem" }}>
      {children}
    </div>
  );
};
