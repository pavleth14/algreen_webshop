// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    isAuthenticated: false,
    role: null
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('isLoggedIn', 'true');  // za raspored nabvara
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.setItem('isLoggedIn', 'false');  // za raspored nabvara
    },
    setRole: (state, action) => {
      state.role = action.payload;    
    },
    clearRole: (state) => {
        state.role = null;        
    }
  },
});

export const { setAccessToken, clearAuth, setRole, clearRole } = authSlice.actions;
export default authSlice.reducer;
