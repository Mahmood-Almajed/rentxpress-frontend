import React from "react";

const teamMembers = [
  {
    name: "Mahmood Almajed",
    role: "Software Engineer",
    linkedin: "https://www.linkedin.com/in/mahmood-almajed",
  },
  {
    name: "Abbas Hussain",
    role: "Software Engineer",
    linkedin: "https://www.linkedin.com/in/abbashussainj",
  },

  {
    name: "Hussain Abduljalil",
    role: "Software Engineer",
    linkedin: "#",
  },
];

const About = () => {
  return (
    <section className="py-1" style={{ marginBottom: 40 }}>
      <div className="container text-center">
        <h1 className="mb-5 fw-bold" style={{ marginTop: 50 }}>
          Our Team
        </h1>
        <div className="row justify-content-center g-4">
          <p style={{ maxWidth: "1000px", marginBottom: 30 }}>
            Car
            <span style={{ color: "#06b4d8" }} className="fw-bold">
              X
            </span>
            press is created by a team of three passionate developers committed
            to revolutionizing car sales and rentals. We aim to provide a
            seamless, secure, and user-friendly platform that connects car
            owners and buyers with renters effortlessly. With a focus on
            convenience, trust, and accessibility, our AI-driven system makes
            finding, listing, buying, and renting cars easier than ever. Your
            perfect ride or your next buyer is just a few clicks away!
          </p>
          {teamMembers.map((member, index) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="team-card-link"
              >
                <div className="team-card shadow-sm">
                  <div className="team-info">
                    <h5>{member.name}</h5>
                    <p>{member.role}</p>
                    <i className="bi bi-linkedin"></i>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
