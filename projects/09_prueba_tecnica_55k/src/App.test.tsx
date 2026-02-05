import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { Gender, Title, User } from "./types.d";

// Mock de usuarios
const mockUser1: User = {
	gender: Gender.Male,
	name: { title: Title.Mr, first: "John", last: "Doe" },
	location: {
		street: { number: 123, name: "Main St" },
		city: "New York",
		state: "NY",
		country: "USA",
		postcode: "10001",
		coordinates: { latitude: "40.7128", longitude: "-74.0060" },
		timezone: { offset: "-5:00", description: "Eastern Time (US & Canada)" },
	},
	email: "john@example.com",
	login: {
		uuid: "1",
		username: "john_doe",
		password: "",
		salt: "",
		md5: "",
		sha1: "",
		sha256: "",
	},
	dob: { date: new Date("1985-01-01"), age: 38 },
	registered: { date: new Date("2010-01-01"), age: 13 },
	phone: "123-456-7890",
	cell: "098-765-4321",
	id: { name: "SSN", value: "111-11-1111" },
	picture: { large: "", medium: "", thumbnail: "" },
	nat: "US",
};

const mockUser2: User = {
	gender: Gender.Female,
	name: { title: Title.Ms, first: "Jane", last: "Smith" },
	location: {
		street: { number: 456, name: "Rue de Paris" },
		city: "Paris",
		state: "Ile-de-France",
		country: "France",
		postcode: "75001",
		coordinates: { latitude: "48.8566", longitude: "2.3522" },
		timezone: { offset: "+1:00", description: "Central European Time" },
	},
	email: "jane@example.com",
	login: {
		uuid: "2",
		username: "jane_smith",
		password: "",
		salt: "",
		md5: "",
		sha1: "",
		sha256: "",
	},
	dob: { date: new Date("1990-05-05"), age: 33 },
	registered: { date: new Date("2015-05-05"), age: 8 },
	phone: "234-567-8901",
	cell: "987-654-3210",
	id: { name: "SSN", value: "222-22-2222" },
	picture: { large: "", medium: "", thumbnail: "" },
	nat: "FR",
};

// Mock de fetchUsers con páginas distintas
import * as fetchModule from "./services/fetchUser";
vi.spyOn(fetchModule, "fetchUsers").mockImplementation(async (page = 1) => {
	if (page === 1) return { users: [mockUser1], nextCursor: 2 };
	if (page === 2) return { users: [mockUser2], nextCursor: undefined };
	return { users: [], nextCursor: undefined };
});

// Helper para renderizar con QueryClient
const renderWithClient = (ui: React.ReactElement) => {
	const queryClient = new QueryClient();
	return render(
		<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
	);
};

