import React, { useEffect, useRef, useState } from 'react';
import { Hide_add } from '../_redux/Actions/processActions';
import { connect } from "react-redux";
import {  toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import {
  processDefinitionSearchApi, stockRoomGetAllApi,
  GeneralParamterGetChildsByParentsApi, AdminUserGetUsersApi,
  ProcessInsertApi,ProcessInsertBalanceApi
} from '../commonConstants/ApiConstants';
import { ProcessTypeCode } from '../commonConstants/commonConstants';
import {useDispatch,useSelector} from 'react-redux'
import DropDown from '../component/UI/DropDown';
import axios from 'axios';
import { Is_added } from '../_redux/Actions/processDefinitionActions';
import { AddNewRow,RemoveRow } from '../_redux/Actions/processActions';
import {  makeStyles } from '@material-ui/core/styles';
import { CardComponent } from '../component/UI/CardComponent'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ProcessAddRow from './ProcessAddRow';
import Multiselect from "@khanacademy/react-multi-select";
import {processListPath} from '../commonConstants/RouteConstant';
import { useHistory } from 'react-router-dom';
import moment from 'moment-jalaali';
import checkRequests from '../component/ErrroHandling';
import {DatePickerComponent} from '../component/DatePickerComponent/DatePickerComponent';
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

export const ProcessDefinitionPageAdd = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [processDefinitionSource, setProcessDefinitionSource] = React.useState([]);
  const [typeContractorTypeSource, setTypeContractorTypeSource] = React.useState([]);
  const [showContractorType, setShowContractorTypes] = React.useState(false);
  const [userContractorsSource, setUserContractorsSource] = React.useState([]);
  const [stockRoomSource, setStockRoomSource] = React.useState([]);
  const [modelInsertedSelected, setModelInsertedSelected] = React.useState({
    processDefinitionID: 0,
    contractorTypeID: 0,
    issueDateVal: '',
    isFinalResult: false,
    contractorTypeFullName: '',
    userContractors: [],
    userContractorID: 0
  });
  const addNewRowDispatch = useDispatch();
  const RemoveRowDispatch = useDispatch();
  const rowProduct = useSelector(state=>state.process);
  const [userContractorSelected,setUserContractorSelecet]= React.useState([]);
  const [lastRow, setLastRow] = React.useState(1);
  const [rows, setRows] = React.useState([]);
  const [selectedProductID,setSelectedProductID]= React.useState([]);
  const processDefinitionRef = useRef();
  const isFinalRef = useRef();
  const contractorTypeRef = useRef();
  const contractorTypeFullNameRef = useRef();
  const titleRef = useRef();
  const descInputRef = useRef();
  const processAddRowRef = useRef(new Array());
  const processRef = useRef();
  const [ProductID,setProductID]=React.useState();
  useEffect(() => {
    fillAutoComplete();
    fillContractorType();
    fillUsersData();
    fillStockRoomData();
    addNewRowDispatch(AddNewRow([]));
  }, []);
  useEffect(()=>{
    if(typeContractorTypeSource[0]!==undefined)
      setModelInsertedSelected({...modelInsertedSelected, contractorTypeID: typeContractorTypeSource[0].id })
  },typeContractorTypeSource);

  function fillAutoComplete() {
    let generateApi = processDefinitionSearchApi + '?Title=' + '&Page=1&Row=300';
    const processDefinitionsArray = [];
    axios.get(generateApi)
      .then(res => {
        if(res.data.hasError===false){
          res.data.processDefinitionDtos.map((item, index) => {
            processDefinitionsArray.push(item);
          });
          setProcessDefinitionSource(processDefinitionsArray);
          if(processDefinitionsArray[0]!=undefined)
            setModelInsertedSelected({...modelInsertedSelected, processDefinitionID:processDefinitionsArray[0].id })
        }

      }).catch((error)=>{
          
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
    }).catch((error)=>{
          
    });
  }

  function fillUsersData() {
    const usersTypeArray = [];
    axios.get(AdminUserGetUsersApi).then((res) => {
      if (res.data.hasError == false) {
        res.data.userDtos.map((item, index) => {
          const newItem = {
            value: item.id,
            label: item.fullName
          }
          usersTypeArray.push(newItem);
        })
      }
      setUserContractorsSource(usersTypeArray);
    }).catch((error)=>{
          
    });
  }

  function fillStockRoomData() {
    const stockRoomArray = [];
    let newItem = {
      ID: 0,
      StockRoom_InitialBalanceFK_ID: 0,
      InitialBalanceEntitiesFK_ID: 0,
      PricePerUnit: 0,
      CurrentCount: 0,
      Count: 0
    };
    axios.get(stockRoomGetAllApi).then((res) => {
      res.data.stockRoomDtos.map((item, index) => {
        newItem.ID = item.id;
        newItem.Title = item.title;
        newItem.StockRoom_InitialBalanceFK_ID = item.id;
        stockRoomArray.push(item);
      });
      setStockRoomSource(stockRoomArray);
    }).catch((error)=>{
          
    });
  }

  function contractorTypeOnChange(e) {
    setModelInsertedSelected({...modelInsertedSelected, contractorTypeID: parseInt(e.target.value )})
    if (parseInt(modelInsertedSelected.contractorTypeID) === 18)
    {
      setUserContractorSelecet([]);
      setShowContractorTypes(false)
    }
    else
      setShowContractorTypes(true)
  }

  function renderContractorType() {
    if (showContractorType === false)
      return (
        <Col md='4' style={{ marginTop: '4px' }}>
          <Form.Label className='custom-label bold'>نام و نام خانوادگی پیمانکار</Form.Label>
          <Form.Control style={{ marginTop: '30px' }} ref={contractorTypeFullNameRef} onKeyUp={(e) => {
            setModelInsertedSelected({...modelInsertedSelected, contractorTypeFullName: e.target.value })
          }} className={classes.inputBackGround, 'custom-label marg-t-20 bold'} type="IssueDate" aria-required={true} />
        </Col>
      )
    else {
      return (
        <Col md='4' style={{ marginTop: '15px' }}>
          <Form.Label className='custom-label bold'>انتخاب کاربران</Form.Label>
          <div style={{marginTop:'23px'}}>
          <Multiselect

              options={userContractorsSource} // Options to display in the dropdown
              selected={userContractorSelected}
              onSelectedChanged={selectedContractorsChange}
              />
          </div>
        </Col>
      )
    }
  }
  function issueDateOnSubmit(e){
      setModelInsertedSelected({...modelInsertedSelected, issueDateVal: e })
  }

  const addRow = () => {
    setLastRow(lastRow + 1);
  }
  useEffect(() => {
    let newRows = [...rowProduct.Rows_Product];
    newRows.push(<ProcessAddRow 
      ref={(element) => processAddRowRef.current.push(element)} 
      id={lastRow} 
      selectedProductID={selectedProductID}
      setSelectedProductID={setSelectedProductID}
      removeRowHandler={removeRowHandler}
      isEditPage={false}
      />);
    addNewRowDispatch(AddNewRow(newRows))
    setRows(newRows);
    
  }, [lastRow]);
  

  function removeRowHandler(e,prodId){
    var rowData = rowProduct.Rows_Product;
    var rowID = parseInt(e.target.id);
    var rowsTmp = [];
    var productID =0;
    rowData.map((item,index)=>{
      if(item.props.id!==rowID){
        rowsTmp.push(item);
      }
    });

    var tmpArray = [];
    var currentItem = selectedProductID.filter(z=>z==prodId)[0];
    selectedProductID.map((item,index)=>{
        if(parseInt(item)!=currentItem)
            tmpArray.push(item);
    });
    RemoveRowDispatch(RemoveRow(prodId));
    setSelectedProductID(tmpArray);
    addNewRowDispatch(AddNewRow(rowsTmp));
    setRows(rowsTmp);
  }

  function selectedContractorsChange(selected){
    var tmpArray = userContractorSelected;
    tmpArray = selected;
    setUserContractorSelecet(tmpArray)
  }
  const notifySuccess = (title) => toast('فرایند ' + title + ' با موفقیت افزوده شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
  const notifyError = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.errorStyle });
  const notifyInfo = (title) => toast('در حال افزودن فرایند  ' + title + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
  const notifyNotValidate= (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.errorStyle });

  function save() {
    if (!validate())
      return;
    var balanceValues= [];
    rowProduct.Selected_Products.map((item,index)=>{
        var data = item.Rows_Product;
        data.map((itemData,indexData)=>{
          balanceValues.push(itemData);
        })
      });
    if(balanceValues.length<=0){
        notifyNotValidate('محصولی انتخاب نشده است.');
        return;
    }
    let title = titleRef.current.value;
    let desc = descInputRef.current.value;
    let userContractorSelectedArray = userContractorSelected;
    let ContractorFullName ='';
    let processDefintionTypeRef = processDefinitionRef;
    if(contractorTypeFullNameRef!==undefined)
    if(contractorTypeFullNameRef.current!==null)
     ContractorFullName=contractorTypeFullNameRef.current.value;
    let issueDate =modelInsertedSelected.issueDateVal;

    let ProcessDefinitionID = modelInsertedSelected.processDefinitionID===0?processDefinitionSource[0].id:modelInsertedSelected.processDefinitionID;
    let isFinalStep =modelInsertedSelected.isFinalResult;
    var data ={
      ProcessDefinitionID:ProcessDefinitionID,
      ContractorFullName:ContractorFullName,
      UserContractorID:userContractorSelectedArray,
      ContractorTypeID:modelInsertedSelected.contractorTypeID===0?typeContractorTypeSource[0].id:modelInsertedSelected.contractorTypeID,
      IssueDate:issueDate,
      IsFinalStep:isFinalStep,
      Title:title,
      Description:desc
    }
    axios.post(ProcessInsertApi, data)
      .then(res => {
        if (res.data.hasError === false) {
          saveInsertBalance(res.data.processDto.id,balanceValues);

        } else {
          notifyError(res.data.errorMessage);
        }
      }).catch((error)=>{
          
      });
    notifyInfo(title);
  }
  function validate() {
    let hasError = false;
    
    if (titleRef.current.value.trim() === '') {
      hasError = true;
      notifyNotValidate('عنوان وارد نشده است.');
    }
    if(modelInsertedSelected.issueDateVal.trim()==''){
      hasError=true;
      notifyNotValidate('مقدار تاریخ وارد نشده است.')
    }
    if (parseInt(modelInsertedSelected.contractorTypeID) === 17||parseInt(modelInsertedSelected.contractorTypeID) ===0) {
      if(contractorTypeFullNameRef.current.value.trim()===''){
        hasError = true;
        notifyNotValidate('نام و نام خانوادگی پیمانکار وارد نشده است.');
      }
    }else{
      if(userContractorSelected.length<=0){
        hasError = true;
        notifyNotValidate('کارگر انتخاب نشده است.');
      }
    }
    return !hasError;
  }

  function saveInsertBalance(id,data){
    let dataBalance ={
        ID:id,
        stockRoom_InitialBalanceDtos:data
      };
    axios.post(ProcessInsertBalanceApi,dataBalance)
      .then(res=>{
        if(res.data.hasError===false){
          notifySuccess(res.data.errorMessage);
          return history.replace(processListPath);
        }else{
          notifyError(res.data.errorMessage);
        }
      }).catch((error)=>{
          
      });
  }



  return (
    <>      
      <div className={classes.rootDiv} >
        <div className="row">
          <div className="col-md-12">
            <CardComponent
              beforeCodeTitle="تعریف فرایند جدید"
              codeBlockHeight="400px">
              <Form style={{ border: '1px solid rgb(201, 211, 255)', padding: '21px' }}>
                <Form.Group>
                  <Row className='marg-t-10'>
                    <Col md='4'>
                    </Col>
                  </Row>
                  <Row >
                    <Col md='4' >
                      <Form.Label className='custom-label bold'>انتخاب نوع فرایند</Form.Label>
                      <DropDown source={processDefinitionSource} ref={processDefinitionRef} SelectedID={modelInsertedSelected.processDefinitionID}
                        onChange={(e) => {
                          setModelInsertedSelected({...modelInsertedSelected, processDefinitionID: e.target.value })
                        }}
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
                      <Form.Label className='custom-label bold'>تاریخ ایجاد فرایند</Form.Label>
                      <DatePickerComponent selectedDate={moment().format('jYYYY-jMM-jDD')} onChange={issueDateOnSubmit}></DatePickerComponent>
                    </Col>
                    <Col md='2'></Col>
                    <Col md='4' style={{ marginTop: '15px' }}>
                      <FormControlLabel
                        control={<Checkbox ref={isFinalRef} checked={modelInsertedSelected.isFinalResult} onChange={(e) => {
                          setModelInsertedSelected({...modelInsertedSelected, isFinalResult: !modelInsertedSelected.isFinalResult })
                        }} name="isFinal" />}
                        label="خروجی نهایی است؟"
                      />
                    </Col>
                  </Row>

                  <div className="separator separator-dashed my-7"></div>
                  <Row>
                    <Col md='4' >
                      <Form.Label className='custom-label bold'>نوع انجام فرایند</Form.Label>
                      <DropDown source={typeContractorTypeSource} ref={contractorTypeRef} SelectedID={modelInsertedSelected.contractorTypeID}
                        onChange={contractorTypeOnChange}
                        className={classes.inputBackGround, 'custom-label marg-t-20 bold'} type="Name" aria-required={true} />
                    </Col>
                    <Col md='2'></Col>
                    {
                      renderContractorType()
                    }
                  </Row>

                  <Row>
                    <Col md='10'>
                    <Form.Label className='custom-label marg-t-20 bold'>توضیحات</Form.Label>
                    <Form.Control ref={descInputRef} className='form-control-custom' as="textarea" rows="4" />
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </CardComponent>
          </div>
        </div>
        <Toaster position={toastConfig.position} />
      </div>

      <div className={classes.rootDiv} style={{marginBottom:'130px'}}>
        <div className="row">
          <div className="col-md-12">
            <CardComponent
              beforeCodeTitle="انتخاب نوع محصول"
              codeBlockHeight="400px">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop:'-80px' }}>
                <button onClick={addRow} type="button" class="btn-height2 create-btn btn btn-info">افزودن رکورد جدید</button>
              </div>
              <div style={{marginTop:'14px'}} id="rowsProduct" ref={processRef}>
                {rowProduct.Rows_Product}
              </div>
            </CardComponent>
          </div>
        </div>

        <Toaster position={toastConfig.position} />
      </div>
      
      <div className="row">
          <div className='category-add-footer' style={{width:'100%',right:0}}>
              <div className='btn-custom btn-custom-save' onClick={save}>ذخیره</div>
          </div>
      </div>
    </>

  );
}

const mapStateToProps = (state => {
  return {
    Show_Hide_Add: state.processDefinition.Show_Hide_Add,
    Is_Added: state.processDefinition.Is_Added
  };
});
const mapDispatchToProps = (dispatch) => ({
  hideFunction: () => dispatch(Hide_add()),
  added: () => dispatch(Is_added())
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(ProcessDefinitionPageAdd,axios));