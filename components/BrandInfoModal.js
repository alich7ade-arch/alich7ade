import React from "react";

function simplifyBrand(m) {
  if (!m) return "";
  return m.toString().replace(/[-\s]?AMG$/i, "").trim();
}

export default function BrandInfoModal({ brand, cars = [], onClose }) {
  if (!brand) return null;

  const carsForBrand = cars.filter((c) => simplifyBrand(c.manufacturer).toLowerCase() === brand.toLowerCase());
  const count = carsForBrand.length;
  const years = carsForBrand.map((c) => c.year).filter(Boolean);
  const minYear = years.length ? Math.min(...years) : null;
  const maxYear = years.length ? Math.max(...years) : null;

  // Best car = highest horsepower, fallback to price
  const bestCar = carsForBrand.slice().sort((a, b) => (b.horsepower || 0) - (a.horsepower || 0))[0] || null;

  // Aggregate features
  const featureCounts = {};
  carsForBrand.forEach((c) => {
    (c.features || []).forEach((f) => {
      featureCounts[f] = (featureCounts[f] || 0) + 1;
    });
  });
  const topFeatures = Object.entries(featureCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map((t) => t[0]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 8, maxWidth: 900, width: "95%", maxHeight: "90%", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>{brand} — Brand Overview</h2>
          <button className="btn" onClick={onClose}>Close</button>
        </div>

        <p style={{ marginTop: 8 }}><strong>Available models:</strong> {count}</p>
        {minYear && maxYear && (
          <p><strong>Years in dataset:</strong> {minYear} — {maxYear}</p>
        )}

        {bestCar && (
          <section style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 12 }}>
            <img src={bestCar.image && bestCar.image.toString().startsWith("http") ? bestCar.image : `/${encodeURI(bestCar.image)}`} alt={bestCar.name} style={{ width: 220, height: "auto", borderRadius: 6 }} />
            <div>
              <h3 style={{ margin: 0 }}>{bestCar.name} <span style={{ color: '#666', fontSize: 14 }}>({bestCar.year})</span></h3>
              <p style={{ marginTop: 8 }}>{bestCar.description}</p>
              <p style={{ fontWeight: 700 }}>${bestCar.price}</p>
              <p>Horsepower: {bestCar.horsepower ?? '—'}</p>
            </div>
          </section>
        )}

        {topFeatures.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <strong>Common features:</strong>
            <ul>
              {topFeatures.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <h4>All models ({count})</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {carsForBrand.map((c) => (
              <div key={c.id} style={{ border: '1px solid #eee', borderRadius: 6, padding: 8 }}>
                <img src={c.image && c.image.toString().startsWith("http") ? c.image : `/${encodeURI(c.image)}`} alt={c.name} style={{ width: '100%', height: 'auto', borderRadius: 4 }} />
                <div style={{ marginTop: 8 }}>
                  <strong>{c.name}</strong>
                  <div style={{ fontSize: 13, color: '#666' }}>{c.year} — ${c.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
