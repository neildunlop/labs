import { useState } from 'react';
import { Link } from 'react-router-dom';

const SuggestProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: '',
    technologies: '',
    timeline: '',
    teamSize: '',
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }
    
    if (!formData.objectives.trim()) {
      newErrors.objectives = 'Project objectives are required';
    }

    if (!formData.technologies.trim()) {
      newErrors.technologies = 'Please specify the technologies';
    }

    if (!formData.timeline) {
      newErrors.timeline = 'Please select an estimated timeline';
    }

    if (!formData.teamSize) {
      newErrors.teamSize = 'Please select the required team size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log('Project suggestion submitted:', formData);
    }
  };

  return (
    <div className="suggest-project-page">
      <section className="hero">
        <div className="container">
          <h1 className="page-title">Suggest a Project</h1>
          <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: 'var(--gray-700)', maxWidth: '900px', margin: '0 auto' }}>
            Have an idea for something new? Share your innovative project proposal with the Burendo Labs community.<br /><br />
            Whether it's a big challenge or a small experiment, we welcome all ideas—just fill out the form below to get started!
          </p>
        </div>
      </section>

      <section className="form-section">
        <div className="container">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="suggest-project-form">
              <div className="form-group">
                <label htmlFor="title">Project Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? 'input-error' : ''}
                  placeholder="Enter a descriptive title for your project"
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Project Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={errors.description ? 'input-error' : ''}
                  placeholder="Describe your project idea in detail"
                  rows={4}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="objectives">Project Objectives</label>
                <textarea
                  id="objectives"
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  className={errors.objectives ? 'input-error' : ''}
                  placeholder="What are the main goals and objectives of this project?"
                  rows={3}
                />
                {errors.objectives && <span className="error-message">{errors.objectives}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="technologies">Technologies</label>
                <textarea
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  className={errors.technologies ? 'input-error' : ''}
                  placeholder="List the technologies, frameworks, and tools that will be used"
                  rows={3}
                />
                {errors.technologies && <span className="error-message">{errors.technologies}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="timeline">Estimated Timeline</label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className={errors.timeline ? 'input-error' : ''}
                  >
                    <option value="">Select timeline</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="12+ months">12+ months</option>
                  </select>
                  {errors.timeline && <span className="error-message">{errors.timeline}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="teamSize">Required Team Size</label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    className={errors.teamSize ? 'input-error' : ''}
                  >
                    <option value="">Select team size</option>
                    <option value="1-3">1-3 members</option>
                    <option value="4-6">4-6 members</option>
                    <option value="7-10">7-10 members</option>
                    <option value="10+">10+ members</option>
                  </select>
                  {errors.teamSize && <span className="error-message">{errors.teamSize}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Submit Project</button>
                <Link to="/projects" className="btn btn-secondary">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuggestProject; 