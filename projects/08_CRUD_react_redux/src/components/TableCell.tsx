import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import { Avatar, Button } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import { useUsersActions } from "../hooks/useUsersActions";
import { ModalUser } from "./ModalUser";

function ActionCell({ idUser }: { idUser: number }) {
	const { removeUser } = useUsersActions();
	return (
		<ButtonGroup size="large" aria-label="Large button group">
			<ModalUser userId={idUser} />
			<Button
				type="button"
				onClick={() => removeUser(idUser)}
				color="secondary"
				variant="contained"
				endIcon={<PersonRemoveRoundedIcon />}
			>
				Delete
			</Button>
		</ButtonGroup>
	);
}

function AvatarCell({ src }: { src: string }) {
	const avatar_url = src === "" ? "https://i.pravatar.cc/300" : src;
	return (
		<Stack direction="row" alignItems="center" justifyContent="center">
			<Avatar alt="User Avatar" src={avatar_url} />
		</Stack>
	);
}

type TableCellProps = {
	typeCell: "action" | "avatar";
	value: string | number;
};

export function TableCell({ typeCell, value }: TableCellProps) {
	if (typeCell === "action") {
		return <ActionCell idUser={value as number} />;
	}
	if (typeCell === "avatar") {
		return <AvatarCell src={value as string} />;
	}
	return <>{value}</>;
}
