import React from 'react';
import { Show_add } from '../_redux/Actions/categoryActions';
import { Hide_add } from '../_redux/Actions/categoryActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button ,Navbar,Container} from 'react-bootstrap';
import toast from 'react-hot-toast';
import {InitialBalanceInsertApi,stockRoomGetAllApi} from '../commonConstants/ApiConstants';
import axios from 'axios';
import { Is_added } from '../_redux/Actions/balanceActions';
import {DropDown} from '../component/UI/DropDown';
import NumericInput from 'react-numeric-input';
import {NumberToWords} from 'persian-tools2';
import checkRequests from '../component/ErrroHandling';
export class BalanceAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image:'',
            leftSideBar: -SideBarConfig.width,
            balanceModel:{
                selectedCategoryItem:this.props.categoryTypeSource[0],
                selectedUnitItem:this.props.unitTypeSource[0],
                selectedMaterialItem:this.props.materialTypesSource[0],
            },
            stockRoomSource:[]
        }
        this.closeClick = this.closeClick.bind(this);
        this.save = this.save.bind(this);

        this.categoryOnChane =this.categoryOnChane.bind(this);
        this.materialOnChane = this.materialOnChane.bind(this);
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
        this.fillStockRoomData();
        this.upload = this.upload.bind(this);
    }

    componentDidMount(){
        var someProperty = {...this.state};
        someProperty.balanceModel.selectedUnitItem = this.props.unitTypeSource[0];
        someProperty.balanceModel.selectedCategoryItem = this.props.categoryTypeSource[1];
        someProperty.balanceModel.selectedMaterialItem = this.props.categoryTypeSource[0];
        this.pricePerUnitRef.current.value=0;
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
        }).catch((error)=>{
          
        });
        return stockRoomArray;
    }

    onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
        let img = event.target.files[0];
            this.setState({
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
        this.setState({...this.state,stockRoomArray:tmpArray});

        
    }
    categoryOnChane(e){
        this.setState({
            ...this.state,
            balanceModel:{
                ...this.state.balanceModel,
                selectedCategoryItem:e.target.value
            }
        })
    }

    materialOnChane(e){
        var someProperty = {...this.state};
        someProperty.balanceModel.selectedMaterialItem = e.target.value;
    }

    unitOnChane(e){
        var someProperty = {...this.state};
        someProperty.balanceModel.selectedUnitItem = e.target.value;
        this.setState({
            ...this.state,
            balanceModel:{
                ...this.state.balanceModel,
                selectedUnitItem:e.target.value
            }
        })
    }

    pricePerUnitOnKeyUp(e){
        var price = parseInt(e.target.value);
        if(price.toString()!=='NaN'){
            e.target.value = parseInt(e.target.value);
            this.pricePerUnitRef.current.value = parseInt(e.target.value);

        }
        else{
            e.target.value =0;
            this.pricePerUnitRef.current.value =0;
        }
        this.pricePerUnitRialRef.current.value=NumberToWords.convert(e.target.value)+' ریال'; 
    }

    closeClick() {
        this.props.hideFunction();
    }
    showSideBar() {
        let frame = 20;
        let duration = SideBarConfig.animationDuration;
        let width = SideBarConfig.width;
        let step = width / duration * frame;
        let left = this.state.leftSideBar;
        let timer;
        timer = setInterval(() => {
            if (left >= 0) {
                this.setState({ leftSideBar: 0 });
                clearInterval(timer);
                return;
            }
            left += step;
            this.setState({ leftSideBar: left });
        }, frame);
    }
    hideSideBar() {
        let frame = 20;
        let duration = SideBarConfig.animationDuration;
        let width = SideBarConfig.width;
        let step = width / duration * frame;
        let left = this.state.leftSideBar;
        let timer;
        timer = setInterval(() => {
            if (left <= -width) {
                this.setState({ leftSideBar: -width });
                clearInterval(timer);
                return;
            }
            left -= step;
            this.setState({ leftSideBar: left });
        }, frame);
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.Show_Hide_Add == 'Show_add') {
            this.showSideBar();
            this.titleInputRef.current.focus();
            this.descInputRef.current.value = '';
        }
        else if (nextprops.Show_Hide_Add == 'Hide_add')
            this.hideSideBar();
    }

    notifySuccess = (title) => toast('مواد اولیه ' + title + ' با موفقیت افزوده شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    notifyError = (title) => toast(title , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyInfo = (title) => toast('در حال افزودن مواد اولیه  ' + title + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    notifyNotValidateTitle = (erorr) => toast(erorr, { duration: toastConfig.duration, style: toastConfig.errorStyle });


    save() {
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
        axios.post(InitialBalanceInsertApi, formData,config)
            .then(res => {
                if(res.data.hasError==false){
                  this.notifySuccess(title);
                  this.props.added();
                  
                }else{
                  this.notifyError(res.data.errorMessage);
                }
            }).catch((error)=>{
          
            });
        this.props.hideFunction();
        this.notifyInfo(title);
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
            <div className='category-add-container' style={{ left: this.state.leftSideBar + 'px', width: SideBarConfig.width + 'px' }}>
                <div className='category-add-header' style={{ gridTemplateColumns: (SideBarConfig.width / 2) + 'px ' + (SideBarConfig.width / 2) + 'px' }}>
                    <div className='category-add-close-btn-container'>
                        <button className='category-add-close-btn' onClick={this.closeClick}>x</button>
                    </div>
                    <div className='category-add-header-text'>افزودن موجودی اولیه</div>
                </div>

                <div className='category-add-body'>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label '>عنوان</Form.Label>
                             <Form.Control ref={this.titleInputRef} className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label '>نوع دسته بندی</Form.Label>
                            <DropDown source={this.props.categoryTypeSource} ref={this.categoryDropRef} SelectedID={this.state.balanceModel.selectedCategoryItem} 
                                    onChange={this.categoryOnChane} 
                                    className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7" style={{display:'none'}}></div>
                    <Row>
                        <Col md='12' style={{display:'none'}}>
                            <Form.Label className='custom-label '>نوع مواد</Form.Label>
                            <DropDown disabled='disabled' source={this.props.materialTypesSource} ref={this.mateialTypeRef}  
                                    onChange={this.materialOnChane}
                                    className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label '>واحد اندازه گیری</Form.Label>
                            <DropDown source={this.props.unitTypeSource} ref={this.unitTypeRef} SelectedID={this.state.balanceModel.selectedUnitItem} 
                                    onChange={this.unitOnChane}
                                    className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>

                            <Form.Label className='custom-label ' style={{marginTope:'10px'}}>قیمت هر واحد</Form.Label>
                            <NumericInput className="form-control" 
                                            onKeyUp={this.pricePerUnitOnKeyUp}
                                            ref={this.pricePerUnitRef}
                                            placeholder="قیمت واحد"  
                                            id="selectImage"
                                            type="price"  style={ false }/>   
                            <Form.Control style={{border: 'none',background: 'white'}} disabled='disabled' ref={this.pricePerUnitRialRef} className='form-control-custom' type="Name" aria-required={true} />       
                            <Container style={{marginTop:15}}>
                        <Form>
                            <Form.Group >
                            {
                                this.state.stockRoomSource.map((item,index)=>{
                                    return(<div key={index+'stockAdd'}>
                                            <Row >
                                                <Form.Label column="4" className='custom-label bold'>اطلاعات پایه انبار : {item.title}</Form.Label>
                                            </Row>
                                            <Row >
                                                <Col>
                                                     <NumericInput className="form-control" 
                                                                    placeholder="تعداد موجودی"   
                                                                    data-indexitem={index} value={item.Count} onKeyUp={this.stockBalanceCountKeyUp} 
                                                                    type="count"  style={ false }/>
                                                </Col>
                                            </Row>
                                    </div>)
                                })
                            }
                            </Form.Group>
                        </Form>

                    </Container>

                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                        <Form style={{display:'none'}}>
                            <Form.File 
                                    ref={this.fileUploadRef}
                                    id="custom-file"
                                    label="بارگزاری عکس"
                                    onChange={this.onImageChange}/></Form>
                            <div style={{width: '100%'}} className='btn-custom btn-custom-cancel' onClick={this.upload}>بارگزاری عکس</div>
                            
                        </Col>
                    </Row>

                    <Row >
                        <Col md='12'>
                            <Form.Label style={{marginBottom: '100px'}} className='custom-label marg-t-20 bold' >توضیحات</Form.Label>
                            <Form.Control  style={{marginBottom: '100px'}} ref={this.descInputRef} className='form-control-custom' as="textarea" rows="4" />
                        </Col>
                    </Row>

 
                    <div style={{marginBottom:'100px'}}></div>
                </div>
                
                <div className='category-add-footer'>
                    <div className='btn-custom btn-custom-save' onClick={this.save}>ذخیره</div>
                    <div className='btn-custom btn-custom-cancel' onClick={this.closeClick}>انصراف</div>
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
    hideFunction: () => dispatch(Hide_add()),
    added: () => dispatch(Is_added())
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(BalanceAdd,axios));