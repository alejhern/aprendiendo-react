import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TableCell } from "../components/TableCell";

// Mock del hook useUsers
const removeUserMock = vi.fn();

vi.mock("../hooks/useUsers", () => ({
	useUsers: () => ({
		removeUser: removeUserMock,
	}),
}));

describe("ActionCell", () => {
	beforeEach(() => {
		removeUserMock.mockClear();
	});

	it("calls removeUser when Delete button is clicked", () => {
		const userId = 42;
		render(<TableCell typeCell="action" value={userId} />);

		// Encontrar el botón Delete
		const deleteButton = screen.getByRole("button", { name: /delete/i });

		// Click en el botón
		fireEvent.click(deleteButton);

		// Verificar que se llamó removeUser con el id correcto
		expect(removeUserMock).toHaveBeenCalledTimes(1);
		expect(removeUserMock).toHaveBeenCalledWith(userId);
	});
});
