import { useSelector } from "react-redux";
import type { RootState } from "../redux/configureStore";

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
    <div className="leaderboardPage">
      <h1>Leaderboard</h1>
      {regions.map((region) => {
        const top3 = calcTop3(region);
        if (top3.length > 0) {
          return (
            <section key={region}>
              <h2>{region}:</h2>
              {top3.map((score, i) => (
                <div className="score" key={`${region}-${score.name}-${i}`}>
                  <div className="number">{i + 1}</div>
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
  );
}
