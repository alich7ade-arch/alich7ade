import { useParams, Link } from "react-router-dom";
import cars from "../data/cars";
import { useState } from "react";

export default function Purchase() {
  const { id } = useParams();
  const car = cars.find((c) => c.id === parseInt(id));

  const [form, setForm] = useState({ name: "", phone: "", age:"", email: "", address: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
     if (!form.age.trim()) errs.age = "age is required";
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Valid email is required";
    if (!form.address.trim()) errs.address = "Address is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);

    // Simulate async purchase processing
    setTimeout(() => {
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      setOrder({ id: orderId, carId: car?.id || null, name: form.name });
      setSubmitting(false);
    }, 700);
  };

  if (!car) {
    return (
      <div className="form-box">
        <h2>Car not found</h2>
        <p>The car you tried to purchase doesn't exist.</p>
        <Link to="/" className="btn" style={{ marginTop: 12 }}>Back to Home</Link>
      </div>
    );
  }

  if (order) {
    return (
      <div className="form-box">
        <h2>Congratulations — your purchase is complete!</h2>
        <p style={{ marginTop: 12 }}>Thank you, <strong>{order.name}</strong>.</p>
        <p>Your order <strong>{order.id}</strong> for <strong>{car.name}</strong> has been received.</p>
        <p style={{ marginTop: 8 }}>We will contact you at <strong>{form.email}</strong> or <strong>{form.phone}</strong> with delivery details.</p>
        <Link to="/" className="btn" style={{ marginTop: 14 }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <h2>Purchase {car.name}</h2>

      <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
      {errors.name && <div style={{ color: 'crimson', marginTop: 6 }}>{errors.name}</div>}

      <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
      {errors.phone && <div style={{ color: 'crimson', marginTop: 6 }}>{errors.phone}</div>}
      <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
      {errors.age && <div style={{ color: 'crimson', marginTop: 6 }}>{errors.age}</div>}

      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      {errors.email && <div style={{ color: 'crimson', marginTop: 6 }}>{errors.email}</div>}

      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      {errors.address && <div style={{ color: 'crimson', marginTop: 6 }}>{errors.address}</div>}

      <button className="btn" type="submit" style={{ marginTop: "15px", width: "100%" }} disabled={submitting}>
        {submitting ? 'Processing...' : 'Confirm Purchase'}
      </button>
    </form>
  );
}