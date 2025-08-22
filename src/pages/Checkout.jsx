import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useMe from "../hooks/useMe";

const Checkout = () => {
  useMe();
  const accessToken = useSelector(state => state.auth?.accessToken);
  console.log(accessToken);
  const state = useSelector((state) => state.handleCart);
  const cartData = useSelector((state) => state.handleCart);
  console.log("cart data checkout page: ", cartData);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!accessToken) {
    console.error("Nema pristupnog tokena, molim uloguj se");
    return;
  }

  try {
    // Pripremi items niz sa tacnim poljima
    const items = state.map(item => ({
      productId: item.product._id,  // backend ocekuje productId
      quantity: item.quantity,
      price: item.product.price,
    }));

    // Izracunaj subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Pripremi payload u skladu sa backend zahtevima
    const payload = {
      items,
      shippingAddress: {
        street: address,       // naziv mora biti street
        city: city,
        state: stateRegion,    // mora se poslati state
        zipCode: zip,          // mora se poslati zipCode
        country: country,
      },
      totalAmount: subtotal,
      paymentMethod: "credit_card",
    };

    console.log("Payload za backend:", payload);
    console.log("Access Token:", accessToken);

    // Pripremi zaglavlja sa Authorization tokenom
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    // Posalji POST zahtev ka backendu
    const response = await fetch("http://localhost:3333/api/orders", {
      method: "POST",
      headers,
      credentials: "include",  // ako backend koristi kolačiće
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Full backend response:", data);

    if (response.ok && data.success) {
      console.log("Uspešan checkout:", data);
      // Ovdje mozes redirectovati korisnika ili ocistiti korpu
    } else {
      console.error("Checkout error:", data.errors || data);
    }
  } catch (error) {
    console.error("Greška prilikom checkout-a:", error);
  }
};


  const EmptyCart = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">No item in Cart</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    state.forEach((item) => {
      subtotal += item.product.price * item.quantity;
      totalItems += item.quantity;
    });

    return (
      <div className="container py-5">
        <div className="row my-4">
          <div className="col-md-5 col-lg-4 order-md-last">
            <div className="card mb-4">
              <div className="card-header py-3 bg-light">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Products ({totalItems}) <span>${Math.round(subtotal)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Shipping <span>${shipping}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <strong>Total amount</strong>
                    <strong>${Math.round(subtotal + shipping)}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-7 col-lg-8">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h4 className="mb-0">Billing address</h4>
              </div>
              <div className="card-body">
                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-sm-6 my-1">
                      <label htmlFor="firstName" className="form-label">First name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-sm-6 my-1">
                      <label htmlFor="lastName" className="form-label">Last name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 my-1">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 my-1">
                      <label htmlFor="address" className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="address2" className="form-label">Address 2 <span className="text-muted">(Optional)</span></label>
                      <input
                        type="text"
                        className="form-control"
                        id="address2"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                      />
                    </div>

                    <div className="col-md-5 my-1">
                      <label htmlFor="country" className="form-label">Country</label>
                      <select
                        className="form-select"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                      >
                        <option value="">Choose...</option>
                        <option value="India">India</option>
                      </select>
                    </div>

                    <div className="col-md-4 my-1">
                      <label htmlFor="state" className="form-label">State / City</label>
                      <select
                        className="form-select"
                        id="state"
                        value={stateRegion}
                        onChange={(e) => setStateRegion(e.target.value)}
                        required
                      >
                        <option value="">Choose...</option>
                        <option value="Punjab">Punjab</option>
                      </select>
                    </div>

                    <div className="col-md-6 my-1">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-3 my-1">
                      <label htmlFor="zip" className="form-label">Zip</label>
                      <input
                        type="text"
                        className="form-control"
                        id="zip"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h4 className="mb-3">Payment</h4>

                  <div className="row gy-3">
                    <div className="col-md-6">
                      <label htmlFor="cc-name" className="form-label">Name on card</label>
                      <input type="text" className="form-control" id="cc-name" required />
                      <small className="text-muted">Full name as displayed on card</small>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="cc-number" className="form-label">Credit card number</label>
                      <input type="text" className="form-control" id="cc-number" required />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="cc-expiration" className="form-label">Expiration</label>
                      <input type="text" className="form-control" id="cc-expiration" required />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="cc-cvv" className="form-label">CVV</label>
                      <input type="text" className="form-control" id="cc-cvv" required />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <button className="w-100 btn btn-primary" type="submit">
                    Continue to checkout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
