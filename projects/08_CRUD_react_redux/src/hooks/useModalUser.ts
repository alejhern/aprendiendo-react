import { useState } from "react";
import { useAppSelector } from "../hooks/useStore";
import { useUsersActions } from "../hooks/useUsersActions";
import type { User } from "../types";

export function useModalUser(userId?: number) {
	const [show, setShow] = useState(false);
	const { addUser, editUser } = useUsersActions();
	const users = useAppSelector((state) => state.users);
	const user: User =
		userId === undefined
			? {
					name: "",
					email: "",
					github: "",
					image: "",
			  }
			: users.find((user) => user.id === userId) ?? {
					name: "",
					email: "",
					github: "",
					image: "",
			  };

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const newUser: User = {
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			github: formData.get("github") as string,
			image: formData.get("image") as string,
		};

		if (userId === undefined) {
			addUser(newUser);
		} else {
			editUser({ ...newUser, id: userId });
		}

		setShow(false);
	};

	return { show, handleClose, handleShow, handlerSubmit, user };
}
