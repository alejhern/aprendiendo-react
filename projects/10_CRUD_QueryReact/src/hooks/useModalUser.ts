import { useCallback, useState } from "react";
import type { User, UserWithId } from "../types";
import { useUsers } from "./useUsers";

export function useModalUser(userId?: number) {
	const [show, setShow] = useState(false);
	const { users, addUser, editUser } = useUsers();
	const user: User =
		userId === undefined
			? {
					name: "",
					email: "",
					github: "",
					image: "",
			  }
			: users?.find((user: UserWithId) => user.id === userId) ?? {
					name: "",
					email: "",
					github: "",
					image: "",
			  };

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handlerSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
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
		},
		[userId, addUser, editUser],
	);

	return { show, handleClose, handleShow, handlerSubmit, user };
}
