import React, { useEffect, useRef, useState } from 'react';
import { SideBarConfig, toastConfig } from '../../Config';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {  makeStyles } from '@material-ui/core/styles';
import { CardComponentReport } from '../../component/UI/CardComponentReport'
import { useHistory } from 'react-router-dom';
import {usersGranPath,usersPath} from '../../commonConstants/RouteConstant';
import { Form, Row, Col, Button } from 'react-bootstrap';
import {
        ActionsGetAllApi,
        GetActionsUserGrantsApi,
        SetGrantToUserApi
      } from '../../commonConstants/ApiConstants';
import { useControlled } from '@material-ui/core';
import formatGroupLabel from '../../component/ReactMultiSelect/formatGroupLabel';
import Select from 'react-select';
import checkRequests from '../../component/ErrroHandling';

const useStyles = makeStyles(theme => ({
  divider: {
    height: theme.spacing(2),
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  inputBackGround: {
    background: '#f8f8f8',
    border: '2px solid black'
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  rootDiv: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    // position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  }
}));

export const UserGrant = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [userID,setUserID] = useState();
  const [actionsDto,setActionsDto] = useState([]);
  const [selectedData,setSelectedData]=useState([]);
  const pdfRef = useRef();

  function groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const notifySuccess = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.successStyle });
  const notifyError = (title) => toast(title , { duration: toastConfig.duration, style: toastConfig.errorStyle });

  useEffect(() => {
    if( props.location.state==undefined)
      return history.replace(usersPath);
    
    var dbid = props.location.state.data;
    setUserID(dbid);

    axios.get(ActionsGetAllApi).then((response)=>{
      var groupd = groupBy(response.data.actionDtos,'controllerName');
      var tmpOptions=[];
      response.data.actionDtos.map((item,index)=>{
          if(!tmpOptions.find(z=>z.label==item.controllerName)){
            var items = groupd[item.controllerName];
            var tmpActions=[];
            items.map((actionItem,index)=>{
              var actionObj ={ value: actionItem.id, label:actionItem.titleFr}
              tmpActions.push(actionObj);
            });
            var obj ={
              label:item.controllerName,
              options:tmpActions
            };
            tmpOptions.push(obj);
          }
      })
      setActionsDto(tmpOptions);
    }).finally((data)=>{

    }).catch((error)=>{
          
    });;
    setDefaultValue(dbid);
  }, []);

  function setDefaultValue(dbid){
    axios.get(GetActionsUserGrantsApi+"/"+dbid).then((response)=>{
      var tmp = [];
      response.data.actionDtos.map((item, index) => {
        tmp.push({value:item.id,label:item.controllerName+":"+item.titleFr});
      });
      setSelectedData(tmp);
    }).catch((error)=>{
          
    });
  }


  function saveGrant(){
    var tmpActions=[];
    selectedData.map((item,index)=>{
      var item =parseInt(item.value)
      tmpActions.push(item)
    });
    axios.put(SetGrantToUserApi,{UserID:userID,ActionIDs:tmpActions}).then((response)=>{
      if(response.data.hasError==false){
        notifySuccess(response.data.errorMessage);
        history.replace(usersPath);
      }else{
        notifyError(response.data.errorMessage);
      }
    }).catch((error)=>{
          
    });;
  }
  function onChangeUserGrant(e){
    setSelectedData(e)
  }
  return (
    <>
      {
      <div style={{  direction: 'rtl',textAlign: 'right'}} id="pdfContent" ref={pdfRef}>
        <div id="showImage"></div>
        <div className="row">
          <div className="col-md-12">
            <CardComponentReport
              footerRender={
                <>
                  <Row>
                    <Col md='4'>
                      <Button onClick={saveGrant} className='btn-height2 create-btn' variant="info">اعمال دسترسی ها</Button>
                    </Col>
                  </Row>
                </>
              }
              codeBlockHeight="400px">
              <Form style={{ border: '1px solid rgb(201, 211, 255)', padding: '21px' }}>
                <Form.Group>   
                  <Row>
                  <Col md='12' style={{ marginTop: '15px' }}>
                    <Form.Label className='custom-label bold'>انتخاب عملیات</Form.Label>
                    <div style={{marginTop:'23px'}}>
                    <Select
                        value={selectedData}
                        onChange={onChangeUserGrant}
                        isRtl={true}
                        isSearchable={true}
                        closeMenuOnSelect={false}
                        isMulti
                        options={actionsDto}
                        formatGroupLabel={formatGroupLabel}
                      />
                    </div>
                  </Col>
                  </Row>

                </Form.Group>
              </Form>
            </CardComponentReport>
          </div>
        </div>
        <Toaster position={toastConfig.position} />
      </div>
    }

    </>
  );
}



export default checkRequests(UserGrant,axios)