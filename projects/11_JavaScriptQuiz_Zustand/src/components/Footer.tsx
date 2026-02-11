import { Button } from "@mui/material";
import { useQuestionsStore } from "../store/questions";

function useFooter() {
	const questions = useQuestionsStore((state) => state.questions);
	let correctAnswers = 0;
	let incorrectAnswers = 0;
	let unanswered = 0;
	questions.forEach((question) => {
		if (question.selectedAnswer === undefined) unanswered++;
		else if (question.isCorrect) correctAnswers++;
		else incorrectAnswers++;
	});
	return { correctAnswers, incorrectAnswers, unanswered };
}

export function Footer() {
	const reset = useQuestionsStore((state) => state.reset);
	const { correctAnswers, incorrectAnswers, unanswered } = useFooter();
	return (
		<footer style={{ marginTop: 20 }}>
			<p>Correct answers: {correctAnswers}</p>
			<p>Incorrect answers: {incorrectAnswers}</p>
			<p>Unanswered: {unanswered}</p>
			<Button onClick={reset} variant="contained">
				Reset Quiz
			</Button>
		</footer>
	);
}
