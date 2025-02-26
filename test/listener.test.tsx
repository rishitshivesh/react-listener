import React, { useState, useRef } from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { useListener } from "../src";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  cleanup();
  jest.useRealTimers();
});

describe("useListener Hook Tests", () => {
  it("should handle debounce correctly", () => {
    function App() {
      const [count, setCount] = useState(0);
      const el = useRef<HTMLButtonElement>(null);
      useListener(el, "click", () => setCount((x) => x + 1), {
        debounce: 300,
      });

      return (
        <>
          <div role="count">{count}</div>
          <button ref={el} role="btn">
            Click
          </button>
        </>
      );
    }

    const screen = render(<App />);
    expect(screen.getByRole("count").innerHTML).toBe("0");

    // Click multiple times quickly
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByRole("btn"));
    }

    // Advance time to trigger debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Only one increment should occur
    expect(screen.getByRole("count").innerHTML).toBe("1");
  });

  it("should handle delay correctly", () => {
    function App() {
      const [count, setCount] = useState(0);
      useListener(window, "click", () => setCount((x) => x + 1), {
        delay: 500,
      });

      return <div role="count">{count}</div>;
    }

    const screen = render(<App />);
    fireEvent.click(window);
    expect(screen.getByRole("count").innerHTML).toBe("0");

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByRole("count").innerHTML).toBe("1");
  });

  it("should handle multiple event types correctly", () => {
    function App() {
      const [count, setCount] = useState(0);
      useListener(window, ["click", "keydown"], () => setCount((x) => x + 1));

      return <div role="count">{count}</div>;
    }

    const screen = render(<App />);
    expect(screen.getByRole("count").innerHTML).toBe("0");

    fireEvent.click(window);
    fireEvent.keyDown(window);

    expect(screen.getByRole("count").innerHTML).toBe("2");
  });

  it("should support dynamic target selection with CSS selector", () => {
    function App() {
      const [count, setCount] = useState(0);
      useListener(null, "click", () => setCount((x) => x + 1), {
        targetSelector: ".dynamic-btn",
      });

      return (
        <>
          <div role="count">{count}</div>
          <button className="dynamic-btn">Dynamic Button</button>
        </>
      );
    }

    const screen = render(<App />);
    fireEvent.click(screen.getByText("Dynamic Button"));
    expect(screen.getByRole("count").innerHTML).toBe("1");
  });

  it("should support once behavior", () => {
    function App() {
      const [count, setCount] = useState(0);
      useListener(window, "click", () => setCount((x) => x + 1), {
        once: true,
      });

      return <div role="count">{count}</div>;
    }

    const screen = render(<App />);

    // Fire the event multiple times
    fireEvent.click(window);
    fireEvent.click(window);
    fireEvent.click(window);

    // ✅ Ensure the event fired only once
    expect(screen.getByRole("count").innerHTML).toBe("1");
  });

  it("should properly clean up event listeners on unmount", () => {
    const removeEventListenerMock = jest.fn();
    const addEventListenerMock = jest.fn();
    const customTarget = {
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    } as any;

    function App({ active }: { active: boolean }) {
      if (active) {
        useListener(customTarget, "click", () => {});
      }
      return <></>;
    }

    const screen = render(<App active={true} />);

    expect(addEventListenerMock).toHaveBeenCalledTimes(1);

    screen.rerender(<App active={false} />);
  });

  it("should correctly apply passive and capture options", () => {
    const eventOptions: any = {};
    const addEventListenerMock = jest.fn((event, handler, options) => {
      eventOptions[event] = options;
    });

    const customTarget = {
      addEventListener: addEventListenerMock,
      removeEventListener: jest.fn(),
    };

    function App() {
      useListener(customTarget as any, "click", () => {}, {
        passive: true,
        capture: true,
      });

      return <></>;
    }

    render(<App />);
    expect(addEventListenerMock).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      expect.objectContaining({
        passive: true,
        capture: true,
      })
    );
  });

  it("should handle dynamic target refs", () => {
    function App() {
      const [count, setCount] = useState(0);
      const buttonRef = useRef<HTMLButtonElement>(null);
      useListener(buttonRef, "click", () => setCount((x) => x + 1));

      return (
        <>
          <div role="count">{count}</div>
          <button ref={buttonRef} role="btn">
            Click
          </button>
        </>
      );
    }

    const screen = render(<App />);
    fireEvent.click(screen.getByRole("btn"));
    expect(screen.getByRole("count").innerHTML).toBe("1");
  });

  it("should not throw errors if the target is null", () => {
    function App() {
      useListener(null, "click", () => {});
      return <></>;
    }

    expect(() => render(<App />)).not.toThrow();
  });
});
