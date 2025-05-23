// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import { useDispatch } from "react-redux";
import { setAccessToken, setRole } from "../redux/reducer/authSlice";
import toast from "react-hot-toast";
import { Footer, Navbar } from "../components";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch(); // Hook za dispatch Redux akcija

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('verified') === 'true') {
      setVerified(true);
    }
  }, [location]);

  const handleLogin = (e) => {
    e.preventDefault();

    const dataToSend = {
      email: email,
      password: password
    };

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'x-api-key': 'bc8lygUI0i1nnES5eM6hxBFZgsICG8ca',
          },
          credentials: 'include',
          body: JSON.stringify(dataToSend),
        });

        const data = await response.json();
        console.log('data login', data);
        console.log('data.data.accessToken', data.data.accessToken)

        if (data.success) {
          // Store access token in Redux

          dispatch(setAccessToken(data.data.accessToken));

          console.log('role" ', data.data.user.role )
          dispatch(setRole(data.data.user.role));

          // Store refresh token and userId in localStorage (or HttpOnly cookie later)
          // localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
          // localStorage.setItem("userId", data.data.user._id);  

          toast.success('You are logged in');
          setTimeout(() => {
            if (data.data.user.role === 'admin') {
              navigate('/admin')
            } else {
              navigate('/');
            }
          }, 1000);
        } else {
          toast.error('Login failed! Please check your credentials.');
        }
      } catch (error) {
        console.log('Error fetching data: ', error);
        toast.error('Invalid credentials');
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="text-center">
                <button onClick={handleLogin} className="my-2 mx-auto btn btn-dark" type="submit">
                  Login
                </button>
              </div>
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
              <div className="my-3">
                <p>Forget password? <Link to="/forget-password" className="text-decoration-underline text-info">Forget password?</Link> </p>
              </div>
              
            </form>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Login;
