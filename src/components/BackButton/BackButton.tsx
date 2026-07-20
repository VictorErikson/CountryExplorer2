import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from "./BackButton.module.scss";

type BackButtonProps = {
  to: string;
};

export default function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={styles.backBtn}
      aria-label="Go back"
      onClick={() => navigate(to)}
    >
      <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
      <span>Back</span>
    </button>
  );
}
