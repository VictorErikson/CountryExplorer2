import { useSelector } from "react-redux";
import type { RootState } from "../redux/configureStore";
import CountryCard from "../components/icons/CountryCard";

export default function CollectionPage() {
  const savedCountries = useSelector(
    (state: RootState) => state.countries.savedCountries
  );

  return (
    <div>
      <h1>Country collection:</h1>
      {savedCountries.map((country) => (
        <div key={country.name.common}>
          <CountryCard name={country.name.common} flags={country.flags} />
        </div>
      ))}
    </div>
  );
}
