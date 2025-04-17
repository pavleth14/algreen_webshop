import { useEffect, useState } from "react";
import '../App.css';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAccessToken, clearAuth, setRole } from "../redux/reducer/authSlice";



const Admin = () => {
    const [products, setProducts] = useState([]);
    const [categoryInputs, setCategoryInputs] = useState({});
    const [tagInputs, setTagInputs] = useState({});
    const [image, setImage] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isFetched, setIsFetched] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const role = useSelector((state) => state.auth.role);
    console.log('admin page state role: ', role);

    const accessToken = useSelector((state) => state.auth.accessToken);
    console.log('accessToken: ', accessToken);



    // if(role === 'admin') {
    //     localStorage.setItem('role', role); // Pavle, ne sme rola u
    // }

    // const roleStorage = localStorage.getItem('role');
    // console.log('user role in admin: ', roleStorage);

    // useEffect(() => {
    //     if(roleStorage !== 'admin') {   
    //         navigate('/');
    //         return;
    //     }
    // }, [roleStorage])


    useEffect(() => {
        const aboutUser = async (retry = false, overrideToken = null) => {
            const tokenToUse = overrideToken || accessToken;
    
            try {
                const response = await fetch(`http://localhost:3333/api/auth/me`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenToUse}`,                        
                    },
                    credentials: 'include'
                });
    
                if (!response.ok) {
                    if (response.status === 401 && !retry) {
                        const refreshResponse = await fetch('http://localhost:3333/api/auth/refresh-token', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                        });
    
                        const data = await refreshResponse.json();
                        console.log('REFRESH TOKEN DATA:', data);
    
                        if (data.success) {
                            dispatch(setAccessToken(data.data.accessToken));
                            return aboutUser(true, data.data.accessToken);
                        } else {
                            dispatch(clearAuth());
                            toast.error('Failed to refresh token. Please log in again.');
                            navigate('/login');
                            return;
                        }
                    }
    
                    throw new Error(`Fetch failed with status ${response.status}`);
                }
    
                const data = await response.json();
                const userRole = data.data.user.role;
                console.log('user role: ', userRole);
                console.log('me data admin:', data);
    
                dispatch(setRole(userRole));
    
                if (userRole !== 'admin') {
                    toast.error('Access denied');
                    navigate('*');
                }
    
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Something went wrong');
                navigate('*');
            }
        };
    
        aboutUser();
    }, [accessToken, dispatch, navigate]);



    // Mapped category i tag
    const categoriesMap = {
        "Okov za proizvode od stakla": {
            categoryCode: "glass",
            subcategories: {
                "Okov za staklo i tuš kabine": "glass1",
                "Aluminijumski sistem za staklene ograde": "glass2",
                "Držači stakla i spajderi": "glass3",
            }
        },
        "Aluminijumski sistemi za ograde": {
            categoryCode: "aluminum",
            subcategories: {
                "Aluminijumski okrugli sistem": "aluminum1",
                "Aluminijumski kvadratni sistem": "aluminum2",
                "Aluminijumski ovalni sistem": "aluminum3",
                "Aluminijumski sistem za staklene ograde": "aluminum4",
                "Aluminijumski sistem za dvorišne ograde": "aluminum5",
            }
        },
        "Rukohvati, kvake i kontrola pristupa za ulazna vrata": {
            categoryCode: "access",
            subcategories: {
                "Rukohvati": "access1",
                "Kvake": "access2",
                "Kontrola pristupa": "access3",
            }
        }
    };

    // useEffect(() => {
    //     if ( role !== 'admin' ) { // role storage, role
    //       navigate('*');
    //     } 
    //   }, [role, navigate]);  // role storage, role


    useEffect(() => {
        const getProducts = async () => {
            const response = await fetch(`http://localhost:3333/api/products?page=${pageNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'x-api-key': 'bc8lygUI0i1nnES5eM6hxBFZgsICG8ca',
                },
            });
            const data = await response.json();
            console.log('data data admin: ', data.data);
            setProducts(data.data.products);
            data && setIsFetched(true);

            // Inicijalizuj stanje za svaki proizvod
            const initialCategoryInputs = {};
            const initialTagInputs = {};
            data.data.products.forEach((prod) => {
                initialCategoryInputs[prod._id] = prod.category || ''; // Podešavanje početne vrednosti
                initialTagInputs[prod._id] = prod.tag || ''; // Podešavanje početne vrednosti
            });

            setCategoryInputs(initialCategoryInputs);
            setTagInputs(initialTagInputs);
        };
        getProducts();
    }, [pageNumber]);

    const handleCategoryChange = (e, productId) => {
        setCategoryInputs((prev) => ({
            ...prev,
            [productId]: e.target.value,
        }));
    };

    const handleTagChange = (e, productId) => {
        setTagInputs((prev) => ({
            ...prev,
            [productId]: e.target.value,
        }));
    };

    const handleImageChange = async (e, productId, retry = false, overrideToken = null) => {
        const selectedImage = e.target.files[0];
        console.log('Selected image:', selectedImage);

        setImage(selectedImage);

        const formData = new FormData();
        formData.append("image", selectedImage);

        const tokenToUse = overrideToken || accessToken;

        try {
            const response = await fetch(`http://localhost:3333/api/products/${productId}/image`, {
                method: "POST",
                body: formData,
                headers: {
                    // 'Content-Type': 'application/json',              
                    'Authorization': `Bearer ${tokenToUse}`,
                },
            });

            if (!response.ok) {
                // Ako je 401 i nismo već retry-ovali, pokušaj refresh tokena
                if (response.status === 401 && !retry) {
                    const refreshResponse = await fetch('http://localhost:3333/api/auth/refresh-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    });

                    const data = await refreshResponse.json();
                    console.log('REFRESH TOKEN DATA:', data);

                    if (data.success) {
                        dispatch(setAccessToken(data.data.accessToken));
                        dispatch(setRole('admin'));
                        console.log('Access token refreshed:', data.data.accessToken);

                        // Retry upload sa svežim tokenom
                        return handleImageChange(e, productId, true, data.data.accessToken);
                    } else {
                        dispatch(clearAuth());
                        toast.error('Failed to refresh token. Please log in again.');
                        return;
                    }
                }

                throw new Error(`Upload failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log("Image uploaded successfully:", data);
            toast.success("Image uploaded!");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image.");
        }
    };

    const handleSaveChanges = async (productId, retry = false, overrideToken = null) => {
        const tokenToUse = overrideToken || accessToken;

        const payload = {
            category_code: categoriesMap[categoryInputs[productId]]?.categoryCode || '',
            tags: [categoriesMap[categoryInputs[productId]]?.subcategories[tagInputs[productId]]],
        };

        const response = await fetch(`http://localhost:3333/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenToUse}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            if (response.status === 401 && !retry) {
                const refreshResponse = await fetch('http://localhost:3333/api/auth/refresh-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const data = await refreshResponse.json();
                console.log('ADMIN DATA RELOAD:', data);

                if (data.success) {
                    dispatch(setAccessToken(data.data.accessToken));
                    dispatch(setRole('admin'));
                    console.log('Access token refreshed:', data.data.accessToken);
                    
                    return handleSaveChanges(productId, true, data.data.accessToken);
                } else {
                    dispatch(clearAuth());
                    toast.error('Failed to refresh token. Please log in again.');
                    return;
                }
            }

            toast.error('Failed to update product');
            return;
        }

        const updatedProduct = await response.json();
        setProducts((prevProducts) =>
            prevProducts.map((p) =>
                p._id === updatedProduct._id ? updatedProduct : p
            )
        );

        toast.success('Product updated successfully');

        setCategoryInputs((prev) => ({
            ...prev,
            [productId]: '',
        }));
        setTagInputs((prev) => ({
            ...prev,
            [productId]: '',
        }));
    };


    const handlePrevPage = () => {
        setPageNumber(prev => {
            if (prev > 1) {
                return prev - 1;
            }
            return prev;
        });
    };

    const handleNextPage = () => {
        isFetched && setPageNumber(prev => prev + 1);
    }

    const handleLogout = () => {
        navigate('/product')
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Admin</h1>
                <button onClick={handleLogout}>Webcite</button>
            </div>

            <div>
                {products.map((prod) => (
                    <div key={prod._id} className="product-item">
                        <span className="product-name">Naziv proizvoda: {prod.name}</span>
                        <span className="product-lager">Lager: {prod.lager}</span>
                        <span className="product-category">ID kategorije: {prod.category_id}</span>

                        {/* Inputs for category, tag and image change */}
                        <div>
                            <label>Kategorija:</label>
                            <input
                                type="text"
                                value={categoryInputs[prod._id] || ''}
                                onChange={(e) => handleCategoryChange(e, prod._id)} // Set the category for the specific product
                            />
                        </div>
                        <div>
                            <label>Tag:</label>
                            <input
                                type="text"
                                value={tagInputs[prod._id] || ''}
                                onChange={(e) => handleTagChange(e, prod._id)} // Set the tag for the specific product
                            />
                        </div>
                        <div>
                            <label>Slika:</label>
                            <input
                                type="file"
                                onChange={(e) => handleImageChange(e, prod._id)} // Pass product ID here
                            />
                        </div>
                        <div>
                            <button onClick={() => handleSaveChanges(prod._id)}>Sacuvaj izmene</button>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ width: '20%', marginTop: '20px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px', padding: '20px' }}>
                    <button onClick={handlePrevPage} className="btn btn-dark m-1">Prev</button>
                    <button onClick={handleNextPage} className="btn btn-dark m-1">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Admin;
