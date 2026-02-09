import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ModalUser } from "../components/ModalUser";
import { TableCell } from "../components/TableCell";
import { mockUsers, renderWithRedux } from "./utils";

describe("ModalUser – create modal behavior", () => {
	it("opens modal in CREATE mode with empty form", () => {
		renderWithRedux(<ModalUser />);

		fireEvent.click(screen.getByRole("button", { name: /add user/i }));

		expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue("");

		expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("");

		expect(screen.getByRole("textbox", { name: /github/i })).toHaveValue("");

		expect(screen.getByRole("textbox", { name: /image/i })).toHaveValue("");
	});

	it("should create a new user and save it in the Redux store", async () => {
		// Renderizamos el componente con redux y obtenemos el store real
		const { store } = renderWithRedux(<ModalUser userId={undefined} />);

		// Abrimos el modal haciendo click en el botón "Add User"
		fireEvent.click(screen.getByRole("button", { name: /add user/i }));

		// Esperamos que el modal esté visible
		const modal = await screen.findByRole("dialog");

		// Rellenamos los inputs dentro del modal
		fireEvent.change(within(modal).getByPlaceholderText(/enter name/i), {
			target: { value: "Alice" },
		});
		fireEvent.change(within(modal).getByPlaceholderText(/enter email/i), {
			target: { value: "alice@test.com" },
		});
		fireEvent.change(
			within(modal).getByPlaceholderText(/enter github username/i),
			{ target: { value: "alicehub" } },
		);
		fireEvent.change(within(modal).getByPlaceholderText(/enter image url/i), {
			target: { value: "https://avatar.com/alice.png" },
		});

		// Hacemos click en el botón de submit "Add User"
		const submitButton = within(modal).getByRole("button", {
			name: /add user/i,
		});
		fireEvent.click(submitButton);

		// Esperamos que el usuario se agregue al store
		await waitFor(() => {
			const state = store.getState().users;
			const newUser = state.find((u) => u.email === "alice@test.com");

			expect(newUser).toBeDefined();
			expect(newUser?.name).toBe("Alice");
			expect(newUser?.github).toBe("alicehub");
			expect(newUser?.image).toBe("https://avatar.com/alice.png");
		});
	});
});

describe("ModalUser – edit user behavior", () => {
	it("opens modal in EDIT mode with user data prefilled", async () => {
		renderWithRedux(<ModalUser userId="1" />, {
			preloadedState: {
				users: mockUsers,
			},
		});

		fireEvent.click(screen.getByRole("button", { name: /edit user/i }));

		expect(await screen.findByLabelText(/name/i)).toHaveValue("Jane");
		expect(screen.getByLabelText(/email/i)).toHaveValue("jane@test.com");
		expect(screen.getByLabelText(/github/i)).toHaveValue("janedoe");
		expect(screen.getByLabelText(/image/i)).toHaveValue(
			"https://avatar.com/jane.png",
		);
	});

	it("should edit an existing user and update it in the Redux store", async () => {
		const { store } = renderWithRedux(<ModalUser userId="1" />, {
			preloadedState: { users: mockUsers },
		});

		// Abrimos el modal
		fireEvent.click(screen.getByRole("button", { name: /edit user/i }));

		// Esperamos que aparezca el modal
		const modal = await screen.findByRole("dialog");

		// Cambiamos los inputs
		fireEvent.change(within(modal).getByLabelText(/name/i), {
			target: { value: "Jane Updated" },
		});
		fireEvent.change(within(modal).getByLabelText(/email/i), {
			target: { value: "jane.updated@test.com" },
		});
		fireEvent.change(within(modal).getByLabelText(/github/i), {
			target: { value: "janedoeupdated" },
		});
		fireEvent.change(within(modal).getByLabelText(/image/i), {
			target: { value: "https://avatar.com/jane-updated.png" },
		});

		// Hacemos submit
		const submitButton = within(modal).getByRole("button", {
			name: /save changes/i,
		});
		fireEvent.click(submitButton);

		// Comprobamos el estado de Redux
		await waitFor(() => {
			const state = store.getState().users;
			const updatedUser = state.find((u) => u.id === "1");

			expect(updatedUser).toBeDefined();
			expect(updatedUser?.name).toBe("Jane Updated");
			expect(updatedUser?.email).toBe("jane.updated@test.com");
			expect(updatedUser?.github).toBe("janedoeupdated");
			expect(updatedUser?.image).toBe("https://avatar.com/jane-updated.png");
		});
	});
});

describe("TableCell - Delete user", () => {
	it("should remove the user from the store", () => {
		const { store } = renderWithRedux(
			<TableCell typeCell="action" value="1" />,
			{ preloadedState: { users: mockUsers } },
		);

		// Aquí usamos la acción real en vez de mock
		const deleteButton = screen.getByText(/delete/i);
		fireEvent.click(deleteButton);

		// Confirmamos que el usuario fue eliminado del store
		const state = store.getState().users;
		expect(state.find((u) => u.id === "1")).toBeUndefined();
	});
});
