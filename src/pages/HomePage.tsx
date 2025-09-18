import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main>
      <Link to="/countries">Study countries</Link>
      <Link to="/collection">Collection</Link>
      <Link to="/quiz">Quiz</Link>
      <Link to="/leaderboard">Leaderboard</Link>
    </main>
  );
}
