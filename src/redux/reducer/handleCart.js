// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;

  switch (action.type) {
    case "ADDITEM":
      // Check if product already in cart, use _id for comparison
      const exist = state.find((x) => x._id === product._id);
      if (exist) {
        // Increase the quantity
        updatedCart = state.map((x) =>
          x._id === product._id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        // Product not in cart, add it with qty: 1
        updatedCart = [...state, { ...product, qty: 1 }];
      }
      // Update localStorage with the new cart
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "DELITEM":
      // Find the item to delete or reduce quantity
      const exist2 = state.find((x) => x._id === product._id);
      if (exist2.qty === 1) {
        // Remove product if qty is 1
        updatedCart = state.filter((x) => x._id !== exist2._id);
      } else {
        // Otherwise, reduce the quantity by 1
        updatedCart = state.map((x) =>
          x._id === product._id ? { ...x, qty: x.qty - 1 } : x
        );
      }
      // Update localStorage with the new cart
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "UPDATE_CART":
      // Replace the current state with the new cart items from the payload
      updatedCart = product; // `product` is the new cart data passed in the action
      // Update localStorage with the new cart
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    default:
      return state;
  }
};

export default handleCart;
