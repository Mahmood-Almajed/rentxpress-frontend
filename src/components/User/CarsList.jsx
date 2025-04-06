import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as carService from '../../services/carService';
import { motion } from 'framer-motion';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sorting, setSorting] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch cars once
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carService.index();
        setCars(data);
      } catch (err) {
        console.error('Error fetching cars:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
    const interval = setInterval(fetchCars, 2000);
    return () => clearInterval(interval);
  }, []);

  // Filter and sort cars
  useEffect(() => {
    let result = [...cars];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(car =>
        car.brand.toLowerCase().includes(q) || car.model.toLowerCase().includes(q)
      );
    }

    // Listing type filter
    if (filterType !== 'all') {
      result = result.filter(car =>
        filterType === 'rent' ? !car.forSale : car.forSale
      );
    }

    // Sort by price
    if (sorting === 'lowToHigh') {
      result.sort((a, b) =>
        (a.forSale ? a.salePrice : a.pricePerDay) - (b.forSale ? b.salePrice : b.pricePerDay)
      );
    } else if (sorting === 'highToLow') {
      result.sort((a, b) =>
        (b.forSale ? b.salePrice : b.pricePerDay) - (a.forSale ? a.salePrice : a.pricePerDay)
      );
    }

    setFilteredCars(result);
  }, [cars, search, filterType, sorting]);

  return (
    <div>
      <div className="container">
        <div className="row py-lg-5 justify-content-center text-center">
          <div className="col-lg-8 col-md-10">
            <h1 className="fw-bold">Find Your Perfect Ride</h1>
            <p className="lead text-body-secondary">
              Browse our cars available for rent and sale. Whether you're traveling or buying, we’ve got you covered.
            </p>

            {/* Filter buttons */}
            <div className="d-flex justify-content-center gap-3 mt-2 mb-3 flex-wrap">
              <button
                className={`btn px-4 py-2 rounded-pill shadow-sm ${
                  filterType === 'rent' ? 'btn-warning' : 'btn-outline-warning'
                }`}
                onClick={() => setFilterType('rent')}
              >
                Cars for Rent
              </button>
              <button
                className={`btn px-4 py-2 rounded-pill shadow-sm ${
                  filterType === 'sale' ? 'btn-warning' : 'btn-outline-warning'
                }`}
                onClick={() => setFilterType('sale')}
              >
                Cars For Sale
              </button>
              <button
                className={`btn px-4 py-2 rounded-pill shadow-sm ${
                  filterType === 'all' ? 'btn-secondary' : 'btn-outline-secondary'
                }`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="container mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <input
            type="text"
            className="form-control shadow-sm rounded-pill px-4 py-2"
            style={{ maxWidth: '400px' }}
            placeholder="🔍 Search by brand or model"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select shadow-sm rounded-pill px-4 py-2"
            style={{ width: '200px' }}
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
          >
            <option value="all">Sort by Price</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>
      </div>

      {/* Cars */}
      <div className="container mb-4">
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="alert alert-warning text-center">No cars match your filters.</div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {filteredCars.map((car) => (
              <div className="col" key={car._id}>
                <motion.div
                  className="card h-100 shadow-sm position-relative"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {car.isSold && (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                      SOLD
                    </span>
                  )}

                  {car.image?.url ? (
                    <img
                      src={car.image.url}
                      className="card-img-top img-fluid"
                      style={{ height: '225px', objectFit: 'cover' }}
                      alt={`${car.brand} ${car.model}`}
                    />
                  ) : (
                    <div
                      className="card-img-top d-flex align-items-center justify-content-center bg-secondary text-white"
                      style={{ height: '225px' }}
                    >
                      No Image Available
                    </div>
                  )}

                  <motion.div
                    className="card-body d-flex flex-column"
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <h5 className="card-title fw-bold">{car.brand} {car.model}</h5>

                    <p className="card-text mb-2">
                      {car.forSale ? (
                        <>BHD <strong>{car.salePrice || 'N/A'}</strong> <small className="text-muted">(For Sale)</small></>
                      ) : (
                        <>BHD <strong>{car.pricePerDay || 'N/A'}</strong> / Day</>
                      )}
                    </p>

                    <small
                      className={`mb-2 ${
                        car.isSold
                          ? 'text-danger'
                          : car.availability === 'available'
                          ? 'text-success'
                          : car.availability === 'rented'
                          ? 'text-secondary'
                          : 'text-muted'
                      }`}
                    >
                      {car.isSold ? 'Unavailable' : car.availability}
                    </small>

                    <motion.div
                      className="d-flex justify-content-end mt-auto"
                      variants={{
                        hover: { opacity: 1, height: 'auto' },
                        rest: { opacity: 0, height: 0 }
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link to={`/cars/${car._id}`} className="btn btn-sm btn-secondary">
                        View Details
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarList;
