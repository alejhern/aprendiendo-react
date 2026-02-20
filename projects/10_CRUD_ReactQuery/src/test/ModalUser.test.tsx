import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { describe, it, vi } from "vitest";
import { ModalUser } from "../components/ModalUser";
import type { User } from "../types";

// Mock del hook useUsers
const mockedUsers: User[] = [
	{ id: 1, name: "John", email: "john@test.com", github: "johndoe", image: "" },
	{ id: 2, name: "Jane", email: "jane@test.com", github: "janedoe", image: "" },
];

const addUserMock = vi.fn();
const editUserMock = vi.fn();

vi.mock("../hooks/useUsers", () => ({
	useUsers: () => ({
		users: mockedUsers,
		addUser: addUserMock,
		editUser: editUserMock,
	}),
}));

describe("ModalUser", () => {
	beforeEach(() => {
		addUserMock.mockClear();
		editUserMock.mockClear();
	});

	it("opens modal in Add mode and submits form", async () => {
		render(<ModalUser />);

		// Abrir modal Add User
		fireEvent.click(screen.getByRole("button", { name: /add user/i }));

		const dialog = await screen.findByRole("dialog");

		expect(
			within(dialog).getByText("Add User", { selector: ".modal-title" }),
		).toBeInTheDocument();

		// Rellenar inputs
		fireEvent.change(within(dialog).getByLabelText(/name/i), {
			target: { value: "Alice" },
		});
		fireEvent.change(within(dialog).getByLabelText(/email/i), {
			target: { value: "alice@test.com" },
		});
		fireEvent.change(within(dialog).getByLabelText(/github/i), {
			target: { value: "alicehub" },
		});
		fireEvent.change(within(dialog).getByLabelText(/image url/i), {
			target: { value: "alice.png" },
		});

		// Enviar formulario
		fireEvent.click(within(dialog).getByRole("button", { name: /add user/i }));

		await waitFor(() => {
			expect(addUserMock).toHaveBeenCalledTimes(1);
			expect(addUserMock).toHaveBeenCalledWith({
				name: "Alice",
				email: "alice@test.com",
				github: "alicehub",
				image: "alice.png",
			});
		});
	});

	it("opens modal in Edit mode with user data", async () => {
		render(<ModalUser userId={1} />);

		// Abrir modal Edit User
		fireEvent.click(screen.getByRole("button", { name: /edit user/i }));

		const dialog = await screen.findByRole("dialog");

		expect(
			within(dialog).getByText("Edit User", { selector: ".modal-title" }),
		).toBeInTheDocument();

		await waitFor(() => {
			expect(within(dialog).getByLabelText(/name/i)).toHaveValue("John");
			expect(within(dialog).getByLabelText(/email/i)).toHaveValue(
				"john@test.com",
			);
			expect(within(dialog).getByLabelText(/github/i)).toHaveValue("johndoe");
			expect(within(dialog).getByLabelText(/image url/i)).toHaveValue("");
		});

		// Modificar datos y enviar
		fireEvent.change(within(dialog).getByLabelText(/name/i), {
			target: { value: "John Edited" },
		});
		fireEvent.click(
			within(dialog).getByRole("button", { name: /save changes/i }),
		);

		await waitFor(() => {
			expect(editUserMock).toHaveBeenCalledTimes(1);
			expect(editUserMock).toHaveBeenCalledWith({
				id: 1,
				name: "John Edited",
				email: "john@test.com",
				github: "johndoe",
				image: "",
			});
		});
	});
});
