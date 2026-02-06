import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import SaveAltRoundedIcon from "@mui/icons-material/SaveAltRounded";
import { Button as MuiButton } from "@mui/material";
import { useId } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useModalUser } from "../hooks/useModalUser";

export function ModalUser({ userId }: { userId?: number }) {
	const { show, handleClose, handleShow, handlerSubmit, user } =
		useModalUser(userId);

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
				<Form onSubmit={handlerSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>
							{userId === undefined ? "Add User" : "Edit User"}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group className="mb-3" controlId={useId()}>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								name="name"
								placeholder="Enter name"
								defaultValue={user.name}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId={useId()}>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								name="email"
								placeholder="Enter email"
								defaultValue={user.email}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId={useId()}>
							<Form.Label>GitHub</Form.Label>
							<Form.Control
								name="github"
								type="text"
								placeholder="Enter GitHub username"
								defaultValue={user.github}
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId={useId()}>
							<Form.Label>Image URL</Form.Label>
							<Form.Control
								name="image"
								type="text"
								placeholder="Enter image URL"
								defaultValue={user.image}
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
