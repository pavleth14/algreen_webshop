import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart, updateCart } from "../redux/action";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import useMe from "../hooks/useMe";

const Cart = () => {
  // const { accessToken } = useMe();
  // console.log(accessToken);
  useMe();
  const accessToken = useSelector(state => state.auth?.accessToken);
  const [testCounter, setTestCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const cartData = useSelector((state) => state.handleCart);
  console.log('Cart data: ', cartData);
  const dispatch = useDispatch();

  useEffect(() => {

    const getCartData = async () => {

      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (isLoggedIn && !accessToken) return;

      try {
        const headers = {
          'Content-Type': 'application/json',
        };

        if (isLoggedIn && accessToken) {
          console.log('User is logged in with token:', accessToken);
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch('http://localhost:3333/api/cart', {
          method: 'GET',
          credentials: 'include',
          headers,
        });

        if (response.ok) {
          const { data } = await response.json();
          console.log('Cart data:', data.items);
          dispatch(updateCart(data.items));
          setIsLoading(false);
        } else {
          console.error('Error fetching cart data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    getCartData();

  }, [testCounter, accessToken]);




  const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

  // Funkcija za dodavanje proizvoda u korpu
  const addItem = debounce((product) => {
    console.log(product.quantity + 1);
    const sendToBackend = async (product) => {
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
            items: [{ product_id: product.product._id, quantity: 1 }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(updateCart(data.data.items));
          setTestCounter(prev => prev + 1);
        } else {
          console.error('Failed to add product to cart:', response);
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    };

    sendToBackend(product);
  }, 200);

  // Funkcija za smanjenje količine proizvoda
  const reduceItem = debounce((product) => {
    console.log(product.quantity - 1);
    const sendToBackend = async (product) => {
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
            items: [{ product_id: product.product._id, quantity: -1 }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(updateCart(data.data.items));
          setTestCounter(prev => prev + 1);
        } else {
          console.error('Failed to reduce product in cart:', response);
        }
      } catch (error) {
        console.error('Error reducing product in cart:', error);
      }
    };

    sendToBackend(product);
  }, 200);

  const handleDeleteItem = (product) => {
    console.log('handleDeleteProduct id: ', product.product._id);

    const sendToBackend = async (product) => {
      try {
        const headers = {
          'Content-Type': 'application/json',
        };

        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
        const response = await fetch(`http://localhost:3333/api/cart/${product.product._id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: headers,
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(updateCart(data.data.items))
          setTestCounter(prev => prev + 1);
        } else {
          console.error('Failed to add product to cart:', response);
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    };
    sendToBackend(product);
  }

  // PAVLE IZMENJEN PODATAK INPUT

  // Funkcija koja ažurira količinu kada korisnik menja vrednost
  const handleNewInputQuantity = (e, productId) => {

    const newQuantity = e.target.value;

    const data = {
      product_id: productId,
      quantity: newQuantity,
      set_quantity: false
    };

    console.log('dataaaaaa', data);


    const sendToBackend = async () => {
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
                product_id: productId,
                quantity: parseInt(newQuantity),
                set_quantity: true
              }
            ]
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Product added to cart in backend:', data);
          dispatch(updateCart(data.data.items));
          setTestCounter(prev => prev + 1);
          // toast.success("Added to cart");

        } else {
          console.error('Failed to add product to cart:', response);
          // toast.error("Failed to add product to cart.");
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
        // toast.error("An error occurred while adding the product.");
      }
    };

    sendToBackend();

  };

  const debouncedHandleNewInputQuantity = debounce(handleNewInputQuantity, 800);

  // PAVLE IZMENJEN PODATAK INPUT

  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    cartData.map((item) => {
      if (item.product) { // Check if item.product is defined
        subtotal += item.product.price * item.quantity;
      }
    });

    cartData.map((item) => {
      if (item.product) { // Check if item.product is defined
        totalItems += item.quantity;
      }
    });

    const handleDeleteCart = () => {

      const isConfirmed = window.confirm('Da li zaista želite da obrišete sve iz kartice?');

      if (isConfirmed) {
        const sendToBackend = async () => {
          try {
            const headers = {
              'Content-Type': 'application/json',
            };

            if (accessToken) {
              headers['Authorization'] = `Bearer ${accessToken}`;
            }
            const response = await fetch(`http://localhost:3333/api/cart`, {
              method: 'DELETE',
              credentials: 'include',
              headers: headers
            });

            if (response.ok) {
              const data = await response.json();
              dispatch(updateCart(data.data.items));
              setTestCounter(prev => prev + 1);
            } else {
              console.error('Failed to remove items from cart:', response);
            }
          } catch (error) {
            console.error('Error adding product to cart:', error);
          }
        };

        sendToBackend();
      } else {
        console.log('Brisanje je otkazano.');
      }
    };

    return (
      <>
        {isLoading && <h2 style={{textAlign: 'center'}}>Loading...</h2>}
        {!isLoading &&
          <section className="h-100 gradient-custom">
            <div className="container py-5">
              <div className="row d-flex justify-content-center my-4">
                <div className="col-md-8">
                  <div className="card mb-4">
                    <div className="card-header py-3">
                      <h5 className="mb-0">Item List</h5>
                    </div>
                    <div className="card-body">
  {cartData.map((item) => (
    <div key={item.product._id} className="mb-4">
      <div className="row align-items-center">

        {/* Slika + ime */}
        <div className="col-12 col-md-3 text-center mb-3 mb-md-0">
          <div className="bg-light rounded p-2">
            <div className="mb-2 fw-bold">{item.product.name}</div>
            <img
              src={item.product.thumbnail_url ? item.product.thumbnail_url : imgUrl}
              alt={item.product.title}
              style={{ width: '100px', height: '75px', objectFit: 'cover' }}
              className="img-fluid"
            />
          </div>
        </div>

        {/* Naslov proizvoda */}
        <div className="col-12 col-md-5 text-center text-md-start mb-3 mb-md-0">
          <p className="mb-2">
            <strong>{item.product.title}</strong>
          </p>
        </div>

        {/* Kontrole količine i dugmad */}
        <div className="col-12 col-md-4 d-flex flex-column align-items-center">
          <div className="d-flex justify-content-center mb-2" style={{ maxWidth: '300px' }}>
            <button
              className="btn btn-outline-secondary px-2"
              onClick={() => reduceItem(item)}
            >
              <i className="fas fa-minus"></i>
            </button>

            <input
              type="text"
              className="form-control mx-2 text-center"
              style={{ width: '60px' }}
              placeholder={item.quantity}
              onChange={(e) => debouncedHandleNewInputQuantity(e, item.product._id)}
            />

            <button
              className="btn btn-outline-secondary px-2"
              onClick={() => addItem(item)}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>

          <p className="text-center mb-2">
            <strong>
              <span className="text-muted">{item.quantity}</span> x ${item.product.price}
            </strong>
          </p>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteItem(item)}
          >
            Delete
          </button>
        </div>
      </div>
      <hr />
    </div>
  ))}

  {cartData.length > 0 && (
    <div className="text-center mt-4">
      <button className="btn btn-outline-danger" onClick={() => handleDeleteCart()}>
        Delete all
      </button>
    </div>
  )}
</div>

                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card mb-4">
                    <div className="card-header py-3 bg-light">
                      <h5 className="mb-0">Order Summary</h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                          Products ({totalItems})<span>${Math.round(subtotal)}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                          Shipping
                          <span>${shipping}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                          <div>
                            <strong>Total amount</strong>
                          </div>
                          <span>
                            <strong>${Math.round(subtotal + shipping)}</strong>
                          </span>
                        </li>
                      </ul>

                      <Link
                        to="/checkout"
                        className="btn btn-dark btn-lg btn-block"
                      >
                        Go to checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
      </>
    );
  };

  const EmptyCart = () => {
    return (
      <div>
        {isLoading && <h1>Loading...</h1>}
        {!isLoading && 
        <div className="container">
          <div className="row">
            <div className="col-md-12 py-5 bg-light text-center">
              <h4 className="p-3 display-5">Your Cart is Empty</h4>
              <Link to="/" className="btn  btn-outline-dark mx-4">
                <i className="fa fa-arrow-left"></i> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        }
      </div>


    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Cart</h1>
        <hr />
        {cartData.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
