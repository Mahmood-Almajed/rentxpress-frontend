import { useEffect, useState } from 'react';
import * as approvalService from '../../services/approvalService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Admin/AdminStyles.css';
import { FaCarSide, FaMoneyCheckAlt } from 'react-icons/fa';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealer, setSelectedDealer] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const fetchCars = async () => {
    try {
      const data = await approvalService.getAllCars();
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    const intervalId = setInterval(fetchCars, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async (carId) => {
    toast.info(
      <div>
        Are you sure you want to delete this car?
        <div className="mt-2 d-flex justify-content-end gap-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={async () => {
              toast.dismiss();
              try {
                await approvalService.deleteCar(carId);
                toast.success('Car deleted successfully');
                fetchCars();
              } catch (error) {
                toast.error('Failed to delete car');
              }
            }}
          >
            Yes, Delete
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => toast.dismiss()}>
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const handleToggleSold = async (car) => {
    const updated = {
      ...car,
      isSold: !car.isSold,
      availability: !car.isSold ? 'unavailable' : 'available'
    };

    try {
      await approvalService.updateCar(car._id, updated);
      toast.success(`Marked as ${updated.isSold ? 'Sold' : 'Available'}`);
      fetchCars();
    } catch (error) {
      toast.error('Failed to update car status');
    }
  };

  const uniqueDealers = Array.from(new Set(cars.map(car => car.dealerId?.username).filter(Boolean)));

  const filteredCars = cars.filter((car) => {
    const dealerMatch = selectedDealer === 'all' || car.dealerId?.username === selectedDealer;
    const typeMatch = selectedType === 'all' || (selectedType === 'sale' ? car.forSale : !car.forSale);
    return dealerMatch && typeMatch;
  });

  const totalSale = cars.filter(car => car.forSale).length;
  const totalRent = cars.filter(car => !car.forSale).length;

  return (
    <div className="container py-5">
      <ToastContainer position="top-center" />
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark">All Cars</h2>
        <p className="text-muted">Manage all cars listed by dealers on the platform.</p>
      </div>

      {/* Summary Cards */}
      <div className="row justify-content-center g-4 mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-success shadow-sm rounded-4">
            <div className="card-body d-flex align-items-center">
              <FaMoneyCheckAlt size={32} className="me-3" />
              <div>
                <h6 className="card-title mb-0">Cars For Sale</h6>
                <h4 className="fw-bold mb-0">{totalSale}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-primary shadow-sm rounded-4">
            <div className="card-body d-flex align-items-center">
              <FaCarSide size={32} className="me-3" />
              <div>
                <h6 className="card-title mb-0">Cars For Rent</h6>
                <h4 className="fw-bold mb-0">{totalRent}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="dealerFilter" className="fw-medium text-dark">Dealer:</label>
          <select
            id="dealerFilter"
            className="form-select w-auto shadow-sm rounded-pill"
            value={selectedDealer}
            onChange={(e) => setSelectedDealer(e.target.value)}
          >
            <option value="all">All Dealers</option>
            {uniqueDealers.map((dealer) => (
              <option key={dealer} value={dealer}>{dealer}</option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label htmlFor="typeFilter" className="fw-medium text-dark">Listing Type:</label>
          <select
            id="typeFilter"
            className="form-select w-auto shadow-sm rounded-pill"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>
      </div>

      {/* Car cards */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="alert alert-info text-center">No cars found for the selected filters.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {filteredCars.map((car) => (
            <div className="col" key={car._id}>
              <div className="card border-0 shadow">
                <div className="card-body text-dark">
                  <h5 className="card-title mb-2 fw-semibold">{car.brand} {car.model}</h5>
                  <p className="card-text mb-2">
                    <strong>Year:</strong> {car.year}<br />
                    <strong>Type:</strong> {car.forSale ? 'For Sale' : 'For Rent'}<br />

                    {car.forSale ? (
                      <>
                        <strong>Sale Price:</strong> {car.salePrice} BHD<br />
                        <strong>Dealer Phone:</strong> 🇧🇭 +973 {car.dealerPhone || 'N/A'}<br />
                      </>
                    ) : (
                      <>
                        <strong>Price/Day:</strong> {car.pricePerDay} BHD<br />
                      </>
                    )}

                    <strong>Status:</strong> {car.isSold ? 'SOLD' : 'Available'}<br />
                    <strong>Dealer:</strong> {car.dealerId?.username || 'Unknown'}
                  </p>

                  <div className="d-flex justify-content-between">
                    {car.forSale && (
                      <button className="btn btn-sm btn-warning" onClick={() => handleToggleSold(car)}>
                        Mark as {car.isSold ? 'Available' : 'Sold'}
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(car._id)}>
                      Delete Car
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;
