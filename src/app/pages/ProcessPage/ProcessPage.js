import React,{useState} from 'react';
import ProcessPageList  from './ProcessPageList';
import ProcessPageAdd from './ProcessAdd';
import ProcessPageEdit from './ProcessPageEdit';
import {ProcessTypeCode} from '../commonConstants/commonConstants';
import {GeneralParamterGetChildsByParentsApi,processDefinitionSearchApi} from '../commonConstants/ApiConstants';
import axios from 'axios';
import checkRequests from '../component/ErrroHandling';
export class ProcessPage extends React.Component {
    constructor(){
        super();
        this.state = {
            contactorTypeResource:[],
            processDefinitionsResource:[]
        }
        this.fillDropDownsData = this.fillDropDownsData.bind(this);
        this.fillAutoComplete = this.fillAutoComplete.bind(this);
        
        this.fillAutoComplete();
        this.fillDropDownsData();
    }


    
    fillAutoComplete(){
        let generateApi = processDefinitionSearchApi+'?Title='+'&Page=1&Row=300';
        const processDefinitionsArray=[];
        axios.get(generateApi)
          .then(res=>{
            res.data.processDefinitionDtos.map((item,index)=>{
                processDefinitionsArray.push(item);
            });
            this.setState({...this.state,
                processDefinitionsResource:processDefinitionsArray,
            });
        }).catch((error)=>{
          
        });
    }


    fillDropDownsData(){
        let api= GeneralParamterGetChildsByParentsApi+"?Code="+ProcessTypeCode;
        const contactorTypeArray=[];
        axios.get(api).then((res)=>{
            if(res.data.hasError==false){
                res.data.generalParamterDtos.map((item,index)=>{
                        contactorTypeArray.push(item);
                })
                this.setState({...this.state,
                    contactorTypeResource:contactorTypeArray,
                });
            }
        }).catch((error)=>{
          
        });
    }

    render() {
        return (
            <>
                <ProcessPageAdd
                    contactorTypeResource={this.state.contactorTypeResource}
                    processDefinitionsResource={this.state.processDefinitionsResource}
                ></ProcessPageAdd>

            </>
        );
    }
}
export default checkRequests(ProcessPage,axios);