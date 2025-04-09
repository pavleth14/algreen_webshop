import React, { useState } from 'react';
import { Footer, Navbar } from "../components";
import { Link } from 'react-router-dom';

const Register = () => {
    // State to manage form input values
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        date_of_birth: '',
        gender: 'male', // default value
        preferences: {
            newsletter: true, // default value
            marketing: true, // default value
            notifications: true, // default value
        }
    });

    // Handle changes in form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name in formData.preferences) {
            // Handle nested preferences
            setFormData(prevState => ({
                ...prevState,
                preferences: {
                    ...prevState.preferences,
                    [name]: value === 'true'
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the data in the required structure
        const dataToSend = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            phone_number: formData.phone_number,
            date_of_birth: formData.date_of_birth,
            gender: formData.gender,
            preferences: formData.preferences, // preferences is already an object
        };

        // Send the data to the server using fetch or axios
        fetch('http://localhost:3333/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // You can handle the response here (e.g., redirect the user to a login page)

                // Pavle cemu mi sluzi localStorage za registraciju

                // localStorage.setItem("accessToken", data.data.accessToken);
                // localStorage.setItem("refreshToken", data.data.refreshToken);
                // localStorage.setItem("userId", data.data.user._id);
                alert("Verification email has been sent. Please check your email inbox.");
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle any errors here
            });
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="form my-3">
                                <label htmlFor="first_name">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="first_name"
                                    name="first_name"
                                    placeholder="Enter your first name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form my-3">
                                <label htmlFor="last_name">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Enter your last name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form my-3">
                                <label htmlFor="email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form my-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form my-3">
                                <label htmlFor="phone_number">Phone Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone_number"
                                    name="phone_number"
                                    placeholder="Enter your phone number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form my-3">
                                <label htmlFor="date_of_birth">Date of Birth</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form my-3">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    className="form-control"
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Preferences */}
                            <div className="form my-3">
                                <label>Preferences</label>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="newsletter"
                                        name="newsletter"
                                        checked={formData.preferences.newsletter}
                                        onChange={e => handleInputChange({ target: { name: 'newsletter', value: e.target.checked.toString() } })}
                                    />
                                    <label className="form-check-label" htmlFor="newsletter">Subscribe to Newsletter</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="marketing"
                                        name="marketing"
                                        checked={formData.preferences.marketing}
                                        onChange={e => handleInputChange({ target: { name: 'marketing', value: e.target.checked.toString() } })}
                                    />
                                    <label className="form-check-label" htmlFor="marketing">Receive Marketing Emails</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="notifications"
                                        name="notifications"
                                        checked={formData.preferences.notifications}
                                        onChange={e => handleInputChange({ target: { name: 'notifications', value: e.target.checked.toString() } })}
                                    />
                                    <label className="form-check-label" htmlFor="notifications">Enable Notifications</label>
                                </div>
                            </div>

                            <div className="my-3">
                                <p>Already have an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit">
                                    Register
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

export default Register;
