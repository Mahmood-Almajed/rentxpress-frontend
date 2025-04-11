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
  const [specialNeedsOnly, setSpecialNeedsOnly] = useState(false);
  const [specialNeedsListingType, setSpecialNeedsListingType] = useState('all');
  const [minMileage, setMinMileage] = useState(0);
  const [maxMileage, setMaxMileage] = useState(1000000);
  const [mileageRange, setMileageRange] = useState([0, 1000000]);
  const [loading, setLoading] = useState(true);

  const filtersActive =
    search ||
    filterType !== 'all' ||
    sorting !== 'all' ||
    specialNeedsOnly ||
    (specialNeedsOnly && specialNeedsListingType !== 'all') ||
    mileageRange[0] > 0 || mileageRange[1] < 1000000;

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

  useEffect(() => {
    if (!specialNeedsOnly) {
      setSpecialNeedsListingType('all');
    }
  }, [specialNeedsOnly]);

  useEffect(() => {
    let result = [...cars];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(car =>
        car.brand.toLowerCase().includes(q) || car.model.toLowerCase().includes(q)
      );
    }

    if (specialNeedsOnly) {
      result = result.filter(car => car.isCompatible);
      if (specialNeedsListingType !== 'all') {
        result = result.filter(car =>
          specialNeedsListingType === 'rent' ? !car.forSale : car.forSale
        );
      }
    } else {
      result = result.filter(car => !car.isCompatible);
      if (filterType !== 'all') {
        result = result.filter(car =>
          filterType === 'rent' ? !car.forSale : car.forSale
        );
      }
    }

    result = result.filter(car =>
      (car.mileage ?? 0) >= mileageRange[0] && (car.mileage ?? 0) <= mileageRange[1]
    );

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
  }, [cars, search, filterType, sorting, specialNeedsOnly, specialNeedsListingType, mileageRange]);

  const handleClearFilters = () => {
    setSearch('');
    setFilterType('all');
    setSorting('all');
    setSpecialNeedsOnly(false);
    setSpecialNeedsListingType('all');
    setMileageRange([0, 1000000]);
  };

  return (
    <div>
      <div className="container">
        <div className="row py-lg-5 justify-content-center text-center">
          <div className="col-lg-8 col-md-10">
            <h1 className="fw-bold">Find Your Perfect Ride</h1>
            <p className="lead text-body-secondary">
              Browse our cars available for rent and sale. Whether you're traveling or buying, we’ve got you covered.
            </p>

            <div className="d-flex justify-content-center gap-3 mt-2 mb-3 flex-wrap">
              <button className={`btn px-4 py-2 rounded-pill shadow-sm btn-warning ${filterType === 'all' ? 'active-warning' : 'btn-warning-outline-hover'}`} onClick={() => setFilterType('all')}>All</button>
              <button className={`btn px-4 py-2 rounded-pill shadow-sm btn-warning ${filterType === 'rent' ? 'active-warning' : 'btn-warning-outline-hover'}`} onClick={() => setFilterType('rent')}>Cars for Rent</button>
              <button className={`btn px-4 py-2 rounded-pill shadow-sm btn-warning ${filterType === 'sale' ? 'active-warning' : 'btn-warning-outline-hover'}`} onClick={() => setFilterType('sale')}>Cars For Sale</button>
              <button className={`btn px-4 py-2 rounded-pill shadow-sm ${specialNeedsOnly ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSpecialNeedsOnly(prev => !prev)}>♿ Special Needs</button>
            </div>

            {specialNeedsOnly && (
              <div className="d-flex justify-content-center gap-2 mb-3 flex-wrap">
                <span className="fw-semibold mt-2">Showing:</span>
                <button className={`btn btn-sm rounded-pill ${specialNeedsListingType === 'all' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setSpecialNeedsListingType('all')}>All</button>
                <button className={`btn btn-sm rounded-pill ${specialNeedsListingType === 'rent' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setSpecialNeedsListingType('rent')}>For Rent</button>
                <button className={`btn btn-sm rounded-pill ${specialNeedsListingType === 'sale' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setSpecialNeedsListingType('sale')}>For Sale</button>
              </div>
            )}

            {/* Mileage Filter UI */}
            <div className="mt-4">
              <p className="mb-1 mt-4">Filter by Mileage (km)</p>
              <div className="d-flex flex-column align-items-center">
                <div className="d-flex gap-3 mb-2">
                  <input
                    type="number"
                    value={mileageRange[0]}
                    min="0"
                    onChange={(e) =>
                      setMileageRange([+e.target.value, mileageRange[1]])
                    }
                    className="form-control"
                    style={{ width: '120px' }}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={mileageRange[1]}
                    min={mileageRange[0]}
                    onChange={(e) =>
                      setMileageRange([mileageRange[0], +e.target.value])
                    }
                    className="form-control"
                    style={{ width: '120px' }}
                  />
                </div>

                {/* Range Sliders */}
                <div className="w-100" style={{ maxWidth: '400px' }}>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="1000"
                    value={mileageRange[0]}
                    onChange={(e) =>
                      setMileageRange([+e.target.value, mileageRange[1]])
                    }
                    className="form-range mb-2"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="1000"
                    value={mileageRange[1]}
                    onChange={(e) =>
                      setMileageRange([mileageRange[0], +e.target.value])
                    }
                    className="form-range"
                  />
                </div>
              </div>
             
            </div>

            {filtersActive && (
              <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-outline-dark btn-sm rounded-pill px-4" onClick={handleClearFilters}>Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

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
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">SOLD</span>
                  )}

                  {car.images && car.images.length > 0 ? (
                    <div id={`carousel-${car._id}`} className="carousel slide" data-bs-ride="carousel">
                      <div className="carousel-inner">
                        {car.images.map((img, index) => (
                          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <img
                              src={img.url}
                              className="d-block w-100"
                              style={{ height: '225px', objectFit: 'cover' }}
                              alt={`Car image ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      {car.images.length > 1 && (
                        <>
                          <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${car._id}`} data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${car._id}`} data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="card-img-top d-flex align-items-center justify-content-center bg-secondary text-white" style={{ height: '225px' }}>
                      No Image Available
                    </div>
                  )}

                  <motion.div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">
                      {car.brand} {car.model}
                      {car.isCompatible && (
                        <span className="badge bg-primary ms-2">♿</span>
                      )}
                    </h5>
                    <p className="card-text mb-2">
                      {car.forSale ? (
                        <>BHD <strong>{car.salePrice || 'N/A'}</strong> <small className="text-muted">(For Sale)</small></>
                      ) : (
                        <>BHD <strong>{car.pricePerDay || 'N/A'}</strong> / Day</>
                      )}
                    </p>
                    <p className="mb-1"><small>Mileage: {car.mileage?.toLocaleString()} km</small></p>
                    <small
                      className={`mb-2 ${car.forSale
                        ? car.isSold
                          ? 'text-danger'
                          : 'text-success'
                        : car.availability === 'available'
                          ? 'text-success'
                          : car.availability === 'rented'
                            ? 'text-secondary'
                            : 'text-muted'
                        }`}
                    >
                      {car.forSale
                        ? car.isSold
                          ? 'SOLD'
                          : 'available'
                        : car.availability}
                    </small>
                    {car.dealerId?.username && (
                      <small className="text-muted">Dealer: <strong>{car.dealerId.username}</strong></small>
                    )}
                    <motion.div className="d-flex justify-content-end mt-auto">
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
