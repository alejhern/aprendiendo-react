# 🖱️ Mouse Follower — Custom Hook with React

## 📌 Purpose and Scope

This project demonstrates how to build a **mouse follower effect** using React by encapsulating all logic inside a **custom hook** called `useMouse`.

The goal is to:

* Track mouse movement
* Animate a DOM element that smoothly follows the cursor
* Enable / disable the effect dynamically
* Manage DOM side effects correctly using React Hooks

This project is a practical example of **imperative DOM manipulation** done safely inside React using `useEffect` and `useRef`.

---

## 🧠 Architecture Overview

The application is split into two clear responsibilities:

* **`App.jsx`** → UI and user interaction
* **`useMouse.js`** → State, effects, and animation logic

```
App
 └── useMouse (custom hook)
       ├── state (enable)
       ├── ref (followerRef)
       ├── mouse events
       └── animation loop
```

This separation keeps the UI declarative and the logic reusable.

---

## ⚛️ React Hooks Used

The project relies on three core React hooks:

| Hook        | Purpose                                      |
| ----------- | -------------------------------------------- |
| `useState`  | Enable / disable the follower                |
| `useRef`    | Direct DOM access to the follower element    |
| `useEffect` | Side effects: events, animation, DOM updates |

---

## 🔹 `useState`: Feature Toggle

```js
const [enable, setEnable] = useState(false)
```

* Controls whether the mouse follower is active
* Drives conditional rendering in the UI
* Triggers effects when its value changes

```js
const toggleEnable = () => setEnable(!enable)
```

---

## 🔹 `useRef`: DOM Element Reference

```js
const followerRef = useRef(null)
```

Why `useRef` is required:

* The follower is a **real DOM element**, not React state
* Animations require **direct style mutations**
* Updating refs does **not** trigger re-renders

This makes `useRef` the correct tool for animations.

---

## 🔹 `useEffect`: Mouse Tracking & Animation

### 🎯 Main Effect: Mouse Following Logic

```js
useEffect(() => {
  if (!enable) return

  const follower = followerRef.current
  let mouseX = 0
  let mouseY = 0
  let posX = 0
  let posY = 0

  const handleMouseMove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  const animate = () => {
    posX += (mouseX - posX) * 0.1
    posY += (mouseY - posY) * 0.1

    follower.style.transform = `
      translate3d(${posX}px, ${posY}px, 0)
      translate(-50%, -50%)
    `

    requestAnimationFrame(animate)
  }

  window.addEventListener('mousemove', handleMouseMove)
  animate()

  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
  }
}, [enable])
```

### 🧠 What Happens Here

* Effect runs **only when `enable` changes**
* Early return prevents unnecessary work
* Mouse position is tracked via `mousemove`
* Animation runs in a continuous loop using `requestAnimationFrame`
* Smooth motion is achieved using **linear interpolation (lerp)**

---

## ✨ Smooth Animation with LERP

```js
posX += (mouseX - posX) * 0.1
posY += (mouseY - posY) * 0.1
```

This technique:

* Creates a trailing effect
* Avoids abrupt jumps
* Produces natural-feeling motion

---

## 🧹 Cleanup and Safety

* Event listeners are removed when the effect stops
* Prevents memory leaks
* Keeps behavior predictable

React guarantees the cleanup function runs:

* When `enable` changes
* When the component unmounts

---

## 🖱️ Cursor Visibility Effect

A secondary effect controls cursor visibility:

```js
useEffect(() => {
  document.body.classList.toggle('no-cursor', enable)
  return () => document.body.classList.remove('no-cursor')
}, [enable])
```

Purpose:

* Hides the system cursor when the follower is active
* Restores it automatically when disabled

---

## 🎨 UI Integration (`App.jsx`)

```js
const { enable, toggleEnable, followerRef } = useMouse()
```

### Conditional Rendering

```jsx
{enable && <div ref={followerRef} className="follower" />}
```

* The follower exists **only when enabled**
* Prevents unnecessary DOM nodes
* Matches React’s declarative philosophy

---

## 🧭 Interaction Flow Diagram

```
App Render
   ↓
User clicks button
   ↓
toggleEnable()
   ↓
setEnable(true)
   ↓
useEffect runs
   ↓
mousemove listener attached
   ↓
requestAnimationFrame loop
   ↓
DOM transform updates
   ↓
Follower tracks mouse
```

---

## 🧠 Why a Custom Hook?

Encapsulating this logic inside `useMouse` provides:

* ♻️ Reusability
* 🧼 Clean components
* 🧠 Easier reasoning about side effects
* 🧪 Better testability

The UI remains declarative, while imperative logic is isolated.

---

✨ **Result:** A clean, idiomatic React implementation of a mouse follower effect using hooks, refs, and effects — ideal for learning advanced React patterns.
