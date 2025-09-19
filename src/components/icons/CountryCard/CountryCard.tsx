import { useNavigate } from "react-router-dom";
import styles from "./CountryCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons";
import type { AppDispatch, RootState } from "../../../redux/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { saveCountry, type Country } from "../../../redux/countriesSlice";

const REGION_CLASS: string = {
  Europe: styles.europe,
  Asia: styles.asia,
  Oceania: styles.oceania,
  Americas: styles.americas,
  Africa: styles.africa,
  Antarctic: styles.antarctic,
};

type CountryCardProps = {
  country: Country;
};

export default function CountryCard({ country }: CountryCardProps) {
  const { name, flags, region, capital } = country;

  const selectedRegion = useSelector(
    (state: RootState) => state.countries.region
  );
  const savedCountries = useSelector(
    (state: RootState) => state.countries.savedCountries
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div
      onClick={() => {
        navigate(`/countries/${name.common}`);
      }}
      className={styles.countryCard}
    >
      <div className={styles.left}>
        <img src={flags.svg} alt={flags.alt} />
        <div className={styles.info}>
          <p className={styles.title}>{name.common}</p>
          {selectedRegion === "All" ? (
            <p className={`${styles.region} ${REGION_CLASS[region]}`}>
              {region}
            </p>
          ) : (
            <p className={`${styles.region} ${REGION_CLASS[region]}`}>
              {capital[0]}
            </p>
          )}
        </div>
      </div>
      <button
        className={styles.likeBtn}
        aria-label="Like button"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(saveCountry(country));
        }}
      >
        {savedCountries.some(
          (country) => country.name.common === name.common
        ) ? (
          <FontAwesomeIcon icon={heartSolid} className={styles.heart} />
        ) : (
          <FontAwesomeIcon icon={faHeart} className={styles.heart} />
        )}
      </button>
    </div>
  );
}
