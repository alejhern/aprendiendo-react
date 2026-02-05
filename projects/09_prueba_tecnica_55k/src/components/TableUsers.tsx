import { Button, Spinner, Table } from "react-bootstrap";
import { SortBy, type User } from "../types.d";

type TableUsersProps = {
	users: User[];
	striped: boolean;
	loading: boolean;
	deleteUser: (email: string) => void;
	toggleSorting: (newSorting: SortBy) => void;
};

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

function RowUser({
	user,
	deleteUser,
}: { user: User; deleteUser: (email: string) => void }) {
	return (
		<tr key={user.email}>
			<td>
				<img
					src={user.picture.thumbnail}
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
					onClick={() => deleteUser(user.email)}
				>
					Delete
				</Button>
			</td>
		</tr>
	);
}

export function TableUsers({
	users,
	striped,
	deleteUser,
	toggleSorting,
	loading,
}: TableUsersProps) {
	return (
		<Table striped={striped} bordered hover size="lg">
			<SorteableTableHeader toggleSorting={toggleSorting} />
			<tbody>
				{users.map((user) => (
					<RowUser key={user.email} user={user} deleteUser={deleteUser} />
				))}
				{loading && (
					<tr>
						<td colSpan={6} className="text-center">
							<Spinner animation="border" role="status" /> Loading...
						</td>
					</tr>
				)}
				{!loading && users.length === 0 && (
					<tr>
						<td colSpan={6} className="text-center">
							No users found.
						</td>
					</tr>
				)}
			</tbody>
		</Table>
	);
}
