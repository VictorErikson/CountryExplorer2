import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import CountriesPage from "./pages/CountriesPage/CountriesPage";
import CountryNamePage from "./pages/CountryNamePage/CountryNamePage";
import CollectionPage from "./pages/CollectionPage";
import QuizPage from "./pages/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import GamePage from "./pages/GamePage/GamePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/countries/:countryName" element={<CountryNamePage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
