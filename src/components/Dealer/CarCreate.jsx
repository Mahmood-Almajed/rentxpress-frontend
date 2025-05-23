import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import * as carService from "../../services/carService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const brandModelMap = {
  Toyota: [
    "Corolla",
    "Camry",
    "RAV4",
    "Highlander",
    "Yaris",
    "Prius",
    "Land Cruiser",
    "Fortuner",
    "Hilux",
    "Avalon",
    "Sequoia",
    "Tacoma",
    "4Runner",
    "Prado",
  ],
  Honda: [
    "Civic",
    "Accord",
    "CR-V",
    "Pilot",
    "Fit",
    "Odyssey",
    "HR-V",
    "Jazz",
    "Insight",
    "Element",
    "Ridgeline",
  ],
  Ford: [
    "Fusion",
    "Escape",
    "Focus",
    "Explorer",
    "Mustang",
    "Edge",
    "F-150",
    "Expedition",
    "Bronco",
    "Ranger",
    "Taurus",
  ],
  Chevrolet: [
    "Malibu",
    "Equinox",
    "Tahoe",
    "Impala",
    "Cruze",
    "Traverse",
    "Suburban",
    "Camaro",
    "Silverado",
    "Blazer",
    "Trailblazer",
  ],
  BMW: [
    "3 Series",
    "5 Series",
    "7 Series",
    "X1",
    "X3",
    "X5",
    "X6",
    "X7",
    "M3",
    "M5",
    "i3",
    "i8",
    "Z4",
  ],
  MercedesBenz: [
    "A-Class",
    "C-Class",
    "E-Class",
    "S-Class",
    "GLA",
    "GLC",
    "GLE",
    "GLS",
    "G-Class",
    "CLA",
    "SL-Class",
    "AMG GT",
  ],
  Audi: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "TT", "RS5", "e-tron"],
  Volkswagen: [
    "Golf",
    "Jetta",
    "Passat",
    "Tiguan",
    "Atlas",
    "Touareg",
    "Beetle",
    "Polo",
  ],
  Hyundai: [
    "Elantra",
    "Tucson",
    "Santa Fe",
    "Sonata",
    "Accent",
    "Palisade",
    "Kona",
    "Venue",
    "Creta",
    "Elentra-N",
  ],
  Kia: [
    "Sorento",
    "Sportage",
    "Soul",
    "Optima",
    "Rio",
    "Seltos",
    "Telluride",
    "Carnival",
    "Cerato",
  ],
  Nissan: [
    "Altima",
    "Sentra",
    "Rogue",
    "Pathfinder",
    "Tiida",
    "Micra",
    "Maxima",
    "Patrol",
    "X-Trail",
    "Juke",
    "Armada",
    "Navara",
  ],
  Tesla: [
    "Model S",
    "Model 3",
    "Model X",
    "Model Y",
    "Roadster",
    "Cybertruck",
    "Semi",
  ],
  Lexus: ["IS", "ES", "GS", "LS", "RX", "NX", "UX", "GX", "LX", "RC", "LC"],
  Mazda: [
    "Mazda2",
    "Mazda3",
    "Mazda6",
    "CX-3",
    "CX-5",
    "CX-9",
    "MX-5 Miata",
    "RX-8",
  ],
  Subaru: [
    "Impreza",
    "Outback",
    "Forester",
    "Crosstrek",
    "Legacy",
    "BRZ",
    "Ascent",
    "WRX",
  ],
  Jeep: [
    "Wrangler",
    "Cherokee",
    "Compass",
    "Grand Cherokee",
    "Renegade",
    "Gladiator",
  ],
  Dodge: ["Charger", "Challenger", "Durango", "Journey", "Dart", "Ram 1500"],
  GMC: ["Sierra", "Yukon", "Terrain", "Acadia", "Canyon", "Envoy", "Savana"],
  Porsche: ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Boxster"],
  LandRover: [
    "Range Rover",
    "Range Rover Sport",
    "Range Rover Velar",
    "Discovery",
    "Discovery Sport",
    "Defender",
    "Freelander",
  ],
  Mitsubishi: [
    "Lancer",
    "Outlander",
    "Pajero",
    "Mirage",
    "ASX",
    "Eclipse Cross",
  ],
};

