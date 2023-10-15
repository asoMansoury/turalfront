import React from 'react';
import { Hide_add } from '../_redux/Actions/costActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Is_added } from '../_redux/Actions/costActions';
import {CostInsertApi} from '../commonConstants/ApiConstants';
import DropDown from '../component/UI/DropDown';
import {DatePickerComponent} from '../component/DatePickerComponent/DatePickerComponent'
import { NumberToWords } from 'persian-tools2';
import moment from 'moment-jalaali';
import setupAxios from '../../../redux/setupAxios';
import checkRequests from '../component/ErrroHandling';
export class CostAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftSideBar: -SideBarConfig.width,
            model:{
                costDate:'',
                costCategoryID:0
            }
        }
        this.closeClick = this.closeClick.bind(this);
        this.save = this.save.bind(this);

        this.titleInputRef = React.createRef();
        this.descInputRef = React.createRef();
        this.costCategoryRef = React.createRef();
        this.costDateRef = React.createRef();
        this.costDurationMonthRef = React.createRef();
        this.costAmountRef = React.createRef();
        this.coustAmounKeyUp = this.coustAmounKeyUp.bind(this);
        this.costAmountCurrencyRef = React.createRef();
        this.issueDateOnSubmit = this.issueDateOnSubmit.bind(this);
        this.durationMonthOnChange= this.durationMonthOnChange.bind(this);
        this.costCategoryChange = this.costCategoryChange.bind(this);
    }

    componentDidMount(){
        this.costDurationMonthRef.current.value=1;
        this.setState({
            ...this.state,
            model:{
                costCategoryID:this.props.costCategorySource[0]!=undefined?this.props.costCategorySource[0].id:0
            }
        })
    }

    coustAmounKeyUp(e){
        if(isNaN(e.target.value)){
            this.costAmountRef.current.value=0;
        }
        this.costAmountRef.current.value = e.target.value;
        this.costAmountCurrencyRef.current.value = NumberToWords.convert(parseInt(e.target.value))+" ریال";
    }
    durationMonthOnChange(e){
        if(isNaN(e.target.value)){
            e.target.value=1;
            this.costDurationMonthRef.current.value=0;
        }
        if(e.target.value>12){
            e.target.value = 12;
            this.costDurationMonthRef.current.value=12;
        }
        if(e.target.value<1){
            e.target.value = 1;
            this.costDurationMonthRef.current.value=1;
        }
        
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
            this.titleInputRef.current.value = '';
            this.descInputRef.current.value = '';
        }
        else if (nextprops.Show_Hide_Add == 'Hide_add')
            this.hideSideBar();
    }

    issueDateOnSubmit(e){
        this.setState({
            ...this.state,
            model:{
                ...this.state.model,
                costDate: e
            } 
        })
    }
    notifySuccess = (title) => toast(' هزینه ' + title + ' با موفقیت افزوده شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    notifyError = (title) => toast( title , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyInfo = (title) => toast(  title , { duration: toastConfig.duration, style: toastConfig.infoStyle });

    save() {
        if(!this.validate())
            return;
        let title = this.titleInputRef.current.value;
        let desc = this.descInputRef.current.value;
        let costDate = this.state.model.costDate;
        let month = this.costDurationMonthRef.current.value;
        let costCategoryID = this.state.model.costCategoryID===0?this.props.costCategorySource[0].id:this.state.model.costCategoryID;
        let costAmount = this.costAmountRef.current.value;
        var data = {
            Title:title,
            Description:desc,
            CostDate:costDate,
            Month:month,
            CostAmount:costAmount,
            costCategoryDto:{
            ID:costCategoryID
            }
        }
        axios.post(CostInsertApi, data)
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
                    <div className='category-add-header-text'>افزودن هزینه</div>
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
                        <Form.Label className='custom-label bold'>گروه هزینه</Form.Label>
                        <DropDown source={this.props.costCategorySource} ref={this.costCategoryRef}
                            onChange={this.costCategoryChange}
                            className={ 'custom-label marg-t-20 bold'} type="Name" aria-required={true} />
                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                        <Form.Label className='custom-label bold'>تاریخ هزینه</Form.Label>
                        <DatePickerComponent selectedDate={moment().format('jYYYY-jMM-jDD')} onChange={this.issueDateOnSubmit}></DatePickerComponent>
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
                        <Col md='12' >
                            <Form.Label className='custom-label marg-t-20 bold'>توضیحات</Form.Label>
                            <Form.Control style={{marginBottom:'140px '}} ref={this.descInputRef} className='form-control-custom' as="textarea" rows="4" />
                        </Col>
                    </Row>
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
        Show_Hide_Add: state.cost.Show_Hide_Add,
        Is_Added: state.cost.Is_Added
    };
});
const mapDispatchToProps = (dispatch) => ({
    hideFunction: () => dispatch(Hide_add()),
    added: () => dispatch(Is_added())
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(CostAdd,axios));