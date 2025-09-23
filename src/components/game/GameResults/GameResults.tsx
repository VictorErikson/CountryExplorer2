import { Link } from "react-router-dom";
import styles from "./GameResults.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

type GameResultsProps = {
  score: number;
  restart: () => void;
};

export default function GameResults({ score, restart }: GameResultsProps) {
  return (
    <div className={styles.GameResults}>
      <img
        src="src/assets/img/logo_White.png"
        alt="Logga"
        className={styles.logo}
      />
      <h2>Final score: {score}/15</h2>

      <div className={styles.menu}>
        <Link to="/" className={styles.link}>
          <FontAwesomeIcon icon={faHouseChimney} className={styles.icon} />
          Home
        </Link>
        <button onClick={restart} className={styles.link}>
          <FontAwesomeIcon icon={faMapLocationDot} className={styles.icon} />
          Play again
        </button>
      </div>
    </div>
  );
}
