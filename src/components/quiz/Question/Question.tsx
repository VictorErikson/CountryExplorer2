import { useSelector } from "react-redux";
import type { Country } from "../../../redux/countriesSlice";
import type { RootState } from "../../../redux/configureStore";
import { useEffect, useState } from "react";
import styles from "./Question.module.css";
import shuffle from "../../../utils/shuffle";

export default function Question({
  country,
  submitAnswer,
  next,
}: {
  country: Country;
  submitAnswer: (isCorrect: boolean) => void;
  next: () => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState<Country[]>([]);
  const allCountries = useSelector(
    (state: RootState) => state.countries.countries
  );

  useEffect(() => {
    const wrong = shuffle(
      allCountries.filter((c) => c.name.common !== country.name.common)
    ).slice(0, 3);
    setAnswers(shuffle([...wrong, country]));
  }, [allCountries, country]);

  const checkAnswer = (a: Country) => {
    if (locked) return;
    setLocked(true);
    setChosen(a.name.common);

    const isCorrect = a.name.common === country.name.common;
    submitAnswer(isCorrect);

    setTimeout(() => {
      setChosen(null);
      setLocked(false);
      next();
    }, 2000);
  };

  const btnClass = (a: Country) => {
    if (!chosen) return styles.answerBtn;
    const isThis = chosen === a.name.common;
    const isCorrect = a.name.common === country.name.common;
    if (isThis && isCorrect) return `${styles.answerBtn} ${styles.correct}`;
    if (isThis && !isCorrect) return `${styles.answerBtn} ${styles.wrong}`;
    return styles.answerBtn;
  };

  return (
    <div>
      <img src={country.flags.svg} alt={country.flags.alt} />
      <div className={styles.answers}>
        {answers.map((a) => (
          <button
            key={a.name.common}
            className={btnClass(a)}
            onClick={() => checkAnswer(a)}
            disabled={locked}
          >
            {a.name.common}
          </button>
        ))}
      </div>
    </div>
  );
}
