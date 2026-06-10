import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('vogueplaza-token');
const userInfo = localStorage.getItem('vogueplaza-user');

const initialState = {
  token: token || null,
  user: userInfo ? JSON.parse(userInfo) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
