import React, { useEffect, useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from 'react-redux';
import useMe from "../hooks/useMe";

const ContactPage = () => {

  useMe();

  const accessToken = useSelector(state => state.auth?.accessToken);
  console.log(accessToken); 

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, [])

  return (
    <>
      {isLoaded && <Navbar />}
      <div className="container my-3 py-3">
        <h1 className="text-center">Contact Us</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form>
              <div className="form my-3">
                <label htmlFor="Name">Name</label>
                <input
                  type="email"
                  className="form-control"
                  id="Name"
                  placeholder="Enter your name"
                />
              </div>
              <div className="form my-3">
                <label htmlFor="Email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="Email"
                  placeholder="name@example.com"
                />
              </div>
              <div className="form  my-3">
                <label htmlFor="Password">Message</label>
                <textarea
                  rows={5}
                  className="form-control"
                  id="Password"
                  placeholder="Enter your message"
                />
              </div>
              <div className="text-center">
                <button
                  className="my-2 px-4 mx-auto btn btn-dark"
                  type="submit"
                  disabled
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
