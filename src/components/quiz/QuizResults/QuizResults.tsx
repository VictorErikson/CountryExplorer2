import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/configureStore";
import { saveResult, type UserScore } from "../../../redux/countriesSlice";
import { Link } from "react-router-dom";

type QuizResultsProps = {
  score: number;
  name: string;
  restart: () => void;
};

export default function QuizResults({
  score,
  name,
  restart,
}: QuizResultsProps) {
  const [newRecord, setNewRecord] = useState(false);
  const [top3, setTop3] = useState<UserScore[]>([]);
  const leaderboard = useSelector(
    (state: RootState) => state.countries.leaderboard
  );
  const region = useSelector((state: RootState) => state.countries.region);
  const savedOnce = useRef(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (savedOnce.current) return;
    savedOnce.current = true;

    dispatch(saveResult({ region, entry: { name, score } }));
  }, [dispatch, region, name, score]);

  useEffect(() => {
    const sorted = [...leaderboard[region]].sort((a, b) => b.score - a.score);
    const top = sorted.slice(0, 3);
    setTop3(top);
    setNewRecord(top.some((u) => u.name === name && u.score === score));
  }, [leaderboard, region, name, score]);

  useEffect(() => {
    localStorage.setItem("savedLeaderboard", JSON.stringify(leaderboard));
  }, [leaderboard]);

  return (
    <div className="QuizResults">
      <img src={"null"} alt="Logga" />
      <h2>Final score: {score}/15</h2>
      {newRecord && (
        <h3>Congratulations, you made it top 3 on the {region}-leaderboard!</h3>
      )}
      <div className="leaderboard">
        <h3>{region}, highscore:</h3>
        {top3 &&
          top3.map((score: UserScore, i) => (
            <div className="score">
              <p className="number">{i + 1}</p>
              <p>
                <span>{score.name}:</span> {score.score}
              </p>
            </div>
          ))}
      </div>
      <div className="menu">
        <Link to="/">Home</Link>
        <button onClick={restart}>Play again!</button>
      </div>
    </div>
  );
}
