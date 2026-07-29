"use client";

import { useEffect, useState, type MouseEvent } from "react";

import { cn } from "@/lib/utils";

export interface DocsTocItem {
  id: string;
  title: string;
}

/**
 * In-page table of contents. Clicking a link scrolls to the matching section
 * and updates the URL hash; landing directly on a URL with a hash scrolls
 * to that section on mount. Highlights the section currently in view.
 */
export function DocsToc({ items }: { items: DocsTocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const target = document.getElementById(hash);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", `#${id}`);
    setActiveId(id);
  }

  if (items.length === 0) return null;

  return (
    <nav className="flex flex-col gap-1">
      <span className="mb-1 text-caption-1 font-semibold tracking-wide text-label-tertiary uppercase">
        On this page
      </span>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(event) => handleClick(event, item.id)}
          className={cn(
            "rounded-sm px-3 py-1.5 text-footnote transition-colors duration-200",
            activeId === item.id
              ? "font-semibold text-tint"
              : "text-label-secondary hover:text-label-primary",
          )}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}
