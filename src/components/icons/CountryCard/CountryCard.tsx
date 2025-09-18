import { useNavigate } from "react-router-dom";
import styles from "./CountryCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons";

const REGION_CLASS: string = {
  Europe: styles.europe,
  Asia: styles.asia,
  Oceania: styles.oceania,
  Americas: styles.americas,
  Africa: styles.africa,
  Antarctic: styles.antarctic,
};

type CountryCardProps = {
  name: string;
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  region: string;
};

export default function CountryCard({ name, flags, region }: CountryCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/countries/${name}`);
      }}
      className={styles.countryCard}
    >
      <div className={styles.left}>
        <img src={flags.svg} alt={flags.alt} />
        <div className={styles.info}>
          <p className={styles.title}>{name}</p>
          <p className={`${styles.region} ${REGION_CLASS[region]}`}>{region}</p>
        </div>
      </div>
      <button className={styles.likeBtn} aria-label="Like button">
        <FontAwesomeIcon icon={faHeart} className={styles.heart} />
        {/* <FontAwesomeIcon icon={heartSolid} className={styles.heart} /> */}
      </button>
    </div>
  );
}
