import { Container, Stack, Typography } from "@mui/material";
import "./App.css";
import { Footer } from "./components/Footer.tsx";
import { Game } from "./components/Game.tsx";
import { Start } from "./components/Start.tsx";
import { useQuestionsStore } from "./store/questions.ts";
import JavaScriptLogo from "/javascript.svg";

function App() {
	const questions = useQuestionsStore((state) => state.questions);

	return (
		<>
			<Container maxWidth="lg">
				<Stack
					direction="row"
					gap={2}
					justifyContent="center"
					alignItems="center"
				>
					<img src={JavaScriptLogo} className="logo react" alt="React logo" />
					<Typography variant="h2" component="h1">
						JAVASCRIPT QUIZ
					</Typography>
				</Stack>
				{questions.length === 0 && <Start />}
				{questions.length > 0 && (
					<>
						<Game />
						<Footer />
					</>
				)}
			</Container>
		</>
	);
}

export default App;
