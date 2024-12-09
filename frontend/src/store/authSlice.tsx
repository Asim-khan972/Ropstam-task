import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the interface for the AuthState
interface AuthState {
  token: string | null;
  name: string | null;
  email: string | null;
}

// Get the initial state from localStorage or set defaults
const initialState: AuthState = {
  token: localStorage.getItem("token"),
  name: localStorage.getItem("name"),
  email: localStorage.getItem("email"),
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; name: string; email: string }>
    ) => {
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.email = action.payload.email;

      // Save the values in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("name", action.payload.name);
      localStorage.setItem("email", action.payload.email);
    },
    logout: (state) => {
      state.token = null;
      state.name = null;
      state.email = null;

      // Clear the values from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
    },
  },
});

// Export the actions and the reducer
export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
