import type { Middleware, PayloadAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { syncDB } from "../services/syncDB";
import usersReducer from "./slices/users";

const persistantMiddleware: Middleware = (store) => (next) => (action) => {
	const { type } = action as PayloadAction;
	next(action);
	if (type.startsWith("users/")) {
		localStorage.setItem("users", JSON.stringify(store.getState().users));
	}
};

const syncWithDatabaseMiddleware: Middleware =
	(store) => (next) => (action) => {
		const { type, payload } = action as PayloadAction;
		// Aquí iría la lógica para sincronizar con una base de datos remota
		next(action);
		if (type.startsWith("users/")) {
			// Simulación de sincronización
			syncDB(type, payload);
		}
	};

export const store = configureStore({
	reducer: {
		users: usersReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			syncWithDatabaseMiddleware,
			persistantMiddleware,
		),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