const modelToTypeMap = {
  // SUVs
  RAV4: "SUV",
  Highlander: "SUV",
  "4Runner": "SUV",
  Prado: "SUV",
  Fortuner: "SUV",
  "CR-V": "SUV",
  Pilot: "SUV",
  "HR-V": "SUV",
  Escape: "SUV",
  Explorer: "SUV",
  Edge: "SUV",
  Expedition: "SUV",
  Equinox: "SUV",
  Tahoe: "SUV",
  Traverse: "SUV",
  Suburban: "SUV",
  Blazer: "SUV",
  Trailblazer: "SUV",
  X3: "SUV",
  X5: "SUV",
  X6: "SUV",
  X7: "SUV",
  GLA: "SUV",
  GLC: "SUV",
  GLE: "SUV",
  GLS: "SUV",
  Q5: "SUV",
  Q7: "SUV",
  Q8: "SUV",
  Tiguan: "SUV",
  Atlas: "SUV",
  Touareg: "SUV",
  Tucson: "SUV",
  "Santa Fe": "SUV",
  Palisade: "SUV",
  Kona: "SUV",
  Venue: "SUV",
  Creta: "SUV",
  Sorento: "SUV",
  Sportage: "SUV",
  Telluride: "SUV",
  Seltos: "SUV",
  Rogue: "SUV",
  Pathfinder: "SUV",
  "X-Trail": "SUV",
  Armada: "SUV",
  RX: "SUV",
  NX: "SUV",
  UX: "SUV",
  GX: "SUV",
  LX: "SUV",
  "CX-5": "SUV",
  "CX-9": "SUV",
  Outback: "SUV",
  Forester: "SUV",
  Ascent: "SUV",
  "Grand Cherokee": "SUV",
  Wrangler: "SUV",
  Cherokee: "SUV",
  Compass: "SUV",
  Durango: "SUV",
  Yukon: "SUV",
  Terrain: "SUV",
  Acadia: "SUV",
  Macan: "SUV",
  Cayenne: "SUV",
  "Range Rover": "SUV",
  Defender: "SUV",
  Discovery: "SUV",
  Outlander: "SUV",
  Pajero: "SUV",
  "Eclipse Cross": "SUV",

  // Trucks
  Hilux: "Truck",
  Tacoma: "Truck",
  "F-150": "Truck",
  Silverado: "Truck",
  "Ram 1500": "Truck",
  Sierra: "Truck",
  Ranger: "Truck",
  Navara: "Truck",
  Ridgeline: "Truck",
  Cybertruck: "Truck",

  // Off-Road
  "Land Cruiser": "Off-Road",
  Patrol: "Off-Road",
  Bronco: "Off-Road",

  // Sedans
  Camry: "Sedan",
  Corolla: "Sedan",
  Yaris: "Sedan",
  Prius: "Sedan",
  Avalon: "Sedan",
  Civic: "Sedan",
  Accord: "Sedan",
  Fit: "Sedan",
  Insight: "Sedan",
  Sentra: "Sedan",
  Altima: "Sedan",
  Tiida: "Sedan",
  Fusion: "Sedan",
  Focus: "Sedan",
  Taurus: "Sedan",
  Malibu: "Sedan",
  Impala: "Sedan",
  Cruze: "Sedan",
  A3: "Sedan",
  A4: "Sedan",
  A6: "Sedan",
  A8: "Sedan",
  Mazda3: "Sedan",
  Mazda6: "Sedan",
  Sonata: "Sedan",
  Elantra: "Sedan",
  Accent: "Sedan",
  Cerato: "Sedan",
  Optima: "Sedan",
  Rio: "Sedan",
  Maxima: "Sedan",
  Lancer: "Sedan",
  Mirage: "Sedan",

  // Hatchbacks
  Beetle: "Hatchback",
  Soul: "Hatchback",
  Jazz: "Hatchback",
  Element: "Hatchback",

  // Convertibles/Sports
  "MX-5 Miata": "Convertible",
  Z4: "Convertible",
  Mustang: "Sports",
  Camaro: "Sports",
  M3: "Sports",
  M5: "Sports",
  RS5: "Sports",
  911: "Sports",
  Boxster: "Sports",
  TT: "Sports",
  BRZ: "Sports",
  "RX-8": "Sports",
  Challenger: "Muscle",

  // Electric / Hybrid / Luxury
  "Model S": "Electric",
  "Model 3": "Electric",
  "Model X": "Electric",
  "Model Y": "Electric",
  Roadster: "Electric",
  Taycan: "Electric",
  i3: "Electric",
  i8: "Hybrid",
  "S-Class": "Luxury",
  Panamera: "Luxury",
  LC: "Luxury",

  "3 Series": "Sedan",
  "5 Series": "Sedan",
  "7 Series": "Luxury",
  "A-Class": "Sedan",
  "AMG GT": "Sports",
  ASX: "SUV",
  "C-Class": "Sedan",
  CLA: "Sedan",
  "CX-3": "SUV",
  Canyon: "Truck",
  Carnival: "Van",
  Charger: "Muscle",
  Crosstrek: "SUV",
  Dart: "Sedan",
  "Discovery Sport": "SUV",
  "E-Class": "Luxury",
  ES: "Sedan",
  "Elentra-N": "Sedan",
  Envoy: "SUV",
  Freelander: "SUV",
  "G-Class": "SUV",
  GS: "Sedan",
  Gladiator: "Truck",
  Golf: "Hatchback",
  IS: "Sedan",
  Impreza: "Sedan",
  Jetta: "Sedan",
  Journey: "SUV",
  Juke: "SUV",
  LS: "Luxury",
  Legacy: "Sedan",
  Mazda2: "Hatchback",
  Micra: "Hatchback",
  Odyssey: "Van",
  Passat: "Sedan",
  Polo: "Hatchback",
  Q3: "SUV",
  RC: "Coupe",
  "Range Rover Sport": "SUV",
  "Range Rover Velar": "SUV",
  Renegade: "SUV",
  "SL-Class": "Convertible",
  Semi: "Truck",
  Sequoia: "SUV",
  WRX: "Sports",
  X1: "SUV",
  "e-tron": "Electric",
  Savana: "Van",
};

