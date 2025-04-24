import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart, updateCart } from "../redux/action";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import useMe from "../hooks/useMe";

const Cart = () => {
  const { accessToken } = useMe();
  console.log(accessToken);
  const [testCounter, setTestCounter] = useState(0);

  const cartData = useSelector((state) => state.handleCart);
  console.log('Cart data: ', cartData);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCartData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
        };

        if (accessToken) {
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
        } else {
          console.error('Error fetching cart data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    getCartData();
  }, [testCounter]);


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
        <section className="h-100 gradient-custom">
          <div className="container py-5">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">Item List</h5>
                  </div>
                  <div className="card-body">
                    {cartData.map((item) => {
                      return (
                        <div key={item.product._id}>
                          <div>
                            <div className="row d-flex align-items-center">
                              <div className="col-lg-3 col-md-12">
                                <div className="bg-image rounded">
                                  <div className="mb-2">{item.product.name}</div>
                                  <img
                                    src={item.product.thumbnail_url ? item.product.thumbnail_url : imgUrl}
                                    alt={item.title}
                                    width={100}
                                    height={75}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-5 col-md-6">
                                <p>
                                  <strong>{item.product.title}</strong>
                                </p>
                              </div>

                              <div className="col-lg-4 col-md-6">
                                <div
                                  className="d-flex justify-content-center mb-4 "
                                  style={{ maxWidth: "300px" }}
                                >
                                  <button
                                    className="btn px-3"
                                    onClick={() => {
                                      reduceItem(item);
                                    }}
                                  >
                                    <i className="fas fa-minus"></i>
                                  </button>

                                  <input style={{ width: '50px', textAlign: 'center' }}
                                    type="text"
                                    onChange={(e) => debouncedHandleNewInputQuantity(e, item.product._id)}
                                    placeholder={item.quantity}
                                  />

                                  <button
                                    className="btn px-3"
                                    onClick={() => {
                                      addItem(item);
                                    }}
                                  >
                                    <i className="fas fa-plus"></i>
                                  </button>
                                </div>

                                <p className="text-start text-md-center mb-4">
                                  <strong>
                                    <span className="text-muted">{item.quantity}</span>{" "}
                                    x ${item.product.price}
                                  </strong>
                                </p>
                                <div className="text-center ">
                                  <button onClick={() => handleDeleteItem(item)}>delete</button>
                                </div>
                              </div>
                            </div>
                            <hr className="my-4" />
                          </div>
                        </div>
                      );
                    })}

                    <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
                      <button onClick={() => handleDeleteCart()}>Delete all</button>
                    </div>

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
      </>
    );
  };

  const EmptyCart = () => {
    return (
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
