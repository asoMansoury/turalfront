import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import React,{useEffect} from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import {DashboardGetProcessChartApi} from '../../commonConstants/ApiConstants';
import axios from 'axios';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import ClipLoader from "react-spinners/ClipLoader";
import checkRequests from '../../component/ErrroHandling';
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
export function ProcessChart(props){
  const [model,setModel]= React.useState([]);
  let [loading, setLoading] = React.useState(true);
    useEffect(()=>{
      axios.get(DashboardGetProcessChartApi).then((res)=>{
        if(res.data.hasError==false){
          var tmp = [];
          var item = res.data.dashboardDto;
          tmp.push({
            color: ColorCode[0],
            title: item.openProcessCount,
            value: item.openProcessCount,
            label: 'فرایند های باز',
            fontSize:'10px'});
            tmp.push({
              color: ColorCode[1],
              title: item.count,
              value: item.count,
              label: 'فرایند های اتمامی',
              fontSize:'10px'})
          setModel(tmp);
          setLoading(false);
        }
      }).catch((error)=>{
          
      })
    },[])

    return (
        <div className={`card card-custom`} style={{borderRadius: '18px'}}>
        {/* Header */}
        <div className="card-header align-items-center border-0 mt-4">
          <h3 className="card-title align-items-start flex-column">
          <span className="font-weight-bolder text-dark">نمودار وضعیت فرایند ها </span>
          </h3>
        </div>
        <div>
        <div className='row'>
          <div className='col-md-4' style={{marginRight:'19px',display: 'flex',flexDirection: 'column',justifyContent: 'center'}}>
            <div className='row'>
              <div className='col-md-9'><span className="spanTitle" >فرایند باز</span></div>
              <div className='col-md-2'><FiberManualRecordRoundedIcon style={{color:ColorCode[0]}}></FiberManualRecordRoundedIcon></div>
            </div>
            <div className='row'>
              <div className='col-md-9'><span className="spanTitle">فرایند بسته</span></div>
              <div className='col-md-2'><FiberManualRecordRoundedIcon style={{color:ColorCode[1]}}></FiberManualRecordRoundedIcon></div>
            </div>
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
                viewBoxSize={[100, 100]}
           />
           
          </div>
        </div>
        </div>
        </div>
      );
}

export default checkRequests(ProcessChart,axios);
