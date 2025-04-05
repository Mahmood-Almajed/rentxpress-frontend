import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import * as carService from "../../services/carService";

const brandModelMap = {
  Toyota: ["Corolla", "Camry", "RAV4", "Highlander"],
  Honda: ["Civic", "Accord", "CR-V"],
  Ford: ["Fusion", "Escape", "Focus"],
  Chevrolet: ["Malibu", "Equinox", "Tahoe"],
  BMW: ["3 Series", "5 Series", "X3"],
  // Keep the rest...
};

const CreateCar = (props) => {
  const { carId } = useParams();
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: currentYear,
    location: "",
    listingType: "rent",
    pricePerDay: "",
    salePrice: "",
    isCompatible: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [marker, setMarker] = useState(null);

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  const center = { lat: 26.2235, lng: 50.5876 };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setFormData({ ...formData, brand, model: "" });
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    setFormData({ ...formData, location: `${lat}, ${lng}` });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
  
    const payload = {
      ...formData,
      forSale: formData.listingType === "sale",
      pricePerDay: formData.listingType === "rent" ? formData.pricePerDay : undefined,
      salePrice: formData.listingType === "sale" ? formData.salePrice : undefined,
      listingType: formData.listingType, // ✅ make sure this goes in!
    };
  
    for (const key in payload) {
      if (payload[key] !== undefined) {
        data.append(key, payload[key]);
      }
    }
  
    if (imageFile) data.append("image", imageFile);
  
    carId ? props.handleUpdateCar(carId, data) : props.handleAddCar(data);
  };

  useEffect(() => {
    if (carId) {
      const fetchCar = async () => {
        const carData = await carService.show(carId);
        setFormData({
          ...carData,
          listingType: carData.forSale ? "sale" : "rent",
          pricePerDay: carData.pricePerDay || "",
          salePrice: carData.salePrice || "",
          isCompatible: carData.isCompatible || false,
        });

        if (carData.location) {
          const [lat, lng] = carData.location.split(",").map(Number);
          setMarker({ lat, lng });
        }
      };
      fetchCar();
    }
  }, [carId]);

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#f5f8fa", minHeight: "100vh" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold text-dark">{carId ? "Edit Car" : "Add New Car"}</h1>
          <p className="text-muted">{carId ? "Update your car listing." : "Fill in the details to list a car."}</p>
        </div>

        <div className="card shadow border-0 rounded-4 p-4 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Brand</label>
                <select className="form-select" name="brand" value={formData.brand} onChange={handleBrandChange} required>
                  <option value="">Select Brand</option>
                  {Object.keys(brandModelMap).map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Model</label>
                <select className="form-select" name="model" value={formData.model} onChange={handleChange} required disabled={!formData.brand}>
                  <option value="">Select Model</option>
                  {formData.brand &&
                    brandModelMap[formData.brand].map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Year</label>
                <select className="form-select" name="year" value={formData.year} onChange={handleChange} required>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* 🔘 Listing Type */}
              <div className="col-md-8">
                <label className="form-label">Listing Type</label>
                <select className="form-select" name="listingType" value={formData.listingType} onChange={handleChange} required>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>

              {/* 💰 Price Input */}
              {formData.listingType === "rent" && (
                <div className="col-md-12">
                  <label className="form-label">Price Per Day (BHD)</label>
                  <input type="number" className="form-control" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required />
                </div>
              )}

              {formData.listingType === "sale" && (
                <div className="col-md-12">
                  <label className="form-label">Sale Price (BHD)</label>
                  <input type="number" className="form-control" name="salePrice" value={formData.salePrice} onChange={handleChange} required />
                </div>
              )}

              <div className="col-12">
                <label className="form-label">Location (click on map)</label>
                {isLoaded ? (
                  <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={marker || center} onClick={handleMapClick}>
                    {marker && <Marker position={marker} />}
                  </GoogleMap>
                ) : (
                  <div className="text-muted">Loading Map...</div>
                )}
                <input type="text" className="form-control mt-2" name="location" value={formData.location} readOnly required />
              </div>

              <div className="col-12">
                <label className="form-label">Upload Car Image</label>
                <input type="file" className="form-control" name="image" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required={!carId} />
                {imageFile && (
                  <div className="mt-2">
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ height: 60, borderRadius: 4 }} />
                  </div>
                )}
              </div>

              {/* ♿ Special Needs */}
              <div className="col-md-6">
                <div className="form-check mt-2">
                  <input className="form-check-input" type="checkbox" name="isCompatible" checked={formData.isCompatible} onChange={handleChange} id="compatibleCheck" />
                  <label className="form-check-label" htmlFor="compatibleCheck">Compatible for Special Needs</label>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column flex-md-row gap-3 mt-4">
              <button type="submit" className="btn btn-primary px-4 py-2 w-100 w-md-auto">
                {carId ? "Update Car" : "Add Car"}
              </button>
              <Link to="/dealer/cars/rentals" className="btn btn-outline-danger px-4 py-2 w-100 w-md-auto">
                Cancel / Go Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCar;
