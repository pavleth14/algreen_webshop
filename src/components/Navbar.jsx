import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from "react-hot-toast";
import { clearAuth, clearRole } from '../redux/reducer/authSlice';  // Importuj akciju za logout

const Navbar = () => {
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Stavimo stanje za login status
    const accessToken = useSelector(state => state.auth?.accessToken);  // Koristi optional chaining
    const state = useSelector(state => state.handleCart);  // Total quantity from cart state
    const dispatch = useDispatch();  // Dispatch za logout

    // Provera statusa prijave sa localStorage-a
    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';  // Proveri da li je korisnik prijavljen
        setIsLoggedIn(loggedInStatus);  // Postavi status
    }, []);  // Ovaj useEffect se izvršava samo prilikom mountovanja komponente

    // Provera i update količine proizvoda u korpi
    useEffect(() => {
        const quantity = state.reduce((total, item) => total + item.quantity, 0);
        setTotalQuantity(quantity);
    }, [state]);  // Ovaj useEffect se izvršava kad god se promeni stanje korpe

    // Handle Logout
    const handleLogout = async () => {
        console.log('Pavle handle logout access token: ', accessToken);
        const isConfirmed = window.confirm("Are you sure you want to logout?");

        if (isConfirmed) {
            try {
                // Send a logout request to the backend
                const response = await fetch('http://localhost:3333/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        accessToken: accessToken // Send the token to invalidate
                    })
                });

                const data = await response.json();
                console.log('Logout response:', data);

                if (data.success) {
                    // Dispatch logout action to clear Redux store
                    dispatch(clearAuth());  // Pozivamo akciju za logout
                    dispatch(clearRole())
                    localStorage.removeItem('role');

                    // Clean up localStorage
                    // localStorage.setItem('isLoggedIn', 'false');  // Postavljamo isLoggedIn u false

                    toast.success('You are logged out');
                    setIsLoggedIn(false);  // Osvežavamo lokalno stanje
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
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/product"
                            >
                                Products
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/about"
                            >
                                About
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/contact"
                            >
                                Contact
                            </NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        {/* Show Login and Register buttons if user is not logged in */}
                        {!isLoggedIn ? (
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-2"><i className="fa fa-sign-in-alt mr-1"></i> Login</NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i> Register</NavLink>
                            </>
                        ) : (
                            // Show Logout button if user is logged in
                            <button onClick={handleLogout} className="btn btn-outline-dark m-2">
                                <i className="fa fa-sign-out-alt mr-1"></i> Logout
                            </button>
                        )}

                        <NavLink to="/cart" className="btn btn-outline-dark m-2"><i className="fa fa-cart-shopping mr-1"></i> Cart ({totalQuantity}) </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
