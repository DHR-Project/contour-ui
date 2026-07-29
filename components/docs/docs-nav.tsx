"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { docsNavGroups } from "@/lib/docs/nav-items";
import { TextField } from "@/components/ui/text-field";
import { Badge } from "@/components/ui/badge";
import { DocsNavPreferences } from "@/components/docs/docs-nav-preferences";

export function DocsNav() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return docsNavGroups;
    return docsNavGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.title.toLowerCase().includes(normalized)),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <TextField
        type="text"
        size="sm"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery("")}
        placeholder="Search components..."
        aria-label="Search components"
        leadingIcon="search"
      />

      <nav className="flex flex-col gap-5">
        {filteredGroups.length === 0 ? (
          <p className="px-3 text-footnote text-label-tertiary">No components found.</p>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-1">
              <p className="px-3 text-caption2 font-semibold tracking-wide text-label-tertiary uppercase">
                {group.title}
              </p>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-sm px-3 py-2 text-subheadline transition-colors duration-200",
                      isActive
                        ? "bg-fill-secondary font-semibold text-label-primary"
                        : "text-label-secondary hover:bg-fill-quaternary",
                    )}
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="tinted"
                        color="primary"
                        size="sm"
                        shape="pill"
                        className="text-[10px] font-semibold px-1.5"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          ))
        )}
      </nav>

      <DocsNavPreferences />
    </div>
  );
}
