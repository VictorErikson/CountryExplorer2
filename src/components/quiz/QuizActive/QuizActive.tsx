import type { Country } from "../../../redux/countriesSlice";
import Question from "../Question/Question";

type QuizActiveProps = {
  i: number;
  score: number;
  currentQuestion: Country;
  submitAnswer: (isCorrect: boolean) => void;
  next: () => void;
};

export default function QuizActive({
  i,
  score,
  currentQuestion,
  submitAnswer,
  next,
}: QuizActiveProps) {
  return (
    <div className="quizActive">
      <h3>Question {i + 1} / 15</h3>
      <h3>Points {score}</h3>
      <Question
        country={currentQuestion}
        submitAnswer={submitAnswer}
        next={next}
      />
    </div>
  );
}
