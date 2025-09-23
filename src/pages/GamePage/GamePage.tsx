import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/configureStore";
import {
  fetchCountries,
  selectRegion,
  type Country,
} from "../../redux/countriesSlice";
import shuffle from "../../utils/shuffle";
import GameActive from "../../components/game/GameActive/GameActive/GameActive";
import GameResults from "../../components/game/GameResults/GameResults";
import styles from "./GamePage.module.scss";

export default function GamePage() {
  const dispatch = useDispatch<AppDispatch>();
  const [questions, setQuestions] = useState<Country[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<null | boolean>(null);
  const [gameActive, setGameActive] = useState(true);
  const [gameResults, setGameResults] = useState(false);

  const isLast = i === questions.length - 1;
  const currentQuestion = questions[i];

  const selectedRegion = useSelector(
    (state: RootState) => state.countries.region
  );

  useEffect(() => {
    dispatch(selectRegion("All"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCountries(selectedRegion));
  }, [dispatch, selectedRegion]);

  const countries = useSelector(
    (state: RootState) => state.countries.countries
  );

  useEffect(() => {
    setQuestions(shuffle(countries).slice(0, 15));
  }, [countries]);

  const submitAnswer = (isCorrect: boolean) => {
    setAnswered(isCorrect);
    if (isCorrect) setScore((score) => score + 1);
  };

  const next = () => {
    if (!isLast) {
      setI((prev) => prev + 1);
      setAnswered(null);
    } else {
      setGameActive(false);
      setGameResults(true);
    }
  };
  const restart = () => {
    setI(0);
    setScore(0);
    setAnswered(null);
    setGameActive(true);
    setGameResults(false);
  };

  return (
    <main className={styles.gamePage}>
      <section className={styles.content}>
        {gameActive && currentQuestion && (
          <GameActive
            i={i}
            score={score}
            currentQuestion={currentQuestion}
            submitAnswer={submitAnswer}
            next={next}
          />
        )}
        {gameResults && !gameActive && (
          <GameResults score={score} restart={restart} />
        )}
      </section>
      <div className={styles.videoBackground}>
        <video autoPlay loop muted playsInline>
          <source src="src/assets/videos/earth/1.mp4" type="video/mp4" />
        </video>
      </div>
    </main>
  );
}
