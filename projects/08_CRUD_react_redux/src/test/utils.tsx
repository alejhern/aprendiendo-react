import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import usersReducer from "../store/slices/users";
import type { UserWithId } from "../types";

export function renderWithRedux(
	ui: React.ReactElement,
	{
		preloadedState = {},
		store = configureStore({
			reducer: {
				users: usersReducer,
			},
			preloadedState,
		}),
	} = {},
) {
	return {
		store,
		...render(<Provider store={store}>{ui}</Provider>),
	};
}

export const mockUsers: UserWithId[] = [
	{
		id: "1",
		name: "Jane",
		email: "jane@test.com",
		github: "janedoe",
		image: "https://avatar.com/jane.png",
	},
	{
		id: "2",
		name: "John",
		email: "john@test.com",
		github: "johndoe",
		image: "https://avatar.com/john.png",
	},
];
