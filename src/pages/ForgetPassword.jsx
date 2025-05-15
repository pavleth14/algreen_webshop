import { useEffect, useRef, useState } from "react";
import { Navbar } from "../components";
import { useSelector } from "react-redux";

const ForgeetPassword = () => {

    const accessToken = useSelector(state => state.auth?.accessToken);
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    }, [])

    const [email, setEmail] = useState('');

    const handleForgetPassword = (e) => {
        setEmail(e.target.value);
    }

    const handleSetToEmail = async () => {
        if (!email || !email.includes('@')) {
            alert('Unesite validan email');
            return;
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }
            const response = await fetch('http://localhost:3333/api/auth/forgot-password', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ 'email': email }) 
            });

            const data = await response.json();
            console.log('Odgovor sa servera:', data);

            if (data.success) {
                alert('Email za resetovanje lozinke je poslat.');
            } else {
                alert(`Greška: ${data.message}`);
                console.error(data.errors); 
            }
        } catch (error) {
            console.error('Greška prilikom slanja zahteva:', error);
            alert('Došlo je do greške. Pokušajte ponovo.');
        }
    };

    return (
        <div>
            <Navbar />
            <hr />
            <div style={{textAlign: 'center', marginTop: '50px', marginBottom: '50px', marginRight: '50px'}}>
            <h1 style={{ textAlign: 'center', padding: '40px' }}>Forget Password?</h1>
            <input             
            style={{padding: '5px'}} 
            type="text" 
            ref={inputRef}
            value={email}
            onChange={handleForgetPassword} 
            placeholder="Enter your email..." />
            <button className="btn btn-outline-dark mb-1 ml-3"  onClick={handleSetToEmail}>Send to email</button>            
            </div>            
        </div>
    );
}

export default ForgeetPassword;

// className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i>