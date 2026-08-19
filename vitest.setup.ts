import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement ResizeObserver, which Radix primitives (Tooltip,
// DropdownMenu, ...) use internally to measure content for positioning.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

// jsdom doesn't implement the Pointer Capture API either -- Radix Slider
// calls set/has/releasePointerCapture directly on the event target during
// drag (react-slider's onPointerDown/onPointerMove/onPointerUp handlers).
if (typeof HTMLElement !== "undefined" && !HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
  HTMLElement.prototype.setPointerCapture = () => {};
  HTMLElement.prototype.releasePointerCapture = () => {};
}

// jsdom doesn't implement matchMedia either -- used for pointer/hover
// capability checks (e.g. ListItem's touch-vs-mouse swipe gating).
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom doesn't implement document.scrollingElement -- framer-motion's
// scroll() (useScrollProgress) defaults its container to that when no
// scrollable ancestor is found, and silently no-ops if it's null/undefined,
// so window-driven scroll tests would otherwise never fire.
if (typeof document !== "undefined" && !document.scrollingElement) {
  Object.defineProperty(document, "scrollingElement", {
    value: document.documentElement,
    configurable: true,
  });
}

// Node's own experimental `localStorage` global (gated behind
// --localstorage-file) shadows jsdom's window.localStorage in this setup,
// leaving it as a plain object with none of the Storage methods (getItem/
// setItem/removeItem/clear) -- breaks any component reading a saved
// preference (e.g. TabBar's top/sidebar layout, SS2.5 dark mode pattern).
// In-memory polyfill so tests get a real Storage implementation.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
}

if (typeof window !== "undefined" && typeof window.localStorage?.setItem !== "function") {
  Object.defineProperty(window, "localStorage", {
    value: new MemoryStorage(),
    writable: true,
    configurable: true,
  });
}
