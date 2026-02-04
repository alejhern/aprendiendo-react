# 🎮 Game State Management — Tic-Tac-Toe (01_3_En_Raya)

## 📌 Purpose and Scope

This document describes the **state management architecture** of the Tic-Tac-Toe game after refactoring the logic into a **custom React Hook**: `use3EnRaya`.

The hook encapsulates all game-related state and behavior, including:

* Board and turn initialization
* Persistence with `localStorage`
* Game progression and winner detection
* Draw handling
* Game reset logic

This approach improves **separation of concerns**, **reusability**, and **testability**, keeping UI components focused purely on presentation.

---

## ⚛️ React Hooks Fundamentals: `useState` and `useEffect`

Before diving into the game-specific logic, it is important to understand the two **core React Hooks** that power the state management in this application: **`useState`** and **`useEffect`**. These hooks are the foundation on which the custom hook `use3EnRaya` is built.

---

### 🔹 `useState`: Local State Management

`useState` allows a functional component (or custom hook) to **store and update local state**. When state changes, React automatically re-renders any components that depend on that state.

General syntax:

```js
const [state, setState] = useState(initialValue)
```

* `state` → the current value
* `setState` → function used to update the value
* `initialValue` → only used on the **first render**

---

#### 🧠 Lazy Initialization

In `use3EnRaya`, `useState` is often used with a **function as the initial value**:

```js
useState(() => {
  // initialization logic
})
```

This is called *lazy initialization* and ensures that:

* The logic runs **only once** (on mount)
* Expensive operations (like reading from `localStorage`) are not repeated on every render

---

#### 📦 `useState` in `use3EnRaya`

```js
const [board, setBoard] = useState(() => {
  const boardFromStorage = window.localStorage.getItem('board')
  return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
})
```

* `board` represents the full game board
* `setBoard` replaces the board immutably
* Any update triggers a re-render of the UI

The same pattern is used for:

* `turn` → current player
* `winner` → game outcome

---

### 🔹 `useEffect`: Side Effects and Synchronization

`useEffect` allows React components and hooks to run **side effects** — operations that interact with the outside world.

Examples of side effects:

* Reading or writing to `localStorage`
* Making HTTP requests
* Subscribing to events
* Triggering animations

General syntax:

```js
useEffect(() => {
  // side effect

  return () => {
    // optional cleanup
  }
}, [dependencies])
```

---

#### 🧩 Dependency Array

The dependency array controls **when** the effect runs:

* `[]` → run only once (on mount)
* `[a, b]` → run whenever `a` or `b` changes
* no array → run on every render (⚠️ rarely desired)

React compares dependencies using **referential equality**.

---

#### 💾 `useEffect` for Persistence

```js
useEffect(() => {
  window.localStorage.setItem('board', JSON.stringify(board))
  window.localStorage.setItem('turn', turn)
}, [turn, board])
```

* Runs **after every render** where `board` or `turn` changes
* Keeps React state and `localStorage` synchronized
* Does not block rendering

---

#### 🧹 `useEffect` for Cleanup

```js
useEffect(() => {
  if (winner === null) return
  window.localStorage.removeItem('board')
  window.localStorage.removeItem('turn')
}, [winner])
```

* Runs when `winner` changes
* Clears persisted state when the game ends
* Prevents stale game restoration

---

### 🧠 Why Hooks Work Well Here

Using `useState` and `useEffect` inside a **custom hook** provides:

* 🔒 Encapsulation of logic
* ♻️ Reusability across components
* 🧪 Easier testing (logic isolated from UI)
* 🧹 Centralized side-effect management

This makes `use3EnRaya` a clean, declarative abstraction over the entire game lifecycle.

---

## 🚀 Performance Hooks: `useMemo` and `useCallback`

In addition to `useState` and `useEffect`, the `use3EnRaya` hook leverages **`useMemo`** and **`useCallback`** to improve performance and ensure stable references when passing values and functions to child components.

These hooks are not about *making the app faster by default*, but about **avoiding unnecessary work and re-renders** as the application grows.

---

