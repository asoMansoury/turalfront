import React from 'react';
import { ADDFlowBalance } from '../../_redux/Actions/balanceActions';
import { connect } from "react-redux";
import {  toastConfig } from '../../Config';
import { Form, Row, Col} from 'react-bootstrap';
import toast from 'react-hot-toast';
import {stockRoomGetAllApi} from '../../commonConstants/ApiConstants';
import axios from 'axios';
import { Is_added } from '../../_redux/Actions/balanceActions';
import {DropDown} from '../../component/UI/DropDown';
import NumericInput from 'react-numeric-input';
import {addCommas } from "persian-tools2";
import checkRequests from '../../component/ErrroHandling';
export class InitialBalanceAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image:null,
            Address:'',
            Title:'',
            Price:'',
            balanceModel:{
                selectedCategoryItem:0,
                selectedUnitItem:0,
                selectedMaterialItem:0,
            },
            StockRoom_InitialBalanceDto:[],
            stockRoomSource:[]
        }
        this.getData = this.getData.bind(this);

        this.categoryOnChane =this.categoryOnChane.bind(this);
        this.materialOnChane = this.materialOnChane.bind(this);
        this.titleOnKeyUp = this.titleOnKeyUp.bind(this);

        this.unitOnChane = this.unitOnChane.bind(this);
        this.stockBalanceCountKeyUp = this.stockBalanceCountKeyUp.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this.fillStockRoomData = this.fillStockRoomData.bind(this);
        
        this.pricePerUnitOnKeyUp= this.pricePerUnitOnKeyUp.bind(this);
        this.titleInputRef = React.createRef();
        this.descInputRef = React.createRef();
        this.unitTypeRef =React.createRef();
        this.mateialTypeRef =React.createRef();
        this.categoryDropRef =React.createRef();
        this.fileUploadRef =React.createRef();
        this.pricePerUnitRef = React.createRef();
        this.pricePerUnitRialRef = React.createRef();
        this.upload = this.upload.bind(this);
        this.fillStockRoomData();
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            ...this.state,
            Price:nextProps.propsedPrice
        });
        this.pricePerUnitRef.current.value = parseInt(nextProps.propsedPrice);
        this.pricePerUnitRialRef.current.value =addCommas(this.pricePerUnitRef.current.value)+" ریال"
        this.props.updateBalanceAddModel(this.state);
        this.props.addBalance(this.state);
    }
    fillStockRoomData(){
        const stockRoomArray=[];
        
        axios.get(stockRoomGetAllApi).then((res)=>{

            res.data.stockRoomDtos.map((item,index)=>{
                let newItem ={
                    ID:item.id,
                    StockRoom_InitialBalanceFK_ID :item.id,
                    title:item.title
                };

                stockRoomArray.push(newItem);
            });
            this.setState({...this.state,
                stockRoomSource:stockRoomArray
            });
        })
        return stockRoomArray;
    }

    onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
        let img = event.target.files[0];
            this.setState({
                ...this.state,
                image: img
            });
        this.props.updateBalanceAddModel(this.state);
        this.props.addBalance({
            ...this.state,
            image: img
        });
        }

    };
    upload() {
        this.fileUploadRef.current.click();
      }
    stockBalanceCountKeyUp(e){

        var itemIndex= e.target.getAttribute('data-indexitem');
        var count = parseInt(e.target.value);
        let tmpArray = this.state.stockRoomSource;
        var prevItem =tmpArray[itemIndex];
        let newItem={
            StockRoom_InitialBalanceFK_ID :prevItem.StockRoom_InitialBalanceFK_ID,
            Count:count,
            title:prevItem.title
        }
        tmpArray[itemIndex] = newItem;
        this.setState({...this.state,
            stockRoomArray:tmpArray,
            StockRoom_InitialBalanceDto:tmpArray
        });
        this.props.updateBalanceAddModel(this.state);
        this.props.addBalance(this.state);
    }

    categoryOnChane(e){
        this.setState({...this.state,
            balanceModel:{
                ...this.state.balanceModel,
                selectedCategoryItem:e.target.value
            }
        });
        this.props.updateBalanceAddModel(this.state);
        this.props.addBalance(this.state);
    }

    materialOnChane(e){
        this.setState({...this.state,
            balanceModel:{
                ...this.state.balanceModel,
                selectedMaterialItem:e.target.value
            }
        });
        this.props.updateBalanceAddModel(this.state);
        this.props.addBalance(this.state);
    }

    unitOnChane(e){
        this.setState({...this.state,
            balanceModel:{
                ...this.state.balanceModel,
                selectedUnitItem:e.target.value
            }
        });
        this.props.updateBalanceAddModel(this.state);
        this.props.addBalance(this.state);
    }

    pricePerUnitOnKeyUp(e){
        var price = parseInt(e.target.value);
        if(price.toString()!=='NaN'){
            e.target.value = parseInt(e.target.value);
            this.pricePerUnitRef.current.value = parseInt(e.target.value);
            this.pricePerUnitRialRef.current.value =addCommas(this.pricePerUnitRef.current.value)+" ریال"
            this.setState({
                ...this.state,
                Price:e.target.value
            });
            this.props.updateBalanceAddModel(this.state);
            this.props.addBalance({
                ...this.state,
                Price:e.target.value
            });
        }
        else{
            e.target.value =0;
            this.pricePerUnitRef.current.value =0;
            this.pricePerUnitRialRef.current.value =addCommas(this.pricePerUnitRef.current.value)+" ریال"
            this.setState({
                ...this.state,
                Price:0
            });
            this.props.updateBalanceAddModel(this.state);
            this.props.addBalance({
                ...this.state,
                Price:0
            });
        }

    }

    componentDidMount(){
        this.setState({
            ...this.state,
            Price:this.props.propsedPrice,
            balanceModel:{
                ...this.state.balanceModel,
                selectedUnitItem:this.props.selectedUnitItem,
                selectedCategoryItem:this.props.selectedCategoryItem,
                selectedMaterialItem:this.props.selectedMaterialItem
            }
        });
        this.pricePerUnitRef.current.value = this.props.propsedPrice;
        this.pricePerUnitRialRef.current.value =addCommas(this.pricePerUnitRef.current.value)+" ریال"
        this.props.updateBalanceAddModel(this.state);
        this.props.addBalance(this.state);
    }

    titleOnKeyUp(e){
        this.setState({...this.state,Title:e.target.value});
        this.props.updateBalanceAddModel(this.state);
        this.props.addBalance({...this.state,Title:e.target.value});
    }
    notifySuccess = (title) => toast('مواد اولیه ' + title + ' با موفقیت افزوده شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    notifyError = (title) => toast(title , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyInfo = (title) => toast('در حال افزودن مواد اولیه  ' + title + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    notifyNotValidateTitle = (erorr) => toast(erorr, { duration: toastConfig.duration, style: toastConfig.errorStyle });


    getData() {
        if(!this.validate())
            return;

        let title = this.titleInputRef.current.value;
        let desc = this.descInputRef.current.value;
        let pricePerUnit = this.pricePerUnitRef.current.value;
        
        let categoryID = this.state.balanceModel.selectedCategoryItem!==undefined?this.state.balanceModel.selectedCategoryItem:this.props.categoryTypeSource[0].id;
        let unitID = this.state.balanceModel.selectedUnitItem!==undefined?this.state.balanceModel.selectedUnitItem:this.props.unitTypeSource[0].id;
        let materiaID= this.state.balanceModel.selectedMaterialItem!==undefined?this.state.balanceModel.selectedMaterialItem:this.props.materialTypesSource[0].id;
        let data={
            Title:title,
            Description:desc,
            Price : pricePerUnit,
            TypeMaterialFK_ID:materiaID,
            CategoryTypeFK_ID:categoryID,
            UnitMeaurementFK_ID:unitID,
            PricePerUnit:pricePerUnit,
            StockRoom_InitialBalanceDto:this.state.stockRoomSource
        }
        const formData = new FormData();
        formData.append("file", this.fileUploadRef.current.files[0]);
        formData.append('body',JSON.stringify(data))   
        const config = {headers: {'content-type': 'multipart/form-data'}};  
        this.props.initialBalanceAddData(formData) ;
    }
    
    validate(){
        let hasError = false;
        if(this.titleInputRef.current.value.trim() === ''){
            hasError = true;
            this.notifyNotValidateTitle('عنوان وارد نشده است');
        }
        if(this.pricePerUnitRef.current.value===0){
            hasError=true;
            this.notifyNotValidateTitle('قیمت وارد نشده است.');
        }
        return !hasError;
    }
    render() {
        return (
            <div ref={this.props.ref}>
                <div style={{background: '#e4e6ef',borderRadius:' 10px'}}>
                    <div className="separator separator-dashed my-7"></div>
                    <Row style={{paddingRight:'8px'}}>
                        <Col md='4' style={{marginTop: '20px !important' }}>
                            <Form.Label className='custom-label bold'>عنوان</Form.Label>
                            <Form.Control 
                                ref={this.titleInputRef}
                                onKeyUp={this.titleOnKeyUp}
                                className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className='category-add-body'>
                    <Row>
                        <Col md='4' style={{marginTop: '20px !important' }}>
                            <Form.Label className='custom-label bold'>نوع دسته بندی</Form.Label>
                            <DropDown source={this.props.categoryTypeSource} ref={this.categoryDropRef} SelectedID={this.state.balanceModel.selectedCategoryItem} 
                                            onChange={this.categoryOnChane} 
                                            className='form-control-custom' type="Name" aria-required={true} />
                        </Col >
                        <Col md='4' style={{display:'none'}}>
                            <Form.Label className='custom-label bold'>نوع مواد</Form.Label>
                            <DropDown disabled={this.props.isEnableMaterialDropDown} source={this.props.materialTypesSource} ref={this.mateialTypeRef} SelectedID={this.state.balanceModel.selectedMaterialItem} 
                                            onChange={this.materialOnChane}
                                            className='form-control-custom' type="Name" aria-required={true} />
                        </Col>

                        <Col  md='4'>
                            <Form.Label className='custom-label bold'>واحد اندازه گیری</Form.Label>
                            <DropDown source={this.props.unitTypeSource} ref={this.unitTypeRef} SelectedID={this.state.balanceModel.selectedUnitItem} 
                                            onChange={this.unitOnChane}
                                            className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>


                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='4' style={{marginTop: '20px !important' }}>
                            <Form.Label className='custom-label bold' style={{marginTop:'10px'}}>قیمت هر واحد</Form.Label>
                            <Form.Control 
                                ref={this.pricePerUnitRef}
                                onKeyUp={this.pricePerUnitOnKeyUp}
                                className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                        <Col md='4' style={{marginTop: '20px !important' }}>
                            <div style={{marginTop: '33px'}} class="alert alert-primary" role="alert">قیمت تمام شده : { addCommas(this.props.propsedPrice)} ریال</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md='4' style={{marginTop: '20px !important' }}>
                        <Form.Control style={{border: 'none',background: '#e4e6ef'}} disabled='disabled' ref={this.pricePerUnitRialRef} className='form-control-custom' type="Name" aria-required={true} />       
                        </Col>
                    </Row>
                    <Row>
                        <Col md='1' style={{fontWeight: 'bold',fontSize: '18px',color: '#6f42c1',paddingRight: '54px'}}>انبار</Col>
                        <Col md='4' style={{fontWeight: 'bold',fontSize: '18px',color: '#6f42c1',paddingRight: '54px'}}>تعداد موجودی</Col>
                    </Row>
                        {
                            this.state.stockRoomSource.map((item,index)=>{
                                return(<div key={index+'stockAdd'}>
                                        <Row style={{marginTop:'15px'}}>
                                            <Col md="1" style={{marginTop: '9px'}}>
                                                <span style={{marginTop:'40px'}}>{item.title}</span>
                                            </Col>
                                            <Col md="4" style={{marginTop: '9px'}}>
                                                    <NumericInput className="form-control" 
                                                                placeholder="تعداد موجودی"   
                                                                data-indexitem={index} value={item.Count} onKeyUp={this.stockBalanceCountKeyUp} 
                                                                type="count"  style={ false }/>
                                            </Col>
                                        </Row>
                                </div>)
                            })
                        }

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='4' style={{marginTop: '20px !important' }}>
                        <Form>
                            <Form.File 
                                style={{display:'none'}}
                                ref={this.fileUploadRef}
                                id="custom-file"
                                label="بارگزاری عکس"
                                onChange={this.onImageChange}/></Form>
                                <div style={{width: '100%'}} className='btn-custom btn-custom-cancel' onClick={this.upload}>بارگزاری عکس</div>
                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12' style={{marginTop: '20px !important' }}>
                            <Form.Label className='custom-label marg-t-20 bold'>توضیحات</Form.Label>
                            <Form.Control ref={this.descInputRef} className='form-control-custom' as="textarea" rows="4" />
                        </Col>
                    </Row>
                    </div>
                                                
                </div>        
            </div>
        );
    }
}

const mapStateToProps = (state => {
    return {
        Show_Hide_Add: state.balance.Show_Hide_Add,
        Is_Added: state.balance.Is_Added
    };
});
const mapDispatchToProps = (dispatch) => ({
    addBalance:(model)=>dispatch(ADDFlowBalance(model)),
    added: () => dispatch(Is_added())
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(InitialBalanceAdd,axios));