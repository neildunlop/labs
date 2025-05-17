import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    skills: '',
    interests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div className="signup-page">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Join Burendo Labs</h1>
          <p className="hero-subtitle">
            Become part of our community and start contributing to innovative projects.
          </p>
        </div>
      </section>

      <section className="form-section">
        <div className="container">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'input-error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="role">Current Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={errors.role ? 'input-error' : ''}
                >
                  <option value="">Select your role</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="devops">DevOps Engineer</option>
                  <option value="qa">QA Engineer</option>
                  <option value="other">Other</option>
                </select>
                {errors.role && <span className="error-message">{errors.role}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="List your technical skills (e.g., React, Python, AWS)"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="interests">Areas of Interest</label>
                <textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="What areas are you interested in? (e.g., AI, Cloud, Web Development)"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Sign Up</button>
                <Link to="/" className="btn btn-secondary">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp; 