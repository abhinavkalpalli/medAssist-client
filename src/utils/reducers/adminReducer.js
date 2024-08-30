import { createSlice } from "@reduxjs/toolkit";
import { adminAuth } from "../../const/localStorage";
import { apiCall } from "../../services/admin/apiCalls";
import { authUrl } from "../../const/routes";

let adminData,isValidUser,token
const adminSlice=createSlice({
    name:'admin',
    initialState:{
        adminData:adminData,
        validUser:isValidUser
    },
    reducers:{
        setAdmin:(state,action)=>{
            state.adminData=action.payload.adminData
            state.validUser = action.payload.adminData.is_Verified;
        },
        removeReduxAdmin: (state, action) => {
            state.adminData = null;
            state.validUser=false
            localStorage.removeItem(adminAuth);
          },
          updateAdmin: (state, action) => {
            state.adminData = {
              ...state.adminData,
              ...action.payload.adminData
            };
          }
    }
})
export const userAuthenticator = () => async (dispatch) => {
    try {
      token = localStorage.getItem(adminAuth);
      if (token) {
        const data = {
          headers: {
            Authorization: token,
          },
        };
        apiCall("get", authUrl.authAdmin, data).then((response) => {
          isValidUser = response.valid;
          adminData = response.user;
          dispatch(setAdmin({ adminData, validUser: isValidUser}));
        }).catch((error) => {
          dispatch(setAdmin({adminData: null, validUser: false}));
        })
      } else {
        dispatch(removeAdmin())
      }
    } catch (e) {
      dispatch(removeAdmin());
    }
  };
export const removeAdmin = () => async (dispatch) => {
    dispatch(removeReduxAdmin());
} 
export const { setAdmin,removeReduxAdmin,updateAdmin} = adminSlice.actions;

export default adminSlice.reducer
