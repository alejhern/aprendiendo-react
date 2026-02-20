import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import SaveAltRoundedIcon from "@mui/icons-material/SaveAltRounded";
import { Button as MuiButton } from "@mui/material";
import { useEffect, useId, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useModalUser } from "../hooks/useModalUser";
import type { User } from "../types";

export function ModalUser({ userId }: { userId?: number }) {
	const { show, handleClose, handleShow, handlerSubmit, users } =
		useModalUser(userId);
	const nameId = useId();
	const emailId = useId();
	const githubId = useId();
	const imageId = useId();

	const [formData, setFormData] = useState<User>({
		name: "",
		email: "",
		github: "",
		image: "",
	});

	useEffect(() => {
		if (!show && userId === undefined) {
			setFormData({
				name: "",
				email: "",
				github: "",
				image: "",
			});
		}
	}, [show, userId]);

	useEffect(() => {
		if (!show || userId === undefined) return;

		const user = users?.find((user) => user.id === userId);
		if (!user) return;

		setFormData({
			name: user.name,
			email: user.email,
			github: user.github,
			image: user.image,
		});
	}, [show, userId, users]);

	const iconOppenModal =
		userId === undefined ? (
			<PersonAddAlt1RoundedIcon />
		) : (
			<BorderColorRoundedIcon />
		);
	return (
		<>
			<MuiButton
				variant="contained"
				type="button"
				onClick={handleShow}
				endIcon={iconOppenModal}
			>
				{userId === undefined ? "Add User" : "Edit User"}
			</MuiButton>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Form onSubmit={(e) => handlerSubmit(e, formData)}>
					<Modal.Header closeButton>
						<Modal.Title>
							{userId === undefined ? "Add User" : "Edit User"}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group className="mb-3" controlId={nameId}>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								name="name"
								placeholder="Enter name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId={emailId}>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								name="email"
								placeholder="Enter email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId={githubId}>
							<Form.Label>GitHub</Form.Label>
							<Form.Control
								name="github"
								type="text"
								placeholder="Enter GitHub username"
								value={formData.github}
								onChange={(e) =>
									setFormData({ ...formData, github: e.target.value })
								}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId={imageId}>
							<Form.Label>Image URL</Form.Label>
							<Form.Control
								name="image"
								type="text"
								placeholder="Enter image URL"
								value={formData.image}
								onChange={(e) =>
									setFormData({ ...formData, image: e.target.value })
								}
							/>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<MuiButton
							color="inherit"
							variant="contained"
							onClick={handleClose}
							endIcon={<CloseRoundedIcon />}
						>
							Close
						</MuiButton>
						<MuiButton
							variant="contained"
							type="submit"
							color="success"
							endIcon={<SaveAltRoundedIcon />}
						>
							{userId === undefined ? "Add User" : "Save Changes"}
						</MuiButton>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}
