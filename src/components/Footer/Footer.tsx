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
import { NavLink, useLocation } from "react-router-dom";

const routes = [
  "/countries",
  "/collection",
  "/",
  "/game",
  "/quiz",
  "/leaderboard",
];

export default function Footer() {
  const { pathname } = useLocation();

  const normalized = pathname.startsWith("/countries")
    ? "/countries"
    : pathname;

  let slot = routes.findIndex((r) => r === normalized);
  if (slot < 0) slot = 2; 

  const isGameOrQuiz = pathname.startsWith("/game") || pathname.startsWith("/quiz");

  return (
    <footer className={styles.footer}>
      <div
        className={
          isGameOrQuiz
            ? `${styles.background} ${styles.dimmed}`
            : styles.background
        }
      >
        <div
          className={styles.track}
          style={{ ["--slot" as any]: String(slot) }}
        >
          <div>
            <NavLink
              to="/countries"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <div className={styles.iconCont}>
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  className={styles.icon}
                />
              </div>
              <span>Study</span>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <div className={styles.iconCont}>
                <FontAwesomeIcon icon={faBookmark} className={styles.icon} />
              </div>
              <span>Collection</span>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <div className={styles.iconCont}>
                <FontAwesomeIcon
                  icon={faHouseChimney}
                  className={styles.icon}
                />
              </div>
              <span>Home</span>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/game"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <div className={styles.iconCont}>
                <FontAwesomeIcon
                  icon={faMapLocationDot}
                  className={styles.icon}
                />
              </div>
              <span>Game</span>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/quiz"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <div className={styles.iconCont}>
                <FontAwesomeIcon icon={faFlag} className={styles.icon} />
              </div>
              <span>Quiz</span>
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              <div className={styles.iconCont}>
                <FontAwesomeIcon icon={faTrophy} className={styles.icon} />
              </div>
              <span>Leaderboard</span>
            </NavLink>
          </div>

          {/* Sliding wave */}
          <svg
            className={styles.wave}
            viewBox="0 0 3127 753"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M2.083,451.655c905.263,0 1010.53,-21.053 1108.77,-266.667c98.246,-245.614 316.434,-215.567 405.491,-75.621c98.245,154.386 159.97,245.698 260.884,255.854c85.285,2.073 1100.17,66.274 1226.67,64.537c123.017,233.714 120.988,320.376 120.988,320.376l-3031.55,-16.101c0,0 -71.332,-89.255 -91.262,-282.378Z" />
          </svg>
        </div>
      </div>
    </footer>
  );
}
