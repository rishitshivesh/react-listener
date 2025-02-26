"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useListener = useListener;
const react_1 = require("react");
/**
 * `useListener` - A versatile event listener hook for React.
 * @param target - The target element, ref, or selector to attach the event(s) to.
 * @param eventTypes - The event name(s) (e.g., 'click' or ['mousedown', 'mouseup']).
 * @param callback - The event handler function.
 * @param options - Additional configurations for listener behavior.
 */
function useListener(target = window, eventTypes, callback, options = {}) {
    const { debounce, delay, enabled = true, once, capture, passive, targetSelector, } = options;
    const timerRef = (0, react_1.useRef)(null);
    const hasRunOnce = (0, react_1.useRef)(false);
    // ✅ Properly typed event handler
    const eventHandler = (0, react_1.useCallback)((event) => {
        if (!enabled)
            return;
        if (once && hasRunOnce.current)
            return; // ✅ Ensures the event fires only once
        hasRunOnce.current = true;
        if (!once)
            hasRunOnce.current = false; // ✅ Reset if `once` is false
        if (delay) {
            setTimeout(() => callback(event), delay);
            return;
        }
        if (debounce) {
            if (timerRef.current)
                clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => callback(event), debounce);
            return;
        }
        callback(event);
    }, [callback, debounce, delay, enabled, once]);
    (0, react_1.useEffect)(() => {
        if (!enabled)
            return;
        const elements = [];
        if (targetSelector) {
            document
                .querySelectorAll(targetSelector)
                .forEach((el) => elements.push(el));
        }
        else {
            const resolvedTarget = target && "current" in target ? target.current : target;
            if (resolvedTarget)
                elements.push(resolvedTarget);
        }
        if (elements.length === 0)
            return;
        const events = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
        elements.forEach((el) => {
            events.forEach((event) => {
                el === null || el === void 0 ? void 0 : el.addEventListener(event, eventHandler, {
                    capture,
                    passive,
                    once,
                });
            });
        });
        return () => {
            elements.forEach((el) => {
                events.forEach((event) => {
                    el === null || el === void 0 ? void 0 : el.removeEventListener(event, eventHandler);
                });
            });
            if (timerRef.current)
                clearTimeout(timerRef.current);
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
        const resolvedTarget = target && "current" in target ? target.current : target;
        if (resolvedTarget) {
            const events = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
            events.forEach((event) => {
                resolvedTarget.removeEventListener(event, eventHandler);
            });
        }
    };
}
