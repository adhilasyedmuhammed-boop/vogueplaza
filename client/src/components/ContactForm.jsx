import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post('/enquiries', form);
      toast.success('Your enquiry has been sent. We will respond shortly.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Unable to send enquiry. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact">
      <div className="container contact-section">
        <div className="section-header">
          <h2 className="section-title">CONTACT US</h2>
          <p className="section-subtitle">Send us a message and our concierge team will be in touch.</p>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
          </div>
          <label>
            Phone Number
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Message
            <textarea name="message" rows="5" value={form.message} onChange={handleChange} required />
          </label>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending…' : 'Submit Enquiry'}
          </button>
        </form>
      </div>
    </section>
  );
}
