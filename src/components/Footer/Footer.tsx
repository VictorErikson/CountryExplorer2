import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Footer.module.scss";
import {
  faBookmark,
  faFlag,
  faGraduationCap,
  faHouseChimney,
  faMapLocationDot,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.countries}>
        <NavLink
          to="/countries"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {({ isActive }) => (
            <>
              <div className={styles.iconCont}>
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  className={styles.icon}
                />
              </div>
              <span>Study</span>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.collection}>
        <NavLink
          to="/collection"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {({ isActive }) => (
            <>
              <div className={styles.iconCont}>
                <FontAwesomeIcon icon={faBookmark} className={styles.icon} />
              </div>
              <span>Collection</span>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.home}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {({ isActive }) => (
            <>
              <div className={styles.iconCont}>
                <FontAwesomeIcon
                  icon={faHouseChimney}
                  className={styles.icon}
                />
              </div>
              <span>Home</span>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.game}>
        <NavLink
          to="/game"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {({ isActive }) => (
            <>
              <div className={styles.iconCont}>
                <FontAwesomeIcon
                  icon={faMapLocationDot}
                  className={styles.icon}
                />
              </div>
              <span>Explore Game</span>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.quiz}>
        <NavLink
          to="/quiz"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {({ isActive }) => (
            <>
              <div className={styles.iconCont}>
                <FontAwesomeIcon icon={faFlag} className={styles.icon} />
              </div>
              <span>Quiz</span>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.leaderboard}>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {({ isActive }) => (
            <>
              <div className={styles.iconCont}>
                <FontAwesomeIcon icon={faTrophy} className={styles.icon} />
              </div>
              <span>Leaderboard</span>
            </>
          )}
        </NavLink>
      </div>
    </footer>
  );
}
