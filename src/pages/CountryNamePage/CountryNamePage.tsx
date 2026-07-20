import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/configureStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch, adaptCountry, RESPONSE_FIELDS, type ApiResponse } from "../../config/api";
import { saveCountry, upsertCountries, type Country } from "../../redux/countriesSlice";
import CountryCard from "../../components/icons/CountryCard/CountryCard";
import styles from "./CountryNamePage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons";
import bgVideo from "../../assets/videos/earth/1.mp4";
import { sleep, backoffDelay } from "../../utils/retry";
import BackButton from "../../components/BackButton/BackButton";

type ConvertResponse = {
  success: boolean;
  terms: string;
  privacy: string;
  query: { from: string; to: string; amount: number };
  info: { timestamp: number; quote: number };
  result: number;
};

type CountryFetchResult =
  | { status: "ok"; country: Country }
  | { status: "not-found" }
  | { status: "aborted" };

// Keeps retrying a country lookup — with exponential backoff so a
// rate-limited API doesn't get hammered — until it succeeds, the country
// definitively doesn't exist, or the caller aborts (e.g. user navigated
// away). `onRetrying` fires once per failed attempt, before the backoff
// wait, so callers can surface "still trying" feedback.
async function fetchCountryWithRetry(
  query: string,
  signal: AbortSignal,
  onRetrying?: () => void
): Promise<CountryFetchResult> {
  let attempt = 0;
  while (!signal.aborted) {
    try {
      const res = await apiFetch(
        `${query}?response_fields=${RESPONSE_FIELDS}`,
        { signal }
      );
      if (res.ok) {
        const json: ApiResponse = await res.json();
        const raw = json.data.objects[0];
        return raw
          ? { status: "ok", country: adaptCountry(raw) }
          : { status: "not-found" }; // no such country — not retryable
      }
      if (res.status === 404) return { status: "not-found" };
      // otherwise (429, 5xx, ...) fall through and retry
    } catch {
      if (signal.aborted) return { status: "aborted" };
      // network/CORS error — this is what a rate-limited preflight looks
      // like from the browser's side — retry
    }

    onRetrying?.();
    attempt++;
    await sleep(backoffDelay(attempt), signal);
  }
  return { status: "aborted" };
}

