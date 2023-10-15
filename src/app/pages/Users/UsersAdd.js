import React from 'react';
import { Show_add } from '../_redux/Actions/usersActions';
import { Hide_add } from '../_redux/Actions/usersActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { API_URL } from '../Config';
import {AdminUserInsertApi} from '../commonConstants/ApiConstants';
import axios from 'axios';
import { Is_added } from '../_redux/Actions/usersActions';
import validator from 'validator'
import DropDown from '../component/UI/DropDown';
import { NumberToWords } from "persian-tools2";
import checkRequests from '../component/ErrroHandling';
export class UsersAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftSideBar: -SideBarConfig.width,
            employerTypeID:0,
            salaryTypeID:14,
            showWorkPerDay:false
        }
        this.closeClick = this.closeClick.bind(this);
        this.save = this.save.bind(this);

        this.emailOnBlur= this.emailOnBlur.bind(this);
        this.mobileOnBlur= this.mobileOnBlur.bind(this);
        this.passwordOnBlur = this.passwordOnBlur.bind(this);
        this.emploeryTypeChange = this.emploeryTypeChange.bind(this);
        this.salaryTypeChange = this.salaryTypeChange.bind(this);
        this.salaryPaymentKeyUp = this.salaryPaymentKeyUp.bind(this);
        this.workDayOnKeyUp = this.workDayOnKeyUp.bind(this);
        this.workHoutKeyUp = this.workHoutKeyUp.bind(this);

        this.salaryPaymentRef = React.createRef();
        this.employerRef =React.createRef();
        this.salaryTypeRef =React.createRef();
        this.nameInputRef = React.createRef();
        this.familyInputRef = React.createRef();
        this.userNameInputRef = React.createRef();
        this.emailInputRef=React.createRef();
        this.mobileInputRef =React.createRef();
        this.passwordInputRef= React.createRef();
        this.descInputRef = React.createRef();
        this.salaryPaymentPersianRef = React.createRef();
        this.workPerHourRef = React.createRef();
        this.workPerDayRef = React.createRef();

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


    emailOnBlur(){
        var email = this.emailInputRef.current.value;
        if(email!==''){
            if(!validator.isEmail(email))
            {
                this.notifyError("فرمت ایمیل صحیح نمی باشد.")
                return false;
            }
        }
        return true;
    }

    workDayOnKeyUp(e){
        var work = e.target.value;
        if(work.toString()==='NaN'){
            work=0;
        }
        if(work==='')
        work = 0;
        e.target.value = parseInt(work);
    }
    workHoutKeyUp(e){
        var work = e.target.value;
        if(work.toString()==='NaN'){
            work=0;
        }
        if(work==='')
        work = 0;
        e.target.value = parseInt(work);
    }
    emploeryTypeChange(e){
        this.setState({...this.state,employerTypeID:e.target.value})
    }

    salaryTypeChange(e){
        this.setState({...this.state,salaryTypeID:e.target.value})

    }

    mobileOnBlur(){
        var mobile = this.mobileInputRef.current.value;
        if(mobile!==''){
            if(!validator.isMobilePhone(mobile)){
                this.notifyError("فرمت موبایل صحیح نمی باشد.");
                return false;
            }
        }
        return true;
    }

    salaryPaymentKeyUp(e){
        var payment = e.target.value;
        if(payment.toString()==='NaN'){
            payment=0;
        }
        if(payment==='')
            payment = 0;
        e.target.value = parseInt(payment);
        this.salaryPaymentPersianRef.current.value= NumberToWords.convert(payment)+' ریال';
    }

    passwordOnBlur(){
        var password = this.passwordInputRef.current.value;
        if(password===''){
            this.notifyError("کلمه عبور الزامی می باشد.");
            return false;
        }

        return true;
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.Show_Hide_Add == 'Show_add') {
            this.showSideBar();
            this.nameInputRef.current.focus();
            this.familyInputRef.current.value = '';
            this.descInputRef.current.value = '';
            this.userNameInputRef.current.value = '';
            this.emailInputRef.current.value = '';
            this.mobileInputRef.current.value = '';

        }
        else if (nextprops.Show_Hide_Add == 'Hide_add')
            this.hideSideBar();
    }

    notifySuccess = (title) => toast('کاربر ' + title + ' با موفقیت افزوده شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    notifyError = (title) => toast(title , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyInfo = (title) => toast('در حال افزودن کاربر  ' + title + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    notifyNotValidateTitle = (errorTitle) => toast(errorTitle, { duration: toastConfig.duration, style: toastConfig.errorStyle });

    save() {
        if(!this.validate())
            return;
        let name = this.nameInputRef.current.value;
        let family = this.familyInputRef.current.value;
        let mobile = this.mobileInputRef.current.value;
        let email = this.emailInputRef.current.value;
        let userName = this.userNameInputRef.current.value;
        let desc = this.descInputRef.current.value;
        let password = this.passwordInputRef.current.value;
        let EmployeerTypeFK_ID = this.state.employerTypeID==0?this.props.emplooyerTypeSource[0].id:this.state.employerTypeID;
        let SalaryTypeFK_ID = this.state.salaryTypeID===0?this.props.salaryTypeResource[0].id:this.state.salaryTypeID;
        let SalaryPayment = this.salaryPaymentRef.current.value;

        let MaxWorkPerHour =this.workPerHourRef.current != undefined?this.workPerHourRef.current.value:0;
        let MaxWorkPerDay =this.workPerDayRef.current !=undefined? this.workPerDayRef.current.value:0;
        var data = {
            Email:email,
            UserName:userName,
            FirstName:name,
            LastName:family,
            Description:desc,
            PhoneNumber:mobile,
            password:password,
            EmployeerTypeFK_ID:EmployeerTypeFK_ID,
            SalaryTypeFK_ID:SalaryTypeFK_ID,
            SalaryPayment:SalaryPayment,
            MaxWorkPerDay:MaxWorkPerDay,
            MaxWorkPerHour:MaxWorkPerHour
        }
        axios.post(AdminUserInsertApi, data)
            .then(res => {
                if(res.data.hasError==false){
                  this.notifySuccess(userName);
                  this.props.added();

                }else{
                  this.notifyError(res.data.errorMessage);
                }
            }).catch((error)=>{
          
            });
        this.props.hideFunction();
        this.notifyInfo(userName);
    }
    
    validate(){
        let hasError = false;
        if(this.nameInputRef.current.value.trim() === ''){
            hasError = true;
            this.notifyNotValidateTitle("نام وارد نشده است.");
        }
        if(this.familyInputRef.current.value.trim() === ''){
            hasError = true;
            this.notifyNotValidateTitle("نام خانوادگی وارد نشده است.");
        }
        if(this.userNameInputRef.current.value.trim() === ''){
            hasError = true;
            this.notifyNotValidateTitle("نام کاربری وارد نشده است.");
        }
        if(this.passwordOnBlur()===false){
            hasError =true;
        }
        if(this.emailOnBlur()===false){
            hasError=true;
        }
        if(this.mobileOnBlur()===false){
            hasError=true;
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
                    <div className='category-add-header-text'>افزودن کاربر</div>
                </div>
                <div className='category-add-body'>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>نام</Form.Label>
                            <Form.Control ref={this.nameInputRef} className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>نام خانوادگی </Form.Label>
                            <Form.Control ref={this.familyInputRef} className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>نام کاربری</Form.Label>
                            <Form.Control ref={this.userNameInputRef} className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>ایمیل</Form.Label>
                            <Form.Control ref={this.emailInputRef} className='form-control-custom' onBlur={this.emailOnBlur} type="Name" aria-required={true} />
                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>شماره تلفن</Form.Label>
                            <Form.Control ref={this.mobileInputRef} className='form-control-custom' onBlur={this.mobileOnBlur} type="Name" aria-required={true} />
                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>نوع کارمند</Form.Label>
                            <DropDown source={this.props.emplooyerTypeSource} 
                                    ref={this.employerRef} 
                                    SelectedID={this.state.employerTypeID} 
                                    onChange={this.emploeryTypeChange} 
                                    className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>


                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>روش پرداخت دستمزد</Form.Label>
                            <DropDown source={this.props.salaryTypeResource} 
                                    ref={this.salaryTypeRef} 
                                    SelectedID={this.state.salaryTypeID} 
                                    onChange={this.salaryTypeChange} 
                                    className='form-control-custom' type="Name" aria-required={true} />
                        </Col>
                    </Row>


                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>دستمزد ساعت/روزانه</Form.Label>
                            <Form.Control ref={this.salaryPaymentRef} className='form-control-custom' onKeyUp={this.salaryPaymentKeyUp} type="Name" aria-required={true} />
                            <Form.Control style={{border: 'none',background: 'white'}} disabled='disabled' ref={this.salaryPaymentPersianRef}  type="Name" aria-required={true} />
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                        {parseInt(this.state.salaryTypeID)===14?
                            <>             
                            <Form.Label className='custom-label bold'>ساعت کار</Form.Label>
                            <Form.Control ref={this.workPerHourRef} className='form-control-custom' onKeyUp={this.workHoutKeyUp} type="Name" aria-required={true} />
                            </>
                            :
                            <>
                                <Form.Label className='custom-label bold'>روز کار</Form.Label>
                                <Form.Control ref={this.workPerDayRef} className='form-control-custom' onKeyUp={this.workDayOnKeyUp} type="Name" aria-required={true} />
                            </>
                        }
                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label className='custom-label bold'>کلمه عبور</Form.Label>
                            <Form.Control ref={this.passwordInputRef} className='form-control-custom' onBlur={this.mobileOnBlur} type="Password" aria-required={true} />
                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                            <Form.Label style={{paddingBottom:'30px'}} className='custom-label marg-t-20 bold'>توضیحات</Form.Label>
                            <Form.Control style={{marginBottom: '100px'}} ref={this.descInputRef} className='form-control-custom' as="textarea" rows="4" />
                        </Col>
                    </Row>

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
        Show_Hide_Add: state.users.Show_Hide_Add,
        Is_Added: state.users.Is_Added
    };
});
const mapDispatchToProps = (dispatch) => ({
    hideFunction: () => dispatch(Hide_add()),
    added: () => dispatch(Is_added())
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(UsersAdd,axios));