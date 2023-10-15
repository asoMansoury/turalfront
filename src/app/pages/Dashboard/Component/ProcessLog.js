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
import {ProcessSearchApi} from '../../commonConstants/ApiConstants';
import TableLog from './TableLog';
import moment from 'moment-jalaali'
import CategoryModalEdit from '../../Category/CategoryModalEdit'
const headRows = [
  { id: 'Id', numeric: false, disablePadding: true, label: 'شناسه' },
  { id: 'Title', numeric: false, disablePadding: true, label: 'عنوان' },
  { id: 'IssueDate', numeric: false, disablePadding: true, label: 'تاریخ اجرا' },
  { id: 'IsFinalStep', numeric: false, disablePadding: true, label: 'خروجی نهایی' },
  { id: 'ContractorTypeName', numeric: false, disablePadding: true, label: 'روش انجام' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'تاریخ ایجاد' },
];
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowY: 'auto',
  },
  table: {
    borderRadius: '1em',
    overflow: 'hidden'
  },
}));


export function ProcessLog({ className }) {
  const [model,setModel] =React.useState([]);
  const classes = useStyles();
  
  useEffect(()=>{
    getData();
},[]);
function createData(id,title,code,processDefinitionTitle,issueDate,isFinalStep,contractorTypeName, description,createdDate,contractorTypeID,processDefinitionID,contractorFullName,userContractorID) {
  return {id,title,code,processDefinitionTitle,issueDate,isFinalStep,contractorTypeName, description,createdDate,contractorTypeID ,processDefinitionID,contractorFullName,userContractorID};
}
const getData = () => {
  let generateApi = ProcessSearchApi+'?Page=' + 1 + '&Row=' + 10+'&sort=date:desc';
  axios.get(generateApi)
    .then(res=>{
      let result = res.data.processDtos;
      let temp = [];
      result.forEach(item => {
        temp.push(createData(item.id,item.title,item.code,item.processDefinitionTitle,item.issueDate,item.isFinalStep,item.contractorTypeName,item.description,item.createdDate,item.contractorTypeID,item.processDefinitionID,item.contractorFullName,item.contractorTypeID))
      });
      setModel(temp);
    })
    .catch(error => {
    });
}

return (
  <div className={`card card-custom`} style={{borderRadius: '28px'}}>
  <div>
    <Row >
      <Col md='12'>
        <TableLog headRows={headRows}>
          {
            model.map((item,index)=>{
              return (
                <tr >
                  <td >{item.id}</td>
                  <td >{item.title}</td>
                  <td >{item.issueDate}</td>
                  <td >{item.isFinalStep===true?'بله':'خیر'}</td>
                  <td >{item.contractorTypeName}</td>
                  <td >{item.createdDate}</td>
                </tr>
              )
            })
          }
        </TableLog>
      </Col>
    </Row>
  </div>
</div>
);
}

export default checkRequests(ProcessLog,axios);
