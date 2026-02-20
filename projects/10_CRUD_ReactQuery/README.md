# 🗂 CRUD React Query Application

## 📌 Purpose and Scope

The **CRUD React Query Application** is a production-ready React app focused on **server-state management** using **TanStack React Query**.

It demonstrates modern patterns for data fetching, caching, synchronization, and UI reactivity without relying on global state managers like Redux.

---

## ✨ Features

* ⚡ Server-state management with **TanStack React Query**
* 🔄 Automatic caching, background refetching, and retries
* 🧠 Custom hooks for queries and mutations
* ✏️ Full CRUD operations (create, read, update, delete)
* 💾 Mock backend using **json-server**
* 🎨 Professional UI with **Material-UI**
* 🧱 Fully typed with **TypeScript**
* 🧹 Linting & formatting powered by **Rome**

---

## 🏗 Application Architecture

| Layer        | Responsibility              | Key Elements                     |
| ------------ | --------------------------- | -------------------------------- |
| UI           | Rendering and interaction   | `App`, `ModalUser`, `UsersTable` |
| Server State | Fetching and mutations      | React Query hooks                |
| Data Access  | API abstraction             | `getUsersFromDB`, `syncDB`       |
| Persistence  | Backend storage             | json-server                      |
| Tooling      | Linting, formatting, typing | Rome, TypeScript                 |

---

## 🚀 Entry Point

```ts
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</StrictMode>
);
```

* `QueryClientProvider` enables React Query globally
* `QueryClient` manages cache, retries, and refetching
* `StrictMode` helps detect side effects in development

---

## 🧠 Server State with React Query

### Fetching users

```ts
useQuery({
	queryKey: ["users"],
	queryFn: getUsersFromDB,
	staleTime: 1000 * 60,
	refetchOnWindowFocus: true,
	refetchOnReconnect: true,
});
```

* Data is cached for 1 minute
* Automatically refetched on focus or reconnect
* No polling unless explicitly configured

---

## ✏️ Mutations Strategy

CRUD operations are implemented using `useMutation`.

Each mutation:

* Syncs data with the backend
* Updates the React Query cache manually
* Avoids unnecessary invalidations when using a mock backend

Example:

```ts
const addUser = useMutation({
		mutationFn: async (newUser: User) => {
			const maxId =
				users?.reduce((max, user) => (user.id > max ? user.id : max), 0) ?? 0;
			const userWithId: UserWithId = { ...newUser, id: maxId + 1 };
			syncDB("users/create", userWithId);
			return userWithId;
		},
		// 1º opción: Mutacion Optimista
		onMutate: async (newUser) => {
			await queryClient.cancelQueries({ queryKey: ["users"] });
			const previousUsers = queryClient.getQueryData<UserWithId[]>(["users"]);
			const maxId =
				users?.reduce((max, user) => (user.id > max ? user.id : max), 0) ?? 0;
			const userWithId: UserWithId = { ...newUser, id: maxId + 1 };
			queryClient.setQueryData<UserWithId[]>(
				["users"],
				(old: UserWithId[] = []) => [...old, userWithId],
			);
			return { previousUsers };
		},
		onError: (err, newUser, context) => {
			console.error("Error al crear el usuario:", err);
			if (context?.previousUsers) {
				queryClient.setQueryData(["users"], context?.previousUsers);
			}
		},
		onSuccess: async (user) => {
			// 2º opción: actualizar el cache manualmente
			//queryClient.setQueryData<UserWithId[]>(["users"], (old = []) => [
			//	...old,
			//	user,
			//]);
			// 3º opción: invalidar la query para que se vuelva a ejecutar y obtener los datos actualizados
			//await queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
```

This ensures instant UI updates and no flickering.

---

## 🔗 Custom Hooks

| Hook           | Responsibility                        |
| -------------- | ------------------------------------- |
| `useUsers`     | Fetch users and expose CRUD mutations |
| `useModalUser` | Modal state and form handling         |

UI state and server state are intentionally kept separate.

---

## 💾 Backend (Mock Server)

### Start json-server

```bash
npx json-server --watch db.json --port 3001
```

### `db.json`

```json
{
	"users": []
}
```

### Endpoints

| Method | Endpoint   | Description |
| ------ | ---------- | ----------- |
| GET    | /users     | Fetch users |
| POST   | /users     | Create user |
| PUT    | /users/:id | Update user |
| DELETE | /users/:id | Delete user |

---

## 🎨 UI & Styling

* **Material-UI** (`DataGrid`, Buttons, Icons, Modal)
* **Bootstrap** for layout utilities
* Custom CSS for spacing and layout

The UI is fully driven by React Query state (`data`, `isLoading`, `isError`).

---

## ⚙ Rome & TypeScript

Rome replaces ESLint and Prettier with a single tool.

```jsonc
{
  "root": true,
  "formatter": {},
  "linter": { "enabled": true },
  "compilerOptions": {
    "tsconfig": "./tsconfig.app.json"
  }
}
```

It enforces:

* Code style
* Type safety
* React Hooks rules

---

