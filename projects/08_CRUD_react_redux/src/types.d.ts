export interface User {
	name: string;
	email: string;
	github: string;
	image: string;
}

export interface UserWithId extends User {
	id: string;
}
