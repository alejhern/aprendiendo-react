# 🟨 JavaScript Quiz Application

A **JavaScript Quiz application** built with **React** and **Zustand**, focused on simplicity, performance, and clean state management. The app allows users to answer randomized quiz questions, navigate between them, and persist progress using local storage.

This project is designed as a **learning and portfolio project**, showcasing modern React patterns and lightweight global state management with JavaScript-focused quiz content.

---

## 🚀 Features

* Randomized quiz questions
* Answer selection with correctness tracking
* Navigation between questions (next / previous)
* Persistent state using `zustand/persist`
* Clean and minimal global state logic
* Fully typed with TypeScript

---

## 🛠 Tech Stack

* **React**
* **TypeScript**
* **Zustand** (state management)
* **Vite** (development & build tool)

---

## 🧠 State Management with Zustand

The application uses **Zustand** for global state management. All quiz-related logic is centralized in a single store:

* Questions list
* Current question index
* Answer selection and validation
* Quiz reset
* Persistent storage

Zustand provides a minimal and intuitive API, allowing direct and readable state updates without unnecessary boilerplate.

---

## 🔄 Zustand vs React Redux

| Feature        | Zustand                                | React Redux              |
| -------------- | -------------------------------------- | ------------------------ |
| Boilerplate    | Very low                               | High (even with Toolkit) |
| Learning curve | Low                                    | Medium–High              |
| Async handling | Built-in                               | Requires middleware      |
| State updates  | Direct and simple                      | Reducers & actions       |
| Performance    | Excellent (fine-grained subscriptions) | Excellent                |
| DevTools       | Basic                                  | Advanced                 |
| Ecosystem      | Small–Medium                           | Very large               |
| Best for       | Small–medium apps                      | Large / enterprise apps  |

---

### 📌 Why Zustand for this project?

Zustand was chosen because it:

* Keeps the codebase small and readable
* Avoids unnecessary abstractions
* Handles async logic naturally
* Provides persistence with minimal setup
* Fits perfectly with the scope of a quiz application

For larger or enterprise-level applications, **Redux Toolkit** would be a solid alternative.

---

## 📂 Project Structure

```txt
public/
└── data.json          # Quiz questions
src/
├── components/        # UI components
├── store/             # Zustand stores
│   └── useQuestionsStore.ts
├── types.d.ts         # TypeScript types
├── App.tsx
└── main.tsx
```

---

## ▶️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📦 Persistence

The quiz state is persisted using `zustand/middleware`, allowing users to refresh the page without losing progress.

```ts
persist({ name: "questions-storage" })
```

---

## 📈 Possible Improvements

* Add scoring summary
* Timer per question
* Category selection
* Difficulty levels
* Dark mode support

---

## 📄 License

This project is for educational purposes and personal learning.
