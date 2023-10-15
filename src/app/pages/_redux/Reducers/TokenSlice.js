import {setStorage,getStorage} from '../../../../_metronic/_helpers/LocalStorageHelpers';
import {TOKEN_OBJ} from '../../commonConstants/commonConstants';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const initialState = {
    TokenObject:{
        Token:'',
        isAuthorized:false
    }
}

export const TokenReducer = persistReducer(
    { storage, key: TOKEN_OBJ, whitelist: ["TokenObject"] },
    (state = initialState, action)=> {
    switch (action.type) {
        case 'Save_Token': {
            var obj = {
                ...state,
                TokenObject: {
                    Token:action.payload.token,
                    isAuthorized:true,
                    userInfo:action.payload
                }
            }
            return obj;
        }
        case 'getToken':{
            return state;
        }
        default:
            return state;
    }
});
export default TokenReducer;