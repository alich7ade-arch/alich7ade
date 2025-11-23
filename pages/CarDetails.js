import { useParams, Link } from "react-router-dom";
import cars from "../data/cars";

export default function CarDetails({ addToCart }) {
  const { id } = useParams();
  const car = cars.find((c) => c.id === parseInt(id));

  if (!car) {
    return (
      <div style={{ padding: 30 }}>
        <h1>Car not found</h1>
        <p>The car you requested does not exist.</p>
        <Link to="/" className="btn" style={{ marginTop: 12 }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div>
        <img
          src={car.image && (car.image.startsWith("http") ? car.image : `/${encodeURI(car.image)}`)}
          alt={car.name}
        />
      </div>

      <div className="details-box">
        <h1>{car.name}</h1>
        <p style={{ marginTop: 8 }}>{car.description}</p>

        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          <div>
            <strong>Manufacturer:</strong>
            <div>{car.manufacturer || '—'}</div>
          </div>

          <div>
            <strong>Year:</strong>
            <div>{car.year || '—'}</div>
          </div>

          <div>
            <strong>Transmission:</strong>
            <div>{car.transmission || '—'}</div>
          </div>

          <div>
            <strong>Mileage:</strong>
            <div>{car.mileage ? `${car.mileage.toLocaleString()} km` : '—'}</div>
          </div>

          <div>
            <strong>Fuel:</strong>
            <div>{car.fuel || '—'}</div>
          </div>

          <div>
            <strong>Seats:</strong>
            <div>{car.seats || '—'}</div>
          </div>

          <div>
            <strong>Horsepower:</strong>
            <div>{car.horsepower ? `${car.horsepower} hp` : '—'}</div>
          </div>

          <div>
            <strong>Color:</strong>
            <div>{car.color || '—'}</div>
          </div>
        </div>

        <h2 className="details-price">${car.price.toLocaleString()}</h2>

        {Array.isArray(car.features) && car.features.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <strong>Features</strong>
            <ul>
              {car.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
          <button className="btn" onClick={() => addToCart(car)}>Add to Cart</button>
          <Link to={`/purchase/${car.id}`} className="btn">Buy Now</Link>
          <Link to="/" className="btn" style={{ background: '#666' }}>Back</Link>
        </div>
      </div>
    </div>
  );
}