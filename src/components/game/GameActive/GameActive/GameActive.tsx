import type { Country } from "../../../../redux/countriesSlice";
import Question from "../../../quiz/Question/Question";
import styles from "./GameActive.module.scss";

type GameActiveProps = {
  i: number;
  score: number;
  currentQuestion: Country;
  submitAnswer: (isCorrect: boolean) => void;
  next: () => void;
};

export default function GameActive({
  i,
  score,
  currentQuestion,
  submitAnswer,
  next,
}: GameActiveProps) {
  return (
    <div className="quizActive">
      <div className={styles.info}>
        <h3>Question {i + 1} / 15</h3>
        <h3>Points {score}</h3>
      </div>
      <Question
        country={currentQuestion}
        submitAnswer={submitAnswer}
        next={next}
        mapsGame={true}
      />
    </div>
  );
}
