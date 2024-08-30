import { createSlice } from "@reduxjs/toolkit";
import { doctorAuth } from "../../const/localStorage";
import { authUrl } from "../../const/routes";
import { apiCall } from "../../services/admin/apiCalls";

let doctorData,isValidUser,token
const doctorSlice=createSlice({
    name:'doctor',
    initialState:{
        doctorData:doctorData,
        validUser:isValidUser
    },
    reducers:{
        setDoctors:(state,action)=>{
            state.doctorData=action.payload.doctorData
            state.validUser = action.payload.validUser;
        },
        removeReduxDoctor: (state, action) => {
            state.doctorData = null;
            state.validUser=false
            localStorage.removeItem(doctorAuth);
          },
          updateDoctor: (state, action) => {
            state.doctorData = {
              ...state.doctorData,
              ...action.payload.doctorData 
            };
          }
    }
})
export const userAuthenticator = () => async (dispatch) => {
    try {
      token = localStorage.getItem(doctorAuth);
      if (token) {
        const data = {
          headers: {
            Authorization: token,
          },
        };
        apiCall("get", authUrl.authDoctor, data).then((response) => {
          isValidUser = response.valid;
          doctorData = response.user;
          dispatch(setDoctors({ doctorData, validUser: isValidUser}));
        }).catch((error) => {
          dispatch(setDoctors({doctorData: null, validUser: false}));
        })
      } else {
        dispatch(removeDoctor())
      }
    } catch (e) {
      dispatch(removeDoctor());
    }
  };
export const { setDoctors,removeReduxDoctor,updateDoctor} = doctorSlice.actions;
export const removeDoctor = () => async (dispatch) => {
    dispatch(removeReduxDoctor());
} 
export default doctorSlice.reducer
