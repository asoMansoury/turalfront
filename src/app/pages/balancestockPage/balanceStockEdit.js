import React from 'react';
import { Hide_edit, Is_edited } from '../_redux/Actions/categoryActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button,Container } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {InitialBalanceEditApi,InitialBalanceGetQuantityStockApi} from '../commonConstants/ApiConstants';
import {DropDown} from '../component/UI/DropDown';
import {NumberToWords} from 'persian-tools2';
import checkRequests from '../component/ErrroHandling';
export class BalanceStockEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftSideBar: -SideBarConfig.width,
            isLoading: false,
            description: '',
            dbid: -1,
            title: '',
            balanceModel:{
              selectedCategoryItem:0,
              selectedUnitItem:0,
              selectedMaterialItem:0,
          },
          stockRoomSource:[],
          stockRoomArray:[]
        }
        this.closeClick = this.closeClick.bind(this);
        this.titleKeyUp = this.titleKeyUp.bind(this);
        this.addressKeyUp=this.addressKeyUp.bind(this);
        this.descriptionKeyUp = this.descriptionKeyUp.bind(this);
        this.save = this.save.bind(this);
        this.fillStockBalanceFromApi = this.fillStockBalanceFromApi.bind(this);
        this.updateModelBalanceStoc = this.updateModelBalanceStoc.bind(this);
        this.stockBalanceCountOnChange = this.stockBalanceCountOnChange.bind(this);
        this.pricePerUnitOnKeyUp = this.pricePerUnitOnKeyUp.bind(this);
        this.pricePerUnitRef =React.createRef();
        this.titleInputRef = React.createRef();
        this.descInputRef = React.createRef();
        this.unitTypeRef =React.createRef();
        this.mateialTypeRef =React.createRef();
        this.categoryDropRef =React.createRef();
        this.fileUploadRef =React.createRef();
        this.pricePerUnitRialRef = React.createRef();

        this.categoryOnChane =this.categoryOnChane.bind(this);
        this.materialOnChane = this.materialOnChane.bind(this);
        this.unitOnChane = this.unitOnChane.bind(this);
        this.upload = this.upload.bind(this);
    }

    stockBalanceCountOnChange(e){
      var itemIndex= e.target.getAttribute('data-indexitem');
      var count = parseInt(e.target.value);
      let tmpArray = this.state.stockRoomSource;
      var prevItem =tmpArray[itemIndex];
      let newItem={
          StockRoom_InitialBalanceFK_ID :prevItem.StockRoom_InitialBalanceFK_ID,
          Count:prevItem.count,
          PricePerUnit:prevItem.PricePerUnit,
          ID:prevItem.ID,
          Title:prevItem.Title,
          CurrentCount:count
      }
      tmpArray[itemIndex] = newItem;
      this.setState({...this.state,stockRoomSource:tmpArray});
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
        this.pricePerUnitRialRef.current.value= NumberToWords.convert(e.target.value)+' ریال'
    }

    updateModelBalanceStoc(){
    }

    fillStockBalanceFromApi(id){
      if(id.toString()!=='NaN')
      {
        axios.get(InitialBalanceGetQuantityStockApi+'/'+id).then((res)=>{
          this.setState({...this.state,stockRoomArray:res.data.stockRoom_InitialBalanceDtos});
        }).finally((data)=>{
          let tmpArray = this.state.stockRoomArray;
          let totalPrice = 0;
          this.state.stockRoomArray.map((item,index)=>{
            var prevItem =tmpArray[index];
            let newItem={
              ID:item.id,
              StockRoom_InitialBalanceFK_ID :prevItem.stockRoom_InitialBalanceFK_ID,
              Count:item.count,
              Title:item.title,
              CurrentCount:item.currentCount
            }
            tmpArray[index] = newItem;
          });
          this.setState({...this.state,stockRoomSource:tmpArray});
        }).catch((error)=>{
          
        });
      }
    }
    upload() {
        this.fileUploadRef.current.click();
      }

    closeClick() {
        this.props.hideFunction();
    }
    showSideBar() {
        this.titleInputRef.current.focus();

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
    notifySuccess = () => toast('موجودی اولیه با شناسه ' + this.state.dbid + ' با موفقیت ویرایش شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    notifyError = (title) => toast( title , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyInfo = () => toast('در حال موجودی اولیه با شناسه ' + this.state.dbid + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    save() {
      if(!this.validate())
      return;

        let title = this.titleInputRef.current.value;
        let desc = this.descInputRef.current.value;
        let price = this.pricePerUnitRef.current.value;
        let categoryID = this.state.balanceModel.selectedCategoryItem!==undefined?this.state.balanceModel.selectedCategoryItem:this.props.categoryTypeSource[0].id;
        let unitID = this.state.balanceModel.selectedUnitItem!==undefined?this.state.balanceModel.selectedUnitItem:this.props.unitTypeSource[0].id;
        let materiaID= this.state.balanceModel.selectedMaterialItem!==undefined?this.state.balanceModel.selectedMaterialItem:this.props.materialTypesSource[0].id;
          let data={
              ID:this.state.dbid,
              Title:title,
              Description:desc,
              TypeMaterialFK_ID:materiaID,
              CategoryTypeFK_ID:categoryID,
              Price:price,
              UnitMeaurementFK_ID:unitID,
              StockRoom_InitialBalanceDto:this.state.stockRoomSource
          }
          const formData = new FormData();
          formData.append("file", this.fileUploadRef.current.files[0]);
          formData.append('body',JSON.stringify(data))   
          const config = {headers: {'content-type': 'multipart/form-data'}};  
          axios.put(InitialBalanceEditApi, formData,config)
              .then(res => {
                if(res.data.hasError==false){
                  this.notifySuccess();
                  this.props.edited();

                }else{
                  this.notifyError(res.data.errorMessage);
                }
              })
              .catch((error)=>{
          
            });
         this.props.hideFunction();
          this.notifyInfo(title);
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

    titleKeyUp(e) {
        this.setState({ title: e.target.value });
    }
    descriptionKeyUp(e) {
        this.setState({ description: e.target.value });
    }
    addressKeyUp(e){
      this.setState({address:e.target.value});
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.Show_Hide_Edit.type == 'Show_edit') {
            this.showSideBar();
            this.titleInputRef.current.focus();
        }
        else if (nextprops.Show_Hide_Edit.type == 'Hide_edit') {
            this.hideSideBar();
        }
        var rowItem={};
        if(nextprops.Show_Hide_Edit.obj.rowItem!=undefined){
            rowItem = JSON.parse(nextprops.Show_Hide_Edit.obj.rowItem);
            debugger;
            this.setState({
                ...this.state,
                balanceModel:{
                    ...this.state.balanceModel,
                    selectedMaterialItem:rowItem.typeMaterialFK_ID,
                    selectedUnitItem:rowItem.unitMeaurementFK_ID,
                    selectedCategoryItem:rowItem.categoryTypeFK_ID

                }
            })
        }
        
        this.titleInputRef.current.value = nextprops.Show_Hide_Edit.obj.title == undefined ? '' : nextprops.Show_Hide_Edit.obj.title;
        this.descInputRef.current.value = nextprops.Show_Hide_Edit.obj.description == undefined ? '' : nextprops.Show_Hide_Edit.obj.description;
        this.pricePerUnitRef.current.value=nextprops.Show_Hide_Edit.obj.pricePerUnit == undefined?0:nextprops.Show_Hide_Edit.obj.pricePerUnit;
        this.pricePerUnitRialRef.current.value  = NumberToWords.convert(this.pricePerUnitRef.current.value) + ' ریال';
        if (!this.props.Is_Edited && nextprops.Show_Hide_Edit.type != 'Hide_edit') {
            this.setState({
                description: nextprops.Show_Hide_Edit.obj.description,
                dbid: parseInt(nextprops.Show_Hide_Edit.obj.id),
                title: nextprops.Show_Hide_Edit.obj.title,
                address:nextprops.Show_Hide_Edit.obj.address,
                price:nextprops.Show_Hide_Edit.obj.pricePerUnit
            });
        }
        
       this.fillStockBalanceFromApi(parseInt(nextprops.Show_Hide_Edit.obj.id));
    }
    notifyNotValidateTitle = () => toast('عنوان وارد نشده است.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    validate(){
        let hasError = false;
        if(this.titleInputRef.current.value.trim() === ''){
            hasError = true;
            this.notifyNotValidateTitle();
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
                    <div className='category-add-header-text'>ویرایش موجودی اولیه</div>
                </div>
                <div className='category-add-body'>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>عنوان</Form.Label>
                            <Form.Control ref={this.titleInputRef} className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>نوع دسته بندی</Form.Label>
                            <DropDown source={this.props.categoryTypeSource} ref={this.categoryDropRef} SelectedID={this.state.balanceModel.selectedCategoryItem} 
                                    onChange={this.categoryOnChane} 
                                    className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"  style={{display:'none'}}></div>
                    <Row>
                        <Col md='12' style={{display:'none'}}>
                            <Form.Label className='custom-label bold'>نوع مواد</Form.Label>
                            <DropDown disabled='disabled' source={this.props.materialTypesSource} ref={this.mateialTypeRef} SelectedID={this.state.balanceModel.selectedMaterialItem} 
                                    onChange={this.materialOnChane}
                                    className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>واحد اندازه گیری</Form.Label>
                            <DropDown source={this.props.unitTypeSource} ref={this.unitTypeRef} SelectedID={this.state.balanceModel.selectedUnitItem} 
                                    onChange={this.unitOnChane}
                                    className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                                <Form.Label className='custom-label bold' style={{marginTope:'10px'}}>قیمت هر واحد</Form.Label>
                                <Form.Control ref={this.pricePerUnitRef}
                                    onKeyUp={this.pricePerUnitOnKeyUp}
                                    placeholder="قیمت واحد"  
                                    className='form-control-custom' 
                                    type="Price" aria-required={true} />
                                <Form.Control ref={this.pricePerUnitRialRef}
                                    disabled='disabled'
                                    style={{border: 'none',background: 'white'}}
                                    placeholder="قیمت واحد"  
                                    className='form-control-custom' 
                                    type="Price" aria-required={true} />

                        </Col>
                    </Row>

                    <Container style={{marginTop:15}}>
                        <Form>
                            <Form.Group >
                            {
                                this.state.stockRoomSource.map((item,index)=>{
                                    return(<div  key={index+'stockEdit'} >
                                            <Row >
                                                <Form.Label column="4" className='custom-label bold'>اطلاعات پایه انبار : {item.Title}</Form.Label>
                                            </Row>
                                            <Row >
                                                <Col>
                                                     <Form.Control placeholder="موجودی فعلی"     data-indexitem={index} onChange={this.stockBalanceCountOnChange} value={item.CurrentCount} className='form-control-custom'  type="Name"  />
                                                </Col>
                                            </Row>
                                    </div>)
                                })
                            }
                            </Form.Group>
                        </Form>

                    </Container>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form>
                                <Form.File 
                                    style={{display:'none'}}
                                    ref={this.fileUploadRef}
                                    id="custom-file"
                                    label="بارگزاری عکس"
                                    onChange={this.onImageChange}/>
                                    <div style={{width: '100%'}} className='btn-custom btn-custom-cancel' onClick={this.upload}>بارگزاری عکس</div>
                                </Form>
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row >
                        <Col md='12'>
                            <Form.Label style={{marginBottom: '100px'}} className='custom-label marg-t-20 bold'>توضیحات</Form.Label>
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
        Show_Hide_Edit: state.category.Show_Hide_Edit,
        Is_Edited: state.category.Is_Edited
    };
});
const mapDispatchToProps = (dispatch) => ({
    hideFunction: () => dispatch(Hide_edit()),
    edited: () => dispatch(Is_edited())
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(BalanceStockEdit,axios));