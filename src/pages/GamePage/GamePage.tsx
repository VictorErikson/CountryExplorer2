import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/configureStore";
import {
  fetchCountries,
  selectRegion,
  type Country,
} from "../../redux/countriesSlice";
import shuffle from "../../utils/shuffle";
import GameActive from "../../components/game/GameActive/GameActive";

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

  return (
    <div className="gamePage">
      {gameActive && currentQuestion && (
        <GameActive
          i={i}
          score={score}
          currentQuestion={currentQuestion}
          submitAnswer={submitAnswer}
          next={next}
        />
      )}
      {/* <iframe
        title={`Street View of ${country.name.common}`}
        width="640"
        height="360"
        style={{ border: 0, borderRadius: 12 }}
        loading="lazy"
        allowFullScreen
        src={src}
      /> */}
      {/* {quizResults && (
        <QuizResults score={score} name={username} restart={restart} />
      )} */}
    </div>
  );
}
