import type { User } from "../types.d";

export const fetchUsers = async (
	cursor: number,
): Promise<{ users: User[]; nextCursor: number }> => {
	const res = await fetch(
		`https://randomuser.me/api/?results=10&page=${cursor}&seed=alejhern`,
	);
	if (!res.ok) throw new Error("Fetch error");
	const data = await res.json();
	const users: User[] = data.results.map((user: User) => ({
		name: user.name,
		email: user.email,
		location: user.location,
		picture: user.picture,
	}));
	console.log("fetchUsers data", users);
	return {
		users,
		nextCursor: data.info.page + 1,
	};
};
