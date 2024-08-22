import {api} from './api'
import {doctorAuth,refreshToken} from '../../const/localStorage'
import { persistor } from '../../app/store'
import { BASE_URL } from '../../const/url';
import axios from 'axios';

export const clearUser = () => {
    localStorage.removeItem(doctorAuth);
    localStorage.removeItem(refreshToken);
    persistor.purge();
    window.location.reload("/login");
  };
  export const apiCall =async(method,url,data)=>{
    return await new Promise(async(resolve,reject)=>{
        try {
            let response, error;
      
            if (method === "post") {
              response = await api.post(url, data).catch((err) => {
                error = err;
              });
            } else if (method === "get") {
              response = await api.get(url, data).catch((err) => {
                error = err;
              });
            } else if (method === "patch") {
              response = await api.patch(url, data).catch((err) => {
                error = err;
              });
            } else if (method === "delete") {
              response = await api.delete(url, data).catch((err) => {
                error = err;
              });
            } else if (method === "put"){
              response = await api.put(url, data).catch((err) => {
                error = err;
              })
            }
            
            if(response){
              resolve(response);
            } else if (error) {
              if(error?.data?.status === 403 && error?.data?.error_code === "FORBIDDEN"){
                localStorage.setItem(doctorAuth, "");
                clearUser();
                window.location.reload("/login");
              }
            }
          } catch (err) {
              reject(err);
          }
        });
};
const refreshAccessToken = async (error) => {
  try {
    if (error.response?.status === 401) {
      const tokenRefresh = localStorage.getItem(refreshToken);

      if (tokenRefresh) {
        error.config._retry = true;

        return new Promise(async (resolve, reject) => {
          try {
            //refreshing the access token
            const response = await axios
              .post(
                `${BASE_URL}/api/auth/doctor/refresh-token`,
                null,
                {
                  headers: {
                    Authorization: tokenRefresh,
                  },
                }
              )
              .catch((err) => {
                reject(err);
              });
            if(response){
              const newAccessToken = response.data.newToken;
              localStorage.setItem(doctorAuth, newAccessToken);

              //calling the original request
              error.config.headers["Authorization"] = newAccessToken;


              axios(error.config)
                .then((response) => {
                  resolve(response);
                })
                .catch((error) => {
                  reject(error);
                });
            }
          } catch (refreshError) {
            reject(refreshError);
          }
        })
      } else {
        clearUser();
      }
    }
  } catch (error) {
    clearUser()
  }
}
