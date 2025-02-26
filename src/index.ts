import { useCallback, useEffect, useRef } from "react";

interface ListenerOptions {
  debounce?: number;
  delay?: number;
  enabled?: boolean;
  once?: boolean;
  capture?: boolean;
  passive?: boolean;
  targetSelector?: string;
}

export type EventCallback<E extends Event = Event> = (event: E) => void;

/**
 * `useListener` - A versatile event listener hook for React.
 * @param target - The target element, ref, or selector to attach the event(s) to.
 * @param eventTypes - The event name(s) (e.g., 'click' or ['mousedown', 'mouseup']).
 * @param callback - The event handler function.
 * @param options - Additional configurations for listener behavior.
 */
export function useListener<T extends EventTarget, E extends Event>(
  target: T | { current: T | null | undefined } | undefined,
  eventTypes: string | string[],
  callback: EventCallback<E>,
  options: ListenerOptions = {}
) {
  const {
    debounce,
    delay,
    enabled = true,
    once,
    capture,
    passive,
    targetSelector,
  } = options;

  const timerRef = useRef<number | null>(null);
  const hasRunOnce = useRef(false);

  const eventHandler = useCallback(
    (event: E) => {
      if (typeof document === "undefined" || !enabled) return;
      if (once && hasRunOnce.current) return; // Ensures the event fires only once

      hasRunOnce.current = true;
      if (!once) hasRunOnce.current = false; // Reset if `once` is false

      if (delay) {
        setTimeout(() => callback(event), delay);
        return;
      }

      if (debounce) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => callback(event), debounce);
        return;
      }

      callback(event);
    },
    [callback, debounce, delay, enabled, once]
  );

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof document === "undefined" ||
      !enabled
    )
      return;

    const elements: EventTarget[] = [];
    const resolvedTarget =
      target && "current" in target ? target.current : target || window;

    if (targetSelector) {
      document
        .querySelectorAll(targetSelector)
        .forEach((el) => elements.push(el as EventTarget));
    } else if (resolvedTarget) {
      elements.push(resolvedTarget);
    }

    if (elements.length === 0) return;

    const events = Array.isArray(eventTypes) ? eventTypes : [eventTypes];

    elements.forEach((el) => {
      events.forEach((event) => {
        el?.addEventListener(event, eventHandler as EventListener, {
          capture,
          passive,
          once,
        });
      });
    });

    return () => {
      elements.forEach((el) => {
        events.forEach((event) => {
          el?.removeEventListener(event, eventHandler as EventListener);
        });
      });
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    target,
    eventTypes,
    eventHandler,
    enabled,
    capture,
    passive,
    once,
    targetSelector,
  ]);

  return () => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const resolvedTarget =
      target && "current" in target ? target.current : target || window;
    if (resolvedTarget) {
      const events = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
      events.forEach((event) => {
        resolvedTarget.removeEventListener(
          event,
          eventHandler as EventListener
        );
      });
    }
  };
}
