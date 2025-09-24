import { useSelector } from "react-redux";
import type { Country } from "../../../redux/countriesSlice";
import Question from "../Question/Question";
import styles from "./QuizActive.module.scss";
import type { RootState } from "../../../redux/configureStore";

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
  const selectedRegion = useSelector(
    (state: RootState) => state.countries.region
  );
  return (
    <div className={styles.quizActive}>
      <h1>{selectedRegion}</h1>
      <div className={styles.info}>
        <h3>Question {i + 1} / 15</h3>
        <h3>Points {score}</h3>
      </div>
      <Question
        country={currentQuestion}
        submitAnswer={submitAnswer}
        next={next}
      />
    </div>
  );
}
