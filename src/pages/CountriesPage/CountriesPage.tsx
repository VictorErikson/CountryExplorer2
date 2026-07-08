import { useEffect, useState } from "react";
import Continent from "../../components/icons/Continent/Continent";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/configureStore";
import { ICONS } from "../../components/icons/Icons";
import { fetchCountries, selectCountriesForRegion, selectRegion } from "../../redux/countriesSlice";
import type { Region } from "../../types";
import CountryCard from "../../components/icons/CountryCard/CountryCard";
import styles from "./CountriesPage.module.scss";
import { MEDIA } from "../../config/media";
import earthVideo from "../../assets/videos/earth/1.mp4";

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

  const countries = useSelector((state: RootState) =>
    selectCountriesForRegion(state.countries)
  );
  const status = useSelector((state: RootState) => state.countries.status);

  useEffect(() => {
    dispatch(selectRegion("Europe"));
  }, [dispatch]);

  useEffect(() => {
    const promise = dispatch(fetchCountries(selectedRegion));
    return () => {
      promise.abort();
    };
  }, [dispatch, selectedRegion]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <main className={styles.main}>
      <section className={styles.content}>
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
        <div className="videoCont">
          <video
            className={styles.video}
            src={video}
            poster={poster}
            preload="auto"
            autoPlay
            muted
            playsInline
            loop
          />
        </div>
        {status === "Loading" && countries.length === 0 && (
          <p className={styles.loading}>Loading countries…</p>
        )}
        {status === "Failed" && countries.length === 0 && (
          <p className={styles.loading}>
            Couldn't load countries — retrying…
          </p>
        )}
        {countries.length > 0 && (
          <ul>
            {countries.map((country) => (
              <CountryCard key={country.name.common} country={country} />
            ))}
          </ul>
        )}
      </section>
      <div className={styles.videoBackground}>
        <video autoPlay loop muted playsInline>
          <source src={earthVideo} type="video/mp4" />
        </video>
      </div>
    </main>
  );
}
