import { useState } from "react";
import * as approvalService from "../../services/approvalService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DealerRequest = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequest = async () => {
    if (!formData.phone || !formData.description.trim()) {
      toast.error("All fields are required.");
      return;
    }
    const bahrainPhoneRegex =
      /^(\+973)?(3(20|21|22|23|80|81|82|83|84|87|88|89|9\d)\d{5}|33\d{6}|34[0-6]\d{5}|35(0|1|3|4|5)\d{5}|36\d{6}|37\d{6}|31\d{6}|66(3|6|7|8|9)\d{5}|6500\d{4}|1\d{7})$/;

    if (!bahrainPhoneRegex.test(formData.phone)) {
      toast.error(
        "Invalid Bahrain phone number. Allowed prefixes: 3xx (Batelco), 33/34x/35x (STC), 36/37 (Zain), 31 (Royal Court), 1xxxxxxx (Landline)."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await approvalService.requestDealer(formData);

      if (response && response.approval) {
        toast.success("Your dealer request has been sent!");
        setSubmitted(true);
      } else if (response?.error) {
        toast.error(response.error);
      } else {
        toast.info("Request submitted. Waiting for admin approval.");
        setSubmitted(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 bg-light" id="dealer-request">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-md-6">
            <h2 className="fw-bold text-dark mb-3">
              Become a Dealer with Car
              <span style={{ color: "#06b4d8" }}>X</span>press
            </h2>
            <hr
              className="mb-4"
              style={{ width: "60px", border: "2px solid rgb(0, 139, 203)" }}
            />
            <p className="text-muted fs-5" style={{ textAlign: "justify" }}>
              Turn your car into income. Whether you're a car enthusiast, an
              individual owner, or a dealership —
              <strong>
                {" "}
                Car<span style={{ color: "#06b4d8" }}>X</span>press{" "}
              </strong>{" "}
              gives you the tools to rent or sell cars easily across Bahrain.
            </p>
            <ul className="list-unstyled mt-4">
              <li className="d-flex mb-3">
                <i
                  className="fas fa-check-circle me-3 mt-1"
                  style={{ color: "#06b4d8" }}
                ></i>
                <div style={{ textAlign: "justify" }}>
                  <strong>List for Rent or Sale:</strong> Choose whether to rent
                  your car by day or sell it outright — you’re in control.
                </div>
              </li>
              <li className="d-flex mb-3">
                <i
                  className="fas fa-check-circle me-3 mt-1"
                  style={{ color: "#06b4d8" }}
                ></i>
                <div style={{ textAlign: "justify" }}>
                  <strong>Easy Uploads:</strong> Add multiple images, pricing,
                  mileage, and even ♿ accessibility options in seconds.
                </div>
              </li>
              <li className="d-flex mb-3">
                <i
                  className="fas fa-check-circle me-3 mt-1"
                  style={{ color: "#06b4d8" }}
                ></i>
                <div style={{ textAlign: "justify" }}>
                  <strong>Manage Everything in One Place:</strong> Approve
                  rental requests, mark cars as sold, and chat with users via
                  your personalized dashboard.
                </div>
              </li>
              <li className="d-flex mb-3">
                <i
                  className="fas fa-check-circle me-3 mt-1"
                  style={{ color: "#06b4d8" }}
                ></i>
                <div style={{ textAlign: "justify" }}>
                  <strong>Get Discovered:</strong> Reach users across Bahrain
                  with our smart filters, AI chatbot, and location-based
                  visibility.
                </div>
              </li>
              <li className="d-flex">
                <i
                  className="fas fa-check-circle me-3 mt-1"
                  style={{ color: "#06b4d8" }}
                ></i>
                <div style={{ textAlign: "justify" }}>
                  <strong>No Showroom Needed:</strong> All you need is a car —
                  whether it’s one or twenty. CarXpress works for everyone.
                </div>
              </li>
            </ul>
          </div>

          <div className="col-md-6">
            <div className="card bg-dark text-light shadow-lg border-0 rounded-4 p-4">
              {submitted ? (
                <div className="text-center">
                  <h4 className="mb-3">🎉 Request Sent</h4>
                  <p>Your dealer request is pending admin approval.</p>
                </div>
              ) : (
                <>
                  <h4 className="mb-3">Request Dealer Access</h4>
                  <form noValidate>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text">🇧🇭 +973</span>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your number"
                          required
                          pattern="(\+973)?(3(20|21|22|23|80|81|82|83|84|87|88|89|9[0-9])[0-9]{5}|33[0-9]{6}|34[0-6][0-9]{5}|35(0|1|3|4|5)[0-9]{5}|36[0-9]{6}|37[0-9]{6}|31[0-9]{6}|66(3|6|7|8|9)[0-9]{5}|6500[0-9]{4}|1[0-9]{7})"
                          maxLength={8}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Why do you want to become a dealer?
                      </label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="d-grid">
                      <button
                        type="button"
                        className="btn btn-lg"
                        style={{ backgroundColor: "#06b4d8" }}
                        onClick={handleRequest}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Submitting...
                          </>
                        ) : (
                          "Send Request"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
    </section>
  );
};

export default DealerRequest;
