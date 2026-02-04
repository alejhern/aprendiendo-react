import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getUsersFromDB } from "../../services/syncDB";
import type { User, UserWithId } from "../../types";

const initialState: Promise<UserWithId[]> = (async () => {
	const usersFromDB = await getUsersFromDB();
	if (usersFromDB && Array.isArray(usersFromDB) && usersFromDB.length > 0) {
		return usersFromDB as UserWithId[];
	}
	const storedUsers = localStorage.getItem("users");
	if (storedUsers) {
		return JSON.parse(storedUsers) as UserWithId[];
	}
	return [];
})();

export const usersSlice = createSlice({
	name: "users",
	initialState: await initialState,
	reducers: {
		create(state, action: PayloadAction<User>) {
			const maxId = state.reduce(
				(max, user) => (user.id > max ? user.id : max),
				0,
			);
			const newUser: UserWithId = {
				...action.payload,
				id: maxId + 1,
			};
			state.push(newUser);
		},
		update(state, action: PayloadAction<UserWithId>) {
			const index = state.findIndex((user) => user.id === action.payload.id);
			if (index !== -1) {
				state[index] = action.payload;
			}
		},
		remove(state, action: PayloadAction<number>) {
			return state.filter((user) => user.id !== action.payload);
		},
	},
});

export default usersSlice.reducer;

export const { create, update, remove } = usersSlice.actions;
