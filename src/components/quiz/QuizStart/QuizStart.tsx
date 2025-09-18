import { useDispatch, useSelector } from "react-redux";
import type { Region } from "../../../types";
import Continent from "../../icons/Continent/Continent";
import { ICONS } from "../../icons/Icons";
import type { AppDispatch, RootState } from "../../../redux/configureStore";
import { selectRegion } from "../../../redux/countriesSlice";

type QuizStartProps = {
  errorMsg: string;
  dropdownOpen: boolean;
  toggleDropdown: () => void;
  startQuiz: () => void;
  changeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeDropdown: (value: boolean) => void;
};

export default function QuizStart({
  errorMsg,
  dropdownOpen,
  toggleDropdown,
  startQuiz,
  changeUsername,
  changeDropdown,
}: QuizStartProps) {
  const regions: Region[] = ["Europe", "Asia", "Oceania", "Americas", "Africa"];
  const selectedRegion = useSelector(
    (state: RootState) => state.countries.region
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="startQuiz">
      <img src={"null"} alt="Logga" />
      <h1>Quiz</h1>
      <label>
        Username:
        <input type="text" onChange={(e) => changeUsername(e)} />
      </label>
      {errorMsg.length > 0 && <p>{errorMsg}</p>}
      <label>Select a region:</label>
      <div className="country-dropdown">
        <Continent
          dropdownOpen={dropdownOpen}
          toggleDropdown={toggleDropdown}
        />
        {dropdownOpen && (
          <ul className="dropdown-list">
            {regions.map((region) => {
              if (region === selectedRegion) return null;
              const Icon = ICONS[region];
              return (
                <li
                  key={region}
                  onClick={() => {
                    dispatch(selectRegion(region));
                    changeDropdown(false);
                  }}
                >
                  <Icon className="continent-component" />
                  {region}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <button onClick={startQuiz}>Start quiz!</button>
    </div>
  );
}
