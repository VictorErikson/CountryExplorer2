import { useSelector } from "react-redux";
import type { RootState } from "../redux/configureStore";
import CountryCard from "../components/icons/CountryCard/CountryCard";

export default function CollectionPage() {
  const savedCountries = useSelector(
    (state: RootState) => state.countries.savedCountries
  );

  return (
    <div>
      <h1>Country collection:</h1>
      {savedCountries.map((country) => (
        <div key={country.name.common}>
          <CountryCard country={country} />
        </div>
      ))}
    </div>
  );
}
