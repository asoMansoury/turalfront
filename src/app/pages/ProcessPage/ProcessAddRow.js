import React from 'react';
import AsyncAutoComplete from './AsyncAutoComplete';
import { Form, Row, Col, Button } from 'react-bootstrap';
import deleteImage from '../pulseDesignImages/delete.svg';
import RemainModal from './RemainModal';
import OrderModal from './OrderModal';
import {InitialBalanceGetQuantityStockApi} from '../commonConstants/ApiConstants';
import { ConfirmAddRow } from '../_redux/Actions/processActions';
import axios from 'axios';
import { connect } from "react-redux";
import checkRequests from '../component/ErrroHandling';
export class ProcessAddRow extends React.Component {
    constructor(props) {
        super(props);
        this.style = '  .card-footer                '
            + '  {  height: 0;               '
            + '     padding: 0;               '
            + '     margin:0;                 '
            + '     border:none;      }      '
            + '.card{border:none !important;}';
        this.state = {
            productId: 0,
            datas: [],
            prevDatas:[],
            fromLoadData: false,
            model:[]
        };
        this.inputCountKeyUp= this.inputCountKeyUp.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.getData = this.getData.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.removeHandler = this.removeHandler.bind(this);
        this.FillInitialFromApi = this.FillInitialFromApi.bind(this);
        this.removeFromAutoCompleteHandler = this.removeFromAutoCompleteHandler.bind(this);
    }

    handleConfirm(e){
        this.props.ConfirmAddRow(this.getData(),this.props.id);
    }

    getData(){
        return this.state.datas;
    }

    loadData() {
        var tmpArray = this.state.datas;
        if(this.state.productId==-1){
            this.setState({
                ...this.state,
                datas: [],
                prevDatas:tmpArray
            })
        }else{
            axios.get(InitialBalanceGetQuantityStockApi+'/' + this.state.productId)
            .then(res =>{
                var processBalance = this.props.processBalance;
                var tmpRowAdded=[];
                res.data.stockRoom_InitialBalanceDtos.map((item,index)=>{
                    let count = 0;
                    if(processBalance!=undefined){
                        var selectedItem = processBalance.filter((z=>z.initialBalanceID===item.initialBalanceEntitiesFK_ID
                                                            &&z.stockRoom_InitialBalanceID===item.id))[0];
                        if(selectedItem!==undefined){
                            count =selectedItem.count;
                        }else{count=0;}
                        var objAdded={
                            count: count,
                            currentCount: 20,
                            id: selectedItem.stockRoom_InitialBalanceID,
                            initialBalanceEntitiesFK_ID: selectedItem.initialBalanceID
                          }
                          tmpRowAdded.push(objAdded);
                    }
                    tmpArray.push({
                        count:count,
                        currentCount:item.currentCount,
                        id:item.id,
                        initialBalanceEntitiesFK_ID:item.initialBalanceEntitiesFK_ID,
                        isEnabled:item.isEnabled,
                        stockRoom_InitialBalanceFK_ID:item.stockRoom_InitialBalanceFK_ID,
                        title:item.title,
                        totalPrice:item.totalPrice,
                        pricePerUnit:item.pricePerUnit
                    })
                });
                this.setState({
                    ...this.state,
                    datas: tmpArray,
                    prevDatas:tmpArray
                })
            })
            .catch(error => {
            })
        }

    }
    setProductId = (x,y) => {
        this.setState({ productId: x, productName : y, fromLoadData: true });
    }

    handleClose(){
        var tmpPrevData = this.state.prevDatas;
        this.setState({
            ...this.state,
            datas:tmpPrevData
        })
    }

    componentDidUpdate() {
        if (this.state.fromLoadData) {
            this.loadData();
            this.setState({ fromLoadData: false });
        }
    }

