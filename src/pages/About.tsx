const About = () => {
  return (
    <div className="about">
      {/* Mission Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">About Burendo Labs</h1>
          <p className="hero-subtitle">
            We're a community of passionate developers dedicated to innovation,
            learning, and building the future of technology together.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="card value-card">
              <h3 className="value-title">Innovation</h3>
              <p className="value-description">
                We encourage experimentation and creative thinking to solve complex
                problems in new ways.
              </p>
            </div>

            <div className="card value-card">
              <h3 className="value-title">Collaboration</h3>
              <p className="value-description">
                We believe in the power of teamwork and knowledge sharing to achieve
                greater results together.
              </p>
            </div>

            <div className="card value-card">
              <h3 className="value-title">Learning</h3>
              <p className="value-description">
                We foster a culture of continuous learning and skill development
                through hands-on experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="card step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Join the Community</h3>
              <p className="step-description">
                Sign up to become a member of Burendo Labs and get access to our
                community of developers.
              </p>
            </div>

            <div className="card step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Explore Projects</h3>
              <p className="step-description">
                Browse through our active projects and find one that matches your
                interests and skills.
              </p>
            </div>

            <div className="card step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Contribute</h3>
              <p className="step-description">
                Join a project team, collaborate with others, and make meaningful
                contributions to the project.
              </p>
            </div>

            <div className="card step-card">
              <div className="step-number">4</div>
              <h3 className="step-title">Grow</h3>
              <p className="step-description">
                Learn new skills, build your portfolio, and grow your professional
                network within the community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 