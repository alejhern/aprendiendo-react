import Paper from "@mui/material/Paper";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import "./App.css";
import { ModalUser } from "./components/ModalUser";
import { TableCell } from "./components/TableCell";
import { useUsers } from "./hooks/useUsers";

const columns = [
	{
		field: "avatar",
		headerName: "Avatar",
		width: 75,
		renderCell: (params: GridRenderCellParams) => (
			<TableCell typeCell="avatar" value={params.row.avatar} />
		),
	},
	{ field: "id", headerName: "ID", width: 70 },
	{ field: "name", headerName: "Name", width: 200 },
	{ field: "email", headerName: "Email", width: 250 },
	{ field: "github", headerName: "GitHub", width: 200 },
	{
		field: "actions",
		headerName: "Actions",
		width: 300,
		renderCell: (params: GridRenderCellParams) => (
			<TableCell typeCell="action" value={params.row.id} />
		),
	},
];

function App() {
	const { users } = useUsers();
	return (
		<>
			<h1>Mi Proyecto con React Query</h1>
			<ModalUser />
			<Paper style={{ height: 400, width: "100%" }}>
				<DataGrid
					rows={users ?? []}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: { pageSize: 5, page: 0 },
						},
					}}
					pageSizeOptions={[5]}
					checkboxSelection
				/>
			</Paper>
		</>
	);
}

export default App;
