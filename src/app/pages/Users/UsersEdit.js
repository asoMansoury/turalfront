import React from 'react';
import { Hide_edit, Is_edited } from '../_redux/Actions/usersActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {AdminUserEditApi} from '../commonConstants/ApiConstants';
import { fr } from 'date-fns/locale';
import validator from 'validator';
import DropDown from '../component/UI/DropDown';
import { NumberToWords } from "persian-tools2";
import checkRequests from '../component/ErrroHandling';
export class UsersEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftSideBar: -SideBarConfig.width,
            isLoading: false,
            description: '',
            dbid: -1,
            title: '',
            salaryTypeID:0,
            employerTypeID:0,
            showWorkPerDay:false,
            maxWorkPerDay:0,
            maxWorkPerHour:0

        }
        this.closeClick = this.closeClick.bind(this);
        this.titleKeyUp = this.titleKeyUp.bind(this);
        this.addressKeyUp=this.addressKeyUp.bind(this);
        this.descriptionKeyUp = this.descriptionKeyUp.bind(this);
        this.save = this.save.bind(this);

        this.emailOnBlur= this.emailOnBlur.bind(this);
        this.mobileOnBlur= this.mobileOnBlur.bind(this);
        this.emploeryTypeChange = this.emploeryTypeChange.bind(this);
        this.salaryTypeChange = this.salaryTypeChange.bind(this);
        this.salaryPaymentKeyUp = this.salaryPaymentKeyUp.bind(this);
        this.workDayOnKeyUp = this.workDayOnKeyUp.bind(this);
        this.workHoutKeyUp = this.workHoutKeyUp.bind(this);

        this.employerRef =React.createRef();
        this.salaryTypeRef =React.createRef();
        this.nameInputRef = React.createRef();
        this.familyInputRef = React.createRef();
        this.userNameInputRef = React.createRef();
        this.emailInputRef=React.createRef();
        this.mobileInputRef =React.createRef();
        this.descriptionRef = React.createRef();
        this.salaryPaymentRef=React.createRef();
        this.salaryPaymentPersianRef = React.createRef();
        this.workPerHourRef = React.createRef();
        this.workPerDayRef = React.createRef();
    }

    
    emailOnBlur(){
        var email = this.emailInputRef.current.value;
        if(email!==''){
            if(!validator.isEmail(email)){
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
        this.setState({
            ...this.state,
            maxWorkPerDay:parseInt(work)
        })
        e.target.value = parseInt(work);
    }
    workHoutKeyUp(e){
        var work = e.target.value;
        if(work.toString()==='NaN'){
            work=0;
        }
        if(work==='')
        work = 0;
        debugger;
        this.setState({
            ...this.state,
            maxWorkPerHour:parseInt(work)
        })
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
    closeClick() {
        this.props.hideFunction();
    }
    showSideBar() {
        this.nameInputRef.current.focus();

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
    notifySuccess = () => toast('کاربر با شناسه ' + this.state.dbid + ' با موفقیت ویرایش شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    notifyError = (error) => toast( error , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyInfo = () => toast('در حال کاربر با شناسه ' + this.state.dbid + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    save() {
        if(!this.validate())
            return;

        let name = this.nameInputRef.current.value;
        let family = this.familyInputRef.current.value;
        let mobile = this.mobileInputRef.current.value;
        let email = this.emailInputRef.current.value;
        let userName = this.userNameInputRef.current.value;
        let desc = this.descriptionRef.current.value;
        let EmployeerTypeFK_ID = this.state.employerTypeID;
        let SalaryTypeFK_ID = this.state.salaryTypeID;
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
            EmployeerTypeFK_ID:EmployeerTypeFK_ID,
            SalaryTypeFK_ID:SalaryTypeFK_ID,
            ID: this.state.dbid,
            SalaryPayment:SalaryPayment,
            MaxWorkPerDay:this.state.maxWorkPerDay,
            MaxWorkPerHour:this.state.maxWorkPerHour
        }
        axios.put(AdminUserEditApi, data)
            .then(res => {
                if(res.data.hasError==false){
                  this.notifySuccess();
                  this.props.edited();

                }else{
                  this.notifyError(res.data.errorMessage);
                }
            }).catch((error)=>{
          
            });
        this.props.hideFunction();
        this.notifyInfo();
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
            this.nameInputRef.current.focus();
        }
        else if (nextprops.Show_Hide_Edit.type == 'Hide_edit') {
            this.hideSideBar();
        }
        

        this.nameInputRef.current.value = nextprops.Show_Hide_Edit.obj.name === undefined ? '' : nextprops.Show_Hide_Edit.obj.name;
        this.familyInputRef.current.value = nextprops.Show_Hide_Edit.obj.family === undefined ? '' : nextprops.Show_Hide_Edit.obj.family;
        this.userNameInputRef.current.value = nextprops.Show_Hide_Edit.obj.userName === undefined ? '' : nextprops.Show_Hide_Edit.obj.userName;
        this.emailInputRef.current.value = nextprops.Show_Hide_Edit.obj.email === undefined ? '' : nextprops.Show_Hide_Edit.obj.email;
        this.descriptionRef.current.value = nextprops.Show_Hide_Edit.obj.description === undefined ? '' : nextprops.Show_Hide_Edit.obj.description;
        this.mobileInputRef.current.value=nextprops.Show_Hide_Edit.obj.mobile === undefined ? '':nextprops.Show_Hide_Edit.obj.mobile;
        this.salaryPaymentRef.current.value=nextprops.Show_Hide_Edit.obj.salaryPayment === undefined ? 0:nextprops.Show_Hide_Edit.obj.salaryPayment;
        this.salaryPaymentPersianRef.current.value= NumberToWords.convert(this.salaryPaymentRef.current.value)+' ریال';
        this.setState({...this.state,
            employerTypeID:nextprops.Show_Hide_Edit.obj.emplooyerID === undefined ? '':nextprops.Show_Hide_Edit.obj.emplooyerID,
            salaryTypeID:nextprops.Show_Hide_Edit.obj.salaryID === undefined ? '':nextprops.Show_Hide_Edit.obj.salaryID,
            maxWorkPerDay:nextprops.Show_Hide_Edit.obj.maxWorkPerDay===undefined?0:nextprops.Show_Hide_Edit.obj.maxWorkPerDay,
            maxWorkPerHour: nextprops.Show_Hide_Edit.obj.maxWorkPerHour===undefined?0:nextprops.Show_Hide_Edit.obj.maxWorkPerHour
        })
        if (!this.props.Is_Edited && nextprops.Show_Hide_Edit.type != 'Hide_edit') {
            this.setState({
                description: nextprops.Show_Hide_Edit.obj.description,
                dbid: parseInt(nextprops.Show_Hide_Edit.obj.id),
                title: nextprops.Show_Hide_Edit.obj.title,
                address:nextprops.Show_Hide_Edit.obj.address,
            });
        }
    }
    notifyNotValidateTitle = () => toast('عنوان وارد نشده است.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    
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
                    <div className='category-add-header-text'>ویرایش کاربر</div>
                </div>
                    <div className='category-add-body' >
                    
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
                        <DropDown source={this.props.emplooyerTypeSource} SelectedID={this.state.employerTypeID} 
                                    onChange={this.emploeryTypeChange} 
                                    className='form-control-custom' type="Name" aria-required={true} />

                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                        <Form.Label className='custom-label bold'>روش پرداخت دستمزد</Form.Label>
                        <DropDown source={this.props.salaryTypeResource}  SelectedID={this.state.salaryTypeID} 
                                    onChange={this.salaryTypeChange} 
                                    className='form-control-custom' type="Name2" aria-required={true} />

                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                        <Form.Label className='custom-label bold'>دستمزد ساعت/روزانه</Form.Label>
                        <Form.Control ref={this.salaryPaymentRef} className='form-control-custom' onKeyUp={this.salaryPaymentKeyUp} type="Name" aria-required={true} />
                        <Form.Control style={{border: 'none',background: 'white'}} disabled='disabled' ref={this.salaryPaymentPersianRef} className='form-control-custom' type="Name" aria-required={true} />


                        </Col>
                    </Row>
                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                        {this.state.salaryTypeID===15?
                            <>
                                <Form.Label className='custom-label bold'>روز کار</Form.Label>
                                <Form.Control ref={this.workPerDayRef} className='form-control-custom' value={this.state.maxWorkPerDay} onChange={this.workDayOnKeyUp} type="Name" aria-required={true} />
                            </>
                            :
                            <>             
                                <Form.Label className='custom-label bold'>ساعت کار</Form.Label>
                                <Form.Control ref={this.workPerHourRef} className='form-control-custom' value={this.state.maxWorkPerHour} onChange={this.workHoutKeyUp} type="Name" aria-required={true} />
                            </>
                        }

                        </Col>
                    </Row>

                    <div className="separator separator-dashed my-7"></div>
                    <Row>
                        <Col md='12'>
                        <Form.Label  style={{paddingBottom:'30px'}} className='custom-label marg-t-20 bold'>توضیحات</Form.Label>
                        <Form.Control style={{marginBottom: '100px'}} ref={this.descriptionRef} className='form-control-custom' as="textarea" rows="4" />
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
        Show_Hide_Edit: state.users.Show_Hide_Edit,
        Is_Edited: state.users.Is_Edited
    };
});
const mapDispatchToProps = (dispatch) => ({
    hideFunction: () => dispatch(Hide_edit()),
    edited: () => dispatch(Is_edited())
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(UsersEdit,axios));