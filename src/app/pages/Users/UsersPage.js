import React from 'react';
import UsersList from './UsersList';
import UsersAdd from './UsersAdd';
import UsersEdit from './UsersEdit';
import {emplooyerCode,salaryTypeCode} from '../commonConstants/commonConstants';
import axios from 'axios';
import {GeneralParamterGetChildsByParentsApi} from '../commonConstants/ApiConstants';
import checkRequests from '../component/ErrroHandling';
export class UsersPage extends React.Component {
    constructor(){
        super();
        this.state = {
            emplooyerTypeSource:[],
            salaryTypeResource:[]
        }
        this.fillDropDownsData = this.fillDropDownsData.bind(this);
        this.fillDropDownsData();
    }

    fillDropDownsData(){
        let api= GeneralParamterGetChildsByParentsApi+"?Code="+emplooyerCode+"&Code="+salaryTypeCode;
        const emplooyerTypeArray=[];
        const salaryTypeArray=[];

        axios.get(api).then((res)=>{
            if(res.data.hasError==false){
                res.data.generalParamterDtos.map((item,index)=>{
                    if(item.parentCode===emplooyerCode)
                        emplooyerTypeArray.push(item);
                    else if(item.parentCode===salaryTypeCode)
                        salaryTypeArray.push(item);
                })
                this.setState({...this.state,
                    emplooyerTypeSource:emplooyerTypeArray,
                    salaryTypeResource:salaryTypeArray
                });
            }
        }).catch((error)=>{
          
        });
    }


    render() {
            return (
                <>
                    <UsersList></UsersList>
                    <UsersAdd
                        emplooyerTypeSource={this.state.emplooyerTypeSource}
                        salaryTypeResource={this.state.salaryTypeResource}
                    ></UsersAdd>
                    <UsersEdit
                        emplooyerTypeSource={this.state.emplooyerTypeSource}
                        salaryTypeResource={this.state.salaryTypeResource}
                    ></UsersEdit>
                </>
            );
    }
}

export default checkRequests(UsersPage,axios);