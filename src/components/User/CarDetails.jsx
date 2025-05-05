import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import * as carService from "../../services/carService";
import * as rentalService from "../../services/rentalService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReviewForm from "./ReviewForm";
import { AuthedUserContext } from "../../App";
import { useLoadScript } from "@react-google-maps/api";
import { motion } from "framer-motion";

const CarDetails = () => {
  const { carId } = useParams();
  const nav = useNavigate();
  const user = useContext(AuthedUserContext);
  const GAPI = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

  const [car, setCar] = useState(null);
  const [rentalData, setRentalData] = useState({ startDate: "", endDate: "", userPhone: "" });
  const [totalPrice, setTotalPrice] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GAPI });

  const fetchCar = async () => {
    try {
      const data = await carService.show(carId);
      setCar(data);
    } catch (err) {
      console.error("Error loading car details:", err);
    }
  };

  useEffect(() => {
    fetchCar();
    const interval = setInterval(fetchCar, 2000);
    return () => clearInterval(interval);
  }, [carId]);

  useEffect(() => {
    const refetchCar = async () => {
      const updated = await carService.show(carId);
      setCar(updated);
    };
    refetchCar();
  }, [car?.reviews?.length]);

  useEffect(() => {
    if (rentalData.startDate && rentalData.endDate && car) {
      const start = new Date(rentalData.startDate);
      const end = new Date(rentalData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setTotalPrice(days > 0 ? days * car.pricePerDay : null);
    } else {
      setTotalPrice(null);
    }
  }, [rentalData, car]);

  const handleChange = (e) => {
    setRentalData({ ...rentalData, [e.target.name]: e.target.value });
  };

  const handleRent = async (e) => {
    e.preventDefault();
    if (car.availability === "rented") {
      toast.error("This car is already rented.");
      return;
    }

    try {
      await rentalService.createRentalRequest(carId, rentalData);
      toast.success("Rental request submitted!");
      setRentalData({ startDate: "", endDate: "" });
      setTotalPrice(null);
      await fetchCar();
      setTimeout(() => nav("/my-rentals"), 1500);
    } catch (err) {
      toast.error("Error submitting rental request.");
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      await carService.createReview(carId, reviewData);
      toast.success("Review submitted!");
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await carService.deleteReview(carId, reviewId);
      toast.success("Review deleted.");
    } catch (err) {
      toast.error("Error deleting review.");
    }
  };

  const coordinates = useMemo(() => {
    let lat = 26.2235,
      lng = 50.5876;
    if (car?.location) {
      const parts = car.location.split(",").map(Number);
      if (!isNaN(parts[0]) && !isNaN(parts[1])) [lat, lng] = parts;
    }
    return { lat, lng };
  }, [car]);

  if (!isLoaded || !car)
    return (
      <div
        className="d-flex justify-content-center align-items-center mt-5"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  const isForSale = car.forSale;

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="row g-5 align-items-start">
        <div className="col-md-6">
          <div
            className="card shadow rounded-4 overflow-hidden"
            style={{ minHeight: "600px" }}
          >
            {car.images && car.images.length > 0 ? (
              <div
                id="carImagesCarousel"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {car.images.map((img, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      key={index}
                    >
                      <img
                        src={img.url}
                        className="d-block w-100"
                        style={{ height: "300px", objectFit: "cover" }}
                        alt={`Car image ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                {car.images.length > 1 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carImagesCarousel"
                      data-bs-slide="prev"
                    >
                      <span
                        style={{backgroundColor: "gray",borderRadius: "50%"}}
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carImagesCarousel"
                      data-bs-slide="next"
                    >
                      <span
                        style={{backgroundColor: "gray",borderRadius: "50%"}}
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center bg-secondary text-white"
                style={{ height: "300px" }}
              >
                No Image Available
              </div>
            )}
            <div className="card-body">
              <h3 className="fw-bold">
                {car.brand} {car.model}
              </h3>
              {car.isCompatible && (
                <span className="badge bg-primary me-2 mb-3">
                  ♿ Compatible for Special Needs
                </span>
              )}
              <p>
                <strong>Year:</strong> {car.year}
              </p>
              <p>
                <strong>Mileage:</strong> {car.mileage?.toLocaleString()} km
              </p>
              <p>
                <strong>Type:</strong> {car.type}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`fw-semibold ${isForSale
                      ? car.isSold
                        ? "text-danger"
                        : "text-success"
                      : car.availability === "available"
                        ? "text-success"
                        : car.availability === "unavailable"
                          ? "text-danger"
                          : "text-muted"
                    }`}
                >
                  {isForSale
                    ? car.isSold
                      ? "SOLD"
                      : "available"
                    : car.availability}
                </span>
              </p>
              {isForSale ? (
                <p>
                  <strong>Sale Price:</strong> BHD {car.salePrice}
                </p>
              ) : (
                <>
                  <p>
                    <strong>Price per day:</strong> BHD {car.pricePerDay}
                  </p>
                  {totalPrice !== null && (
                    <>
                      <p className="mt-2">
                        <strong>Total Price:</strong> BHD {totalPrice.toFixed(1)}
                      </p>
                      <p className="mt-1">
                        <strong>Number of Days:</strong>{" "}
                        {Math.ceil(
                          (new Date(rentalData.endDate) - new Date(rentalData.startDate)) /
                          (1000 * 60 * 60 * 24)
                        )}
                      </p>
                    </>
                  )}

                </>
              )}
              <p>

              </p>
              {car.dealerId?.username && (
                <>
                  <p>
                    <strong>Dealer Name:</strong> {car.dealerId?.username}
                  </p>
                  <p>
                    <strong>Contact Number:</strong> +973 {car.dealerPhone}
                  </p>
                </>
              )}
              {isForSale && (
                <div className="mt-4">
                  <div className="card bg-dark text-white text-center py-4">
                    <h5 className="fw-bold mb-2">📞 Dealer Contact</h5>
                    <p className="fs-4 m-0">+973 {car.dealerPhone || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <motion.div
            className="rounded overflow-hidden shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <iframe
              title="Car Location"
              src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`}
              width="100%"
              height="600"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      </div>

      {!isForSale && (
        <motion.div
          className="card shadow p-4 mt-5 rounded-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ backgroundColor: "#181616", color: "white" }}
        >
          <h5 className="fw-bold mb-3">Rent this Car</h5>
          <form onSubmit={handleRent}>
            <div className="mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={rentalData.startDate}
                min={today}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={rentalData.endDate}
                min={rentalData.startDate || today}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                name="userPhone"
                value={rentalData.userPhone}
                onChange={handleChange}
                required
                placeholder="Enter your Phone number"
                pattern="\d{8}"
                maxLength={8}
              />
            </div>
            <button
              className="btn w-100 fw-semibold"
              style={{ backgroundColor: "#06b4d8" }}
              type="submit"
            >
              Rent Now
            </button>
          </form>
        </motion.div>
      )}

      <motion.div
        className="mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <ReviewForm handleAddReview={handleAddReview} />
        {car.reviews && car.reviews.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-3">Customer Reviews</h4>
            <div
              className="list-group border rounded"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {car.reviews.map((review) => (
                <div key={review._id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{review.userId?.username || "Anonymous"}</strong>
                      <small className="d-block">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    {user?._id === review.userId?._id && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="mb-1">
                    <strong>Rating:</strong> {review.rating}/5
                  </p>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <ToastContainer />
    </motion.div>
  );
};

export default CarDetails;
