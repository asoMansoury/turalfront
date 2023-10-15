import React from 'react';
import CostList from './CostList';
import CostAdd from './CostAdd';
import CostEdit from './CostEdit';
import {CostCategoryGetAllApi} from '../commonConstants/ApiConstants';
import axios from 'axios';
import checkRequests from '../component/ErrroHandling';
export class CostCategoryPage extends React.Component {
    constructor(){
        super();
        this.state = {
            costCategorySource:[],
        }
        this.fillCostCategorySource = this.fillCostCategorySource.bind(this);
        this.fillCostCategorySource();
    }

    fillCostCategorySource(){
        axios.get(CostCategoryGetAllApi).then((res)=>{
            if(res.data.hasError===false){
                this.setState({
                    costCategorySource:res.data.costCategoryDtos
                });
            }
        })
    }

    render() {
        return (
            <>
                <CostList />
                <CostAdd costCategorySource={this.state.costCategorySource}/>
                <CostEdit costCategorySource={this.state.costCategorySource}/>
            </>
        );
    }
}

export default checkRequests(CostCategoryPage,axios)