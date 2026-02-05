import { Button, Container, Row } from "react-bootstrap";
import "./App.css";
import { TableUsers } from "./components/TableUsers";
import { useUsers } from "./hooks/useUsers";

function App() {
	const { isLoading, fetchNextPage, hasNextPage } = useUsers();
	return (
		<Container fluid>
			<Row className="my-3">
				<h1>Prueva Tecnica</h1>
			</Row>
			<TableUsers />
			<Row>
				<Button
					variant="secondary"
					onClick={() => void fetchNextPage()}
					disabled={!hasNextPage || isLoading}
				>
					Load More
				</Button>
			</Row>
		</Container>
	);
}

export default App;
