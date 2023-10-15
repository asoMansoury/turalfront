import React, {useEffect} from "react";
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import * as Token from '../../../app/pages/_redux/Actions/TokenActions';
import { SideBarConfig, toastConfig } from '../Config';

const checkRequests= (Wrapped,axios) => {
    function CheckRequests(props) {
        const token = JSON.parse(localStorage.getItem("persist:tokenObject"));
        const tokenObj = JSON.parse(token.TokenObject).Token;
        const notifyError = (title) => toast(title , { duration: toastConfig.duration, style: toastConfig.errorStyle });
        const tokenDispatch = useDispatch();
        axios.interceptors.request.use(request=>{
            console.log("Tokenn--",tokenObj,Wrapped)
          if (token) {
            request.headers.Authorization = "Bearer "+tokenObj;
            }
            return request;
        })
        axios.interceptors.response.use(response=>{
            return response;
        },error=>{
            if(error.response.status===400){
                if(error.response.data.code==="TNA"){
                    notifyError("نشست کاری شما منقضی شده است، لطفا مجددا وارد سامانه شوید.");
                    tokenDispatch(Token.Save_Token({token:''}))
                }else if(error.response.data.code==='NHA'){
                    notifyError(error.response.data.errorMessage);
                }
            }
        })

        return (
            <Wrapped {...props} />
        )
    }
    return CheckRequests
}

export default checkRequests