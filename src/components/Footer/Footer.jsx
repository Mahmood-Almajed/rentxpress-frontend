import React from 'react';
import { useMediaQuery } from 'react-responsive';

const Footer = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <footer className="bg-dark text-white pt-5 border-top">
      <div className="container">
        <div className="row">
          <div className={`${isMobile ? 'col-12' : 'col-md-4'} mb-4`}>
            <h5 className="mb-3" style={{ color: "#06b4d8", fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
              About CarXpress
            </h5>
            <p style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
              CarXpress is created by a team of three passionate developers committed to revolutionizing car sales and rentals.
              We aim to provide a seamless, secure, and user-friendly platform that connects car owners and buyers with renters effortlessly.
              {isMobile ? '...' : ' With a focus on convenience, trust, and accessibility, our AI-driven system makes finding, listing, buying, and renting cars easier than ever.'}
            </p>
            {!isMobile && (
              <p style={{ fontSize: '1rem' }}>
                Your perfect ride or your next buyer is just a few clicks away!
              </p>
            )}
          </div>

          <div className={`${isMobile ? 'col-12' : 'col-md-4'} mb-4`}>
            <h5 className="mb-3" style={{ color: "#06b4d8", fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
              Quick Links
            </h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <strong style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>Important:</strong>{' '}
                <a href="#" className="text-white text-decoration-underline" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Terms & Conditions
                </a>,{' '}
                <a href="#" className="text-white text-decoration-underline" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <strong style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>Resources:</strong>{' '}
                <a href="#" className="text-white text-decoration-underline" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Expertise
                </a>,{' '}
                <a href="#" className="text-white text-decoration-underline" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Pricing
                </a>,{' '}
                <a href="#" className="text-white text-decoration-underline" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Newsletter
                </a>
              </li>
              <li>
                <strong style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>Navigation:</strong>{' '}
                <a href="#" className="text-white text-decoration-underline" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Home
                </a>,{' '}
                <a href="#" className="text-white text-decoration-underline" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Details
                </a>,{' '}
                {!isMobile && (
                  <>
                    <a href="#" className="text-white text-decoration-underline">
                      Solutions
                    </a>,{' '}
                    <a href="#" className="text-white text-decoration-underline">
                      Projects
                    </a>
                  </>
                )}
              </li>
            </ul>
          </div>

          <div className={`${isMobile ? 'col-12' : 'col-md-4'} mb-4`}>
            <h5 className="mb-3" style={{ color: "#06b4d8", fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
              Get in Touch
            </h5>
            <p className="mb-0" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
              We'd love to hear from you<br />
            </p>
            <div className="mb-3 mt-2">
              <a href="#" className="text-white me-3" style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-white me-3" style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white me-3" style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white me-3" style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
        </div>

        <div 
          className="text-center pt-4 border-top mt-4 pb-3" 
          style={{ 
            fontSize: isMobile ? '0.8rem' : '0.9rem', 
            color: "#06b4d8" 
          }}
        >
          &copy; {new Date().getFullYear()} CarXpress. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;