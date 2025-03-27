import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { AuthedUserContext } from "../../App";
import * as carService from "../../services/carService";
import { motion } from "framer-motion";

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
    text: "Simple, fast, and reliable. I’ll definitely be using Carbook again in the future!",
    image: "https://randomuser.me/api/portraits/men/88.jpg",
  },
];

const Dashboard = () => {
  const user = useContext(AuthedUserContext);
  const [cars, setCars] = useState([]);

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

  return (
    <>
     <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 2 }}
  style={{
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  }}
>
  <video
    autoPlay
    muted
    loop
    playsInline
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0,
    }}
  >
    <source src="./CINEMATIC.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      zIndex: 1,
      outline: "none",
    }}
  >
    <motion.h1
      className="fw-bold text-light"
      initial={{ scale: 0.8, letterSpacing: "-1px" }}
      animate={{ scale: 1, letterSpacing: "2px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        fontSize: "clamp(2.5rem, 6vw, 5rem)",
        marginBottom: "1rem",
      }}
    >
      Rent<span className="text-warning">X</span>press
    </motion.h1>
    <p className="lead text-white fs-6 fs-md-5 mb-0">Find Your Perfect Car</p>
  </div>
</motion.div>


      <main className="container" style={{ marginTop: 100, marginBottom: 50 }}>
        <motion.section
          className="py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 text-center text-md-start">
            <h2 className="fw-bold mb-3 mb-md-0">Explore Our Premium Brands</h2>
            <a href="/signin" className="btn btn-warning">
              Show All Brands ↗
            </a>
          </div>
          <div className="row g-3 g-md-4">
            {brands.map((brand, idx) => (
              <motion.div
                className="col-6 col-sm-4 col-md-3 col-lg-2"
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                <div className="text-center p-2 p-md-3 shadow-sm bg-white rounded-4 h-100">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="mb-2 img-fluid"
                    style={{ height: 40, objectFit: "contain" }}
                  />
                  <p className="mb-0 small fw-medium">{brand.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <hr />

        <section className="ftco-section ftco-about py-5">
          <div className="row g-0 flex-column flex-md-row">
            <div
              className="col-md-6"
              style={{
                backgroundImage: `url('./enhanced-image.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "300px",
                borderRadius: "20px 20px 0 0",
              }}
            ></div>
            <div className="col-md-6 bg-dark text-white p-4 rounded-bottom">
              <div className="p-md-5 px-3 py-4 text-center text-md-start">
                <span className="text-uppercase text-warning fw-semibold">
                  About us
                </span>
                <h2 className="mb-4 mt-2 fs-3 fs-md-2">
                  Welcome to Rent<span className="text-warning fw-bold">X</span>press
                </h2>
                <p className="small">
                  RentXpress is created by a team of four passionate developers committed to revolutionizing car rentals.
                </p>
                <p className="small">
                  We aim to provide a seamless, secure, and user-friendly platform that connects car owners with renters effortlessly.
                  Your perfect ride is just a few clicks away!
                </p>
                <a href="/signin" className="btn btn-warning mt-3">
                  Search Vehicle
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center mb-4">
          <h3 style={{ marginTop: 50 }}>Featured Vehicles</h3>
          <p className="text-muted">Explore some of the top listed cars available now.</p>
        </div>

        {cars.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {cars.map((car, idx) => (
              <SwiperSlide key={car._id || idx}>
                <div className="card h-100 shadow-sm">
                  <div
                    className="card-img-top"
                    style={{
                      height: "180px",
                      backgroundImage: `url(${car.image?.url || "/placeholder.jpg"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="card-body text-center d-flex flex-column">
                    <h6 className="card-title small">{car.brand} {car.model}</h6>
                    <p className="fw-bold small">BHD {car.pricePerDay} / day</p>
                    <Link to={`/signin`} className="btn btn-sm btn-warning mt-auto">Details</Link>
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
                <span className="text-uppercase text-warning">Testimonial</span>
                <h2 className="fw-bold">Happy Clients</h2>
              </div>
            </div>

            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
              }}
            >
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="text-center p-4 bg-white rounded-4 shadow-sm h-100 mx-2">
                    <div
                      className="mb-3 mx-auto rounded-circle"
                      style={{
                        width: 100,
                        height: 100,
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                    <p className="mb-3 fst-italic small px-3">"{item.text}"</p>
                    <h6 className="fw-semibold mb-0">{item.name}</h6>
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
