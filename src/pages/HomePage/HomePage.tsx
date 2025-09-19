import { Link } from "react-router-dom";
import styles from "./HomePage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

import { usePreloadMedia } from "../../config/usePreloadMedia";
import { MEDIA } from "../../config/media";
export default function HomePage() {
  usePreloadMedia(MEDIA, { aggressiveVideos: false }); // prefetch videos, preload posters

  return (
    <>
      <main className={styles.mainPage}>
        <section className={styles.content}>
          <img
            src="src/assets/img/logo_White.png"
            alt="logo"
            className={styles.logo}
          />
          <Link to="/countries" className={styles.link}>
            <FontAwesomeIcon icon={faGraduationCap} className={styles.icon} />
            Study countries
          </Link>
          <Link className={styles.link} to="/collection">
            <FontAwesomeIcon icon={faBookmark} className={styles.icon} />
            Collection
          </Link>
          <Link className={styles.link} to="/quiz">
            <FontAwesomeIcon icon={faFlag} className={styles.icon} />
            Quiz
          </Link>
          <Link className={styles.link} to="/leaderboard">
            <FontAwesomeIcon icon={faTrophy} className={styles.icon} />
            Leaderboard
          </Link>
        </section>

        <div className={styles.videoBackground}>
          <video autoPlay loop muted playsInline>
            <source src="src/assets/videos/earth/1.mp4" type="video/mp4" />
          </video>
        </div>
      </main>
    </>
  );
}
