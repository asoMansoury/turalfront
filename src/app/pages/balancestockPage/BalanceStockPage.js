import React,{useEffect} from 'react';
import BalanceStockList from './BalanceStockList';
import BalanceAdd from './BalanceStockAdd';
import {GeneralParamterGetChildsByParentsApi,stockRoomGetAllApi} from '../commonConstants/ApiConstants';
import {unitTypeCode,typeMaterialCode,categoryParentCode} from '../commonConstants/commonConstants';
import BalanceStockEdit from './balanceStockEdit';
import axios from 'axios';
import checkRequests from '../component/ErrroHandling';
export class BalanceStockPage extends React.Component {
    constructor(){
        super();
        this.state = {
            materialTypesSource:[],
            unitTypeSource:[],
            categoryTypeSource:[]
        }
        this.fillDropDownsData = this.fillDropDownsData.bind(this);
        this.fillDropDownsData();
    }

    componentDidMount(){
        
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
        }).catch((error)=>{

        })
    }


    render() {
            return (
                <>
                    <BalanceStockList></BalanceStockList>
                    <BalanceAdd
                        unitTypeSource={this.state.unitTypeSource}
                        materialTypesSource={this.state.materialTypesSource}
                        categoryTypeSource={this.state.categoryTypeSource}
                    ></BalanceAdd>
                    <BalanceStockEdit
                        unitTypeSource={this.state.unitTypeSource}
                        materialTypesSource={this.state.materialTypesSource}
                        categoryTypeSource={this.state.categoryTypeSource}
                    ></BalanceStockEdit>
                </>
            );
    }
}

export default checkRequests(BalanceStockPage,axios);