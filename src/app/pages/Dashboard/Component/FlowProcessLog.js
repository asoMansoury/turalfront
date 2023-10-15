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
import {FlowProcessSearchApi} from '../../commonConstants/ApiConstants';
import TableLog from './TableLog';
import moment from 'moment-jalaali'
import CategoryModalEdit from '../../Category/CategoryModalEdit'
const headRows = [
  { id: 'Id', numeric: false, disablePadding: true, label: 'شناسه' },
  { id: 'Code', numeric: false, disablePadding: true, label: 'کد' },
  { id: 'Title', numeric: false, disablePadding: true, label: 'عنوان' },
  { id: 'Description', numeric: false, disablePadding: true, label: 'توضیحات' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'تاریخ ایجاد' }
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


export function FlowProcessLog({ className }) {
  const [model,setModel] =React.useState([]);
  const classes = useStyles();
  
  useEffect(()=>{
    getData();
},[]);
function createData(id,title,code,processDefinitionTitle,issueDate,isFinalStep,contractorTypeName, description,createdDate,contractorTypeID,processDefinitionID,contractorFullName,userContractorID) {
  return {id,title,code,processDefinitionTitle,issueDate,isFinalStep,contractorTypeName, description,createdDate,contractorTypeID ,processDefinitionID,contractorFullName,userContractorID};
}

const getData = () => {
  let generateApi = FlowProcessSearchApi+'?Page=' + 1 + '&Row=' + 10+'&sort=date:desc';
  axios.get(generateApi)
    .then(res=>{
      let result = res.data.flowProcessDtos;
      let temp = [];
      result.forEach(item => {
        temp.push(createData(item.id,item.title,item.code,item.processDefinitionTitle,item.issueDate,item.isFinalStep,item.contractorTypeName,item.description,item.createdDate,item.contractorTypeID,item.processDefinitionID,item.contractorFullName,item.userContractorID))
      });
      setModel(temp);
    })
    .catch(error => {
    });
}

return (
  <div className={`card card-custom`} style={{borderRadius: '28px',marginTop: '4px'}}>
  {/* Header */}
  <div>
  <Row >
      <Col md='12'>
    </Col>
    <Col md='12'>
      <TableLog headRows={headRows}>
        {
          model.map((item,index)=>{
            return (
              <tr >
                <td>{item.id}</td>
                <td>{item.code}</td>
                <td>{item.title}</td>
                <td>{item.description === '' ? <span className='pointer label label-lg label-light-danger label-inline btn-height'>فاقد توضیحات</span> : <CategoryModalEdit dbid={item.id} title="مشاهده توضیحات" name={item.title} text={item.description} />}</td>
                <td>{item.createdDate}</td>
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

export default checkRequests(FlowProcessLog,axios);
