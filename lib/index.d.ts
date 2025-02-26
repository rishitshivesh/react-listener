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
export declare function useListener<T extends EventTarget, E extends Event>(target: (T | {
    current: T | null | undefined;
}) | undefined, eventTypes: string | string[], callback: EventCallback<E>, options?: ListenerOptions): () => void;
export {};
