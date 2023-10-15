import React, {Suspense, lazy,useEffect} from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../_metronic/layout";
import {BuilderPage} from "./pages/BuilderPage";
import {DashboardPage} from "./pages/DashboardPage";
import {CategoryPage} from "./pages/Category/CategoryPage";
import {stockroomManagePath
  ,categoryPath
  ,balancestocManagePath
  ,usersPath
  ,processDefinitionPath
  ,processPath
  ,processEditPath
  ,processListPath
  ,flowProcessAddPath
  ,flowProcessListPath  
  ,flowProcessEditPath
  ,CostCateogryPath
  ,CostListPath
  ,ProcessPDFPath
  ,FlowProcessPDFPath
  ,ProductListPath
  ,ReportProductPath
  ,usersGranPath
  ,DashboardPath
  ,WastagePath
} from './pages/commonConstants/RouteConstant';
import StockRoomPage from './pages/stookroomPage/StockroomPage';
import BalanceStockPage from './pages/balancestockPage/BalanceStockPage';
import UsersPage from './pages/Users/UsersPage';
import ProcessDefinitionPage from './pages/ProcessDefinitionPage/ProcessDefinitionPage';
import ProcessAdd from './pages/ProcessPage/ProcessAdd';
import ProcessPageList from './pages/ProcessPage/ProcessPageList';
import ProcessEdit from './pages/ProcessPage/ProcessPageEdit';
import FlowProcessPage from './pages/FlowProcess/FlowProcessPage';
import FlowProcessList from './pages/FlowProcess/FlowProcessList';
import FlowProcessEdit from './pages/FlowProcess/FlowProcessEdit';
import CostCategoryPage from './pages/CostCategory/CostCategoryPage';
import ProcessPDF from './pages/ProcessPage/Components/ProcessPDF';
import FlowProcessPDF from './pages/FlowProcess/components/FlowProcessPDF';
import ProductList from './pages/Products/ProductsList';
import CostPage from './pages/Cost/CostPage';
import ReportProduct from './pages/Products/ReportProduct';
import UserGrant from './pages/Users/UserGrant/UserGrant';
import { AnimatedSwitch } from 'react-router-transition';
import WastageList from './pages/Wastages/WastageList'
import Dashboard from './pages/Dashboard/Dashboard';
const TouralProcesPage = lazy(()=>
  import("./modules/TouralPages/TouralProcessPage")
)
const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);




export default function BasePage() {
  useEffect(()=>{
    document.getElementsByClassName('container')[0].style.margin = 0;
    document.getElementsByClassName('container')[0].style.width = '100%';
    document.getElementsByClassName('container')[0].style.paddingLeft = '12px';
    document.getElementsByClassName('container')[0].style.maxWidth = '1850px';
  },[])

  
    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/products/Categories"/>
                }
                <ContentRoute path="/dashboard" component={DashboardPage}/>
                <ContentRoute path="/builder" component={BuilderPage}/>
                <ContentRoute path={stockroomManagePath} component={StockRoomPage}></ContentRoute>
                <ContentRoute path={balancestocManagePath} component={BalanceStockPage}></ContentRoute>
                <ContentRoute path={categoryPath} component={CategoryPage} />
                <ContentRoute path={usersPath} component={UsersPage}></ContentRoute>
                
                <ContentRoute path={processDefinitionPath} component={ProcessDefinitionPage}></ContentRoute>

                <ContentRoute path={processPath} component={ProcessAdd}></ContentRoute>
                <ContentRoute path={processListPath} component={ProcessPageList}></ContentRoute>
                <ContentRoute path={processEditPath} component={ProcessEdit}></ContentRoute>
                <ContentRoute path={ProcessPDFPath} component={ProcessPDF}></ContentRoute>
                
                <ContentRoute path={flowProcessAddPath} component={FlowProcessPage}></ContentRoute>
                <ContentRoute path={flowProcessListPath} component={FlowProcessList}></ContentRoute>
                <ContentRoute path={flowProcessEditPath} component={FlowProcessEdit}></ContentRoute>
                <ContentRoute path={FlowProcessPDFPath} component={FlowProcessPDF}></ContentRoute>

                <ContentRoute path={CostCateogryPath} component={CostCategoryPage}></ContentRoute>
                <ContentRoute path={CostListPath} component={CostPage}></ContentRoute>

                <ContentRoute path={ProductListPath} component={ProductList}></ContentRoute>
                <ContentRoute path={ReportProductPath} component={ReportProduct}></ContentRoute>
                <ContentRoute path={usersGranPath} component={UserGrant}></ContentRoute>
                <ContentRoute path={DashboardPath} component={Dashboard}></ContentRoute>
                <ContentRoute path={WastagePath} component={WastageList}></ContentRoute>
                <Route path="/google-material" component={GoogleMaterialPage}/>
                <Route path="/react-bootstrap" component={ReactBootstrapPage}/>
                <Route path="/e-commerce" component={ECommercePage}/>
                <Redirect to={DashboardPath}/>
            </Switch>
        </Suspense>
    );
}
