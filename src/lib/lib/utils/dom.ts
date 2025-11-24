/**
 * DOM utility functions
 */

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes?: Record<string, string>,
  children?: (string | HTMLElement)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  if (children) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

export function query<T extends Element = Element>(selector: string): T | null {
  return document.querySelector<T>(selector);
}

export function queryAll<T extends Element = Element>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector));
}

export function addClass(element: HTMLElement, ...classNames: string[]): void {
  element.classList.add(...classNames);
}

export function removeClass(element: HTMLElement, ...classNames: string[]): void {
  element.classList.remove(...classNames);
}

export function toggleClass(element: HTMLElement, className: string, force?: boolean): void {
  element.classList.toggle(className, force);
}

export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

export function setAttributes(element: HTMLElement, attributes: Record<string, string>): void {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export function getAttributes(element: HTMLElement): Record<string, string> {
  const attributes: Record<string, string> = {};
  
  Array.from(element.attributes).forEach((attr) => {
    attributes[attr.name] = attr.value;
  });
  
  return attributes;
}

export function removeElement(element: HTMLElement): void {
  element.parentNode?.removeChild(element);
}

export function insertAfter(newNode: HTMLElement, referenceNode: HTMLElement): void {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
}

export function insertBefore(newNode: HTMLElement, referenceNode: HTMLElement): void {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode);
}

export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

export function scrollTo(x: number, y: number, smooth: boolean = true): void {
  window.scrollTo({
    left: x,
    top: y,
    behavior: smooth ? "smooth" : "auto",
  });
}

export function scrollToElement(element: HTMLElement, smooth: boolean = true): void {
  element.scrollIntoView({
    behavior: smooth ? "smooth" : "auto",
    block: "start",
  });
}

export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
}

export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportSize();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= viewport.height &&
    rect.right <= viewport.width
  );
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback for older browsers
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return Promise.resolve();
  } catch (error) {
    document.body.removeChild(textArea);
    return Promise.reject(error);
  }
}

