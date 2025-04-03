import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SLICE_NAMES } from "../../constants/enums";
import { axios_instance } from "../../lib/axios";
import { errorToast } from "../../lib/toast";

const initialState = localStorage.getItem(SLICE_NAMES.USER)
  ? JSON.parse(localStorage.getItem(SLICE_NAMES.USER) || "")
  : null;

const userSlice = createSlice({
  name: SLICE_NAMES.USER,
  initialState,
  reducers: {
    setUser: (state, actions) => {
      // set local storage
      localStorage.setItem(SLICE_NAMES.USER, JSON.stringify(actions.payload));

      // set state
      return {
        ...state,
        ...actions.payload,
      };
    },

    logoutUser: (_state) => {
      // remove local storage
      localStorage.removeItem(SLICE_NAMES.USER);

      // set state
      return {};
    },
    updateUser: (state, action) => {
      if (state) {
        return {
          ...state,
          user: {
            ...state.user,
            ...action.payload,
          },
        };
      }
      return state;
    },
  },
});

export const { setUser, logoutUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
