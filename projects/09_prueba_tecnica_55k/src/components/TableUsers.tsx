import { useCallback, useId, useState } from "react";
import {
	Button,
	ButtonGroup,
	Form,
	Row,
	Spinner,
	Table,
} from "react-bootstrap";
import { useUsers } from "../hooks/useUsers";
import { SortBy, type User } from "../types.d";

function FormTable({
	toggleStriped,
	sorting,
	setFilterCountry,
	toggleSorting,
}: {
	toggleStriped: () => void;
	sorting: SortBy;
	setFilterCountry: (country: string) => void;
	toggleSorting: (newSorting: SortBy) => void;
}) {
	const { refetch } = useUsers();
	return (
		<>
			<Form>
				<Form.Group className="mb-3" controlId={useId()}>
					<Form.Label>Search by country</Form.Label>
					<Form.Control
						type="text"
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
					<Button variant="secondary" onClick={() => refetch()}>
						Restore Users
					</Button>
				</ButtonGroup>
			</Row>
		</>
	);
}

function SorteableTableHeader({
	toggleSorting,
}: { toggleSorting: (newSorting: SortBy) => void }) {
	return (
		<thead>
			<tr>
				<th>Picture</th>
				<th
					onClick={() => toggleSorting(SortBy.NAME)}
					onKeyUp={(e) => {
						if (e.key === "Enter" || e.key === " ") toggleSorting(SortBy.NAME);
					}}
					tabIndex={0}
				>
					First Name
				</th>
				<th
					onClick={() => toggleSorting(SortBy.LAST_NAME)}
					onKeyUp={(e) => {
						if (e.key === "Enter" || e.key === " ")
							toggleSorting(SortBy.LAST_NAME);
					}}
					tabIndex={0}
				>
					Last Name
				</th>
				<th
					onClick={() => toggleSorting(SortBy.EMAIL)}
					onKeyUp={(e) => {
						if (e.key === "Enter" || e.key === " ") toggleSorting(SortBy.EMAIL);
					}}
					tabIndex={0}
				>
					Email
				</th>
				<th
					onClick={() => toggleSorting(SortBy.COUNTRY)}
					onKeyUp={(e) => {
						if (e.key === "Enter" || e.key === " ")
							toggleSorting(SortBy.COUNTRY);
					}}
					tabIndex={0}
				>
					Country
				</th>
				<th>Actions</th>
			</tr>
		</thead>
	);
}

function RowUser({ user }: { user: User }) {
	const { handlerDeleteUser } = useUsers();
	return (
		<tr key={user.email}>
			<td>
				<img
					src={user.picture.thumbnail || ""}
					alt={`${user.name.first} ${user.name.last}`}
				/>
			</td>
			<td>{user.name.first}</td>
			<td>{user.name.last}</td>
			<td>{user.email}</td>
			<td>{user.location.country}</td>
			<td>
				<Button
					variant="danger"
					size="lg"
					onClick={() => handlerDeleteUser(user.email)}
				>
					Delete
				</Button>
			</td>
		</tr>
	);
}

export function TableUsers() {
	const { toggleSorting, isLoading, users, sorting, setFilterCountry } =
		useUsers();
	const [striped, setStriped] = useState<boolean>(false);

	const toggleStriped = useCallback(() => {
		setStriped(!striped);
	}, [striped]);

	return (
		<>
			<FormTable
				toggleStriped={toggleStriped}
				toggleSorting={toggleSorting}
				setFilterCountry={setFilterCountry}
				sorting={sorting}
			/>
			<Table striped={striped} bordered hover size="lg">
				<SorteableTableHeader toggleSorting={toggleSorting} />
				<tbody>
					{users.map((user) => (
						<RowUser key={user.email} user={user} />
					))}
					{isLoading && (
						<tr>
							<td colSpan={6} className="text-center">
								<Spinner animation="border" role="status" /> Loading...
							</td>
						</tr>
					)}
					{!isLoading && users.length === 0 && (
						<tr>
							<td colSpan={6} className="text-center">
								No users found.
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</>
	);
}
