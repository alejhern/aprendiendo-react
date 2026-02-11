import { Button } from "@mui/material";
import { useQuestionsStore } from "../store/questions";

export function Start() {
	const setQuestions = useQuestionsStore((state) => state.setQuestions);

	return (
		<Button onClick={() => setQuestions(10)} variant="contained">
			Click the button below to start the quiz!
		</Button>
	);
}
