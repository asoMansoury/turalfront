import React,{useEffect} from 'react';
import FlowProcessAdd from './FlowProcessAdd';
import FlowBalanceEdit from './FlowBalanceEdit';
import { ProcessTypeCode } from '../commonConstants/commonConstants';
import {GeneralParamterGetChildsByParentsApi,stockRoomGetAllApi,InitialBalanceGetAllApi} from '../commonConstants/ApiConstants';
import {unitTypeCode,typeMaterialCode,categoryParentCode} from '../commonConstants/commonConstants';
import axios from 'axios';
import checkRequests from '../component/ErrroHandling';
export class FlowProcessPage extends React.Component {
    constructor(){
        super();
        this.state = {
            materialTypesSource:[],
            unitTypeSource:[],
            categoryTypeSource:[],
            initialBalanceSource:[]
        }
        this.fillDropDownsData = this.fillDropDownsData.bind(this);
        this.initialBalanceData=  this.initialBalanceData.bind(this);

    }

    initialBalanceData(){
        axios.get(InitialBalanceGetAllApi).then((res)=>{
            if(res.data.hasError===false){
                this.setState({...this.state,initialBalanceSource:res.data.initialBalanceDtos})
            }
        })
    }

    componentWillMount(){
        this.fillDropDownsData();
        this.initialBalanceData();
    }

    fillDropDownsData(){
        let api= GeneralParamterGetChildsByParentsApi+"?Code="+unitTypeCode+"&Code="+typeMaterialCode+"&Code="+categoryParentCode;
        const unitTypesArray=[];
        const materialTypeArray=[];
        const categoryTypeArray=[];
        axios.get(api).then((res)=>{
            if(res.data.hasError==false){
                res.data.generalParamterDtos.map((item,index)=>{
                    if(item.parentCode===unitTypeCode)
                        unitTypesArray.push(item);
                    else if(item.parentCode===typeMaterialCode)
                        materialTypeArray.push(item);
                    else if(item.parentCode===categoryParentCode)
                        categoryTypeArray.push(item);
                })
                this.setState({...this.state,
                    unitTypeSource:unitTypesArray,
                    materialTypesSource:materialTypeArray,
                    categoryTypeSource:categoryTypeArray
                });
            }
        })
    }



    render() {
            return (
                <>
                    <FlowProcessAdd
                        initialBalanceSource={this.state.initialBalanceSource}
                        unitTypeSource={this.state.unitTypeSource}
                        materialTypesSource={this.state.materialTypesSource}
                        categoryTypeSource={this.state.categoryTypeSource}
                    ></FlowProcessAdd>
                </>
            );
    }
}

export default checkRequests(FlowProcessPage,axios);