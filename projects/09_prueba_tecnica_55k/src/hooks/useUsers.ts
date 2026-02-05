import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { fetchUsers } from "../services/fetchUser";
import { SortBy, type User } from "../types.d";

export function useUsers() {
	const { data, isLoading, refetch, fetchNextPage, hasNextPage } =
		useInfiniteQuery<{ users: User[]; nextCursor: number }>({
			queryKey: ["users"],
			queryFn: ({ pageParam }) => fetchUsers(pageParam as number),
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: 1,
		});
	const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
	const [filterCountry, setFilterCountry] = useState<string>("");
	const users: User[] = useMemo(
		() => (data ? data.pages.flatMap((page) => page.users) : []),
		[data],
	);

	const filteredUsers = useMemo(
		() =>
			typeof filterCountry === "string" && filterCountry.length > 0
				? users.filter((user) =>
						user.location.country
							.toLowerCase()
							.includes(filterCountry.toLowerCase()),
				  )
				: users,
		[filterCountry, users],
	);

	const sortedUsers = useMemo(() => {
		if (sorting === SortBy.NONE) return filteredUsers;
		const compareProperties: Record<string, (user: User) => string> = {
			[SortBy.COUNTRY]: (user) => user.location.country,
			[SortBy.NAME]: (user) => user.name.first,
			[SortBy.LAST_NAME]: (user) => user.name.last,
			[SortBy.EMAIL]: (user) => user.email,
		};
		return filteredUsers.toSorted((a, b) => {
			const extractProp = compareProperties[sorting];
			return extractProp(a).localeCompare(extractProp(b));
		});
	}, [sorting, filteredUsers, users]);

	const toggleSorting = useCallback(
		(newSorting: SortBy) => {
			if (sorting === newSorting) return setSorting(SortBy.NONE);
			return setSorting(newSorting);
		},
		[sorting],
	);

	const queryClient = useQueryClient();
	const handlerDeleteUser = useCallback((email: string) => {
		queryClient.setQueryData<{
			pages: { users: User[]; nextCursor: number }[];
		}>(
			["users"], // tu queryKey
			(oldData) => {
				if (!oldData) return oldData;

				return {
					...oldData,
					pages: oldData.pages.map((page) => ({
						...page,
						users: page.users.filter((u) => u.email !== email),
					})),
				};
			},
		);
	}, []);

	return {
		users: sortedUsers,
		toggleSorting,
		sorting,
		isLoading,
		refetch,
		fetchNextPage,
		hasNextPage,
		setFilterCountry,
		handlerDeleteUser,
	};
}
