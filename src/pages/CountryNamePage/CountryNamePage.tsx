import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/configureStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config/api";
import { saveCountry, type Country } from "../../redux/countriesSlice";
import CountryCard from "../../components/icons/CountryCard/CountryCard";
import styles from "./CountryNamePage.module.scss";
import FitText from "../../utils/FitText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons";

export default function CountryNamePage() {
  const [country, setCountry] = useState<Country | null>(null);
  const { countryName } = useParams();
  const [neighbors, setNeighbors] = useState<Country[]>([]);
  const [googleImg, setGoogleImg] = useState("");
  const GOOGLE_KEY = "AIzaSyAIP9n7rVJZXLDB81HvftDMIbwPDCoDp0E";

  const dispatch = useDispatch<AppDispatch>();

  const countries = useSelector(
    (state: RootState) => state.countries.countries
  );
  const savedCountries = useSelector(
    (state: RootState) => state.countries.savedCountries
  );

  useEffect(() => {
    localStorage.setItem("savedCountries", JSON.stringify(savedCountries));
  }, [savedCountries]);

  useEffect(() => {
    if (!country?.borders) return;
    const neighborsString = country?.borders.join(",");

    const fetchData = async () => {
      const response = await fetch(
        BASE_URL +
          "alpha?codes=" +
          neighborsString +
          "&fields=name,capital,currencies,maps,population,flags,region,cca3,borders"
      );
      const json = await response.json();
      setNeighbors(json);
    };

    if (country) {
      fetchData();
    }
  }, [country]);

  useEffect(() => {
    const found = countries.find(
      (country) => country.name.common === countryName
    );
    if (found) {
      setCountry(found);
    } else {
      const fetchData = async () => {
        const response = await fetch(
          BASE_URL +
            "name/" +
            countryName +
            "?fullText=true&fields=name,capital,currencies,maps,population,flags,region,cca3,borders"
        );
        const json = await response.json();
        setCountry(json[0]);
      };
      fetchData();
    }
  }, [countries, countryName]);

  useEffect(() => {
    if (!country?.name) return;
    setGoogleImg(staticMapForCountry(country.name.common, GOOGLE_KEY));
  }, [country?.name.common, GOOGLE_KEY]);

  const firstCurrency = country && Object.values(country.currencies)[0];

  //Skapa kart-bilden
  function staticMapForCountry(country: string, key: string) {
    const params = new URLSearchParams({
      center: country, // Google will geocode the name
      zoom: "5", // tune per your design
      size: "640x360",
      scale: "2",
      maptype: "roadmap",
      key,
    });
    return `https://maps.googleapis.com/maps/api/staticmap?${params}`;
  }

  return (
    <>
      {country && (
        <main className={styles.main}>
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
              <FitText className={styles.fifa}>{country.cca3}</FitText>
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
                  <FontAwesomeIcon icon={heartSolid} className={styles.heart} />
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
                    <h3>
                      <span>Currency: </span>
                      {firstCurrency.name} ({firstCurrency.symbol})
                    </h3>
                  )}
                </div>
              </div>

              <a href={country.maps.googleMaps} className={styles.mapLink}>
                {googleImg ? (
                  <img
                    src={googleImg}
                    alt={`Map of ${country.name}`}
                    className={styles.map}
                  />
                ) : (
                  <span>Loading map…</span>
                )}
              </a>
            </div>
          </div>
          {neighbors.length > 0 && (
            <section className={styles.neighborsSection}>
              <h2>Neighboring countries:</h2>
              <div className={styles.neighbors}>
                {neighbors.map((neighbor) => (
                  <CountryCard country={neighbor} key={neighbor.name.common} />
                ))}
              </div>
            </section>
          )}
        </main>
      )}
    </>
  );
}
