import { useSelector } from "react-redux";
import { ICONS } from "./Icons";
import type { RootState } from "../../redux/configureStore";

type ContinentProps = {
  dropdownOpen: boolean;
  toggleDropdown: () => void;
};
export default function Continent({
  dropdownOpen,
  toggleDropdown,
}: ContinentProps) {
  // const regions = ["Europe", "Asia", "Oceania", "Americas", "Africa"];
  const region = useSelector((state: RootState) => state.countries.region);
  const Icon = ICONS[region];
  return (
    <button
      className="dropdown-toggle"
      aria-label="Välj land"
      type="button"
      onClick={toggleDropdown}
    >
      <Icon className="continent-component" />
      {region}
      {dropdownOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#ffffff"
        >
          <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#ffffff"
        >
          <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
        </svg>
      )}
    </button>
  );
}
