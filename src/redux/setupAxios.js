import {getStorage} from '../_metronic/_helpers/LocalStorageHelpers';
import {TOKEN_OBJ} from '../app/pages/commonConstants/commonConstants';
import { parseJSON } from 'date-fns';
import storage from "redux-persist/lib/storage";
import toast, { Toaster } from 'react-hot-toast';
import { tableConfig,toastConfig } from '../app/pages/Config';

export default function setupAxios(axios, store) {

  const notifyError = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.errorStyle });
  axios.interceptors.request.use(
    config => {
      const token = JSON.parse(localStorage.getItem("persist:tokenObject"));
      const tokenObj = JSON.parse(token.TokenObject).Token;
      if (token) {
        config.headers.Authorization = "Bearer "+tokenObj;
      }
      return config;
    },
    err => Promise.reject(err)
  );
  axios.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 400 ) {
      
      notifyError(error.response.data.errorMessage);
      return;
    }
    return Promise.reject(error);
  });
}
