import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsersFromDB, syncDB } from "../services/syncDB";
import type { User, UserWithId } from "../types";

export function useUsers() {
	const queryClient = useQueryClient();

	const { data: users, isLoading } = useQuery<UserWithId[]>({
		queryKey: ["users"],
		queryFn: getUsersFromDB,
		retry(failureCount, error) {
			if (error instanceof Error && error.message === "Failed to fetch") {
				return failureCount < 3; // Reintenta hasta 3 veces si el error es "Failed to fetch"
			}
			return false; // No reintentar para otros tipos de errores
		},
		staleTime: 1000 * 60, // 1 minuto
		refetchInterval: 1000 * 60, // cada 1 minuto
		refetchOnWindowFocus: "always",
	});

	const addUser = useMutation({
		mutationFn: async (newUser: User) => {
			const maxId =
				users?.reduce((max, user) => (user.id > max ? user.id : max), 0) ?? 0;
			const userWithId: UserWithId = { ...newUser, id: maxId + 1 };
			syncDB("users/create", userWithId);
			return userWithId;
		},
		// 1º opción: Mutacion Optimista
		onMutate: async (newUser) => {
			await queryClient.cancelQueries({ queryKey: ["users"] });
			const previousUsers = queryClient.getQueryData<UserWithId[]>(["users"]);
			const maxId =
				users?.reduce((max, user) => (user.id > max ? user.id : max), 0) ?? 0;
			const userWithId: UserWithId = { ...newUser, id: maxId + 1 };
			queryClient.setQueryData<UserWithId[]>(
				["users"],
				(old: UserWithId[] = []) => [...old, userWithId],
			);
			return { previousUsers };
		},
		onError: (err, newUser, context) => {
			console.error("Error al crear el usuario:", err);
			if (context?.previousUsers) {
				queryClient.setQueryData(["users"], context?.previousUsers);
			}
		},
		onSuccess: async (user) => {
			// 2º opción: actualizar el cache manualmente
			//queryClient.setQueryData<UserWithId[]>(["users"], (old = []) => [
			//	...old,
			//	user,
			//]);
			// 3º opción: invalidar la query para que se vuelva a ejecutar y obtener los datos actualizados
			//await queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const editUser = useMutation({
		mutationFn: async (user: UserWithId) => {
			syncDB("users/update", user);
			return user;
		},
		onSuccess: async (updatedUser) => {
			/*queryClient.setQueryData<UserWithId[]>(["users"], (old = []) =>
				old.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
			);*/
			await queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const removeUser = useMutation({
		mutationFn: async (id: number) => {
			syncDB("users/remove", id);
			return id;
		},
		onSuccess: async (id: number) => {
			/*queryClient.setQueryData<UserWithId[]>(["users"], (old = []) =>
				old.filter((u) => u.id !== id),
			);*/
			await queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	return {
		users,
		isLoading,
		addUser: addUser.mutate,
		editUser: editUser.mutate,
		removeUser: removeUser.mutate,
	};
}
