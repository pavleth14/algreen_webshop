import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch, useSelector } from "react-redux";
import { addCart, updateCart, setTestCounter } from "../redux/action";
import toast from "react-hot-toast";

import { Footer, Navbar } from "../components";

const Product = () => {

  const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'

  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();
  // const testCounter = useSelector((state) => state.cartItems.testCounter); 
  const [testCounter, setTestCounter] = useState(0); 

  // get cart data
 
  useEffect(() => {
    const getCartData = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/cart', {
          method: 'GET',     
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            // 'x-api-key': 'bc8lygUI0i1nnES5eM6hxBFZgsICG8ca',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Cart data:', data.data.items);
          dispatch(updateCart(data.data.items))          
        } else {
          console.error('Error fetching cart data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    getCartData();
  }, [testCounter]);
  

  const addProduct = (product) => {

    // dispatch(addCart(product));    
    
    const sendToBackend = async (product) => {
      console.log('Pavle product: ', product);
      console.log('Pavle product id: ', product._id);   
      try {
        const response = await fetch('http://localhost:3333/api/cart', {
          method: 'PUT',     
          credentials: 'include',       
          headers: {
            'Content-Type': 'application/json',
            // 'x-api-key': 'bc8lygUI0i1nnES5eM6hxBFZgsICG8ca', 
          },
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
          // dispatch(setTestCounter(testCounter + 1));
          setTestCounter(prev => prev + 1);
          console.log('Product added to cart in backend:', data);
          toast.success("Product added to cart successfully!");
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
  };

  useEffect(() => {
    console.log('Pavle id: ', id);
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`http://localhost:3333/api/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'x-api-key': 'bc8lygUI0i1nnES5eM6hxBFZgsICG8ca',
        },
      });
      const data = await response.json();
      setProduct(data.data);
      console.log(data.data);
      setLoading(false);
      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <img
                className="img-fluid"
                src={product.image_url ? product.image_url : imgUrl}
                alt={product.title}
                width="400px"
                height="400px"
              />
            </div>
            <div className="col-md-6 col-md-6 py-5">
              <h4 className="text-uppercase text-muted">{product.category}</h4>
              <p className="display-6">{product.name}</p>
              <p className="lead">
                {product.rating && product.rating.rate}{" "}
                <i className="fa fa-star"></i>
              </p>
              <h3 className="display-6  my-4">${product.price}</h3>
              <p className="lead">{product.description}</p>
              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  toast.success("Added to card");                
                  addProduct(product)}
                }
              >
                Add to Cart
              </button>
              <Link to="/cart" className="btn btn-dark mx-3">
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item) => {
              return (
                <div key={item.id} className="card mx-4 text-center">
                  <img
                    className="card-img-top p-3"
                    src={item.image}
                    alt="Card"
                    height={300}
                    width={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {item.title.substring(0, 15)}...
                    </h5>
                  </div>
                  {/* <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">${product.price}</li>
                  </ul> */}
                  <div className="card-body">
                    <Link
                      to={"/product/" + item.id}
                      className="btn btn-dark m-1"
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => addProduct(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
          <h2 className="">You may also Like</h2>
            <Marquee
              pauseOnHover={true}
              pauseOnClick={true}
              speed={50}
            >
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
