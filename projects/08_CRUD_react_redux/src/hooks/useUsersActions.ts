import { create, remove, update } from "../store/slices/users";
import type { User, UserWithId } from "../types";
import { useAppDispatch } from "./useStore";

export function useUsersActions() {
	const dispatch = useAppDispatch();

	const addUser = (user: User) => {
		dispatch(create(user));
	};
	const editUser = (user: UserWithId) => {
		dispatch(update(user));
	};
	const removeUser = (id: number) => {
		dispatch(remove(id));
	};
	return {
		addUser,
		editUser,
		removeUser,
	};
}
