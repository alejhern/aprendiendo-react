export interface Question {
	id: number;
	question: string;
	code: string;
	answers: string[];
	correctAnswer: number;
	isCorrect?: boolean;
	selectedAnswer?: number;
}
