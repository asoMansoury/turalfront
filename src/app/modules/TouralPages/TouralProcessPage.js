import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { InputsPage } from "../GoogleMaterialExamples/inputs/InputsPage";
import {StockRoomManage} from './stockRoom/StockRooomManage';
import { DataDisplaysPage } from "../GoogleMaterialExamples/data-displays/DataDisplaysPage";
import { FeedbackPage } from "../GoogleMaterialExamples/feedback/FeedbacksPage";
import { LabsPage } from "../GoogleMaterialExamples/labs/LabsPage";
import { NavigationPage } from "../GoogleMaterialExamples/navigation/NavigationPage";
import { LayoutPage } from "../GoogleMaterialExamples/layout/LayoutPage";
import { SurfacesPage } from "../GoogleMaterialExamples/surfaces/SurfacesPage";
import { UtilsPage } from "../GoogleMaterialExamples/utils/UtilsPage";
import { ContentRoute } from "../../../_metronic/layout";

export default function TouralProcesPage() {
    return (
        <Switch>
             <ContentRoute  from="/TouralProcess/StockRoom" component={StockRoomManage} />
        </Switch>
      );
}