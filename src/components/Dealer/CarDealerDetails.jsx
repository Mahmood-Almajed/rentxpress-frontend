import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as carService from "../../services/carService";
import { motion } from "framer-motion";

const CarDealerDetails = ({ handleDeleteCar }) => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      const data = await carService.show(carId);
      setCar(data);
    };
    fetchCar();
  }, [carId]);

  if (!car)
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

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="card shadow p-4 rounded-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="row g-4 align-items-center">
          <div className="col-md-5">
            {car.images && car.images.length > 0 ? (
              <div
                id={`carousel-${car._id}`}
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner rounded-4 shadow-sm">
                  {car.images.map((img, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      key={index}
                    >
                      <img
                        src={img.url}
                        className="d-block w-100"
                        style={{ height: "300px", objectFit: "cover" }}
                        alt={`Car ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                {car.images.length > 1 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#carousel-${car._id}`}
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#carousel-${car._id}`}
                      data-bs-slide="next"
                    >
                      <span
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
                className="d-flex justify-content-center align-items-center bg-secondary text-white rounded-4"
                style={{ height: "300px" }}
              >
                No Images Available
              </div>
            )}
          </div>

          <div className="col-md-7">
            <h2 className="fw-bold">
              {car.brand} {car.model}
            </h2>

            {car.isCompatible && (
              <span className="badge bg-primary me-2 mb-2">
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

            {car.forSale ? (
              <>
                <p>
                  <strong>Sale Price:</strong> BHD {car.salePrice}
                </p>
                <p>
                  <strong>Listing Type:</strong>{" "}
                  <span className="badge bg-warning text-dark">For Sale</span>
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {car.isSold ? (
                    <span className="badge bg-danger">SOLD</span>
                  ) : (
                    <span className="badge bg-success">available</span>
                  )}
                </p>
                {car.isSold && car.buyerId && (
                  <p>
                    <strong>Buyer:</strong> {car.buyerId.username || "User"}
                  </p>
                )}
              </>
            ) : (
              <>
                <p>
                  <strong>Price per Day:</strong> BHD {car.pricePerDay}
                </p>
                <p>
                  <strong>Listing Type:</strong>{" "}
                  <span className="badge bg-info">For Rent</span>
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`fw-semibold ${
                      car.availability === "rented"
                        ? "text-secondary"
                        : car.availability === "unavailable"
                        ? "text-warning"
                        : "text-success"
                    }`}
                  >
                    {car.availability === "rented"
                      ? "RENTED"
                      : car.availability === "unavailable"
                      ? "PENDING REQUESTS"
                      : "AVAILABLE"}
                  </span>
                </p>
              </>
            )}

            <div className="d-flex gap-3 flex-wrap mt-4">
              <Link
                to={`/dealer/cars/${car._id}/edit`}
                className="btn btn-outline-primary rounded-pill px-4"
              >
                Edit
              </Link>
              <button
                className="btn btn-outline-danger rounded-pill px-4"
                onClick={() => handleDeleteCar(carId)}
              >
                Delete
              </button>
              <Link
                to="/dealer/cars/rentals"
                className="btn btn-outline-secondary rounded-pill px-4"
              >
                Back to Cars
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {car.reviews && car.reviews.length > 0 && (
        <motion.div
          className="card shadow-sm p-4 rounded-4 mt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="fw-bold mb-3">Customer Reviews</h4>
          <div
            className="list-group border rounded"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {car.reviews.map((review) => (
              <div key={review._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong>{review.userId?.username || "Anonymous"}</strong>
                    <small className="d-block text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <p className="mb-0">{review.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CarDealerDetails;
