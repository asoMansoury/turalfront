import React,{useEffect, useRef, useState} from 'react';
import {GeneralParamterGetChildsByParentsApi,stockRoomGetAllApi,InitialBalanceGetQuantityStockApi} from '../../commonConstants/ApiConstants';
import {unitTypeCode,typeMaterialCode,categoryParentCode} from '../../commonConstants/commonConstants';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import DropDown from '../../component/UI/DropDown';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { NumberToWords,addCommas } from "persian-tools2";
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
    },
    stockLabel:{
      fontWeight: 'bold',
      fontSize: '18px',
      color: '#6f42c1',
      paddingRight: '54px'
    },
  }));
export const InitialBalanceEdit =(props)=>{
    const initialBalanceRef = useRef();
    const classes = useStyles();
    const [stockRoomSource,setStockRoomSource] = React.useState([]);

    const [selectedItem,setSelectedItem] = React.useState();
    useEffect(()=>{
        if(props.initialBalanceSource[0]!=undefined)
            fillStockBalanceFromApi(props.initialBalanceSource[0].id);
        setSelectedItem(props.selectedItem);
    },[])

function fillStockBalanceFromApi(id){
    if(id.toString()!=='NaN')
    {
        axios.get(InitialBalanceGetQuantityStockApi+'/'+id).then((res)=>{
        let tmpArray = res.data.stockRoom_InitialBalanceDtos;
        let totalPrice = 0;
        
        res.data.stockRoom_InitialBalanceDtos.map((item,index)=>{
            var prevItem =tmpArray[index];
            let newItem={
            ID:item.id,
            StockRoom_InitialBalanceFK_ID :prevItem.stockRoom_InitialBalanceFK_ID,
            Count:0,
            Title:item.title,
            CurrentCount:item.currentCount
            }
            tmpArray[index] = newItem;
        });
        setStockRoomSource(tmpArray);
      });
    }
}
function intialBalanceOnChange(e){
    setSelectedItem(props.selectedItem);
    fillStockBalanceFromApi(e.target.value);
}

function stockBalanceCountOnKeyUp(e){
    var itemIndex=parseInt( e.target.getAttribute('data-indexitem'));
    var count = parseInt(e.target.value);
    if(count.toString()==='NaN'){
      count=0;
      e.target.value=0;
    }
    let tmpArray = [];
    var prevItem =stockRoomSource[itemIndex];
    stockRoomSource.map((item,index)=>{
      if(item.ID!==prevItem.ID){
        tmpArray.push(item);
      }else{
        prevItem.Count = count;
        e.target.value = count;
        tmpArray.push(prevItem);
      }
    })
    setStockRoomSource(tmpArray);
    props.updateBalanceModel(stockRoomSource);
}

return (
        <>
        <React.Fragment>
        <div style={{background: '#e4e6ef',borderRadius:' 10px',paddingBottom: '43px'}}>
            <div className="separator separator-dashed my-7"></div>
            <Row style={{paddingRight:'8px'}}>
                <Col md='4' style={{marginTop: '20px !important' }}>
                    <Form.Label className='custom-label bold'>انتخاب مواد اولیه</Form.Label>
                    <DropDown 
                      source={props.initialBalanceSource} 
                      ref={initialBalanceRef} 
                      onChange={intialBalanceOnChange}
                      SelectedID={selectedItem}
                      className={classes.inputBackGround, 'custom-label marg-t-20 bold'} type="Name" aria-required={true} />
                </Col>
                <Col md='4' style={{marginTop: '20px !important' }}>
                    <div style={{marginTop: '60px'}} class="alert alert-primary" role="alert">قیمت تمام شده : { addCommas(props.propsedPrice)} ریال</div>

                </Col>
            </Row>
            <Row style={{textAlign: 'center'}}>
                <Col md='1' className={classes.stockLabel}>انبار</Col>
                <Col md='4'className={classes.stockLabel}>
                    موجودی فعلی
                </Col>
                <Col md='4'className={classes.stockLabel}>
                  تعداد تولید شده
                </Col>
            </Row>
            {
                stockRoomSource.map((item,index)=>{
                    return(<div  key={index+'stockEdit'} >
                            <Row style={{marginTop:'15px',paddingRight:'56px'}}>
                                <Col md="1" style={{marginTop: '9px'}}>
                                    <Form.Label className='custom-label bold'>{item.Title}</Form.Label>
                                  </Col>
                                <Col md="4" style={{marginTop:'10px'}}>
                                     <Form.Control disabled='disabled' placeholder="موجودی فعلی" value={item.CurrentCount}   data-indexitem={index}  className='form-control-custom'  type="Name"  />
                                </Col>
                                <Col md="4" style={{marginTop:'10px'}}>
                                     <Form.Control placeholder="موجودی فعلی"   onKeyUp={stockBalanceCountOnKeyUp}   data-indexitem={index}  className='form-control-custom'  type="Name"  />
                                </Col>
                            </Row>
                    </div>)
                })
            }
          </div>      
          </React.Fragment>
        </>
    )
}

export default checkRequests(InitialBalanceEdit,axios);