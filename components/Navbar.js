import { Link } from "react-router-dom";

export default function Navbar({ cartCount }) {
  return (
    <div className="navbar">
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Car Store
      </Link>

      <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
        Cart ({cartCount})
      </Link>
    </div>
  );
}