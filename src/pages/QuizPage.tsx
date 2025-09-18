import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/configureStore";
import { useEffect, useState } from "react";
import {
  fetchCountries,
  selectRegion,
  type Country,
} from "../redux/countriesSlice";
import shuffle from "../utils/shuffle";
import QuizResults from "../components/quiz/QuizResults/QuizResults";
import QuizActive from "../components/quiz/QuizActive/QuizActive";
import QuizStart from "../components/quiz/QuizStart/QuizStart";

export default function QuizPage() {
  const [quizActive, setQuizActive] = useState(false);
  const [quizResults, setQuizResults] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [questions, setQuestions] = useState<Country[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<null | boolean>(null);

  const isLast = i === questions.length - 1;
  const currentQuestion = questions[i];

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(selectRegion("Europe"));
  }, [dispatch]);

  const selectedRegion = useSelector(
    (state: RootState) => state.countries.region
  );
  const countries = useSelector(
    (state: RootState) => state.countries.countries
  );

  useEffect(() => {
    dispatch(fetchCountries(selectedRegion));
  }, [dispatch, selectedRegion]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const startQuiz = () => {
    setErrorMsg("");
    if (countries.length === 0) {
      setErrorMsg("Please enter a region");
      return;
    }
    if (username.trim() && countries && countries.length > 0) {
      setQuestions(shuffle(countries).slice(0, 15));
      setQuizActive(true);
    } else {
      setErrorMsg("Please enter a username");
    }
  };

  const submitAnswer = (isCorrect: boolean) => {
    setAnswered(isCorrect);
    if (isCorrect) setScore((score) => score + 1);
  };

  const next = () => {
    if (!isLast) {
      setI((prev) => prev + 1);
      setAnswered(null);
    } else {
      setQuizActive(false);
      setQuizResults(true);
    }
  };

  const restart = () => {
    setI(0);
    setScore(0);
    setAnswered(null);
    setQuizActive(false);
    setQuizResults(false);
  };

  const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const changeDropdown = (value: boolean) => {
    setDropdownOpen(value);
  };

  return (
    <div className="quizPage">
      {!quizActive && !quizResults && (
        <QuizStart
          errorMsg={errorMsg}
          dropdownOpen={dropdownOpen}
          toggleDropdown={toggleDropdown}
          startQuiz={startQuiz}
          changeUsername={changeUsername}
          changeDropdown={changeDropdown}
        />
      )}
      {quizActive && (
        <QuizActive
          i={i}
          score={score}
          currentQuestion={currentQuestion}
          submitAnswer={submitAnswer}
          next={next}
        />
      )}
      {quizResults && (
        <QuizResults score={score} name={username} restart={restart} />
      )}
    </div>
  );
}
