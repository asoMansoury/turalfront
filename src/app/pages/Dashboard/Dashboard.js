import React, {useEffect} from 'react';
import {MyActivityWidget} from './Component/MyActivityWidget';
import     InitialBalanceWidget from './Component/InitialBalanceWidget';
import     StockRoomWidget from './Component/StockRoomWidget';
import axios from 'axios';
import { Preloader, Oval } from 'react-preloader-icon';
import toast, { Toaster } from 'react-hot-toast';
import { toastConfig } from '../Config';
import { useDispatch, useSelector } from "react-redux";
import ProcessLog from './Component/ProcessLog';
import ProcessChart from './Component/ProcessChart';
import FlowProcessLog from './Component/FlowProcessLog';
import {Row,Col} from 'react-bootstrap';
import CostsChart from './Component/CostsChart';
import ClipLoader from "react-spinners/DotLoader";
export function Dashboard (props){
    const controllerPersmission = useSelector(state=>state.tokenReducer.TokenObject.userInfo.controllerDtos);
    const actionsPermission =useSelector(state=>state.tokenReducer.TokenObject.userInfo.actionDtos);
    let [loading, setLoading] = React.useState(true);
    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false);

        },2000)
    },[])
    
    if(loading===true)
    return (<div className={'card card-cusstom'} style={{height: '100%',border: 'none',display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
    <ClipLoader color='#4c9ca0' size={150} loading={loading}></ClipLoader>
  </div>)
  else
    return (
        <>
            <div className="row">
                <div className="col-lg-6 col-xxl-4 card card-custom" style={{padding: '12px',borderRadius: '18px'}}>
                    <MyActivityWidget className="card-stretch gutter-b"/>
                </div>
                <div className='col-lg-6 col-xxl-8' style={{paddingRight: 0,marginRight: '-12px'}}>
                    <div className='col-lg-12 col-xxl-12' style={{display: 'flex'}}>
                        <div className="col-lg-6 col-xxl-6 card card-custom" style={{padding: '2px',borderRadius: '18px',maxHeight:'400px  !important',margin: '2px'}}>
                                <CostsChart></CostsChart>
                        </div>
                        <div className="col-lg-6 col-xxl-6 card card-custom" style={{padding: '2px',borderRadius: '18px',maxHeight:'400px  !important',margin: '2px'}}>
                                <ProcessChart></ProcessChart>
                        </div>
                    </div>
                    <div className='col-lg-12 col-xxl-12' style={{display: 'flex',flexDirection:'column'}}>
                        <ProcessLog></ProcessLog>
                    </div>
                    <div className='col-lg-12 col-xxl-12' style={{display: 'flex',flexDirection:'column'}}>
                        <FlowProcessLog></FlowProcessLog>
                    </div>
                </div>
            </div>
            <div className="row">

            </div>
            <div className="row">

            </div>

    </>
    )

}

export default Dashboard;