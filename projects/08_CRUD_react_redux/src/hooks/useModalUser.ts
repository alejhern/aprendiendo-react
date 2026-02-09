import { useState } from "react";
import { useUsersActions } from "../hooks/useUsersActions";
import type { UserWithId } from "../types";

export function useModalUser(userId?: string) {
	const [show, setShow] = useState(false);
	const { addUser, editUser } = useUsersActions();

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handlerSubmit = (
		e: React.FormEvent<HTMLFormElement>,
		formData: UserWithId,
	) => {
		e.preventDefault();
		if (userId === undefined) {
			addUser(formData);
		} else {
			editUser(formData);
		}

		setShow(false);
	};

	return { show, handleClose, handleShow, handlerSubmit };
}
