import { useSelector } from "react-redux";
import type { Country } from "../../../redux/countriesSlice";
import type { RootState } from "../../../redux/configureStore";
import { useEffect, useState } from "react";
import styles from "./Question.module.css";
import shuffle from "../../../utils/shuffle";
import { GOOGLE_KEY } from "../../../pages/CountryNamePage/CountryNamePage";
import { getNearestPano } from "../../../utils/getNearestPano";

export default function Question({
  country,
  submitAnswer,
  next,
  mapsGame = false,
}: {
  country: Country;
  submitAnswer: (isCorrect: boolean) => void;
  next: () => void;
  mapsGame?: boolean;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [answers, setAnswers] = useState<Country[]>([]);
  const [src, setSrc] = useState<string>("");

  const allCountries = useSelector(
    (state: RootState) => state.countries.countries
  );
  // if (!country) return null;

  // const coords = country.capitalInfo?.latlng ?? country.latlng;
  // if (!coords || coords.length < 2) return null;
  // const [lat, lng] = country.capitalInfo?.latlng ?? country.latlng;
  // let lat: number, lng: number;

  // if (country.capitalInfo) {
  //   [lat, lng] = country.capitalInfo.latlng;
  // } else {
  //   [lat, lng] = country.latlng;
  // }
  const [lat, lng] = country.capitalInfo?.latlng ?? country.latlng;
  // const src = `https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_KEY}&location=${lat},${lng}&fov=80&pitch=5&heading=0&source=outdoor`;
  useEffect(() => {
    let cancelled = false;

    const loadPano = async () => {
      const meta = await getNearestPano(lat, lng, GOOGLE_KEY);

      if (!cancelled) {
        if (meta) {
          setSrc(
            `https://www.google.com/maps/embed/v1/streetview?pano=${meta.pano_id}&key=${GOOGLE_KEY}&fov=80&pitch=5&heading=0`
          );
        } else {
          setSrc(
            `https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_KEY}&location=${lat},${lng}&source=outdoor`
          );
        }
      }
    };

    loadPano();

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  // const src = meta
  //   ? `https://www.google.com/maps/embed/v1/streetview?pano=${meta.pano_id}&key=${GOOGLE_KEY}&fov=80&pitch=5&heading=0`
  //   : `https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_KEY}&location=${lat},${lng}&source=outdoor`;

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
      {mapsGame ? (
        src ? (
          <iframe
            title={`Street View of ${country.name.common}`}
            width="640"
            height="360"
            style={{ border: 0, borderRadius: 12 }}
            loading="lazy"
            allow="accelerometer; gyroscope; fullscreen"
            src={src}
          />
        ) : null
      ) : (
        <img src={country.flags.svg} alt={country.flags.alt} />
      )}

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
