import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { Country } from "../../../redux/countriesSlice";
import type { RootState } from "../../../redux/configureStore";
import styles from "./Question.module.scss";
import shuffle from "../../../utils/shuffle";
import { getNearestPano } from "../../../utils/getNearestPano";
import { GOOGLE_KEY } from "../../../pages/CountryNamePage/CountryNamePage";
type QuestionProps = {
  country: Country;
  submitAnswer: (isCorrect: boolean) => void;
  next: () => void;
  mapsGame?: boolean;
};

export default function Question({
  country,
  submitAnswer,
  next,
  mapsGame = false,
}: QuestionProps) {
  const allCountries = useSelector((s: RootState) => s.countries.countries);

  const [chosen, setChosen] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [effectiveCountry, setEffectiveCountry] = useState<Country>(country);
  const [answers, setAnswers] = useState<Country[]>([]);
  const [src, setSrc] = useState<string>("");
  const [badCountries, setBadCountries] = useState<Set<string>>(new Set());

  useEffect(() => {
    setEffectiveCountry(country);
    setSrc("");
  }, [country]);

  useEffect(() => {
    const wrong = shuffle(
      allCountries.filter((c) => c.name.common !== effectiveCountry.name.common)
    ).slice(0, 3);
    setAnswers(shuffle([...wrong, effectiveCountry]));
  }, [allCountries, effectiveCountry]);

  useEffect(() => {
    if (!mapsGame) return;

    const coords =
      effectiveCountry.capitalInfo?.latlng ?? effectiveCountry.latlng;
    if (!Array.isArray(coords) || coords.length < 2) return;

    let cancelled = false;

    const tryLoad = async () => {
      const [lat, lng] = coords as [number, number];

      const meta = await getNearestPano(lat, lng, GOOGLE_KEY);
      if (cancelled) return;

      if (meta) {
        setSrc(
          `https://www.google.com/maps/embed/v1/streetview?pano=${meta.pano_id}&key=${GOOGLE_KEY}&fov=80&pitch=5&heading=0`
        );
        // setSrc(meta.pano_id);
        return;
      }

      const updatedBad = new Set(badCountries).add(
        effectiveCountry.name.common
      );

      const candidates = shuffle(
        allCountries.filter(
          (c) =>
            c.name.common !== effectiveCountry.name.common &&
            !updatedBad.has(c.name.common)
        )
      );

      for (const c of candidates) {
        const cc = c.capitalInfo?.latlng ?? c.latlng;
        if (!Array.isArray(cc) || cc.length < 2) continue;

        const [clat, clng] = cc as [number, number];
        const cm = await getNearestPano(clat, clng, GOOGLE_KEY);
        if (cancelled) return;

        if (cm) {
          setBadCountries(updatedBad);
          setEffectiveCountry(c);
          // setSrc(cm.pano_id);
          setSrc(
            `https://www.google.com/maps/embed/v1/streetview?pano=${cm.pano_id}&key=${GOOGLE_KEY}&fov=80&pitch=5&heading=0`
          );
          return;
        } else {
          updatedBad.add(c.name.common);
        }
      }

      setBadCountries(updatedBad);
      next();
    };

    tryLoad();
    return () => {
      cancelled = true;
    };
  }, [mapsGame, effectiveCountry, allCountries, badCountries, next]);

  const checkAnswer = (a: Country) => {
    if (locked) return;
    setLocked(true);
    setChosen(a.name.common);

    const isCorrect = a.name.common === effectiveCountry.name.common;
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
    const isCorrect = a.name.common === effectiveCountry.name.common;
    if (isThis && isCorrect) return `${styles.answerBtn} ${styles.correct}`;
    if (isThis && !isCorrect) return `${styles.answerBtn} ${styles.wrong}`;
    return styles.answerBtn;
  };

  return (
    <div>
      {mapsGame ? (
        src ? (
          <div className={styles.iframeContainer}>
            <iframe
              title={`Street View`}
              width="640"
              height="360"
              style={{ border: 0, borderRadius: 12 }}
              loading="lazy"
              allow="accelerometer; gyroscope; fullscreen"
              src={src}
            />
          </div>
        ) : (
          // <MapBox panoId={src} heading={0} pitch={5} />
          <div className={styles.iframeContainer}></div>
        )
      ) : (
        <img
          src={effectiveCountry.flags.svg}
          alt={effectiveCountry.flags.alt}
          className={styles.flag}
        />
      )}
      <h2>
        {locked && chosen !== effectiveCountry.name.common
          ? `Correct answer: ${effectiveCountry.name.common}`
          : ""}
      </h2>
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
