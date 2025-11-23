import { useMemo, useState } from "react";
import carsData from "../data/cars";
import CarCard from "../components/CarCard";
import BrandInfoModal from "../components/BrandInfoModal";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sort, setSort] = useState("featured"); 
  const [view, setView] = useState("grid");
  const navigate = useNavigate();

  const [brandInfo, setBrandInfo] = useState("");

  const simplifyBrand = (m) => {
    if (!m) return "";
    return m.toString().replace(/[-\s]?AMG$/i, "").trim();
  };

  const handleSearch = () => {
    const q = inputValue.trim();
    // if empty, clear query and scroll to all cars
    if (q === "") {
      setQuery("");
      const el = document.getElementById("all-cars");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const lower = q.toLowerCase();
    // try to find an exact name match first
    const exact = carsData.find((c) => {
      if (!c || typeof c !== "object") return false;
      return (c.name || "").toString().toLowerCase() === lower;
    });

    if (exact) {
      navigate(`/car/${exact.id}`);
      return;
    }

    const matches = carsData.filter((c) => {
      if (!c || typeof c !== "object") return false;
      const name = (c.name || "").toString().toLowerCase();
      const desc = (c.description || "").toString().toLowerCase();
      return name.includes(lower) || desc.includes(lower);
    });

    if (matches.length === 1) {
      // navigate directly to the car details when only one match
      navigate(`/car/${matches[0].id}`);
      return;
    }

    // otherwise set the query to filter results and scroll to list
    setQuery(q);
    const el = document.getElementById("all-cars");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const featured = useMemo(() => carsData.slice(0, 6), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = carsData.filter((c) => {
      if (!c || typeof c !== "object") return false;
      const name = (c.name || "").toString().toLowerCase();
      const desc = (c.description || "").toString().toLowerCase();
      const matchesQuery = q === "" || name.includes(q) || desc.includes(q);
      const matchesPrice = typeof c.price === "number" ? c.price <= maxPrice : true;
      return matchesQuery && matchesPrice;
    });

    // Do not mutate the original array when sorting
    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [query, maxPrice, sort]);

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <h1>Find Your Next Car</h1>
          <p className="muted">Browse curated electric and sports cars — hand-picked for performance and style.</p>

          <div className="hero-ctas">
            <a href="#all-cars" className="btn hero-cta">Browse All Cars</a>
            <a href="#featured" className="btn hero-cta outline">See Featured</a>
          </div>

          <div className="search-bar">
            <input
              aria-label="Search cars"
              placeholder="Search by model or description..."
              value={inputValue}
              onChange={(e) => {
                const v = e.target.value;
                setInputValue(v);
                if (v.trim() === "") {
                  setQuery("");
                  const el = document.getElementById("all-cars");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button className="btn" onClick={handleSearch}>Search</button>

            <div className="filters">
              <label>
                Max price: ${maxPrice.toLocaleString()}
                <input
                  type="range"
                  min="20000"
                  max="200000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="featured-section">
        <h2>Featured</h2>
        <div className="featured-grid">
          {featured.map((c) => (
            <article key={c.id} className="featured-card">
              <div className="featured-media">
                <img src={c.image && c.image.toString().startsWith("http") ? c.image : `/${encodeURI(c.image)}`} alt={c.name} />
              </div>
              <div className="featured-body">
                <h3>{c.name}</h3>
                <p className="muted" style={{ marginTop: 8 }}>{c.description}</p>
                <p style={{ fontWeight: 700, marginTop: 10 }}>${c.price}</p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }} className="featured-actions">
                  <Link to={`/car/${c.id}`} className="btn">View Details</Link>
                  <Link to={`/purchase/${c.id}`} className="btn">Buy Now</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: 20 }}>
        <div className="controls" style={{ maxWidth: 1100, margin: "0 auto 16px", display: "flex", gap: 12, alignItems: "center" }}>
          <h2 style={{ marginRight: 12 }}>All Cars</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ fontSize: 14, color: "#333" }}>Sort:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button className={`btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")}>Grid</button>
            <button className={`btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>List</button>
          </div>
        </div>

        <div className={`cars-container ${view === "list" ? "list-view" : ""}`}>
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} onBrandInfo={(m) => setBrandInfo(simplifyBrand(m))} />
          ))}
          {filtered.length === 0 && (
            <p style={{ padding: 20 }}>No cars match your search/filter.</p>
          )}
        </div>
      </section>
      {brandInfo && (
        <BrandInfoModal brand={brandInfo} cars={carsData} onClose={() => setBrandInfo("")} />
      )}
    </main>
  );
}