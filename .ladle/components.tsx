import type { GlobalProvider } from "@ladle/react";
import { useEffect } from "react";
import "../app/globals.css";

export const Provider: GlobalProvider = ({ children, globalState }) => {
  const isDark = globalState.theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return <div style={{ padding: "1.5rem" }}>{children}</div>;
};