Totalmente válido 😌 — y de hecho **tiene mucho sentido** que te haya gustado más Redux.
Voy a dejarte una **comparativa honesta y profesional**, no evangelista, como para **README / portfolio**, y además te explico *por qué* a cierto perfil (el tuyo) Redux suele “encajar mejor”.

---

# ⚖️ Redux Toolkit vs React Query

This section compares **Redux Toolkit** and **TanStack React Query** in the context of CRUD applications.

Both are excellent tools, but they solve **different problems**.

---

## 🧠 Conceptual Difference

| Aspect         | Redux Toolkit                     | React Query           |
| -------------- | --------------------------------- | --------------------- |
| Core focus     | **Client state** & business logic | **Server state**      |
| Mental model   | Events → reducers → new state     | Fetch → cache → sync  |
| Data ownership | App owns the data                 | Server owns the data  |
| Determinism    | Fully deterministic               | Eventually consistent |
| Debuggability  | Excellent (DevTools)              | Good (DevTools)       |

---

## 🔄 CRUD Workflow Comparison

### Redux Toolkit

```txt
UI → dispatch(action)
   → reducer updates state
   → middleware syncs DB
   → UI re-renders
```

✔ Predictable
✔ Single source of truth
✔ Full control of transitions

---

### React Query

```txt
UI → mutate()
   → optimistic cache update
   → backend request
   → background reconciliation
```

✔ Less boilerplate
✔ Automatic retries & refetch
✔ Cache-driven UI

---

## 📦 State Ownership

### Redux Toolkit

* State lives **inside the application**
* Backend is a persistence layer
* Ideal for:

  * Complex forms
  * Wizards
  * Multi-step workflows
  * Cross-feature coordination

### React Query

* State lives **in the server**
* App mirrors server state
* Ideal for:

  * Dashboards
  * Lists
  * Read-heavy views
  * Stateless CRUD UIs

---

## 🧪 Testing & Debugging

| Area            | Redux Toolkit        | React Query          |
| --------------- | -------------------- | -------------------- |
| Unit testing    | Reducers are trivial | Hooks need providers |
| Time travel     | ✔ Yes                | ❌ No                 |
| Reproducibility | ✔ Deterministic      | ⚠ Depends on cache   |
| Error tracing   | Explicit             | Implicit             |

👉 Redux **wins** for traceability and business logic.

---

## 🧰 Tooling & Ecosystem

| Feature        | Redux Toolkit       | React Query |
| -------------- | ------------------- | ----------- |
| DevTools       | ⭐⭐⭐⭐⭐               | ⭐⭐⭐⭐        |
| Middleware     | Powerful & explicit | Limited     |
| Side effects   | Centralized         | Distributed |
| Learning curve | Medium              | Low–Medium  |

---

## 🧠 Why Redux Often “Feels Better”

Redux shines when:

* You want **full control**
* You think in **state transitions**
* You value **predictability over magic**
* You like seeing **every change explicitly**
* You care about **debugging and audits**

> React Query optimizes DX.
> Redux optimizes **mental clarity**.

---

## ⚠️ Where React Query Can Feel Weird

* Cache invalidation feels implicit
* UI can “flicker” if backend lags
* Optimistic updates require care
* Stale vs fresh is not intuitive at first
* Not ideal for complex local workflows

---

## 🏆 When to Choose Each

### Choose **Redux Toolkit** when:

* Business logic is complex
* State is mostly client-owned
* You need deterministic flows
* You want middleware orchestration
* The app behaves more like a **system**

### Choose **React Query** when:

* State is server-owned
* CRUD is straightforward
* You want minimal boilerplate
* Data freshness matters
* The app behaves more like a **viewer**

---

## 🧠 The Best Real-World Approach

Many production apps use **both**:

```txt
Redux → UI state, forms, workflows
React Query → server data, lists, caching
```

They are **complementary**, not competitors.

---

## 🎯 Portfolio-friendly Conclusion

> This project was implemented using both Redux Toolkit and React Query to understand their trade-offs.
>
> Redux provided stronger predictability and clearer state transitions, while React Query reduced boilerplate and simplified server synchronization.
>
> The final choice depends on application complexity, data ownership, and debugging requirements.

---

Si quieres, puedo:

* adaptar esta sección a **tono más técnico o más recruiter**
* dejar una **conclusión personal firmada** (queda muy bien en GitHub)
* o ayudarte a **defender Redux en una entrevista** sin quedar “old school” 😉

Dime cómo lo quieres 👌

---

## 📦 Dependencies

### Development

* vite
* @vitejs/plugin-react(-swc)
* typescript
* rome
* json-server

### Production

* react
* react-dom
* @tanstack/react-query
* @mui/material
* @mui/x-data-grid
* bootstrap

---

## ✅ Summary

This project demonstrates:

* Modern server-state management with React Query
* Clean separation between UI and data logic
* Predictable CRUD behavior
* Simplified tooling with Rome
* A realistic alternative to Redux for server-driven applications

---

Si quieres, el siguiente paso natural sería:

* una **conclusión personal** defendiendo por qué prefieres Redux (queda 🔥 en entrevistas)
* o una **versión corta del README** para que el repo se vea más limpio

Tú me dices 👌
