import {all} from "redux-saga/effects";
import {combineReducers} from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import { customersSlice } from "../app/modules/ECommerce/_redux/customers/customersSlice";
import { productsSlice } from "../app/modules/ECommerce/_redux/products/productsSlice";
import { remarksSlice } from "../app/modules/ECommerce/_redux/remarks/remarksSlice";
import { specificationsSlice } from "../app/modules/ECommerce/_redux/specifications/specificationsSlice";
import categoryReducer from "../app/pages/_redux/Reducers/categorySlice";
import stockroomReducer from '../app/pages/_redux/Reducers/stockroomSlice';
import balanceReducer from '../app/pages/_redux/Reducers/balanceSlice';
import usersReducer from '../app/pages/_redux/Reducers/usersSlice';
import processDefinitionReducer from '../app/pages/_redux/Reducers/processDefinitionSlice';
import flowProcessReducer from '../app/pages/_redux/Reducers/FlowProcessSlice';
import processReducer from '../app/pages/_redux/Reducers/processSlice';
import costCategoryReducer from '../app/pages/_redux/Reducers/costCategorySlice';
import costSlice from '../app/pages/_redux/Reducers/costSlice';
import tokenReducer from '../app/pages/_redux/Reducers/TokenSlice';

export const rootReducer = combineReducers({
  auth: auth.reducer,
  customers: customersSlice.reducer,
  products: productsSlice.reducer,
  remarks: remarksSlice.reducer,
  specifications: specificationsSlice.reducer,
  category : categoryReducer,
  stockroomReducer:stockroomReducer,
  balance:balanceReducer,
  users:usersReducer,
  processDefinition:processDefinitionReducer,
  process:processReducer,
  flowProcess:flowProcessReducer,
  costCategory:costCategoryReducer,
  cost:costSlice,
  tokenReducer:tokenReducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}