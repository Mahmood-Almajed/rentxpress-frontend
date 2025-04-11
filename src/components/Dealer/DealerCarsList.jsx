import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthedUserContext } from '../../App';
import * as carService from '../../services/carService';
import { motion } from 'framer-motion';

function DealerCarsList() {
  const user = useContext(AuthedUserContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mileageRange, setMileageRange] = useState([0, 1000000]);

  useEffect(() => {
    const fetchDealerCars = async () => {
      try {
        const allCars = await carService.index();
        const dealerCars = allCars.filter(
          (car) => car.dealerId?._id === user._id || car.dealerId === user._id
        );
        setCars(dealerCars);
      } catch (error) {
        console.error('Error fetching dealer cars:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'dealer') {
      fetchDealerCars();
      const interval = setInterval(fetchDealerCars, 2000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const filteredCars = cars.filter((car) => {
    const matchesFilter =
      filter === 'all' || (filter === 'rent' && !car.forSale) || (filter === 'sale' && car.forSale);
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMileage =
      (car.mileage ?? 0) >= mileageRange[0] && (car.mileage ?? 0) <= mileageRange[1];
    return matchesFilter && matchesSearch && matchesMileage;
  });

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Your Listed Vehicles</h1>
        <p className="text-muted fs-5">
          Welcome, <strong>{user?.username}</strong>. Below are the cars you've listed.
        </p>
      </div>

      <div className="container mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <input
            type="text"
            className="form-control shadow-sm rounded-pill px-4 py-2"
            style={{ maxWidth: '400px' }}
            placeholder="🔍 Search by brand or model"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select shadow-sm rounded-pill px-4 py-2"
            style={{ width: '200px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Listings</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>

        <div className="mt-4">
          <p className="mb-1">Mileage Filter (km)</p>
          <div className="d-flex flex-column align-items-center">
            <div className="d-flex gap-3 mb-2">
              <input
                type="number"
                value={mileageRange[0]}
                onChange={(e) => setMileageRange([+e.target.value, mileageRange[1]])}
                className="form-control"
                style={{ width: '120px' }}
              />
              <span>to</span>
              <input
                type="number"
                value={mileageRange[1]}
                onChange={(e) => setMileageRange([mileageRange[0], +e.target.value])}
                className="form-control"
                style={{ width: '120px' }}
              />
            </div>
            <div className="w-100" style={{ maxWidth: '400px' }}>
              <input
                type="range"
                min="0"
                max="1000000"
                step="1000"
                value={mileageRange[0]}
                onChange={(e) => setMileageRange([+e.target.value, mileageRange[1]])}
                className="form-range mb-2"
              />
              <input
                type="range"
                min="0"
                max="1000000"
                step="1000"
                value={mileageRange[1]}
                onChange={(e) => setMileageRange([mileageRange[0], +e.target.value])}
                className="form-range"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="alert alert-info">No cars match your current search or filter.</div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {filteredCars.map((car) => (
            <div className="col" key={car._id}>
              <motion.div className="card h-100 shadow-sm position-relative" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover="hover">
                {car.isSold && <span className="badge bg-danger position-absolute top-0 end-0 m-2">SOLD</span>}
                {car.images && car.images.length > 0 ? (
                  <div id={`carousel-${car._id}`} className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {car.images.map((img, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                          <img src={img.url} className="d-block w-100" style={{ height: '225px', objectFit: 'cover' }} alt={`Car ${index + 1}`} />
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
                  <div className="card-img-top d-flex align-items-center justify-content-center bg-secondary text-white" style={{ height: '225px' }}>No Image Available</div>
                )}

                <motion.div className="card-body d-flex flex-column" initial="rest" whileHover="hover" animate="rest" variants={{ rest: { y: 0 }, hover: { y: -5 } }}>
                  <h5 className="card-title fw-bold">
                    {car.brand} {car.model} {car.isCompatible && <span className="badge bg-primary ms-2">♿</span>}
                  </h5>
                  <p className="card-text mb-2">
                    {car.forSale ? <>BHD <strong>{car.salePrice}</strong> <small className="text-muted">(For Sale)</small></> : <>BHD <strong>{car.pricePerDay}</strong> / Day</>}
                  </p>
                  <p className="card-text mb-1"><small>Mileage: {car.mileage?.toLocaleString()} km</small></p>
                  <small className={`mb-2 ${car.forSale ? car.isSold ? 'text-danger' : 'text-success' : car.availability === 'available' ? 'text-success' : car.availability === 'rented' ? 'text-secondary' : 'text-muted'}`}>
                    {car.forSale ? car.isSold ? 'SOLD' : 'available' : car.availability}
                  </small>
                  <motion.div className="card-text small mb-2" variants={{ hover: { opacity: 1, height: 'auto' }, rest: { opacity: 0, height: 0 } }} transition={{ duration: 0.3 }}>
                    <strong>Dealer:</strong> {car.dealerId?.username || 'You'}
                  </motion.div>
                  <div className="d-flex justify-content-end mt-auto">
                    <Link to={`/dealer/cars/${car._id}`} className="btn btn-sm btn-secondary">View Details</Link>
                  </div>

                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DealerCarsList;
