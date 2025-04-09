import { useEffect, useState } from "react";
import '../App.css';
import toast from "react-hot-toast";

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [categoryInputs, setCategoryInputs] = useState({});
    const [tagInputs, setTagInputs] = useState({});
    const [image, setImage] = useState(null);
    const [pageNumber, setPageNumber] = useState(1); 
    const [isFetched, setIsFetched] = useState(false);

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

    useEffect(() => {
        const getProducts = async () => {
            const response = await fetch(`http://localhost:3333/api/products?page=${pageNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'bc8lygUI0i1nnES5eM6hxBFZgsICG8ca',
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

    const handleImageChange = (e, productId) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);

        const formData = new FormData();
        formData.append("image", selectedImage);

        fetch(`http://localhost:3333/api/products/${productId}/image`, {
            method: "POST",
            body: formData,
            headers: {
                'x-api-key': 'bc8lygUI0i1nnES5eM6hxBFZgsICG8ca',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Image uploaded successfully:", data);
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
            });
    };

    const handleSaveChanges = async (productId) => {
        const payload = {
            category_code: categoriesMap[categoryInputs[productId]]?.categoryCode || '',
            tags: [categoriesMap[categoryInputs[productId]]?.subcategories[tagInputs[productId]]], // Napravimo niz ako tag postoji
        };

        const response = await fetch(`http://localhost:3333/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'bc8lygUI0i1nnES5eM6hxBFZgsICG8ca',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const updatedProduct = await response.json();
            setProducts((prevProducts) =>
                prevProducts.map((p) =>
                    p._id === updatedProduct._id ? updatedProduct : p
                )
            );
            toast.success('Product updated successfully')
            // alert('Product updated successfully');

            // Resetovanje input polja za kategoriju i tag
            setCategoryInputs((prev) => ({
                ...prev,
                [productId]: '', // Resetuje kategoriju za ovaj proizvod
            }));
            setTagInputs((prev) => ({
                ...prev,
                [productId]: '', // Resetuje tag za ovaj proizvod
            }));
        } else {
            toast.error('Failed to update product');
            // alert('Failed to update product');
        }
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

    return (
        <div>
            <h1>Admin</h1>
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
