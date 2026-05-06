import "@radix-ui/themes/styles.css";
import "./index.css";
import "./App.css";
import type { ReactNode } from "react";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function Themed({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <Theme appearance={resolvedTheme} accentColor="indigo" grayColor="slate" radius="medium" hasBackground={false}>
      {children}
    </Theme>
  );
}

export default function ToolShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Themed>
        <div className="json-tools-root flex flex-col w-full max-w-6xl mx-auto px-4 py-8">
          {children}
        </div>
      </Themed>
    </ThemeProvider>
  );
}