export default function CountryNamePage() {
  const [country, setCountry] = useState<Country | null>(null);
  const [countryLoading, setCountryLoading] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [countryNotFound, setCountryNotFound] = useState(false);
  const { countryName } = useParams();
  const [neighbors, setNeighbors] = useState<Country[]>([]);
  const [neighborsLoading, setNeighborsLoading] = useState(false);
  const [googleImg, setGoogleImg] = useState("");
  const [rate, setRate] = useState<number | null>(null);
  const KEY = "12bc801a1fa18594812963f7da6d1646";

  const dispatch = useDispatch<AppDispatch>();

  const countries = useSelector(
    (state: RootState) => state.countries.countries
  );
  const savedCountries = useSelector(
    (state: RootState) => state.countries.savedCountries
  );

  useEffect(() => {
    if (!country?.borders || country.borders.length === 0) {
      setNeighbors([]);
      setNeighborsLoading(false);
      return;
    }

    const controller = new AbortController();
    setNeighborsLoading(true);

    const fetchData = async () => {
      const fetchedFromNetwork: Country[] = [];

      const results = await Promise.all(
        country.borders.map(async (code) => {
          // Reuse whatever's already in the redux cache instead of
          // re-fetching every neighbor over the network on every visit —
          // the API rate-limits aggressively on bursts of parallel requests.
          const cached = countries.find((c) => c.cca3 === code);
          if (cached) return cached;

          const result = await fetchCountryWithRetry(
            `codes.alpha_3/${code}`,
            controller.signal
          );
          if (result.status === "ok") {
            fetchedFromNetwork.push(result.country);
            return result.country;
          }
          return undefined;
        })
      );

      if (!controller.signal.aborted) {
        setNeighbors(results.filter((c): c is Country => c !== undefined));
        setNeighborsLoading(false);
        // Feed anything freshly fetched back into the shared cache so
        // other pages/future visits don't have to fetch it again.
        if (fetchedFromNetwork.length > 0) dispatch(upsertCountries(fetchedFromNetwork));
      }
    };

    fetchData();
    return () => {
      controller.abort();
    };
  }, [country, countries, dispatch]);

  useEffect(() => {
    const found = countries.find(
      (country) => country.name.common === countryName
    );
    if (found) {
      setCountry(found);
      setCountryLoading(false);
      setCountryError(false);
      setCountryNotFound(false);
      return;
    }

    setCountry(null);
    setCountryLoading(true);
    setCountryError(false);
    setCountryNotFound(false);

    // The page's own country is the priority fetch — it's debounced
    // briefly (so quick successive navigations don't each fire a request)
    // then retried with backoff until it succeeds. Neighbors only start
    // once `country` state is actually set, via the effect above.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      const fetchData = async () => {
        const result = await fetchCountryWithRetry(
          `names.common/${countryName}`,
          controller.signal,
          () => setCountryError(true)
        );

        if (result.status === "ok") {
          setCountry(result.country);
          setCountryLoading(false);
          setCountryError(false);
          dispatch(upsertCountries([result.country]));
        } else if (result.status === "not-found") {
          setCountryLoading(false);
          setCountryError(false);
          setCountryNotFound(true);
        }
        // "aborted" — a newer navigation superseded this one; leave state
        // alone, the newer effect run owns it now.
      };
      fetchData();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [countries, countryName, dispatch]);

  useEffect(() => {
    if (!country?.name) return;
    setGoogleImg(staticMapForCountry(country.name.common));
  }, [country?.name.common]);

  const firstCurrency = country && Object.values(country.currencies)[0];
  const [code] = Object.keys(country?.currencies ?? {});

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!code) return;

      if (code === "EUR") {
        if (!cancelled) setRate(null);
        return;
      }

      try {
        const res: ConvertResponse = await fetch(
          `https://api.exchangerate.host/convert?access_key=${KEY}&from=EUR&to=${code}&amount=1`
        ).then((r) => r.json());

        if (!cancelled) setRate(res.result);
      } catch {
        if (!cancelled) setRate(null);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [code, KEY]);

  function staticMapForCountry(country: string) {
    const params = new URLSearchParams({
      center: country,
      zoom: "5",
      size: "640x360",
      scale: "2",
      maptype: "roadmap",
      key: import.meta.env.VITE_GMAPS_KEY,
    });
    return `https://maps.googleapis.com/maps/api/staticmap?${params}`;
  }

  return (
    <>
      <BackButton to="/countries" />
      {!country && countryLoading && (
        <main className={styles.countryNameMain}>
          <p className={styles.loading}>
            {countryError
              ? "Couldn't load this country — retrying…"
              : "Loading country…"}
          </p>
        </main>
      )}
      {!country && !countryLoading && countryNotFound && (
        <main className={styles.countryNameMain}>
          <p className={styles.loading}>Country not found.</p>
        </main>
      )}
      {country && (
        <main className={styles.countryNameMain}>
          <section className={styles.content}>
            <div className={styles.country}>
              <div className={styles.flagCont}>
                <div className={styles.flag}>
                  <img
                    src={country.flags.svg}
                    alt={country.flags.alt}
                    className={styles.flag}
                    onLoad={() => window.dispatchEvent(new Event("resize"))}
                  />
                </div>
                <button
                  className={styles.likeBtn}
                  aria-label="Like button"
                  onClick={() => {
                    dispatch(saveCountry(country));
                  }}
                >
                  {savedCountries.some(
                    (c) => c.name.common === country.name.common
                  ) ? (
                    <FontAwesomeIcon
                      icon={heartSolid}
                      className={styles.heartLiked}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faHeart} className={styles.heart} />
                  )}
                </button>
              </div>
              <div className={styles.middle}>
                <div className={styles.info}>
                  <h2>{country.name.common}</h2>
                  <div className={styles.infobox}>
                    <h3>
                      <span>Capital: </span>
                      {country.capital}
                    </h3>
                    <h3>
                      <span>Population: </span>
                      {country.population}p
                    </h3>
                    {firstCurrency && (
                      <>
                        <h3>
                          <span>Currency: </span>
                          {firstCurrency.name} ({firstCurrency.symbol})
                        </h3>

                        {rate != null && (
                          <h3>
                            <span>1 Euro: </span>
                            {rate.toFixed(2)}
                            {firstCurrency.symbol}
                          </h3>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <a
                  href={country.maps.googleMaps}
                  className={styles.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {googleImg ? (
                    <img
                      src={googleImg}
                      alt={`Map of ${country.name.common}`}
                      className={styles.map}
                    />
                  ) : (
                    <span>Loading map…</span>
                  )}
                </a>
              </div>
            </div>
            {(country.borders?.length ?? 0) === 0 && (
              <p className={styles.loading}>This country has no land borders.</p>
            )}
            {neighborsLoading && neighbors.length === 0 && (
              <p className={styles.loading}>Loading neighboring countries…</p>
            )}
            {!neighborsLoading &&
              neighbors.length === 0 &&
              (country.borders?.length ?? 0) > 0 && (
                <p className={styles.loading}>
                  No data available for neighboring countries.
                </p>
              )}
            {neighbors.length > 0 && (
              <section className={styles.neighborsSection}>
                <h2>Neighboring countries:</h2>
                <ul
                  className={`${styles.neighbors} ${
                    neighbors.length > 1 ? styles.twoCols : ""
                  }`}
                >
                  {neighbors.map((neighbor) => (
                    <CountryCard
                      country={neighbor}
                      key={neighbor.name.common}
                    />
                  ))}
                </ul>
              </section>
            )}
          </section>
          <div className={styles.videoBackground}>
            <video autoPlay loop muted playsInline>
              <source src={bgVideo} type="video/mp4" />
            </video>
          </div>
        </main>
      )}
    </>
  );
}