    FillInitialFromApi(prodId,id,count){
        var tmpArray = [];
        var prevItem = this.state.datas.filter(z=>z.initialBalanceEntitiesFK_ID===prodId&&z.id===id)[0];
        if(prevItem!=undefined){
            this.state.datas.map((item,index)=>{
                if(prevItem.id!==item.id)
                    tmpArray.push(item)
                else{
                    prevItem.count=parseInt(count);
                    tmpArray.push(prevItem);
                }
    
            })
        }
        this.setState({...this.state,datas:tmpArray});
    }
     inputCountKeyUp(e){
        let id= parseInt(e.currentTarget.getAttribute('id'));
        let prodId = parseInt(e.currentTarget.getAttribute('prodid'));
        let currentCount = e.currentTarget.getAttribute('currentCount');
        let index = parseInt(e.currentTarget.getAttribute('indexItem'));
        let count = e.currentTarget.value;
        if(parseInt(currentCount)<parseInt(count)){
            e.currentTarget.value = currentCount;
            count = parseInt(currentCount);
        }
        var tmpArray = [];
        var prevItem = this.state.datas.filter(z=>z.initialBalanceEntitiesFK_ID===prodId&&z.id===id)[0];
        this.state.datas.map((item,index)=>{
            if(prevItem.id!==item.id)
                tmpArray.push(item)
            else{
                prevItem.count=parseInt(count);
                tmpArray.push(prevItem);
            }

        })
        this.setState({...this.state,datas:tmpArray});
    }

    removeHandler(e){
        let prodId = parseInt(e.currentTarget.getAttribute('productID'));
        this.props.removeRowHandler(e,prodId);
    }

    removeFromAutoCompleteHandler(e,prodID){
        let prodId = parseInt(e.currentTarget.getAttribute('productID'));
        this.props.removeRowHandler(e,prodID);
    }

    render() {
        var selectedProductID=  this.props.selectedProductID;
        var setSelectedProductID = this.props.setSelectedProductID;
        var rowID = this.props.id;
        var {initialBalanceID,processBalance} = this.props;
        var datas= this.state.datas;
        return (
            <div id={rowID}>
                <div class='process-row-container' productID={this.state.productId}  style={{marginBottom:'130px !important'}}>
                    <Row className='process-row'>
                        <Col md='4'>
                            <AsyncAutoComplete removeHandler= {this.removeFromAutoCompleteHandler} id={rowID} isEditPage={this.props.isEditPage} FillInitialFromApi={this.FillInitialFromApi} processBalance={processBalance} initialBalanceID={initialBalanceID} setSelectedProductID={setSelectedProductID} selectedProductID={selectedProductID} setProductId={this.setProductId} width='100%' id={'async-auto-complete-' + this.props.id} />
                        </Col>
                        <Col md='7'>
                            <RemainModal isEditPage={this.props.isEditPage} handleConfirm={this.handleConfirm} handleClose={this.handleClose}         inputCountKeyUp={this.inputCountKeyUp} data={datas} prodId = {this.state.productId} prodName = {this.state.productName} />
                        </Col>
                        {/* <Col md='4'>
                            <OrderModal model={this.state.model} data={this.state.datas} prodId = {this.state.productId} prodName = {this.state.productName}/>
                        </Col> */}
                        <Col md='1'>
                            <div className='delete-btn-row-proc'>
                                <img style={{ heigt: '25px', width: '25px' }} productID={this.state.productId} src={deleteImage} id={rowID} onClick={this.removeHandler} />
                            </div>
                        </Col>
                    </Row>
                    <style>
                        {this.style}
                    </style>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state => {
    return {
      Show_Hide_Add: state.processDefinition.Show_Hide_Add,
      Is_Added: state.processDefinition.Is_Added,
      Selected_Products:state.process.Selected_Products
    };
  });
  const mapDispatchToProps = (dispatch) => ({
    ConfirmAddRow:(obj,rowID)=>dispatch(ConfirmAddRow(obj,rowID))
  });

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(ProcessAddRow,axios));