import { useEffect, useState } from "react";
import Continent from "../components/icons/Continent";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/configureStore";
import { ICONS } from "../components/icons/Icons";
import { fetchCountries, selectRegion } from "../redux/countriesSlice";
import type { Region } from "../types";
import CountryCard from "../components/icons/CountryCard";

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
    <>
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
                    setDropdownOpen(false);
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
      {countries && (
        <ul>
          {countries.map((country) => (
            <CountryCard
              key={country.name.common}
              name={country.name.common}
              flags={country.flags}
            />
          ))}
        </ul>
      )}
    </>
  );
}
