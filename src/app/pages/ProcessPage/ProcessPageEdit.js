import React, { useEffect, useRef, useState } from 'react';
import { Hide_add } from '../_redux/Actions/processActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import moment from 'moment-jalaali';
import { AddNewRow,RemoveRow } from '../_redux/Actions/processActions';
import {processDefinitionSearchApi
    ,GeneralParamterGetChildsByParentsApi
    ,AdminUserGetUsersApi
    ,ProcessEditApi
    ,ProcessEditBalanceApi
    ,ProcessGetUserContractorsById
    ,ProcessGetProcessProductsById
    ,ProcessRolBackProcessApi
} from '../commonConstants/ApiConstants';
import { ProcessTypeCode } from '../commonConstants/commonConstants';
import DropDown from '../component/UI/DropDown';
import axios from 'axios';
import checkRequests from '../component/ErrroHandling';
import { Is_added } from '../_redux/Actions/processDefinitionActions';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {useDispatch,useSelector} from 'react-redux'
import { CardComponent } from '../component/UI/CardComponent'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {DatePickerComponent} from '../component/DatePickerComponent/DatePickerComponent';
import ProcessAddRow from './ProcessAddRow';
import Multiselect from "@khanacademy/react-multi-select";
import { functions } from 'lodash';
import { useHistory } from 'react-router-dom';
import {processEditPath,processPath,processListPath} from '../commonConstants/RouteConstant';

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

