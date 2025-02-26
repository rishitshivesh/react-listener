# React Listener Hook

A lightweight and flexible React hook for handling event listeners with **debounce**, **delay**, and **CSS selectors** support.

## 📦 Installation

```sh
yarn add react-listener
# or
npm install react-listener
```

## 🚀 Usage

### **Basic Example**

```tsx
import { useListener } from "react-listener";

function App() {
  useListener(window, "resize", () => {
    console.log("Window resized!");
  });

  return <div>Resize the window to see logs in the console.</div>;
}
```

### **Debounce Example**

```tsx
useListener(
  window,
  "scroll",
  () => {
    console.log("Scrolled!");
  },
  { debounce: 500 }
);
```

### **Using a Ref**

```tsx
import { useRef } from "react";
import { useListener } from "react-listener";

function ClickCounter() {
  const btnRef = useRef(null);
  const [count, setCount] = useState(0);

  useListener(btnRef, "click", () => setCount((prev) => prev + 1));

  return <button ref={btnRef}>Clicked {count} times</button>;
}
```

## 🛠 Features

✅ **Supports Multiple Events** (`click`, `keydown`, etc.)  
✅ **Debounce and Delay Support**  
✅ **Attach Listeners to Refs or Window/Document**  
✅ **CSS Selector Support** (for dynamically added elements)  
✅ **Automatic Cleanup on Unmount**

## 📝 License

This project is licensed under the MIT License.