const CreateCar = (props) => {
  const { carId } = useParams();
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: currentYear,
    type: "",
    location: "",
    listingType: "rent",
    pricePerDay: "",
    salePrice: "",
    forSale: false,
    isSold: false,
    buyerId: "",
    isCompatible: false,
    dealerPhone: "",
    mileage: "",
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [marker, setMarker] = useState(null);

  const mapContainerStyle = { width: "100%", height: "300px" };
  const center = { lat: 26.2235, lng: 50.5876 };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // Auto-fill type based on model
    if (name === "model") {
      const detectedType = modelToTypeMap[value] || "";
      updated.type = detectedType;
    }

    setFormData(updated);
  };

  const handleBrandChange = (e) => {
    setFormData({ ...formData, brand: e.target.value, model: "" });
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    setFormData({ ...formData, location: `${lat}, ${lng}` });
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };
  const [removedImageIds, setRemovedImageIds] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.brand ||
      !formData.model ||
      !formData.year ||
      !formData.location ||
      !formData.dealerPhone
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.listingType === "rent" && !formData.pricePerDay) {
      toast.error("Please enter price per day for rentals.");
      return;
    }
    if (formData.listingType === "sale" && !formData.salePrice) {
      toast.error("Please enter sale price.");
      return;
    }

    if (!carId && imageFiles.length === 0) {
      toast.error("At least one image is required.");
      return;
    }

    const bahrainPhoneRegex =
      /^(\+973)?(3(20|21|22|23|80|81|82|83|84|87|88|89|9\d)\d{5}|33\d{6}|34[0-6]\d{5}|35(0|1|3|4|5)\d{5}|36\d{6}|37\d{6}|31\d{6}|66(3|6|7|8|9)\d{5}|6500\d{4}|1\d{7})$/;

    if (!bahrainPhoneRegex.test(formData.dealerPhone)) {
      toast.error(
        "Invalid Bahrain phone number. Use valid 8-digit number starting with 3xx, 33–37, 31, or 1."
      );
      return;
    }

    const data = new FormData();
    const payload = {
      ...formData,
      forSale: formData.listingType === "sale",
      pricePerDay: formData.listingType === "rent" ? formData.pricePerDay : "",
      salePrice: formData.listingType === "sale" ? formData.salePrice : "",
      isSold: formData.listingType === "sale" ? formData.isSold : false,
      buyerId: formData.listingType === "sale" ? formData.buyerId : "",
    };

    for (const key in payload) {
      const value = payload[key];
      if (value !== undefined && value !== null && typeof value !== "object") {
        data.append(key, String(value));
      }
    }

    imageFiles.forEach((file) => {
      data.append("images", file);
    });

    // Append removeIds before the fetch call
    if (removedImageIds.length > 0) {
      removedImageIds.forEach((id) => data.append("removeIds", id));
    }

    carId ? props.handleUpdateCar(carId, data) : props.handleAddCar(data);
  };

  useEffect(() => {
    if (carId) {
      const fetchCar = async () => {
        const carData = await carService.show(carId);

        // Auto-detect type if not saved already
        if (!carData.type && carData.model) {
          carData.type = modelToTypeMap[carData.model] || "";
        }

        setFormData({
          ...carData,
          listingType: carData.forSale ? "sale" : "rent",
          pricePerDay: carData.pricePerDay || "",
          salePrice: carData.salePrice || "",
          isCompatible: carData.isCompatible || false,
          isSold: carData.isSold || false,
          buyerId: carData.buyerId || "",
          dealerPhone: carData.dealerPhone || "",
          type: carData.type || "",
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
    <div
      className="container-fluid py-5"
      style={{ backgroundColor: "#f5f8fa", minHeight: "100vh" }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold text-dark">
            {carId ? "Edit Car" : "Add New Car"}
          </h1>
          <p className="text-muted">
            {carId
              ? "Update your car listing."
              : "Fill in the details to list a car."}
          </p>
        </div>
        <div className="card shadow border-0 rounded-4 p-4 bg-white">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Brand</label>
                <select
                  className="form-select"
                  name="brand"
                  value={formData.brand}
                  onChange={handleBrandChange}
                  required
                >
                  <option value="">Select Brand</option>
                  {Object.keys(brandModelMap).map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Model</label>
                <select
                  className="form-select"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  disabled={!formData.brand}
                >
                  <option value="">Select Model</option>
                  {formData.brand &&
                    brandModelMap[formData.brand].map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Year</label>
                <select
                  className="form-select"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Car Type</label>
                <select
                  className="form-select"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Truck">Truck</option>
                  <option value="Off-Road">Off-Road</option>
                  <option value="Electric">Electric</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Sports">Sports</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Van">Van</option>
                  <option value="Muscle">Muscle</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Listing Type</label>
                <select
                  className="form-select"
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  required
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>

              {formData.listingType === "rent" && (
                <div className="col-md-12">
                  <label className="form-label">Price Per Day (BHD)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {formData.listingType === "sale" && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Sale Price (BHD)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Mark as Sold?</label>
                    <select
                      name="isSold"
                      className="form-select"
                      value={formData.isSold ? "true" : "false"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isSold: e.target.value === "true",
                        })
                      }
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </>
              )}

              <div className="col-12">
                <label className="form-label">Location (click on map)</label>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={10}
                    center={marker || center}
                    onClick={handleMapClick}
                  >
                    {marker && <Marker position={marker} />}
                  </GoogleMap>
                ) : (
                  <div className="text-muted">Loading Map...</div>
                )}
                <input
                  type="text"
                  className="form-control mt-2"
                  name="location"
                  value={formData.location}
                  readOnly
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Upload Car Images</label>
                <input
                  type="file"
                  className="form-control"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  required={!carId}
                />
                <div className="mt-3 d-flex flex-wrap gap-3">
                  {imageFiles.map((file, idx) => (
                    <div key={`new-${idx}`} className="position-relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`new-${idx}`}
                        className="rounded border"
                        style={{ width: 60, height: 60, objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImageFiles((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0"
                        style={{
                          transform: "translate(50%, -50%)",
                          fontSize: "0.6rem",
                          lineHeight: 1,
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {carId &&
                    imageFiles.length === 0 &&
                    formData.images?.map((img, idx) => (
                      <div
                        key={`existing-${idx}`}
                        className="position-relative"
                      >
                        <img
                          src={img.url}
                          alt={`existing-${idx}`}
                          className="rounded border"
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const removedImage = formData.images[idx];
                            setRemovedImageIds((prev) => [
                              ...prev,
                              removedImage.cloudinary_id,
                            ]);
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0"
                          style={{
                            transform: "translate(50%, -50%)",
                            fontSize: "0.6rem",
                            lineHeight: 1,
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Dealer Phone</label>
                <div className="input-group">
                  <span className="input-group-text"> 🇧🇭 +973</span>
                  <input
                    type="tel"
                    className="form-control"
                    name="dealerPhone"
                    value={formData.dealerPhone}
                    onChange={handleChange}
                    placeholder="Enter your number"
                    required
                    pattern="(\+973)?(3(20|21|22|23|80|81|82|83|84|87|88|89|9[0-9])[0-9]{5}|33[0-9]{6}|34[0-6][0-9]{5}|35(0|1|3|4|5)[0-9]{5}|36[0-9]{6}|37[0-9]{6}|31[0-9]{6}|66(3|6|7|8|9)[0-9]{5}|6500[0-9]{4}|1[0-9]{7})"
                    maxLength={8}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="mileage" className="form-label">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="col-md-6 mt-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isCompatible"
                    checked={formData.isCompatible}
                    onChange={handleChange}
                    id="compatibleCheck"
                  />
                  <label className="form-check-label" htmlFor="compatibleCheck">
                    Compatible for Special Needs
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column flex-md-row gap-3 mt-4">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 w-100 w-md-auto"
              >
                {carId ? "Update Car" : "Add Car"}
              </button>
              <Link
                to="/dealer/cars/rentals"
                className="btn btn-outline-danger px-4 py-2 w-100 w-md-auto"
              >
                Cancel / Go Back
              </Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
    </div>
  );
};

export default CreateCar;
