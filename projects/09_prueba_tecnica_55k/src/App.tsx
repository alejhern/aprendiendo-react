import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button, ButtonGroup, Container, Form, Row } from "react-bootstrap";
import "./App.css";
import { TableUsers } from "./components/TableUsers";
import { SortBy, type User } from "./types.d";

function App() {
	const [users, setUsers] = useState<User[]>([]);
	const [striped, setStriped] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
	const [filterCountry, setFilterCountry] = useState<string>("");
	const originalUsers = useRef<User[]>([]);

	useEffect(() => {
		fetch("https://randomuser.me/api/?results=100")
			.then((response) => response.json())
			.then((data) => {
				setUsers(data.results);
				originalUsers.current = data.results;
			})
			.catch((error) => console.error("Error fetching users:", error));
	}, []);

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
	}, [sorting, filteredUsers]);

	const toggleStriped = () => {
		setStriped(!striped);
	};

	const toggleSorting = (newSorting: SortBy) => {
		if (sorting === newSorting) return setSorting(SortBy.NONE);
		return setSorting(newSorting);
	};

	const handlerDeleteUser = (email: string) => {
		const filteredUsers = users.filter((user) => user.email !== email);
		setUsers(filteredUsers);
	};
	return (
		<Container fluid>
			<Row className="my-3">
				<h1>Prueva Tecnica</h1>
			</Row>
			<Form>
				<Form.Group className="mb-3" controlId={useId()}>
					<Form.Label>Search by country</Form.Label>
					<Form.Control
						type="email"
						placeholder="Spain, France, Germany..."
						onChange={(e) => setFilterCountry(e.target.value)}
					/>
				</Form.Group>
			</Form>
			<Row className="mb-3">
				<ButtonGroup aria-label="Basic example">
					<Button variant="secondary" onClick={toggleStriped}>
						Toggle Striped
					</Button>
					<Button
						variant="secondary"
						onClick={() => toggleSorting(SortBy.COUNTRY)}
					>
						{sorting !== SortBy.NONE ? "Unsort" : "Sort"} by country
					</Button>
					<Button
						variant="secondary"
						onClick={() => setUsers(originalUsers.current)}
					>
						Restore Users
					</Button>
				</ButtonGroup>
			</Row>
			<Row>
				<TableUsers
					users={sortedUsers}
					striped={striped}
					deleteUser={handlerDeleteUser}
					toggleSorting={toggleSorting}
				/>
			</Row>
		</Container>
	);
}

export default App;
