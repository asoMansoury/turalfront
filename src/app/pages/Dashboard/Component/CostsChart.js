import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import React,{useEffect} from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import axios from 'axios';
import checkRequests from '../../component/ErrroHandling';
import {DashboardGetCostChartApi,DashboardGetLogEntitiesApi} from '../../commonConstants/ApiConstants';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import ClipLoader from "react-spinners/ScaleLoader";
const ColorCode = ["#6d78ad",
"#51cda0",
"#df7970",
"#4c9ca0",
"#ae7d99",
"#c9d45c",
"#5592ad",
"#df874d",
"#982968",
"#31bf57"]
export function CostsChart(props){
  const [model,setModel]= React.useState([]);
  let [loading, setLoading] = React.useState(true);
  useEffect(()=>{
    axios.get(DashboardGetLogEntitiesApi).then((response)=>{
      
    }).catch((res)=>{

    });
    axios.get(DashboardGetCostChartApi).then((res)=>{
      if(res.data.hasError==false){
        var tmp = [];
        res.data.dashboardDto.costCategoryDtos.map((item,index)=>{
          tmp.push({
            color: ColorCode[index],
            title: item.costCount,
            value: item.costCount,
            label: item.title,
            fontSize:'10px'})
        });
        setModel(tmp);
        setLoading(false);
      }
    }).catch((error)=>{
        
    })
},[])
    const label=[{
        
    }]
    return (
        <div className={`card card-custom`} style={{maxHeight:'400px !important',borderRadius: '18px'}}>
            <div className="card-header align-items-center border-0 mt-4">
              <h3 className="card-title align-items-start flex-column">
              <span className="font-weight-bolder text-dark">نمودار هزینه ها  </span>
              </h3>
            </div>
            <div>
            <div className='row'>
            <div className='col-md-4' style={{marginRight:'19px',display: 'flex',flexDirection: 'column',justifyContent: 'center'}}>
              {
                model.map((item,index)=>{
                  return(
                      <div className='row'>
                        <div className='col-md-9'><span className="spanTitle">{item.label}</span></div>
                        <div className='col-md-2'><FiberManualRecordRoundedIcon style={{color:ColorCode[index]}}></FiberManualRecordRoundedIcon></div>
                      </div>
                  )
                })
              }
            </div>
              
              <div className='col-md-7'>
                <PieChart
                    animation
                    animationDuration={500}
                    animationEasing="ease-out"
                    center={[50, 50]}
                    data={model}
                    label={props => { return props.dataEntry.title}}
                    labelPosition={85}
                    labelStyle={{fontSize:'6px',color:'white'}}
                    lengthAngle={360}
                    lineWidth={25}
                    paddingAngle={0}
                    radius={50}
                    rounded
                    startAngle={0}
                    viewBoxSize={[100, 100]}/>
              </div>
            </div>
        </div>    
        </div>
      );
}

export default checkRequests(CostsChart,axios);
