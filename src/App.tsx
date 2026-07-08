import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import CountriesPage from "./pages/CountriesPage/CountriesPage";
import CountryNamePage from "./pages/CountryNamePage/CountryNamePage";
import CollectionPage from "./pages/CollectionPage/CollectionPage";
import QuizPage from "./pages/QuizPage/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage/LeaderboardPage";
import GamePage from "./pages/GamePage/GamePage";
import Footer from "./components/Footer/Footer";

function AppRoutes() {
  const { pathname } = useLocation();
  const showFooter = pathname !== "/";

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/countries/:countryName" element={<CountryNamePage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </Router>
  );
}