export const ProcessPageEdit = (props) => {

  const classes = useStyles();
  const [processDefinitionSource, setProcessDefinitionSource] = React.useState([]);
  const [typeContractorTypeSource, setTypeContractorTypeSource] = React.useState([]);
  const [showContractorType, setShowContractorTypes] = React.useState(false);
  const [userContractorsSource, setUserContractorsSource] = React.useState([]);
  const [selectedProductID,setSelectedProductID]= React.useState([]);
  const rowProduct = useSelector(state=>state.process);
  const history = useHistory();
  const [issueDateChanged,setIssueDateChanged] = React.useState(false);
  const [modelInsertedSelected, setModelInsertedSelected] = React.useState({
    processDefinitionID: 0,
    contractorTypeID: 0,
    issueDateVal:props.location.state.data!=undefined? props.location.state.data.issueDate:'1400-01-01',
    isFinalResult: false,
    contractorTypeFullName: '',
    userContractors: [],
    userContractorID: 0
  });


  const [userContractorSelected,setUserContractorSelecet]= React.useState([]);
  const [lastRow, setLastRow] = React.useState(1);
  const [rows, setRows] = React.useState([]);
  const processDefinitionRef = useRef();
  const issueDateRef = useRef();
  const isFinalRef = useRef();
  const contractorTypeRef = useRef();
  const contractorTypeFullNameRef = useRef();
  const titleRef = useRef();
  const descInputRef = useRef();
  const processAddRowRef = useRef(new Array());
  const addNewRowDispatch = useDispatch();
  const RemoveRowDispatch = useDispatch();

  useEffect(() => {
    fillAutoComplete();
    fillContractorType();
    fillUsersData();
    initializeForm();
  }, []);

  useEffect(()=>{
    if(modelInsertedSelected.id!=undefined)
      loadProcessBalance(modelInsertedSelected.id);
  },[modelInsertedSelected.id])
  function initializeForm(){
    if( props.location.state==undefined)
      return history.replace(processListPath)
    var dbid = props.location.state.data.id;
    var rowItem = props.location.state.data;
    setModelInsertedSelected({
        processDefinitionID: rowItem.processDefinitionID,
        isFinalResult: rowItem.isFinalStep,
        contractorTypeID: rowItem.contractorTypeID,
        id:dbid,
        issueDateVal:rowItem.issueDate
    });

    titleRef.current.value = rowItem.title;
    descInputRef.current.value =rowItem.description;
    contractorTypeFullNameRef.current.value= rowItem.contractorFullName;
    isFinalRef.current.value = rowItem.isFinalStep;
    contractorTypeEvent(rowItem.contractorTypeID);
    if(rowItem.contractorTypeID===18){
        var api = ProcessGetUserContractorsById + '/' + dbid;
        axios.get(api).then((res)=>{
            selectedContractorsChange(res.data.userContractorID);
        }).catch((error)=>{
          
        });
    }

}

  function onlyUnique(array,key) {
      const arrayUniqueByKey = [...new Map(array.map(item =>
      [item[key], item])).values()];
      return arrayUniqueByKey;
  }

   function loadProcessBalance(id){
    var api = ProcessGetProcessProductsById +'/'+id;
    axios.get(api).then((res)=>{
        let newRows = [];
        let rowID  = lastRow;
        let tmpSelectedProducts=[];
        var processUniqueBalances = onlyUnique(res.data.processBalanceDtos,"initialBalanceID");
        processUniqueBalances.map((item,index)=>{
          newRows.push(<ProcessAddRow 
            ref={(element) => processAddRowRef.current.push(element)} 
            id={lastRow}
            isEditPage={true}
            processBalance={res.data.processBalanceDtos}
            initialBalanceID={item.initialBalanceID} 
            selectedProductID={selectedProductID}
            setSelectedProductID={setSelectedProductID}
            removeRowHandler={removeRowHandler}/>);
            rowID=rowID+1;
            tmpSelectedProducts.push(item.initialBalanceID);
        });
        setSelectedProductID(tmpSelectedProducts);
        addNewRowDispatch(AddNewRow(newRows));
        setRows(newRows);
    })
   }

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

  function contractorTypeEvent(contractorTypeID){
    if (parseInt(contractorTypeID) !== 18)
    {
      setUserContractorSelecet([]);
      setShowContractorTypes(false)
    }
    else
      setShowContractorTypes(true)
  }
  function contractorTypeOnChange(e) {
    setModelInsertedSelected({...modelInsertedSelected, contractorTypeID: e.target.value })
    contractorTypeEvent(e.target.value)
  }

  function renderContractorType() {
    if (showContractorType === false)
      return (
        <Col md='4' style={{ marginTop: '15px' }}>
          <Form.Label className='custom-label bold'>نام و نام خانوادگی پیمانکار</Form.Label>
          <Form.Control style={{ marginTop: '30px' }} ref={contractorTypeFullNameRef} onKeyUp={(e) => {
            setModelInsertedSelected({...modelInsertedSelected, contractorTypeFullName: e.target.value })
          }} className={classes.inputBackGround, 'custom-label marg-t-20 bold'} type="IssueDate" aria-required={true} />
        </Col>
      )
    else {
      return (
        <Col md='4' style={{ marginTop: '15px' }}>
          <Form.Label className='custom-label bold'>انتخاب کارگران</Form.Label>
          <Multiselect
              style={{marginTop:'30px'}}
              options={userContractorsSource} // Options to display in the dropdown
              selected={userContractorSelected}
              onSelectedChanged={selectedContractorsChange}
              />
        </Col>
      )
    }
  }


  const addRow = () => {
    setLastRow(lastRow + 1);
  }
  useEffect(() => {
    generateRows(lastRow);
  }, [lastRow]);

  function generateRows(lastRow){
    let newRows = [...rows];
    newRows.push(<ProcessAddRow 
      ref={(element) => processAddRowRef.current.push(element)} 
      id={lastRow} 
      selectedProductID={selectedProductID}
      setSelectedProductID={setSelectedProductID}
      removeRowHandler={removeRowHandler}
      />);
    addNewRowDispatch(AddNewRow(newRows));
    setRows(newRows);
  }
  function removeRowHandler(e,prodId){
    var rowData = rowProduct.Rows_Product;
    var rowID = parseInt(e.target.id);
    var rowsTmp = [];
    var selectedProductsArray =[];
    rowData.map((item,index)=>{

      if(item.props.initialBalanceID!=undefined)
      {
        if(item.props.initialBalanceID!==prodId){
          rowsTmp.push(item);
          selectedProductsArray.push(item.props.initialBalanceID);
        }
      }else{
        if(item.props.id!==rowID){
          rowsTmp.push(item);
        }
      }
    });

    var tmpArray = [];
    var currentItem = selectedProductsArray.filter(z=>z==prodId)[0];
    selectedProductsArray.map((item,index)=>{
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
  
  const notifySuccess = (title) => toast('ویرایش ' + title + ' با موفقیت انجام گردید.', { duration: toastConfig.duration, style: toastConfig.successStyle });
  const notifyError = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.errorStyle });
  const notifyInfo = (title) => toast('در حال ویرایش فرایند  ' + title + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
  const notifyNotValidate= (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.errorStyle });

  function save() {
    if (!validate())
      return;
    var balanceValues= [];
    debugger;
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
    if(contractorTypeFullNameRef!==undefined)
    if(contractorTypeFullNameRef.current!==null)
     ContractorFullName=contractorTypeFullNameRef.current.value;
     let issueDate = modelInsertedSelected.issueDateVal;
     if(issueDateChanged==false){
      issueDate = moment(modelInsertedSelected.issueDateVal, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
     }

    let ProcessDefinitionID = modelInsertedSelected.processDefinitionID===0?processDefinitionSource[0].id:modelInsertedSelected.processDefinitionID;
    let isFinalStep =modelInsertedSelected.isFinalResult;
    var data ={
      ID:modelInsertedSelected.id,
      ProcessDefinitionID:ProcessDefinitionID,
      ContractorFullName:ContractorFullName,
      UserContractorID:userContractorSelectedArray,
      ContractorTypeID:modelInsertedSelected.contractorTypeID,
      IssueDate:issueDate,
      IsFinalStep:isFinalStep,
      Title:title,
      Description:desc
    }
    axios.put(ProcessEditApi, data)
      .then(res => {
        if (res.data.hasError === false) {
          saveInsertBalance(modelInsertedSelected.id,balanceValues);

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

  function datePickerOnChange(e){
    setIssueDateChanged(true);
    setModelInsertedSelected({...modelInsertedSelected, issueDateVal: e})
  }
  function saveInsertBalance(id,data){
    let dataBalance ={
        ID:id,
        stockRoom_InitialBalanceDtos:data
      };
    axios.put(ProcessEditBalanceApi,dataBalance)
      .then(res=>{
        if(res.data.hasError===false){
          notifySuccess(titleRef.current.value);
          return history.replace(processListPath)
        }else{
          axios.get(ProcessRolBackProcessApi+id).then((res)=>{
            notifyError("عملیات ویرایش با خطا مواجه شد،لطفا مجددا تست نمایید.");
          })

        }
      }).catch((error)=>{
        axios.get(ProcessRolBackProcessApi+id).then((res)=>{
          notifyError("عملیات افزودن با خطا مواجه شد،لطفا مجددا تست نمایید.");
        }).catch((error)=>{
          
        });
        notifyError(error.message);
      })
  }



  return (
    <>
      <div className={classes.rootDiv} >
        <div className="row">
          <div className="col-md-12">
            <CardComponent
              beforeCodeTitle="ویرایش فرایند"
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
                      <Form.Label className='custom-label bold'>تاریخ اجرای فرایند</Form.Label>
                      <DatePickerComponent selectedDate={modelInsertedSelected.issueDateVal} onChange={datePickerOnChange}></DatePickerComponent>


                    </Col>
                    <Col md='4' style={{ marginTop: '42px' }}>
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
                      <DropDown
                        disabled='disabled'
                        source={typeContractorTypeSource} ref={contractorTypeRef} SelectedID={modelInsertedSelected.contractorTypeID}
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
              <div style={{marginTop:'14px'}}>
                {rows}
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

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(ProcessPageEdit,axios));