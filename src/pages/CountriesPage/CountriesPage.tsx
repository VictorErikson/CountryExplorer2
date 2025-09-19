import { useEffect, useState } from "react";
import Continent from "../../components/icons/Continent/Continent";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/configureStore";
import { ICONS } from "../../components/icons/Icons";
import { fetchCountries, selectRegion } from "../../redux/countriesSlice";
import type { Region } from "../../types";
import CountryCard from "../../components/icons/CountryCard/CountryCard";
import styles from "./CountriesPage.module.scss";
import { MEDIA } from "../../config/media";

export default function CountriesPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const regions: Region[] = [
    "All",
    "Europe",
    "Asia",
    "Oceania",
    "Americas",
    "Africa",
  ];

  const dispatch = useDispatch<AppDispatch>();

  const selectedRegion = useSelector(
    (state: RootState) => state.countries.region
  );
  const { video, poster } = MEDIA[selectedRegion];

  const countries = useSelector(
    (state: RootState) => state.countries.countries
  );
  useEffect(() => {
    dispatch(selectRegion("All"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCountries(selectedRegion));
  }, [dispatch, selectedRegion]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <main className={styles.main}>
      {selectedRegion === "All" ? (
        <h1>All Countrys</h1>
      ) : (
        <h1>{selectedRegion}</h1>
      )}
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
                  onClick={() => {
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
      <video
        className={styles.video}
        src={video}
        poster={poster}
        // controls
        preload="auto"
        autoPlay
        muted
        playsInline
        loop
      />
      {countries && (
        <ul>
          {countries.map((country) => (
            <CountryCard key={country.name.common} country={country} />
          ))}
        </ul>
      )}
    </main>
  );
}
