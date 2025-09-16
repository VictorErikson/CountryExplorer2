import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/configureStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { saveCountry, type Country } from "../redux/countriesSlice";

export default function CountryNamePage() {
  const [country, setCountry] = useState<Country | null>(null);
  const { countryName } = useParams();

  const dispatch = useDispatch<AppDispatch>();

  const countries = useSelector(
    (state: RootState) => state.countries.countries
  );
  const savedCountries = useSelector(
    (state: RootState) => state.countries.savedCountries
  );

  useEffect(() => {
    localStorage.setItem("savedCountries", JSON.stringify(savedCountries));
  }, [savedCountries]);

  useEffect(() => {
    const found = countries.find(
      (country) => country.name.common === countryName
    );
    if (found) {
      setCountry(found);
    } else {
      const fetchData = async () => {
        const response = await fetch(
          BASE_URL +
            "name/" +
            countryName +
            "?fields=name,capital,currencies,maps,population,flags,region,fifa"
        );
        const json = await response.json();
        setCountry(json[0]);
      };
      fetchData();
    }
  }, [countries, countryName]);

  const firstCurrency = country && Object.values(country.currencies)[0];

  return (
    <>
      {country && (
        <div>
          <img src={country.flags.svg} alt={country.flags.alt} />
          <button onClick={() => dispatch(saveCountry(country))}>
            {savedCountries.some((c) => c.name.common === country.name.common)
              ? "Unsave"
              : "Save"}
          </button>
          <h2>{country.name.common}</h2>
          {firstCurrency && (
            <h3>
              {firstCurrency.name} ({firstCurrency.symbol})
            </h3>
          )}
          <h3>Population {country.population}</h3>
          <h3>Capital {country.capital}</h3>
          <h3>fifa: {country.fifa}</h3>
          <a href={country.maps.googleMaps}>
            Map(göra denna till en bild på google-maps?)
          </a>
        </div>
      )}
    </>
  );
}
