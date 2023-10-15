/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useEffect} from "react";
import {Dropdown} from "react-bootstrap";
import {toAbsoluteUrl} from "../../../../_metronic/_helpers";
import {DropdownCustomToggler, DropdownMenu2,DropdownMenu1} from "../../../../_metronic/_partials/dropdowns";
import checkRequests from '../../component/ErrroHandling';
import axios from 'axios';
import {DashboardGetInitialBalanceApi} from '../../commonConstants/ApiConstants';
export function InitialBalanceWidget({ className }) {
  const [dto,setDto]=React.useState();

  useEffect(()=>{
    setTimeout(() => {
      axios.get(DashboardGetInitialBalanceApi).then((response)=>{
          let result = response.data;
          if(result.hasError==false){
            setDto(result.initialBalanceDtos)
          }else{
  
          }
      }).catch((error)=>{
  
      });
    },2000)
    },[]);
  return (
    <>
      <div className={`card card-custom ${className}`}>
        {/* Head */}
        <div className="card-header border-0">
          <h3 className="card-title font-weight-bolder text-dark">آخرین فعالیت های مواد اولیه</h3>
        </div>
        {/* Body */}
        {
          dto!=undefined?

          dto.map((item,index)=>{
            return (
              <div className="card-body pt-2" key={index}>
              <div className="d-flex align-items-center mb-10">
                <span className="bullet bullet-bar bg-success align-self-stretch" style={{backgroundImage:'linear-gradient(to right, #6a75ca, #9666f7)'}}></span>
    
                <label className="checkbox checkbox-lg checkbox-light-success checkbox-single flex-shrink-0 m-0 mx-4">
                  <input type="checkbox" name="" onChange={() => {}} value="1" />
                  <span></span>
                </label>
    
                <div className="d-flex flex-column flex-grow-1">
                {item.dashboardDto.activityName} توسط : {item.dashboardDto.fullName}
                  <span className="text-muted font-weight-bold">{item.dashboardDto.dateActivity}</span>
                </div>
              </div>
            </div>
          
            )
          })

          :<></>
        }
          

      </div>
    </>
  );
}


export default checkRequests(InitialBalanceWidget,axios);