describe("App", () => {
	it("renders table with users", async () => {
		renderWithClient(<App />);
		await waitFor(() => {
			expect(screen.getByText("John")).toBeInTheDocument();
		});
	});

	it("filters users by country", async () => {
		renderWithClient(<App />);
		const input = screen.getByPlaceholderText("Spain, France, Germany...");
		fireEvent.change(input, { target: { value: "USA" } });

		await waitFor(() => {
			expect(screen.getByText("John")).toBeInTheDocument();
			expect(screen.queryByText("Jane")).not.toBeInTheDocument();
		});
	});

	it("deletes a user", async () => {
		renderWithClient(<App />);
		await waitFor(() => screen.getByText("John"));

		const deleteButton = screen.getByText("Delete");
		fireEvent.click(deleteButton);

		await waitFor(() => {
			expect(screen.queryByText("John")).not.toBeInTheDocument();
		});
	});

	it("loads more users", async () => {
		renderWithClient(<App />);
		await waitFor(() => screen.getByText("John"));

		const loadMoreButton = screen.getByText("Load More");
		fireEvent.click(loadMoreButton);

		// Ahora sí, debería aparecer Jane
		await waitFor(() => {
			expect(screen.getByText("Jane")).toBeInTheDocument();
		});
	});
	it("sorts users by first name", async () => {
		renderWithClient(<App />);
		await waitFor(() => screen.getByText("John"));

		// Seleccionamos el <th> que contiene "First Name"
		const thFirstName = screen.getByText("First Name");
		fireEvent.click(thFirstName); // Simulamos click sobre el th

		// Hacemos load more para tener más de un usuario
		const loadMoreButton = screen.getByText("Load More");
		fireEvent.click(loadMoreButton);
		await waitFor(() => screen.getByText("Jane"));

		// Verificamos el orden de las filas (la primera fila es el header)
		const rows = screen.getAllByRole("row");

		// Segunda fila: debería ser Jane
		expect(rows[1]).toHaveTextContent("Jane");
		// Tercera fila: John
		expect(rows[2]).toHaveTextContent("John");
	});
	it("sorts users by country button", async () => {
		renderWithClient(<App />);
		await waitFor(() => screen.getByText("John"));

		const sortByCountryButton = screen.getByText(/Sort by country/i);
		fireEvent.click(sortByCountryButton); // Simulamos click sobre el botón

		// Hacemos load more para tener más de un usuario
		const loadMoreButton = screen.getByText("Load More");
		fireEvent.click(loadMoreButton);
		await waitFor(() => screen.getByText("Jane"));

		// Verificamos el orden de las filas (la primera fila es el header)
		const rows = screen.getAllByRole("row");

		// Segunda fila: debería ser Jane (France)
		expect(rows[1]).toHaveTextContent("Jane");
		// Tercera fila: John (USA)
		expect(rows[2]).toHaveTextContent("John");
	});
	it("toggles sorting off when clicking the same sort button twice", async () => {
		renderWithClient(<App />);
		await waitFor(() => screen.getByText("John"));

		const sortByCountryButton = screen.getByText(/Sort by country/i);
		fireEvent.click(sortByCountryButton); // Activamos orden por país
		fireEvent.click(sortByCountryButton); // Desactivamos orden por país

		// Hacemos load more para tener más de un usuario
		const loadMoreButton = screen.getByText("Load More");
		fireEvent.click(loadMoreButton);
		await waitFor(() => screen.getByText("Jane"));

		// Verificamos el orden de las filas (la primera fila es el header)
		const rows = screen.getAllByRole("row");

		// Segunda fila: debería ser John (orden original)
		expect(rows[1]).toHaveTextContent("John");
		// Tercera fila: Jane
		expect(rows[2]).toHaveTextContent("Jane");
	});
	it("sorting by country click on header and button should toggle sorting", async () => {
		renderWithClient(<App />);
		await waitFor(() => screen.getByText("John"));
		const thCountry = screen.getByText("Country");
		const sortByCountryButton = screen.getByText(/Sort by country/i);
		// Activamos orden por país con el header
		fireEvent.click(thCountry);
		// Hacemos load more para tener más de un usuario
		const loadMoreButton = screen.getByText("Load More");
		fireEvent.click(loadMoreButton);
		await waitFor(() => screen.getByText("Jane"));
		// Verificamos el orden de las filas (la primera fila es el header)
		let rows = screen.getAllByRole("row");
		// Segunda fila: debería ser Jane (France)
		expect(rows[1]).toHaveTextContent("Jane");
		// Tercera fila: John (USA)
		expect(rows[2]).toHaveTextContent("John");
		// Ahora hacemos click en el botón para desactivar orden
		fireEvent.click(sortByCountryButton);
		// Verificamos el orden de las filas (la primera fila es el header)
		rows = screen.getAllByRole("row");
		// Segunda fila: debería ser John (orden original)
		expect(rows[1]).toHaveTextContent("John");
		// Tercera fila: Jane
		expect(rows[2]).toHaveTextContent("Jane");
	});
	it("restore button should bring back deleted users", async () => {
		renderWithClient(<App />);
		await waitFor(() => screen.getByText("John"));
		const deleteButton = screen.getByText("Delete");
		fireEvent.click(deleteButton);
		await waitFor(() => {
			expect(screen.queryByText("John")).not.toBeInTheDocument();
		});
		const restoreButton = screen.getByText(/Restore Users/i);
		fireEvent.click(restoreButton);
		await waitFor(() => {
			expect(screen.getByText("John")).toBeInTheDocument();
		});
	});
	it("sort by email should sort users by email", async () => {
		renderWithClient(<App />);
		await waitFor(() => screen.getByText("John"));
		const thEmail = screen.getByText("Email");
		fireEvent.click(thEmail); // Simulamos click sobre el th
		// Hacemos load more para tener más de un usuario
		const loadMoreButton = screen.getByText("Load More");
		fireEvent.click(loadMoreButton);
		await waitFor(() => screen.getByText("Jane"));
		// Verificamos el orden de las filas (la primera fila es el header)
		const rows = screen.getAllByRole("row");
		// Segunda fila: debería ser Jane (
		expect(rows[1]).toHaveTextContent("Jane");
		// Tercera fila: John
		expect(rows[2]).toHaveTextContent("John");
	});
});
