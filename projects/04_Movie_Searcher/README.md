# 🎬 Movie Search Application

## 📌 Purpose and Scope

The **Movie Search Application** is a high-priority project in the repository that demonstrates advanced React patterns:

* Custom Hooks
* Debouncing for optimized input handling
* External API integration
* Optional alphabetical sorting

The app allows users to search movies in real-time and automatically handles rapid typing through debouncing.

> 🔎 For detailed hook documentation, see `useSearchMovies` hook (#2.1). For UI details, see `Searcher` component (#2.2).

---

## 🏗 Application Architecture

The application follows a **hook-driven architecture**:

### Layers

1. **UI Layer**

   * `App.jsx` orchestrates the layout
   * `Searcher` handles user input
   * `MoviesGrid` displays search results

2. **Logic Layer**

   * `useSearchMovies` custom hook manages state, debouncing, sorting, and API calls

3. **Service Layer**

   * `searchMovies` function abstracts external API communication

### Component Hierarchy

```
App
 ├─ Searcher (input, checkbox, submit button)
 └─ MoviesGrid (movie cards)
```

* `App` consumes the `useSearchMovies` hook
* Props passed to children: `movies`, `handleSubmit`, `handlerSort`, `handlerSearchChange`

---

## 🧩 Application Flow

### Flowchart (Mermaid.js)

```mermaid
flowchart TD
    A[User Input (Searcher)] --> B[useSearchMovies Hook]
    B -->|calls| C[searchMovies API]
    C --> D[Update movies state]
    D --> E[MoviesGrid UI Render]
    B -->|sort toggle| D
```

### Flow Explanation

1. **User Interaction:**

   * User types in the search input or toggles the sort checkbox.
   * `handlerSearchChange` or `handlerSort` is triggered.

2. **Custom Hook (`useSearchMovies`)**

   * Updates local `search`, `movies`, or `sort` state.
   * Debouncing ensures rapid input does not trigger excessive API calls.
   * Sorting is memoized for performance.

3. **API Call (`searchMovies`)**

   * Triggered when `search` state changes.
   * Fetches movie data from external API.
   * Returns movies array or empty array.

4. **State Update**

   * Hook updates `movies` state.

5. **UI Render (`MoviesGrid`)**

   * Receives `movies` array via props.
   * Re-renders the list of movie cards based on updated state.

---

## 🛠 State Management (`useSearchMovies`)

| State Variable | Type         | Purpose                                  |
| -------------- | ------------ | ---------------------------------------- |
| movies         | array | null | Stores fetched movie data from API       |
| search         | string       | Current search query, triggers API calls |
| sort           | boolean      | Toggle flag for alphabetical sorting     |

### Event Handlers

* `handleSubmit` → Processes manual form submission
* `handlerSort` → Toggles sorting (wrapped with `useCallback`)
* `handlerSearchChange` → Handles input changes with debounced search
* `changeSearch` → Debounced function (300ms) updates `search` state

### Debouncing Implementation

* Uses `just-debounce-it` library
* `changeSearch` memoized with `useMemo` for stability
* 300ms delay
* Cleanup effect cancels pending debounced calls on unmount
* Empty input clears results immediately

### Sorting Mechanism

* Alphabetical sorting with `useMemo` for performance
* Shallow copy of movies array before sorting
* `localeCompare` used for accurate string comparison
* Depends on `sort` and `movies` state
* `handlerSort` wrapped with `useCallback` to prevent unnecessary re-renders

---

## 🌐 API Integration

The service layer handles external API communication.

### searchMovies Service

* **Purpose:** Fetch movies based on search query
* **Pattern:** Called inside a `useEffect` triggered when `search` changes
* **Guard Clause:** Returns early if search is empty
* **Response:** Returns array of movies or empty array if nothing found
* **Error Handling:** Should be implemented in service layer

**API Flow:**

```
User types → handlerSearchChange → changeSearch (debounced)
  ↓
search state updates → useEffect calls searchMovies API
  ↓
movies state updated → MoviesGrid re-renders
```

---

## 🔹 User Interface Components

### Searcher Component

| Element              | Type                   | Handler             | Purpose                        |
| -------------------- | ---------------------- | ------------------- | ------------------------------ |
| Text input (#search) | input[type="text"]     | handlerSearchChange | Real-time search with debounce |
| Checkbox (#sort)     | input[type="checkbox"] | handlerSort         | Toggle alphabetical sorting    |
| Submit button        | button[type="submit"]  | handleSubmit        | Manual search trigger          |

* Purely presentational
* Receives all behavior as props
* Form submit handled in component, inputs handle respective changes

### MoviesGrid Component

* Displays movie results
* Receives `movies` array as prop
* Stateless, purely presentational

---

## 🎨 Styling Architecture

* Dark theme inspired by Netflix
* **Colors:**

  * Background: #121212
  * Accent: #e50914
  * Border: #2a2a2a
* CSS Highlights:

  * Pill-shaped search input (50px radius)
  * Animated custom checkbox
  * Flexbox layout with responsive wrapping
  * Focus state with red glow shadow effect

---

## 🧰 Technology Stack

| Category   | Technology               | Version | Purpose                   |
| ---------- | ------------------------ | ------- | ------------------------- |
| Framework  | React                    | 19.2.0  | UI library                |
| Build Tool | Vite                     | 7.2.4   | Dev server & bundler      |
| Compiler   | @vitejs/plugin-react-swc | 4.2.2   | Fast JSX compilation      |
| Utilities  | just-debounce-it         | 3.2.0   | Debouncing implementation |
| Linting    | ESLint                   | 9.39.1  | Code quality              |

* Uses ES modules (`type: module`) and SWC for fast compilation

---

## 🚀 Development Scripts

| Command         | Purpose                          |
| --------------- | -------------------------------- |
| npm run dev     | Start Vite dev server with HMR   |
| npm run build   | Production build                 |
| npm run lint    | Run ESLint checks                |
| npm run preview | Preview production build locally |

* Entry point: `index.html` → loads `src/main.jsx` → renders `App` to `div#root`

---

## ⚡ Performance Optimizations

* `useCallback` wraps all event handlers to maintain referential equality
* `useMemo` caches debounced search function and sorted movies array
* Debouncing delays API calls by 300ms to batch rapid input
* Cleanup effects cancel pending debounced calls on unmount
* Prevents unnecessary re-renders in `Searcher` component

---

## 🖥 Application Entry Point

* `index.html` loads `main.jsx`
* `App.jsx` initializes `useSearchMovies` hook and renders UI
* Page title: "04-search-movie" with default Vite favicon

---

## 📂 File Structure (Key Directories)

```
src/
 ├─ components/  # Presentational components (Searcher, MoviesGrid)
 ├─ hooks/       # useSearchMovies custom hook
 ├─ services/    # API service layer (searchMovies)
 ├─ main.jsx     # App entry
 └─ styles/      # CSS for components
```
