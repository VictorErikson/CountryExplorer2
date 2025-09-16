import { useNavigate } from "react-router-dom";

type CountryCardProps = {
  name: string;
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
};

export default function CountryCard({ name, flags }: CountryCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/countries/${name}`);
      }}
      style={{
        backgroundImage: `url(${flags.svg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "200px",
        height: "120px",
      }}
      aria-label={flags.alt}
    >
      {name}
    </div>
  );
}
