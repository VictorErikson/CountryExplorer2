import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/configureStore";
import {
  fetchCountries,
  selectCountriesForRegion,
  selectRegion,
  type Country,
} from "../../redux/countriesSlice";
import shuffle from "../../utils/shuffle";
import GameActive from "../../components/game/GameActive/GameActive/GameActive";
import GameResults from "../../components/game/GameResults/GameResults";
import styles from "./GamePage.module.scss";
import earthVideo from "../../assets/videos/earth/1.mp4";

export default function GamePage() {
  const dispatch = useDispatch<AppDispatch>();
  const [questions, setQuestions] = useState<Country[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [gameResults, setGameResults] = useState(false);

  const isLast = i === questions.length - 1;
  const currentQuestion = questions[i];

  useEffect(() => {
    dispatch(selectRegion("All"));
    const promise = dispatch(fetchCountries("All"));
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const countries = useSelector((state: RootState) =>
    selectCountriesForRegion(state.countries)
  );

  useEffect(() => {
    setQuestions(shuffle(countries).slice(0, 15));
  }, [countries]);

  const submitAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((score) => score + 1);
  };

  const next = () => {
    if (!isLast) {
      setI((prev) => prev + 1);
    } else {
      setGameActive(false);
      setGameResults(true);
    }
  };
  const restart = () => {
    setI(0);
    setScore(0);
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
          <source src={earthVideo} type="video/mp4" />
        </video>
      </div>
    </main>
  );
}
