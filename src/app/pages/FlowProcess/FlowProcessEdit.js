import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import {InitialBalanceGetAllApi} from '../commonConstants/ApiConstants';
import InitialBalanceEdit from './InitialBalance/InitialBalanceEdit';
import {unitTypeCode,typeMaterialCode,categoryParentCode} from '../commonConstants/commonConstants';
import InitialBalanceAdd from './InitialBalance/InitialBalanceAdd';
import { ProcessTypeCode
  ,FlowProcessTypeCode} from '../commonConstants/commonConstants';
import DropDown from '../component/UI/DropDown';
import axios from 'axios';
import { Show_add, Show_edit, Is_not_edited, Is_not_deleted_one, Is_not_deleted_group, Is_not_added } from '../_redux/Actions/FlowProcessActions';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Notice } from "../../../_metronic/_partials/controls";
import { CardComponent } from '../component/UI/CardComponent';
import WastageAdd from './Wastage/WastageAdd';
import SalaryModal from './components/SalaryModel';
import checkRequests from '../component/ErrroHandling';
import {
  FlowProcessInsertToStackApi
  ,FlowProcessInsertNewBalanceApi
  ,FlowProcessEditApi
  ,ProcessGetAllApi
  ,ProcessGetByIDApi
  ,FlowProcessGetByIDApi
  ,GeneralParamterGetChildsByParentsApi} from '../commonConstants/ApiConstants';
import {flowProcessListPath} from '../commonConstants/RouteConstant';
import { useHistory } from 'react-router-dom';

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

