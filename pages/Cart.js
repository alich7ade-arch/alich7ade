import { Link } from "react-router-dom";

export default function Cart({ cart, removeFromCart }) {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Cart</h1>

      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.map((car, index) => (
        <div key={index} className="car-card" style={{ marginTop: "20px" }}>
          <img src={car.image && (car.image.startsWith("http") ? car.image : `/${encodeURI(car.image)}`)} width="200" alt={car.name} />
          <h2>{car.name}</h2>
          <p>${car.price}</p>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button className="btn" onClick={() => removeFromCart(index)}>
              Remove
            </button>
            <Link className="btn" to={`/purchase/${car.id}`}>
              Buy
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}