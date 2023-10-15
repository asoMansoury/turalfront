import React,{useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Row,Col} from 'react-bootstrap';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import checkRequests from '../../component/ErrroHandling';
import {DashboardGetLogEntitiesApi} from '../../commonConstants/ApiConstants';
import moment from 'moment-jalaali'
const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundImage: 'linear-gradient(to right, #6a75ca, #9666f7)',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowY: 'auto',
  },
  table: {
    maxWidth: 400,
  },
}));


export function MyActivityWidget({ className }) {
  const [model,setModel] =React.useState([]);
  const classes = useStyles();
  
  useEffect(()=>{
    axios.get(DashboardGetLogEntitiesApi).then((response)=>{
      let result = response.data;
      if(result.hasError==false){
        setModel(result.logDtos);
      }else{

      }
  
    }).catch((error)=>{

  });
  
},[]);


return (
    <>
      <div className={`card card-custom ${className}`}>
        {/* Header */}
        <div className="card-header align-items-center border-0 mt-4">
          <h3 className="card-title align-items-start flex-column">
            <span className="font-weight-bolder text-dark">آخرین فعالیت ها</span>
            <span className="text-muted mt-3 font-weight-bold font-size-sm">
              
            </span>
          </h3>
        </div>
        {/* Body */}
        {model.map(row => (
          <div className="card-body pt-4">
          <div className="timeline timeline-6 mt-3">
            <div className="timeline-item align-items-start">
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
              {moment(row.createdDate,'YYYY/MM/DD  h:mm:ss').format('jYYYY/jMM/jDD hh:mm')}
              </div>

              <div className="timeline-badge">
                <i className="fa fa-genderless text-success icon-xl" style={{color:'#6610f2 !important'}}></i>
              </div>

              <div className="timeline-content d-flex">
                <span className="font-weight-bolder text-dark-75 pl-3 font-size-lg">
                {row.description}
                </span>
              </div>
            </div>
          </div>
          </div>
        ))}

      </div>

    </>
);
}

export default checkRequests(MyActivityWidget,axios);
