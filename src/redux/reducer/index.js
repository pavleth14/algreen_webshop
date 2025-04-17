import handleCart from './handleCart'
import auth from './authSlice';
import cartItems from './cartItems'
import { combineReducers } from "redux";
const rootReducers = combineReducers({
    handleCart,
    auth
    // cartItems
})
export default rootReducers






