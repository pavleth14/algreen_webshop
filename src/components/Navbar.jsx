import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from "react-hot-toast";

const Navbar = () => {
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const state = useSelector(state => state.handleCart); // Pavle totalQuantity umesto state.length  
    const location = useLocation();  // Get the current location/path

    // Check if the user is logged in when the component mounts
    useEffect(() => {
        // Check if user is logged in by the presence of access token in localStorage
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }

        const quantity = state.reduce((total, item) => total + item.quantity, 0);
        setTotalQuantity(quantity);
    }, [state]);

    // Custom click handler to prevent reloading on the same page

    const handleClick = (e, to) => {
        if (location.pathname === to) {
            // Prevent the default action if we're already on the page
            e.preventDefault();
            localStorage.removeItem('api url');
            localStorage.removeItem('currentCategory');
            localStorage.removeItem('currentSubCategory');
            window.location.reload();
        }
    };

    // Handle Logout
    const handleLogout = async () => {

        const isConfirmed = window.confirm("Are you sure you want to logout?");

        if (isConfirmed) {
            try {
                // Send a logout request to the backend
                const response = await fetch('http://localhost:3333/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        accessToken: localStorage.getItem('accessToken') // Send the token to invalidate
                    })
                });

                const data = await response.json();
                console.log('Logout response:', data);

                if (data.success) {
                    // Clear localStorage to log the user out
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("userId");

                    // Update the UI after logout
                    setIsLoggedIn(false);
                    toast.success('You are logged out');
                } else {
                    console.log('Logout failed!');
                }
            } catch (error) {
                console.log('Error logging out:', error);
            }
        }


    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">React Ecommerce</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/"
                                onClick={(e) => handleClick(e, "/")}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/product"
                                onClick={(e) => handleClick(e, "/product")}
                            >
                                Products
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/about"
                                onClick={(e) => handleClick(e, "/about")}
                            >
                                About
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/contact"
                                onClick={(e) => handleClick(e, "/contact")}
                            >
                                Contact
                            </NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        {/* Show Login and Register buttons if user is not logged in */}
                        {!isLoggedIn && (
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-2"><i className="fa fa-sign-in-alt mr-1"></i> Login</NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i> Register</NavLink>
                            </>
                        )}

                        <NavLink to="/cart" className="btn btn-outline-dark m-2"><i className="fa fa-cart-shopping mr-1"></i> Cart ({totalQuantity}) </NavLink>

                        {/* Show Logout button if user is logged in */}
                        {isLoggedIn && (
                            <button onClick={handleLogout} className="btn btn-outline-dark m-2">
                                <i className="fa fa-sign-out-alt mr-1"></i> Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
