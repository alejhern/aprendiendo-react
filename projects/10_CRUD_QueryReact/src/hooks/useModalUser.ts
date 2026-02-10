import { useCallback, useState } from "react";
import type { User } from "../types";
import { useUsers } from "./useUsers";

export function useModalUser(userId?: number) {
	const [show, setShow] = useState(false);
	const { users, addUser, editUser } = useUsers();

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handlerSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>, formData: User) => {
			e.preventDefault();
			if (userId === undefined) {
				addUser(formData);
			} else {
				editUser({ ...formData, id: userId });
			}

			setShow(false);
		},
		[userId, addUser, editUser],
	);

	return { show, handleClose, handleShow, handlerSubmit, users };
}
