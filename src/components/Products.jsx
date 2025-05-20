import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCart, updateCart, setTestCounter } from "../redux/action";
import toast from "react-hot-toast";
import Menu from "./Menu";
import useMe from '../hooks/useMe'

const Products = () => {

  // const {accessToken} = useMe();
  // console.log(accessToken);
  
  useMe();
  
  const accessToken = useSelector(state => state.auth?.accessToken);
  console.log(accessToken); 


  const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isFetched, setIsFetched] = useState(false);
  const [categoryUrl, setCategoryUrl] = useState('');
  const [cateogoryTagsUrl, setCategoryTagsUrl] = useState('');
  const [testCounter, setTestCounter] = useState(0);
  const [resetStorageApiUrl, setResetStorageApiUrl] = useState(false);

  const dispatch = useDispatch();
  // const testCounter = useSelector((state) => state.cartItems.testCounter);  

  const handleCategoryUrl = (param) => {
    // Ensure categoryUrl only updates if it's different from the current state
    if (categoryUrl !== param) {
      // console.log('Category url: ', param);
      setCategoryUrl(param);
    }
    console.log('url param:', param)
  };

  const handleCategoryTagsUrl = (category, tags) => {
    setCategoryUrl(category);
    console.log('category: ', category);
    setCategoryTagsUrl(tags);
    console.log('tags: ', tags);
  }

  // Pavle vidi da li trebas da radis setFilteredData kad se menja categoryUrl...

  // useEffect(() => {
  //   // Reset filteredData whenever categoryUrl changes
  //   setFilteredData([]);
  // }, [categoryUrl]); // When categoryUrl changes, reset the filtered data



  // get cart data

  useEffect(() => {
    const getCartData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
        };

        if (accessToken) {
          console.log('Pavle: ', 1111111111111111);
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch('http://localhost:3333/api/cart', {
          method: 'GET',
          credentials: 'include',
          headers: headers,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Cart data:', data.data.items);
          dispatch(updateCart(data.data.items));
          dispatch(updateCart(data.data.items));
          setCartData(data);  // Postavljanje podataka u state
          dispatch(updateCart(data.data.items));          
          setCartData(data);  // Postavljanje podataka u state
        } else {
          console.error('Error fetching cart data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    getCartData();
  }, [testCounter, accessToken]);



  useEffect(() => {
    // Fetch the API URL from localStorage
    const storedApiUrl = localStorage.getItem('api url');

    console.log('PAGE NUMBER: ', pageNumber);

    // If there is a stored URL, use it; otherwise, fallback to the default URL logic
    const fetchData = async () => {
      try {
        let apiUrl = storedApiUrl || `http://localhost:3333/api/products?page=${pageNumber}`;

        // If categoryUrl and cateogoryTagsUrl are provided, update the API URL
        if (categoryUrl && cateogoryTagsUrl) {
          apiUrl = `http://localhost:3333/api/products?category_code=${categoryUrl}&tags=${cateogoryTagsUrl}&page=${pageNumber}`;
        } else if (categoryUrl) {
          apiUrl = `http://localhost:3333/api/products?category_code=${categoryUrl}&page=${pageNumber}`;
        }

        console.log('Using API URL:', apiUrl); // Log to check the final URL being used

        const headers = {
          'Content-Type': 'application/json',
        };

        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: headers
        });

        const data = await response.json();
        console.log('Fetched Data:', data);

        setData(data); // Set full data
        setFilteredData(data.data.products || []); // Set products if available
        setIsFetched(true);

        // Store the API URL in localStorage so it can be used later
        localStorage.setItem('api url', apiUrl);
        console.log('api url: ', apiUrl)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [pageNumber, categoryUrl, cateogoryTagsUrl, resetStorageApiUrl, accessToken]);


  // Prvo salji na server, pa na redux (cart put swager)
  const addProduct = (product) => {
    const sendToBackend = async (product) => {
      console.log('Pavle product: ', product);
      console.log('Pavle product id: ', product._id);
      console.log('Pavle ACCESS TOKEN', accessToken);
      try {
        const headers = {
          'Content-Type': 'application/json',
        };

        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch('http://localhost:3333/api/cart', {
          method: 'PUT',
          credentials: 'include',
          headers: headers,
          body: JSON.stringify({
            items: [
              {
                product_id: product._id,
                quantity: 1
              }
            ]
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTestCounter(prev => prev + 1);
          // dispatch(setTestCounter(testCounter + 1));
          console.log('Product added to cart in backend:', data);
          toast.success("Added to cart");
        } else {
          console.error('Failed to add product to cart:', response);
          toast.error("Failed to add product to cart.");
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
        toast.error("An error occurred while adding the product.");
      }
    };

    sendToBackend(product);

    // dispatch(addCart(product));
  };


  const inputHandler = (e) => {
    const filteredData = data.data.products.filter((item) => item.name.trim().toLowerCase().includes(e.target.value.toLowerCase()));
    setFilteredData(filteredData);
  };

  // localstorage page number

  useEffect(() => {
    const savedPageNumber = localStorage.getItem('page number');
    if (savedPageNumber) {
      setPageNumber(Number(savedPageNumber));
    }
  }, []);

  const handlePrevPage = () => {
    setPageNumber((prev) => {
      const newPageNumber = prev > 1 ? prev - 1 : prev;
      localStorage.setItem('page number', newPageNumber); // Store the new page number in localStorage
      return newPageNumber;
    });
    localStorage.removeItem('api url')
  };

  const handleNextPage = () => {
    setPageNumber((prev) => {
      const newPageNumber = isFetched ? prev + 1 : prev;
      localStorage.setItem('page number', newPageNumber); // Store the new page number in localStorage
      return newPageNumber;
    });
    localStorage.removeItem('api url')
  };


  return (
    <>

      <div>
        <Menu handleCategoryUrl={handleCategoryUrl} handleCategoryTagsUrl={handleCategoryTagsUrl} setCategoryTagsUrl={setCategoryTagsUrl} setResetStorageApiUrl={setResetStorageApiUrl} />

        <div style={{ padding: '20px', textAlign: 'center' }}>
          <input style={{ padding: '5px' }}
            onChange={inputHandler}
            type="text"
            placeholder="Search by product title..."
          />
        </div>
      </div>

      <div className="grid-container">
        {/* Pavle nema svaki proizvod cenu */}
        {filteredData.map((item, index) => (

          <div key={index} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <div style={{ height: '120px', margin: '30px' }}>
              <img style={{ height: '100%' }} src={item.thumbnail_url ? item.thumbnail_url : imgUrl} alt={item.title} />
            </div>
            <h6>{item.name.substring(0, 20)}</h6>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <span>Sifra: {item.internal_id}</span>
              <p>Cena: {item.price}$</p>
            </div>
            <div className="card-body">
              <Link
                to={"/product/" + item._id}
                className="btn btn-dark m-1"
              >
                Buy Now
              </Link>
              <button
                className="btn btn-dark m-1"
                onClick={() => {
                  // toast.success("Added to cart");
                  addProduct(item);
                }}
              >
                Add to Cart
              </button>
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

    </>
  );
};

export default Products;
