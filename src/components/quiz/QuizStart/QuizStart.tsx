import { useDispatch, useSelector } from "react-redux";
import type { Region } from "../../../types";
import Continent from "../../icons/Continent/Continent";
import { ICONS } from "../../icons/Icons";
import type { AppDispatch, RootState } from "../../../redux/configureStore";
import { selectRegion } from "../../../redux/countriesSlice";
import styles from "./QuizStart.module.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../assets/img/logo_White.png";

type QuizStartProps = {
  errorMsg: string;
  startQuiz: () => void;
  changeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function QuizStart({
  errorMsg,
  startQuiz,
  changeUsername,
}: QuizStartProps) {
  const regions: Region[] = ["Europe", "Asia", "Oceania", "Americas", "Africa"];
  const selectedRegion = useSelector(
    (state: RootState) => state.countries.region
  );
  const dispatch = useDispatch<AppDispatch>();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // const changeDropdown = (value: boolean) => {
  //   setDropdownOpen(value);
  // };
  return (
    <div className={styles.startQuiz}>
      <section className={styles.section}>
        <img
          src={logo}
          alt="Logga"
          className={styles.logo}
        />

        <h1>Quiz</h1>
        <label>
          Username:
          <input type="text" onChange={(e) => changeUsername(e)} />
        </label>
        {errorMsg.length > 0 && <p>{errorMsg}</p>}
        <label>
          Select a region:
          <div className={styles.countryDropdown}>
            <Continent
              dropdownOpen={dropdownOpen}
              toggleDropdown={toggleDropdown}
            />
            {dropdownOpen && (
              <ul className={styles.dropdownList}>
                {regions.map((region) => {
                  if (region === selectedRegion) return null;
                  const iconUrl = ICONS[region];
                  return (
                    <li
                      key={region}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        dispatch(selectRegion(region));
                        setDropdownOpen(false);
                      }}
                    >
                      <img
                        className={styles.icon}
                        src={iconUrl}
                        alt={`${region} icon`}
                      />
                      {region}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </label>
        <button onClick={startQuiz} className={styles.link}>
          <FontAwesomeIcon icon={faFlag} className={styles.icon} />
          Start quiz
        </button>
      </section>
    </div>
  );
}
