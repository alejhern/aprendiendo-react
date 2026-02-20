import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUsers } from "../hooks/useUsers";
import { getUsersFromDB, syncDB } from "../services/syncDB";
import { renderWithQueryClient } from "./utils";

vi.mock("../services/syncDB");

describe("useUsers hook (React Query)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	// ─────────────────────────────────────────────
	// FETCH USERS
	// ─────────────────────────────────────────────
	describe("fetch users", () => {
		it("should fetch and render users from DB", async () => {
			(getUsersFromDB as vi.Mock).mockResolvedValueOnce([
				{ id: 1, name: "John", email: "", github: "", image: "" },
			]);

			function TestComponent() {
				const { users, isLoading } = useUsers();

				if (isLoading) return <span>loading</span>;

				return <span>{users?.[0]?.name}</span>;
			}

			renderWithQueryClient(<TestComponent />);

			expect(screen.getByText(/loading/i)).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByText("John")).toBeInTheDocument();
			});
		});
	});

	// ─────────────────────────────────────────────
	// ADD USER
	// ─────────────────────────────────────────────
	describe("addUser mutation", () => {
		it("should optimistically add a user and call syncDB", async () => {
			(getUsersFromDB as vi.Mock).mockResolvedValueOnce([]);

			function TestComponent() {
				const { users, addUser } = useUsers();

				return (
					<>
						<button
							type="button"
							onClick={() =>
								addUser({
									name: "Alice",
									email: "alice@test.com",
									github: "alicehub",
									image: "",
								})
							}
						>
							Add
						</button>

						{users?.map((u) => (
							<span key={u.id}>{u.name}</span>
						))}
					</>
				);
			}

			renderWithQueryClient(<TestComponent />);

			fireEvent.click(screen.getByText("Add"));

			await waitFor(() => {
				expect(screen.getByText("Alice")).toBeInTheDocument();
			});

			expect(syncDB).toHaveBeenCalledWith(
				"users/create",
				expect.objectContaining({
					name: "Alice",
					email: "alice@test.com",
					id: 1,
				}),
			);
		});
	});

	// ─────────────────────────────────────────────
	// EDIT USER
	// ─────────────────────────────────────────────
	describe("editUser mutation", () => {
		it("should optimistically update user data", async () => {
			(getUsersFromDB as vi.Mock).mockResolvedValueOnce([
				{ id: 1, name: "John", email: "", github: "", image: "" },
			]);

			function TestComponent() {
				const { users, editUser } = useUsers();

				return (
					<>
						<button
							type="button"
							onClick={() =>
								editUser({
									id: 1,
									name: "John Updated",
									email: "",
									github: "",
									image: "",
								})
							}
						>
							Edit
						</button>

						<span>{users?.[0]?.name}</span>
					</>
				);
			}

			renderWithQueryClient(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByText("John")).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText("Edit"));

			await waitFor(() => {
				expect(screen.getByText("John Updated")).toBeInTheDocument();
			});
		});
	});

	// ─────────────────────────────────────────────
	// REMOVE USER
	// ─────────────────────────────────────────────
	describe("removeUser mutation", () => {
		it("should optimistically remove user and call syncDB", async () => {
			(getUsersFromDB as vi.Mock).mockResolvedValueOnce([
				{ id: 1, name: "John", email: "", github: "", image: "" },
			]);

			function TestComponent() {
				const { users, removeUser } = useUsers();

				return (
					<>
						<button type="button" onClick={() => removeUser(1)}>
							Delete
						</button>

						{users?.map((u) => (
							<span key={u.id}>{u.name}</span>
						))}
					</>
				);
			}

			renderWithQueryClient(<TestComponent />);

			await waitFor(() => {
				expect(screen.getByText("John")).toBeInTheDocument();
			});

			fireEvent.click(screen.getByText("Delete"));

			await waitFor(() => {
				expect(screen.queryByText("John")).not.toBeInTheDocument();
			});
		});
	});
});
