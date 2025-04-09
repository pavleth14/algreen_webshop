import handleCart from './handleCart'
import cartItems from './cartItems'
import { combineReducers } from "redux";
const rootReducers = combineReducers({
    handleCart,
    // cartItems
})
export default rootReducers