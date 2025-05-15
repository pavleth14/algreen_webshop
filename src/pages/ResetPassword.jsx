// src/pages/ResetPassword.jsx
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    console.log("Token iz URL-a:", token);

    const newPasswordRef = useRef();

    useEffect(() => {
        newPasswordRef.current.focus();
    }, [])

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert("Lozinka mora imati bar 6 karaktera.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Lozinke se ne poklapaju.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3333/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token,
                    password: newPassword,
                    confirm_password: confirmPassword
                })
            });

            const data = await response.json();
            console.log(data);

            if (data.success) {
                alert("Uspešno ste resetovali lozinku.");
                navigate('/login')
            } else {
                alert(`Greška: ${data.message}`);
            }

        } catch (err) {
            console.error("Greška:", err);
            alert("Nešto je pošlo po zlu.");
        }
    };


    return (
        <div>
            <Navbar />
            <div style={{ textAlign: 'center', marginTop: '50px', marginBottom: '50px', marginRight: '100px' }}>
            <h1 style={{ textAlign: 'center', padding: '40px' }}>Reset Password</h1>
                
                <div>
                    <input style={{marginBottom: '10px', padding: '5px'}}                        
                        type="password"
                        placeholder="Nova lozinka..."
                        value={newPassword}
                        ref={newPasswordRef}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div>
                    <input style={{marginBottom: '10px', padding: '5px'}}
                        type="password"
                        placeholder="Potvrdi lozinku..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button className="btn btn-outline-dark" onClick={handleResetPassword}>Postavi lozinku</button>
                
            </div>
        </div>
    );
};

export default ResetPassword;
