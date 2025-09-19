import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/configureStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config/api";
import { saveCountry, type Country } from "../redux/countriesSlice";
import CountryCard from "../components/icons/CountryCard/CountryCard";

export default function CountryNamePage() {
  const [country, setCountry] = useState<Country | null>(null);
  const { countryName } = useParams();
  const [neighbors, setNeighbors] = useState<Country[]>([]);

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
    if (!country?.borders) return;
    const neighborsString = country?.borders.join(",");

    const fetchData = async () => {
      const response = await fetch(
        BASE_URL +
          "alpha?codes=" +
          neighborsString +
          "&fields=name,capital,currencies,maps,population,flags,region,fifa,borders"
      );
      const json = await response.json();
      setNeighbors(json);
    };

    if (country) {
      fetchData();
    }
  }, [country]);

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
            "?fields=name,capital,currencies,maps,population,flags,region,fifa,borders"
        );
        const json = await response.json();
        setCountry(json[0]);
      };
      fetchData();
    }
  }, [countries, countryName]);

  const firstCurrency = country && Object.values(country.currencies)[0];

  function staticMapForCountry(country: string, key: string) {
    const params = new URLSearchParams({
      center: country, // Google will geocode the name
      zoom: "4", // tune per your design
      size: "640x360",
      scale: "2",
      maptype: "roadmap",
      key,
    });
    return `https://maps.googleapis.com/maps/api/staticmap?${params}`;
  }

  function staticMapUrl(
    center: { lat?: number; lng?: number; zoom?: number; query?: string },
    key: string,
    { width = 640, height = 360, maptype = "roadmap" } = {}
  ) {
    const params = new URLSearchParams({
      size: `${width}x${height}`,
      scale: "2",
      maptype,
      key,
    });
    if (center.lat != null && center.lng != null) {
      params.set("center", `${center.lat},${center.lng}`);
      params.set("zoom", String(center.zoom ?? 4));
    } else if (center.query) {
      params.set("center", center.query);
      params.set("zoom", "4");
    } else {
      throw new Error("No center found");
    }
    return `https://maps.googleapis.com/maps/api/staticmap?${params}`;
  }

  async function mapFromShortLink(shortUrl: string, key: string) {
    const expanded = await expandGoo(shortUrl);
    const parsed = parseMapsUrl(expanded);
    if (!parsed) throw new Error("Could not parse expanded Maps URL");
    return staticMapUrl(parsed, key);
  }
  // Usage:
  // const imgSrc = await mapFromShortLink("https://goo.gl/maps/Z8mQ6jxnRQKFwJy9A", GOOGLE_KEY);
  // <img src={imgSrc} alt="Country map" />

  return (
    <>
      {country && (
        <div>
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
          {neighbors.length > 0 && (
            <div className="neighbors">
              {neighbors.map((neighbor) => (
                <CountryCard country={neighbor} key={neighbor.name.common} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

//sjajs
