import { useSelector } from "react-redux";
import type { RootState } from "../../redux/configureStore";
import styles from "./LeaderboardPage.module.scss";

export default function LeaderboardPage() {
  const leaderboard = useSelector(
    (state: RootState) => state.countries.leaderboard
  );
  const regions: Region[] = ["Europe", "Asia", "Oceania", "Americas", "Africa"];
  type Region = "Europe" | "Asia" | "Oceania" | "Americas" | "Africa";

  const calcTop3 = (region: Region) => {
    const sorted = [...leaderboard[region]].sort((a, b) => b.score - a.score);
    return sorted.slice(0, 3);
  };

  return (
    <div className={styles.leaderboardPage}>
      <section className={styles.allContent}>
        <img
          src="src/assets/img/logo_White.png"
          alt="Logga"
          className={styles.logo}
        />
        <h1>Leaderboard</h1>
        <div className={styles.content}>
          {regions.map((region) => {
            const top3 = calcTop3(region);
            if (top3.length > 0) {
              return (
                <section key={region}>
                  <h2>{region}:</h2>
                  {top3.map((score, i) => (
                    <div
                      className={styles.score}
                      key={`${region}-${score.name}-${i}`}
                    >
                      <img
                        className={styles.number}
                        src={`src/icons/${i + 1}.svg`}
                        alt={"number " + i + 1}
                      />
                      <p>
                        <span>{score.name}:</span> {score.score}p
                      </p>
                    </div>
                  ))}
                </section>
              );
            }
          })}
        </div>
      </section>
      <div className={styles.videoBackground}>
        <video autoPlay loop muted playsInline>
          <source src="src/assets/videos/earth/1.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
