import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { Country } from "../../../redux/countriesSlice";
import type { RootState } from "../../../redux/configureStore";
import styles from "./Question.module.css";
import shuffle from "../../../utils/shuffle";
import { getNearestPano } from "../../../utils/getNearestPano";
import { GOOGLE_KEY } from "../../../pages/CountryNamePage/CountryNamePage";

// Prefer a single source of truth for the key
// const GOOGLE_KEY = import.meta.env.VITE_GMAPS_KEY as string;

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

  // Local state
  const [chosen, setChosen] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [effectiveCountry, setEffectiveCountry] = useState<Country>(country);
  const [answers, setAnswers] = useState<Country[]>([]);
  const [src, setSrc] = useState<string>("");
  const [badCountries, setBadCountries] = useState<Set<string>>(new Set());

  // Keep effectiveCountry in sync with incoming prop; reset src to avoid stale pano
  useEffect(() => {
    setEffectiveCountry(country);
    setSrc("");
  }, [country]);

  // Build answers whenever the effectiveCountry changes
  useEffect(() => {
    const wrong = shuffle(
      allCountries.filter((c) => c.name.common !== effectiveCountry.name.common)
    ).slice(0, 3);
    setAnswers(shuffle([...wrong, effectiveCountry]));
  }, [allCountries, effectiveCountry]);

  // Load pano for effectiveCountry; if none exists, pick a replacement country that has one
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
        return;
      }

      // Mark current as "bad" and search a replacement with pano
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
          setSrc(
            `https://www.google.com/maps/embed/v1/streetview?pano=${cm.pano_id}&key=${GOOGLE_KEY}&fov=80&pitch=5&heading=0`
          );
          return;
        } else {
          updatedBad.add(c.name.common);
        }
      }

      // None found → skip this question
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
          <iframe
            title={`Street View of ${effectiveCountry.name.common}`}
            width="640"
            height="360"
            style={{ border: 0, borderRadius: 12 }}
            loading="lazy"
            allow="accelerometer; gyroscope; fullscreen"
            src={src}
          />
        ) : null
      ) : (
        <img
          src={effectiveCountry.flags.svg}
          alt={effectiveCountry.flags.alt}
        />
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

// import { useSelector } from "react-redux";
// import type { Country } from "../../../redux/countriesSlice";
// import type { RootState } from "../../../redux/configureStore";
// import { useEffect, useState } from "react";
// import styles from "./Question.module.css";
// import shuffle from "../../../utils/shuffle";
// import { GOOGLE_KEY } from "../../../pages/CountryNamePage/CountryNamePage";
// import { getNearestPano } from "../../../utils/getNearestPano";

// export default function Question({
//   country,
//   submitAnswer,
//   next,
//   mapsGame = false,
// }: {
//   country: Country;
//   submitAnswer: (isCorrect: boolean) => void;
//   next: () => void;
//   mapsGame?: boolean;
// }) {
//   const [chosen, setChosen] = useState<string | null>(null);
//   const [locked, setLocked] = useState(false);
//   const [answers, setAnswers] = useState<Country[]>([]);
//   const [src, setSrc] = useState<string>("");
//   const [notWorkingCountries, setNotWorkingCountries] = useState<string[]>([]);

//   const allCountries = useSelector(
//     (state: RootState) => state.countries.countries
//   );

//   const coords = country.capitalInfo?.latlng ?? country.latlng;
//   const hasCoords =
//     Array.isArray(coords) &&
//     coords.length >= 2 &&
//     typeof coords[0] === "number" &&
//     typeof coords[1] === "number";

//   const lat = hasCoords ? coords[0] : null;
//   const lng = hasCoords ? coords[1] : null;

//   useEffect(() => {
//     if (lat == null || lng == null) return;
//     let cancelled = false;

//     const loadPano = async () => {
//       const meta = await getNearestPano(lat, lng, GOOGLE_KEY);
//       if (cancelled) return;

//       if (!cancelled) {
//         if (meta) {
//           setSrc(
//             `https://www.google.com/maps/embed/v1/streetview?pano=${meta.pano_id}&key=${GOOGLE_KEY}&fov=80&pitch=5&heading=0`
//           );
//         } else {
//           console.log("No pano found, falling back to location");
//           setSrc(
//             `https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_KEY}&location=${lat},${lng}&source=outdoor`
//           );
//         }
//       }
//     };

//     loadPano();

//     loadPano();
//     return () => {
//       cancelled = true;
//     };
//   }, [lat, lng]);

//   useEffect(() => {
//     const wrong = shuffle(
//       allCountries.filter((c) => c.name.common !== country.name.common)
//     ).slice(0, 3);
//     setAnswers(shuffle([...wrong, country]));
//   }, [allCountries, country]);

//   const checkAnswer = (a: Country) => {
//     if (locked) return;
//     setLocked(true);
//     setChosen(a.name.common);

//     const isCorrect = a.name.common === country.name.common;
//     submitAnswer(isCorrect);

//     setTimeout(() => {
//       setChosen(null);
//       setLocked(false);
//       next();
//     }, 2000);
//   };

//   const btnClass = (a: Country) => {
//     if (!chosen) return styles.answerBtn;
//     const isThis = chosen === a.name.common;
//     const isCorrect = a.name.common === country.name.common;
//     if (isThis && isCorrect) return `${styles.answerBtn} ${styles.correct}`;
//     if (isThis && !isCorrect) return `${styles.answerBtn} ${styles.wrong}`;
//     return styles.answerBtn;
//   };

//   return (
//     <div>
//       {mapsGame ? (
//         src ? (
//           <iframe
//             title={`Street View of ${country.name.common}`}
//             width="640"
//             height="360"
//             style={{ border: 0, borderRadius: 12 }}
//             loading="lazy"
//             allow="accelerometer; gyroscope; fullscreen"
//             src={src}
//           />
//         ) : null
//       ) : (
//         <img src={country.flags.svg} alt={country.flags.alt} />
//       )}

//       <div className={styles.answers}>
//         {answers.map((a) => (
//           <button
//             key={a.name.common}
//             className={btnClass(a)}
//             onClick={() => checkAnswer(a)}
//             disabled={locked}
//           >
//             {a.name.common}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
