import type { User } from "../types.d";
export async function fetchUsers(page: number): Promise<User[]> {
	const response = await fetch(
		`https://randomuser.me/api/?results=10&seed=alejhern&page=${page}`,
	);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data.results;
}
