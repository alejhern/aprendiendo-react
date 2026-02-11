import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question } from "../types";

interface QuestionsState {
	questions: Question[];
	currentQuestionIndex: number;
	setQuestions: (limit: number) => Promise<void>;
	selectAnswer: (questionId: number, answerIndex: number) => void;
	goNextQuestion: () => void;
	goPreviousQuestion: () => void;
	reset: () => void;
}

export const useQuestionsStore = create<QuestionsState>()(
	persist(
		(set) => ({
			questions: [],
			currentQuestionIndex: 0,
			setQuestions: async (limit: number) => {
				try {
					const response = await fetch("http://localhost:5173/data.json");
					const json = await response.json();
					const questions: Question[] = json
						.sort(() => Math.random() - 0.5)
						.slice(0, limit);
					set({ questions });
					console.log("Questions fetched and set:", questions);
				} catch (error) {
					console.error("Error fetching questions:", error);
				}
			},
			selectAnswer: (questionId: number, answerIndex: number) => {
				const { questions } = useQuestionsStore.getState();
				const newQuestions = structuredClone(questions);
				const questionIndex = newQuestions.findIndex(
					(q) => q.id === questionId,
				);
				const question = newQuestions[questionIndex];
				const isCorrect = question.correctAnswer === answerIndex;
				question.selectedAnswer = answerIndex;
				question.isCorrect = isCorrect;
				set({ questions: newQuestions });
			},
			goNextQuestion: () => {
				const { currentQuestionIndex, questions } =
					useQuestionsStore.getState();
				if (currentQuestionIndex < questions.length - 1) {
					set({ currentQuestionIndex: currentQuestionIndex + 1 });
				}
			},
			goPreviousQuestion: () => {
				const { currentQuestionIndex } = useQuestionsStore.getState();
				if (currentQuestionIndex > 0) {
					set({ currentQuestionIndex: currentQuestionIndex - 1 });
				}
			},
			reset: () => {
				set({ questions: [], currentQuestionIndex: 0 });
			},
		}),
		{
			name: "questions-storage",
		},
	),
);
