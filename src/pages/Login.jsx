import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";

const Login = () => {
  // State to manage the email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verified, setVerified] = useState(false); // State to track if user is verified

  const navigate = useNavigate(); // To handle redirection
  const location = useLocation(); // To access the current URL and its query parameters

  // Check for the 'verified' query parameter when the component is mounted
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('verified') === 'true') {
      setVerified(true); // Set verified to true if the query parameter exists
    }
  }, [location]);

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();

    const dataToSend = {
      email: email,
      password: password
    };

    console.log('data to send: ', dataToSend);

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'bc8lygUI0i1nnES5eM6hxBFZgsICG8ca',
          },
          body: JSON.stringify(dataToSend), 
        });

        const data = await response.json();
        console.log('Login response data: ', data);

        // Handle the response here (e.g., save tokens, user data, etc.)
        if (data.success) {
          // Store tokens or other important user data here
          console.log('Login successful!');
          // Store tokens and user ID
          localStorage.setItem("accessToken", data.data.tokens.accessToken);
          localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
          localStorage.setItem("userId", data.data.user._id);

          toast.success('You are logged in');
          
          // Redirect to /products after successful login
          setTimeout(() => {
            navigate('/product');            
          }, 1000);
        } else {
          toast.error('Login failed! Please check your credentials.');          
        }

      } catch (error) {
        console.log('Error fetching data: ', error);        
      }
    };

    fetchData();
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        
        {/* Show success message if verified query parameter is present */}
        {verified && (
          <div className="alert alert-success text-center" role="alert">
            Your account has been successfully verified. You can now log in.
          </div>
        )}

        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form>
              <div className="my-3">
                <label htmlFor="display-4">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update state on input change
                />
              </div>
              <div className="my-3">
                <label htmlFor="floatingPassword display-4">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update state on input change
                />
              </div>
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
              <div className="text-center">
                <button onClick={handleLogin} className="my-2 mx-auto btn btn-dark" type="submit">
                  Login
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

export default Login;
