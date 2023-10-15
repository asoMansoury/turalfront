import React from 'react';
import { Hide_edit, Is_edited } from '../_redux/Actions/costCategoryActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import {CostEditApi} from '../commonConstants/ApiConstants'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {CostGetByIDApi} from '../commonConstants/ApiConstants';
import DropDown from '../component/UI/DropDown';
import {DatePickerComponent} from '../component/DatePickerComponent/DatePickerComponent';
import checkRequests from '../component/ErrroHandling';
import {NumberToWords} from 'persian-tools2';
export class CostEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftSideBar: -SideBarConfig.width,
            isLoading: false,
            description: '',
            dbid: -1,
            title: '',
            model:{
                costDate:'1400/01/01',
                costCategoryID:0
            }
        }
        this.closeClick = this.closeClick.bind(this);
        this.titleKeyUp = this.titleKeyUp.bind(this);
        this.descriptionKeyUp = this.descriptionKeyUp.bind(this);
        this.save = this.save.bind(this);

        this.titleInputRef = React.createRef();
        this.descInputRef = React.createRef();
        this.costCategoryRef = React.createRef();
        this.costDurationMonthRef = React.createRef();

        this.coustAmounKeyUp = this.coustAmounKeyUp.bind(this);
        this.durationMonthOnChange= this.durationMonthOnChange.bind(this);
        this.costAmountRef = React.createRef();
        this.datePickerRef = React.createRef();
        this.costAmountCurrencyRef = React.createRef();
        this.issueDateOnSubmit = this.issueDateOnSubmit.bind(this);
        this.costCategoryChange = this.costCategoryChange.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }
    forceUpdateHandler(){
        this.forceUpdate();
      };

    durationMonthOnChange(e){
        if(isNaN(e.target.value)){
            e.target.value=0;
        }
        if(e.target.value>12)
            e.target.value = 12;
            if(e.target.value<1)
            e.target.value = 1;
    }

    coustAmounKeyUp(e){
        if(isNaN(e.target.value)){
            this.costAmountRef.current.value=0;
        }
        this.costAmountRef.current.value = e.target.value;
        this.costAmountCurrencyRef.current.value = NumberToWords.convert(parseInt(e.target.value))+" ریال";
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
    costCategoryChange(e){
        this.setState({
            ...this.state,
            model:{
                ...this.state.model.costDate,
                costCategoryID:e.target.value
            }
        })
    }
    notifySuccess = () => toast('هزینه با شناسه ' + this.state.dbid + ' با موفقیت ویرایش شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    notifyError = (erorMessage) => toast(erorMessage, { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyInfo = () => toast('در حال ویرایش هزینه با شناسه ' + this.state.dbid + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    save() {

        if(!this.validate())
            return;
            let title = this.titleInputRef.current.value;
            let desc = this.descInputRef.current.value;
            let costDate = this.state.model.costDate;
            let month = this.costDurationMonthRef.current.value;
            let costAmount = this.costAmountRef.current.value;
            let costCategoryID = this.state.model.costCategoryID;
            var data = {
                ID:this.state.dbid,
                Title:title,
                Description:desc,
                CostDate:costDate,
                CostAmount:costAmount,
                Month:month,
                costCategoryDto:{
                ID:costCategoryID
                }
            }
        axios.put(CostEditApi, data)
            .then(res => {
                console.log(res.data);
                if(res.data.hasError===false){
                    this.notifySuccess(res.data.errorMessage);
                    this.props.edited();
                }else{
                    this.notifyError(res.data.errorMessage);
                }


            }).catch((error)=>{
          
            });
            this.props.hideFunction();
            this.notifyInfo();
    }
    componentDidMount(){
    }
    titleKeyUp(e) {
        this.setState({ title: e.target.value });
    }
    descriptionKeyUp(e) {
        this.setState({ description: e.target.value });
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.Show_Hide_Edit.type == 'Show_edit') {
            this.showSideBar();
            this.titleInputRef.current.focus();
        }
        else if (nextprops.Show_Hide_Edit.type == 'Hide_edit') {
            this.hideSideBar();
        }
        if(nextprops.Show_Hide_Edit.obj!=undefined&&nextprops.Show_Hide_Edit.obj.id!=undefined){
            this.setState({...this.state,dbid:nextprops.Show_Hide_Edit.obj.id});
            axios.get(CostGetByIDApi+nextprops.Show_Hide_Edit.obj.id).then((res)=>{
                if(res.data.hasError===false){
                    var result = res.data.costDto;
                    this.titleInputRef.current.value = result.title;
                    this.descInputRef.current.value = result.description;
                    this.costDurationMonthRef.current.value =result.month;
                    this.costAmountRef.current.value=result.costAmount;
                    this.costAmountCurrencyRef.current.value = NumberToWords.convert(result.costAmount)+" ریال";
                    this.setState({
                        ...this.state,
                        model:{
                            ...this.state.model,
                            costCategoryID:result.costCategoryDto.id
                        }
                    });
                    this.issueDateOnSubmit(result.costDate.toString().replace('/','-'));
                }
            })
        }
        
    }
    issueDateOnSubmit(e){
        this.setState({
            ...this.state,
            model:{
                ...this.state.model,
                costDate:e
            }
        });
        this.forceUpdateHandler();
    }


    notifyNotValidateTitle = () => toast('عنوان وارد نشده است.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyNotValidate = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.errorStyle });
    validate(){
        let hasError = false;
        if(this.titleInputRef.current.value.trim() === ''){
            hasError = true;
            this.notifyNotValidateTitle();
        }
        if(parseInt(this.costAmountRef.current.value)<=0){
            hasError = true;
            this.notifyNotValidate("مبلغ هزینه وارد نشده است.");
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
                    <div className='category-add-header-text'>ویرایش دسته بندی</div>
                </div>
                <div className='category-add-body'>
                    <div style={{ /*display: this.state.isLoading ? 'none' : 'block'*/ }}>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>عنوان</Form.Label>
                            <Form.Control ref={this.titleInputRef} className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>گروه هزینه</Form.Label>
                            <DropDown 
                                onChange={this.costCategoryChange}
                                source={this.props.costCategorySource} ref={this.costCategoryRef} SelectedID={this.state.model.costCategoryID}
                                className={ 'custom-label marg-t-20 bold'} type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                             <Form.Label className='custom-label bold'>تاریخ هزینه</Form.Label>
                                <DatePickerComponent ref={this.datePickerRef} selectedDate={this.state.model.costDate} onChange={this.issueDateOnSubmit}></DatePickerComponent>
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                        <Form.Label className='custom-label bold'>دوره هزینه به ماه(1-12)</Form.Label>
                            <Form.Control ref={this.costDurationMonthRef} onKeyUp={this.durationMonthOnChange} className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>مبلغ هزینه(ریال)</Form.Label>
                            <Form.Control ref={this.costAmountRef} onKeyUp={this.coustAmounKeyUp} className='form-control-custom' type="Name" aria-required={true} />
                            <Form.Control style={{border: 'none',background: 'white'}} disabled='disabled' ref={this.costAmountCurrencyRef}  className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>
                    <Row >
                        <Col md='12'>
                            <Form.Label className='custom-label marg-t-20 bold'>توضیحات</Form.Label>
                            <Form.Control  style={{marginBottom:'140px '}} ref={this.descInputRef} className='form-control-custom' as="textarea" rows="4" />
                        </Col>
                    </Row>


                    </div>
                </div>
                <div style={{marginBottom:'100px'}}></div>

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
        Show_Hide_Edit: state.cost.Show_Hide_Edit,
        Is_Edited: state.cost.Is_Edited
    };
});
const mapDispatchToProps = (dispatch) => ({
    // showFunction: () => dispatch(Show_edit()),
    hideFunction: () => dispatch(Hide_edit()),
    edited: () => dispatch(Is_edited())
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(CostEdit,axios));