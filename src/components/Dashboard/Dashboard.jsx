import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { AuthedUserContext } from "../../App";
import * as carService from "../../services/carService";
import './Dashboard.css'
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

const Dashboard = () => {
  const user = useContext(AuthedUserContext);
  const [cars, setCars] = useState([]);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const allCars = await carService.index();
        setCars(allCars);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };
    fetchCars();
  }, []);

  

  const brands = [
    {
      name: "Audi",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg",
    },
    {
      name: "BMW",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
    },
    {
      name: "Ford",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg",
    },
    {
      name: "Mercedes Benz",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
    },
    {
      name: "Nissan",
      logo: "https://www.gearboxsolutions.com.au/wp-content/uploads/2016/02/Nissan-logo.svg_.png",
    },
    {
      name: "Toyota",
      logo: "https://www.svgrepo.com/show/306868/toyota.svg",
    },
  ];

  const testimonials = [
    {
      name: "Michael Brown",
      text: "Carbook made renting a car effortless! The process was smooth, and I found the perfect car in minutes.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Emily Johnson",
      text: "Amazing service! The platform is easy to use, and I appreciate the security measures in place.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "James Wilson",
      text: "A great experience! The car options were excellent, and the booking process was seamless.",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      name: "Sophia Martinez",
      text: "Booking was quick and hassle-free. Highly recommend this platform for car rentals!",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      name: "Daniel Anderson",
      text: "I found exactly what I was looking for. Great selection and a user-friendly interface!",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
      name: "Olivia Thomas",
      text: "This platform made my trip planning so much easier. The rental process was smooth!",
      image: "https://randomuser.me/api/portraits/women/36.jpg",
    },
    {
      name: "William Harris",
      text: "Simple, fast, and reliable. I'll definitely be using Carbook again in the future!",
      image: "https://randomuser.me/api/portraits/men/88.jpg",
    },
  ];

  return (
    <>
      <motion.div
        className="hero-video-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 3 }}
        transition={{ duration: 2 }}
      >
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="./CINEMATIC.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay-content">
          <motion.h1
            className="display-4 fw-bold text-light"
            initial={{ scale: 0.8, letterSpacing: '-1px' }}
            animate={{ scale: 1, letterSpacing: '2px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ fontSize: isMobile ? 40 : 80 }}
          >
            Car<span style={{ color: "#06b4d8" }}>X</span>press
          </motion.h1>
          <p className="lead text-white">Find Your Perfect Car</p>
        </div>
      </motion.div>

      <main className="container" style={{ marginTop: isMobile ? 50 : 100, marginBottom: 50 }}>
        <section className="py-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold" style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
                Explore Our Premium Brands
              </h2>
              <span style={{ color: "black", cursor: "pointer" }}>
                <a href="/cars" className="btn" style={{
                  textDecoration: "none",
                  backgroundColor: "#06b4d8",
                  padding: isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem'
                }}>
                  {isMobile ? 'All Brands' : 'Show All Brands'} ↗
                </a>
              </span>
            </div>
            <div className="row g-4">
              {brands.map((brand, idx) => (
                <motion.div
                  className={`${isMobile ? 'col-4' :
                    isTablet ? 'col-3' :
                      'col-2'
                    }`}
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                >
                  <div className="brand-card text-center p-3 shadow-sm bg-white rounded-4 h-100">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="brand-logo mb-2"
                      style={{
                        height: isMobile ? 40 : 50,
                        objectFit: "contain"
                      }}
                    />
                    <p className="mb-0 fw-medium" style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>
                      {brand.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <hr />

        <section className="ftco-section ftco-about py-5">
          <div className="container" style={{ 
            width: isMobile ? '100%' : isTablet ? '90%' : 1300,
            padding: isMobile ? 0 : ''
          }}>
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                backgroundImage: `url('./enhanced-image.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: "20px",
                minHeight: isMobile ? 400 : 500,
                padding: isMobile ? "2rem" : "4rem",
                flexDirection: "column",
                textAlign: "center",
                backgroundColor: "#000000aa"
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  padding: isMobile ? "1rem" : "2rem",
                  borderRadius: "16px",
                  width: "100%",
                  maxWidth: 700,
                }}
              >
                <span 
                  className="text-uppercase fw-semibold d-block mb-2" 
                  style={{ 
                    color: "#06b4d8",
                    fontSize: isMobile ? '0.8rem' : '1rem'
                  }}
                >
                  About us
                </span>
                <h2 
                  className="fw-bold mb-4" 
                  style={{ 
                    fontSize: isMobile ? '1.75rem' : '2rem',
                    lineHeight: 1.2
                  }}
                >
                  Welcome to Car<span style={{ color: "#06b4d8" }}>X</span>press
                </h2>
                <p style={{ 
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  marginBottom: isMobile ? '1rem' : '1.5rem'
                }}>
                  CarXpress is created by a team of three passionate developers committed to revolutionizing car sales and rentals.
                </p>
                <p style={{ 
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  marginBottom: isMobile ? '1.5rem' : '2rem'
                }}>
                  We aim to provide a seamless, secure, and user-friendly platform that connects car owners and buyers with renters effortlessly.
                  With a focus on convenience, trust, and accessibility, our AI-driven system makes finding, listing, buying, and renting cars easier than ever.
                </p>
                <a 
                  href="/cars" 
                  className="btn py-2 px-4" 
                  style={{ 
                    backgroundColor: "#06b4d8", 
                    color: "white",
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                >
                  Search Vehicle
                </a>
              </div>
            </div>
          </div>
        </section>
        
        <div className="text-center mb-4">
          <h3 style={{ marginTop: 50 }} className="fw-bold">
            Featured Vehicles
          </h3>
          <p className="text-muted" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
            Explore some of the top listed cars available now.
          </p>
        </div>

        {cars.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={isMobile ? 1 : isTablet ? 2 : 3}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
          >
            {cars.map((car, idx) => (
              <SwiperSlide key={car._id || idx}>
                <div className="card h-100 shadow-sm" style={{ height: isMobile ? 350 : 400 }}>
                  <div
                    className="card-img-top"
                    style={{
                      height: isMobile ? 150 : 200,
                      backgroundImage: `url(${car.image?.url || "/placeholder.jpg"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                  />
                  <div className="card-body d-flex flex-column text-center">
                    <h5 className="card-title" style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                      {car.brand} {car.model}
                    </h5>

                    <p className="fw-bold" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                      {car.forSale ? (
                        <>BHD {car.salePrice}</>
                      ) : (
                        <>
                          BHD {car.pricePerDay} <span className="text-muted">/ day</span>
                        </>
                      )}
                    </p>

                    {car.isSold && (
                      <span className="badge bg-danger mb-2">SOLD</span>
                    )}

                    <div className="d-flex justify-content-center gap-2 mt-auto">
                      <Link
                        to={`/cars/${car._id}`}
                        className="btn btn-sm"
                        style={{ color: "black", backgroundColor: "#06b4d8" }}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-muted">Loading featured vehicles...</p>
        )}


        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center mb-5">
              <div className="col-md-7 text-center">
                <span className="text-uppercase" style={{ color: "#06b4d8" }}>
                  Testimonial
                </span>
                <h2 className="fw-bold" style={{ fontSize: isMobile ? '1.75rem' : '2rem' }}>
                  Happy Clients
                </h2>
              </div>
            </div>

            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={isMobile ? 1 : isTablet ? 2 : 3}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
            >
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="testimony-wrap text-center p-4 bg-white rounded-4 shadow-sm h-100 mx-2">
                    <div
                      className="user-img mb-3 mx-auto rounded-circle"
                      style={{
                        width: isMobile ? 80 : 100,
                        height: isMobile ? 80 : 100,
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                    <p className="mb-3 fst-italic small px-3" style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>
                      "{item.text}"
                    </p>
                    <h6 className="fw-semibold mb-0" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                      {item.name}
                    </h6>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </main>
    </>
  );
};

export default Dashboard;