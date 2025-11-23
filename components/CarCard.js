import { Link } from "react-router-dom";

export default function CarCard({ car, onBrandClick, onBrandInfo }) {
  const imgSrc = car.image && (car.image.toString().startsWith("http") ? car.image : `/${encodeURI(car.image)}`);

  return (
    <div className="car-card" style={{ border: "1px solid #ddd", padding: "12px", borderRadius: "8px", marginBottom: "12px" }}>
      <img
        src={imgSrc}
        alt={car.name}
        style={{ width: "100%", maxWidth: "400px", height: "auto" }}
      />
      <h3>{car.name}</h3>
      <p style={{ color: "#666" }}>{car.description}</p>
      <p style={{ fontWeight: "600" }}>${car.price}</p>
      <p style={{ fontSize: 13, color: "#444", marginTop: 6 }}>
        <strong>Brand:</strong> {car.manufacturer || "—"}
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        <Link to={`/car/${car.id}`} className="btn">View Details</Link>
        <button
          className="btn"
          onClick={() => onBrandInfo && onBrandInfo(car.manufacturer)}
          aria-label={`Info about ${car.manufacturer}`}
        >
          More from {car.manufacturer}
        </button>
      </div>
    </div>
  );
}
