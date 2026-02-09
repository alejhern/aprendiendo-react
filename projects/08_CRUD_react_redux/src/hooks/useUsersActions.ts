import { create, remove, update } from "../store/slices/users";
import type { UserWithId } from "../types";
import { useAppDispatch } from "./useStore";

export function useUsersActions() {
	const dispatch = useAppDispatch();

	const addUser = (user: UserWithId) => {
		dispatch(create(user));
	};
	const editUser = (user: UserWithId) => {
		dispatch(update(user));
	};
	const removeUser = (id: string) => {
		dispatch(remove(id));
	};
	return {
		addUser,
		editUser,
		removeUser,
	};
}
