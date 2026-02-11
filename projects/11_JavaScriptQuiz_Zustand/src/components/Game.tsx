import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import {
	Card,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Stack,
} from "@mui/material";
import confetti from "canvas-confetti";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useQuestionsStore } from "../store/questions";
import type { Question } from "../types";

const getBackgroundColor = (answerIndex: number, question: Question) => {
	if (question.selectedAnswer === undefined) return "transparent";
	if (answerIndex === question.correctAnswer) return "green";
	if (answerIndex === question.selectedAnswer) return "red";
	return "transparent";
};

function QuestionCard({ question }: { question: Question }) {
	const selectAnswer = useQuestionsStore((state) => state.selectAnswer);
	const createHandlerClickAnswer = (answerIndex: number) => () => {
		selectAnswer(question.id, answerIndex);
		if (question.correctAnswer === answerIndex) {
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});
		}
	};

	return (
		<Card variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
			<h2>{question.question}</h2>
			{question.code && (
				<SyntaxHighlighter language="javascript" style={atomOneDark}>
					{question.code}
				</SyntaxHighlighter>
			)}
			<List>
				{question.answers.map((answer, id) => (
					<ListItem key={Number(id)} disablePadding divider>
						<ListItemButton
							disabled={question.selectedAnswer !== undefined}
							onClick={createHandlerClickAnswer(id)}
							sx={{ backgroundColor: getBackgroundColor(id, question) }}
						>
							<ListItemText primary={answer} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Card>
	);
}

export function Game() {
	const questions = useQuestionsStore((state) => state.questions);
	const currentQuestionIndex = useQuestionsStore(
		(state) => state.currentQuestionIndex,
	);
	const goNextQuestion = useQuestionsStore((state) => state.goNextQuestion);
	const goPreviousQuestion = useQuestionsStore(
		(state) => state.goPreviousQuestion,
	);

	return (
		<div>
			{questions.length > 0 ? (
				<>
					<Stack
						direction="row"
						gap={2}
						justifyContent="center"
						alignItems="center"
						mb={2}
					>
						<IconButton
							onClick={goPreviousQuestion}
							disabled={currentQuestionIndex === 0}
						>
							<ArrowBackIosNew />
						</IconButton>
						{currentQuestionIndex + 1} / {questions.length}
						<IconButton
							onClick={goNextQuestion}
							disabled={currentQuestionIndex === questions.length - 1}
						>
							<ArrowForwardIos />
						</IconButton>
					</Stack>
					<QuestionCard question={questions[currentQuestionIndex]} />
				</>
			) : (
				<p>No questions available.</p>
			)}
		</div>
	);
}
