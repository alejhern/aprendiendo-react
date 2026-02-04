import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserWithId } from "../types";

const API_URL = "http://localhost:3000/users";

function create(user: PayloadAction["payload"]) {
	fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Usuario creado en la base de datos:", data);
		})
		.catch((error) => {
			console.error("Error al crear el usuario:", error);
		});
}

function update(user: PayloadAction["payload"]) {
	fetch(`${API_URL}/${user}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Usuario actualizado en la base de datos:", data);
		})
		.catch((error) => {
			console.error("Error al actualizar el usuario:", error);
		});
}

function remove(id: PayloadAction["payload"]) {
	fetch(`${API_URL}/${id}`, {
		method: "DELETE",
	})
		.then(() => {
			console.log("Usuario eliminado de la base de datos:", id);
		})
		.catch((error) => {
			console.error("Error al eliminar el usuario:", error);
		});
}

export function syncDB(type: string, payload: PayloadAction["payload"]) {
	if (type.split("/")[1] === "create") {
		create(payload);
	} else if (type.split("/")[1] === "update") {
		update(payload);
	} else if (type.split("/")[1] === "remove") {
		remove(payload);
	}
}

export function getUsersFromDB(): Promise<UserWithId[]> {
	return fetch(API_URL)
		.then((response) => response.json())
		.then((data) => {
			console.log("Usuarios obtenidos de la base de datos:", data);
			return data as UserWithId[];
		})
		.catch((error) => {
			console.error("Error al obtener los usuarios:", error);
			return [];
		});
}