export const FlowProcessEdit = (props) => {
  const classes = useStyles();
  const processRef = useRef();
  const titleRef = useRef();
  const descInputRef = useRef();
  const history = useHistory();
  const [flowId,setFlowID]=React.useState();
  const [wastageModel,setWastageModel] = React.useState([]);
  const [processTypesSource, setProcessTypesSource] = React.useState([]);
  const [flowProcessTypesSource, setFlowProcessTypesSource] = React.useState([]);
  const [flowDto,setFlowDto] = React.useState();
  const [selectedFlowProcessType, setSelectedFlowProcessType] = React.useState([]);
  const [processInfo,setProcessInfo] = React.useState();
  const [flowProcessInfo,setFlowProcessInfo] = React.useState();

  const [showContractorType, setShowContractorTypes] = React.useState(false);
  const [typeContractorTypeSource,setTypeContractorTypeSource] = React.useState([]);

  const [showSalaryModal,setShowSalaryModel] =React.useState(false);
  const [salaryData,setSalaryData] =React.useState([]);
  const [pageModel,setPageModel] = React.useState({
    contractorTypeID:0,
    selectedInitialBalance:0,
    processTypeID:0,
    salaryModel:[]
    
  })
  const hireRef =useRef();

  useEffect(() => {
    fillProcess();
    fillFlowProcess();
    fillContractorType();
    initializeForm();
  }, []);
  
  useEffect(()=>{
    if(flowDto!=undefined){
      setFlowProcessInfo({
        processUserDtos:flowDto.userSalaryDtos,
        initialBalanceDtos:flowDto.wastagesDto,
        processUserDtos:flowDto.userSalaryDtos
      })
      titleRef.current.value = flowDto.title;
      descInputRef.current.value  = flowDto.description;
      hireRef.current.value = flowDto.hire;
      setPageModel({
        ...pageModel,
        processTypeID:flowDto.processID,
        contractorTypeID:flowDto.processDto.contractorTypeID
      });
      showContractors(parseInt(flowDto.processDto.contractorTypeID));
    }
  },flowDto);

  useEffect(()=>{
  },processInfo)
  
  function initializeForm(){
    if( props.location.state==undefined)
      return history.replace(flowProcessListPath)
    var dbid = props.location.state.data.id;
    setFlowID(dbid);
    var rowItem = props.location.state.data;
    axios.get(FlowProcessGetByIDApi+dbid).then(res=>{
      const data = res.data.flowProcessDto;
      setFlowDto(data);
    });
  }


  function fillContractorType() {
    let api = GeneralParamterGetChildsByParentsApi + "?Code=" + ProcessTypeCode;
    const contactorTypeArray = [];
    axios.get(api).then((res) => {
      if (res.data.hasError === false) {
        res.data.generalParamterDtos.map((item, index) => {
          contactorTypeArray.push(item);
        })
        setTypeContractorTypeSource(contactorTypeArray);
      }
    })
  }

  
  function fillProcess() {
    let api = ProcessGetAllApi;
    const tmpArray = [];
    axios.get(api).then((res) => {

      if (res.data.hasError === false) {
        res.data.processDtos.map((item, index) => {
          tmpArray.push(item);
        })
        setProcessTypesSource(tmpArray);
        getProcessInformation(tmpArray[0].id);
      }
    })
  }
  function fillFlowProcess() {
    let api = GeneralParamterGetChildsByParentsApi + "?Code=" + FlowProcessTypeCode;
    const tmpArray = [];
    axios.get(api).then((res) => {

      if (res.data.hasError === false) {
        res.data.generalParamterDtos.map((item, index) => {
          tmpArray.push(item);
        })
        setFlowProcessTypesSource(tmpArray);
        setSelectedFlowProcessType(tmpArray[0].id);
      }
    })
  }

  function getProcessInformation(id){
      axios.get(ProcessGetByIDApi+'/'+id).then((res)=>{
        if(res.data.hasError===false){
          console.log("processInfo",res.data)
          setProcessInfo(res.data);
          setPageModel({
            ...pageModel,
            processTypeID:id
          })
        } 
      })
  }

  function processTypeChange(e){
    getProcessInformation(e.target.value);

  }

  function showSalaryModalOnChange(){
    setShowSalaryModel(true);
  }

  function showContractors(id){
    if (id === 17)
    {
      setShowContractorTypes(false)
    }
    else
      setShowContractorTypes(true)
  }



  function salaryModalConfirm(data){
    setShowSalaryModel(false);
    setSalaryData(data);
    console.log(data);
  }
  function salaryModalClose(){
    setShowSalaryModel(false);
  }

  function wastageModelHandler(data){
    setWastageModel(data);
  }

  function renderContractorType() {
    if (showContractorType === false)
      return (
        <Col md='4'>
          <Form.Label className='custom-label bold'>اجرت</Form.Label>
          <Form.Control style={{marginTop: '23px' }} disabled='disabled' className={classes.inputBackGround, 'custom-label marg-t-20 bold'} placeholder="اجرت" ref={hireRef}></Form.Control>
      </Col>
      )
    else {
      return (
        <Col md='4' style={{marginTop:'37px'}}>
          <div className='btn-custom btn-custom-save' onClick={showSalaryModalOnChange}>ورود دستمزد</div>
          <SalaryModal
                      processUsers ={flowProcessInfo.processUserDtos!=undefined?flowProcessInfo.processUserDtos:[]} 
                      handleConfirm={salaryModalConfirm} 
                      handleClose={salaryModalClose} 
                      show={showSalaryModal}></SalaryModal>
        </Col>
      )
    }
  }

  const notifySuccess = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.successStyle });
  const notifyError = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.errorStyle });
  const notifyInfo = (title) => toast('در حال افزودن فرایند  ' + title + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
  const notifyNotValidate= (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.errorStyle });



  function save() {
    if (!validate())
      return;
    let title = titleRef.current.value;
    let description = descInputRef.current.value;
    var data ={
      id:flowId,
      title:title,
      description:description
    }
    axios.put(FlowProcessEditApi,data).then((res)=>{
      if(res.data.hasError===false){
        notifySuccess(res.data.errorMessage);
      }else{
        notifyError(res.data.errorMessage)
      }
    })
  }

  function validate() {
    let hasError = false;
    if (titleRef.current.value.trim() === '') {
      hasError = true;
      notifyNotValidate('عنوان وارد نشده است.');
    }
    if(showContractorType==false){
      if (hireRef.current.value.trim() === '') {
        hasError = true;
        notifyNotValidate('مقدار اجرت وارد نشده است.');
      }
    }else{
      if(salaryData.length<=0){
        hasError = true;
        notifyNotValidate('ساعت کار کارگران وارد نشده است');
      }
    }

    return !hasError;
  }



  return (
    <>
      <div className={classes.rootDiv}>
        <div className="row">
          <div className="col-md-12">
            <CardComponent
              beforeCodeTitle="تعریف خروجی نهایی فرایند"
              codeBlockHeight="400px">
              <Form style={{ border: '1px solid rgb(201, 211, 255)', padding: '21px' }}>
                <Form.Group>
                  <Row className='marg-t-10'>
                    <Col md='4'>
                    </Col>
                  </Row>
                  <Row >
                    <Col md='4' >
                      <Form.Label className='custom-label bold'>انتخاب فرایند</Form.Label>
                      <DropDown
                      disabled='disabled'
                      source={processTypesSource} ref={processRef} 
                      SelectedID={pageModel.processTypeID}
                      onChange={processTypeChange}
                        className={classes.inputBackGround, 'custom-label marg-t-20 bold'} type="Name" aria-required={true} />
                    </Col>
                  </Row>
                  
                  <div className="separator separator-dashed my-7"></div>
                  <Row >
                    <Col md='4' style={{marginTop: '20px !important' }}>
                      <Form.Label className='custom-label bold'>عنوان</Form.Label>
                      <Form.Control className={classes.inputBackGround, 'custom-label marg-t-20 bold'} placeholder="عنوان" ref={titleRef}></Form.Control>
                    </Col>
                  </Row>
                  
                  <div className="separator separator-dashed my-7"></div>
                  <Row >
                    <Col md='4' >
                      <Form.Label className='custom-label bold'>نوع انجام فرایند</Form.Label>
                      <DropDown disabled='disabled'  
                         source={typeContractorTypeSource} 
                        style={{marginTop: '3px'}}
                        SelectedID={pageModel.contractorTypeID}
                        className={classes.inputBackGround, 'custom-label marg-t-4 bold'} type="Name" aria-required={true} />
                    </Col>
                    {
                      renderContractorType()
                    }
                  </Row>

                  <Row>
                    <Col md='10'>
                    <Form.Label className='custom-label marg-t-20 bold'>توضیحات</Form.Label>
                    <Form.Control ref={descInputRef}   className='form-control-custom' as="textarea" rows="4" />
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </CardComponent>
          </div>
        </div>
        <Toaster position={toastConfig.position} />
      </div>
      <WastageAdd
        wastageModelHandler={wastageModelHandler}
        processInfo={flowProcessInfo}
      ></WastageAdd>
      <div className="row">
          <div className='category-add-footer'>
              <div className='btn-custom btn-custom-save' onClick={save}>ذخیره</div>
          </div>
      </div>
    </>

  );
}

const mapStateToProps = (state => {
  return {
    Is_Edited: state.flowProcess.Is_Edited,
    Is_Deleted_One: state.flowProcess.Is_Deleted_One,
    Is_Deleted_Group: state.flowProcess.Is_Deleted_Group,
    Is_Added: state.flowProcess.Is_Added,
  };
});

const mapDispatchToProps = (dispatch) => ({
showAddFunction: () => dispatch(Show_add()),
showEditFunction: (obj) => dispatch(Show_edit(obj)),
notEdited: () => dispatch(Is_not_edited()),
notDeletedOne: () => dispatch(Is_not_deleted_one()),
notDeletedGroup: () => dispatch(Is_not_deleted_group()),
notAdded: () => dispatch(Is_not_added()),
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(FlowProcessEdit,axios));