### 🔹 `useMemo`: Memoizing Derived Values

`useMemo` caches the **result of a computation** and only recalculates it when its dependencies change.

General syntax:

```js
const memoizedValue = useMemo(() => computeValue(a, b), [a, b])
```

Use `useMemo` when:

* The value is **derived from state or props**
* The computation has a cost (CPU or conceptual complexity)
* You want to avoid recalculating it on every render

---

#### 🤝 `useMemo` in `use3EnRaya`: Draw Detection

```js
const isDraw = useMemo(() => {
  return board.every(square => square !== null)
}, [board])
```

Why this makes sense:

* `isDraw` is **derived state** (it depends only on `board`)
* Keeps the render logic clean and declarative
* Guarantees consistency across renders

This avoids recalculating the draw condition unless the board actually changes.

---

### 🔹 `useCallback`: Stable Function References

`useCallback` memoizes a **function reference**, ensuring that React does not create a new function on every render unless dependencies change.

General syntax:

```js
const memoizedFn = useCallback(() => {
  // logic
}, [dependencies])
```

Use `useCallback` when:

* Passing callbacks to child components
* The function depends on state or props
* You want to prevent unnecessary re-renders or re-subscriptions

---

#### ♻️ `useCallback` in `use3EnRaya`: Reset Logic

```js
const resetGame = useCallback(() => {
  setBoard(Array(9).fill(null))
  setTurn(PLAYERS.x)
  setWinner(null)
}, [])
```

Why this is important:

* `resetGame` does not depend on changing state
* The reference stays stable across renders
* Ideal for passing to buttons or modals

---

### ⚠️ Why `updateBoard` Uses `useMemo`

```js
const updateBoard = useMemo(() => (index) => {
  // game logic
}, [board, turn, winner, isDraw])
```

This pattern ensures:

* The function always closes over **the latest state**
* A stable reference unless dependencies change

> 💡 `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`

Using `useMemo` here makes the dependency relationship explicit and keeps the logic readable.

---

### 🧠 Mental Model: When to Use Which Hook

| Hook          | Use it when…                           |
| ------------- | -------------------------------------- |
| `useState`    | You need to store mutable UI state     |
| `useEffect`   | You need side effects or external sync |
| `useMemo`     | You derive values from state           |
| `useCallback` | You pass functions down the tree       |

---

## 🧭 Game Lifecycle Flowchart

Below is a mental model of the **complete game cycle**, from initialization to reset:

```
┌─────────────────────────┐
│ Component Mount         │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│ useState (lazy init)    │
│ - board from storage    │
│ - turn from storage     │
│ - winner = null         │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│ User clicks a Square    │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│ updateBoard(index)     │
│ - guard checks          │
│ - update board          │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│ checkWinner(newBoard)  │
└───────┬─────────┬───────┘
        │         │
        │         ▼
        │   ┌────────────────┐
        │   │ Draw detected  │
        │   │ winner = false │
        │   └────────────────┘
        │
        ▼
┌─────────────────────────┐
│ Winner found            │
│ - setWinner(symbol)     │
│ - confetti 🎉           │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│ useEffect cleanup       │
│ - clear localStorage    │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│ User clicks Reset       │
│ resetGame()             │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│ Fresh game state        │
└─────────────────────────┘
```

This flow clearly shows how **state, effects, memoization, and user interaction** work together to manage the full lifecycle of the game.

---

## 🧠 State Architecture

The game manages three core pieces of state inside the custom hook:

| State Variable | Type                        | Purpose                        | Initial Value Source          |
| -------------- | --------------------------- | ------------------------------ | ----------------------------- |
| `board`        | `Array<string \| null>`     | Tracks the 9 board positions   | `localStorage` or empty array |
| `turn`         | `string`                    | Tracks current player (❌ or ⭕) | `localStorage` or `PLAYERS.x` |
| `winner`       | `string \| boolean \| null` | Tracks game outcome            | `null`                        |

### 🏁 Winner State Values

* `null` → Game in progress
* `false` → Draw (board full, no winner)
* `'❌'` or `'⭕'` → Winning player

