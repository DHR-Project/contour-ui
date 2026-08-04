// Walks up from `node` to find the nearest ancestor that actually scrolls.
// NavBar/ProgressiveBlur assumed `window` was always the scrolling context,
// which silently does nothing when the bar lives inside its own scrollable
// container (a flex/grid section with `overflow-y: auto`, common in real
// app shells) instead of the page body -- `window.scrollY` just stays 0.
export function findScrollParent(node: Element | null): HTMLElement | null {
  let el = node?.parentElement ?? null;
  while (el) {
    const style = getComputedStyle(el);
    if (/(auto|scroll|overlay)/.test(style.overflowY) && el.scrollHeight > el.clientHeight) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export function getScrollTop(target: HTMLElement | null): number {
  return target ? target.scrollTop : window.scrollY;
}

export function getScrollEventTarget(target: HTMLElement | null): HTMLElement | Window {
  return target ?? window;
}
