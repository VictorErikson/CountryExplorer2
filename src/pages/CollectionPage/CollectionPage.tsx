import { useSelector } from "react-redux";
import type { RootState } from "../../redux/configureStore";
import CountryCard from "../../components/icons/CountryCard/CountryCard";
import styles from "./CollectionPage.module.scss";
import earthVideo from "../../assets/videos/earth/1.mp4";

export default function CollectionPage() {
  const savedCountries = useSelector(
    (state: RootState) => state.countries.savedCountries
  );

  return (
    <main className={styles.collectionPage}>
      <section className={styles.content}>
        <h1>Country collection:</h1>
        {savedCountries && (
          <ul>
            {savedCountries.map((country) => (
              <div key={country.name.common}>
                <CountryCard country={country} />
              </div>
            ))}
          </ul>
        )}
        {!savedCountries && (
          <h2>You will find your favourite-marked countries here!</h2>
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