---

## 🧩 Custom Hook: `use3EnRaya`

The `use3EnRaya` hook centralizes **all game logic and side effects**.

```js
export function use3EnRaya() {
  return { board, turn, winner, updateBoard, resetGame }
}
```

### ✅ Responsibilities of the Hook

* Initialize state from `localStorage`
* Persist state changes
* Prevent invalid moves
* Detect wins and draws
* Trigger side effects (confetti 🎉)
* Expose a clean API to UI components

---

## 💾 State Initialization with `localStorage`

Lazy initialization is used to ensure values are read from `localStorage` **only once on mount**.

### 🧱 Board Initialization

```js
const [board, setBoard] = useState(() => {
  const boardFromStorage = window.localStorage.getItem('board')
  return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
})
```

### 🔁 Turn Initialization

```js
const [turn, setTurn] = useState(() => {
  const turnFromStorage = window.localStorage.getItem('turn')
  return turnFromStorage ? turnFromStorage : PLAYERS.x
})
```

---

## 🔄 State Persistence with `useEffect`

### 💾 Persistence Effect

Whenever `board` or `turn` changes, the state is synchronized with `localStorage`:

```js
useEffect(() => {
  window.localStorage.setItem('board', JSON.stringify(board))
  window.localStorage.setItem('turn', turn)
}, [turn, board])
```

This guarantees that an in-progress game survives browser refreshes.

---

### 🧹 Cleanup Effect

When the game ends (`winner !== null`), persisted data is cleared:

```js
useEffect(() => {
  if (winner === null) return
  window.localStorage.removeItem('board')
  window.localStorage.removeItem('turn')
}, [winner])
```

This prevents finished games from being restored.

---

## 🤝 Draw Detection (Derived State)

Draw detection is implemented as **derived state** using `useMemo`:

```js
const isDraw = useMemo(() => {
  return board.every(square => square !== null)
}, [board])
```

This avoids unnecessary recalculations and keeps the logic declarative.

---

## ⚙️ Game Update Flow — `updateBoard`

The `updateBoard` function is memoized and contains the full game progression logic.

```js
const updateBoard = useMemo(() => (index) => {
  if (board[index] || winner) return

  const newBoard = [...board]
  newBoard[index] = turn
  setBoard(newBoard)

  const newWinner = checkWinner(newBoard)
  if (newWinner) {
    setWinner(newWinner)
    confetti()
    return
  }

  if (isDraw) {
    setWinner(false)
    return
  }

  const newTurn = turn === PLAYERS.x ? PLAYERS.o : PLAYERS.x
  setTurn(newTurn)
}, [board, turn, winner, isDraw])
```

### 🛑 Early Exit Guards

* Prevents overwriting occupied squares
* Prevents moves after the game has ended

### 🏆 Win Detection

* Delegated to `checkWinner` from `logic/board.js`
* Triggers a confetti animation on success

---

## ♻️ Game Reset Logic

```js
const resetGame = useCallback(() => {
  setBoard(Array(9).fill(null))
  setTurn(PLAYERS.x)
  setWinner(null)
}, [])
```

* Resets all game state
* Automatically triggers `localStorage` cleanup via effects

---

## 🎨 Integration with UI Components

The hook is consumed by the top-level component (`App.jsx`), which passes state and callbacks down to presentation components.

```js
const { board, turn, winner, updateBoard, resetGame } = use3EnRaya()
```

### 🔗 Data Flow

```
use3EnRaya (state + logic)
        ↓
       App
        ↓
     Board
        ↓
     Square
```

* State flows downward
* User actions flow upward via `updateBoard`

---

## 🔌 External Dependencies

| Dependency        | Purpose                   |
| ----------------- | ------------------------- |
| `canvas-confetti` | Visual celebration on win |
| `checkWinner`     | Winner detection logic    |
| `PLAYERS`         | Player symbol constants   |

---

✨ **Result:** A clean, reusable, and maintainable state management solution built around a custom React Hook, fully aligned with React’s unidirectional data flow and side‑effect management patterns.
