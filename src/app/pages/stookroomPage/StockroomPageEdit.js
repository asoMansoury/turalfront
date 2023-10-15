import React from 'react';
import { Hide_edit, Is_edited } from '../_redux/Actions/categoryActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Preloader, Oval } from 'react-preloader-icon';
import { API_URL } from '../Config';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {stockRoomEditApi} from '../commonConstants/ApiConstants';
import { fr } from 'date-fns/locale';
import checkRequests from '../component/ErrroHandling';
export class StockEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftSideBar: -SideBarConfig.width,
            isLoading: false,
            description: '',
            dbid: -1,
            title: ''
        }
        this.closeClick = this.closeClick.bind(this);
        this.titleKeyUp = this.titleKeyUp.bind(this);
        this.addressKeyUp=this.addressKeyUp.bind(this);
        this.descriptionKeyUp = this.descriptionKeyUp.bind(this);
        this.save = this.save.bind(this);

        this.addressInputRef = React.createRef();
        this.titleInputRef = React.createRef();
        this.descriptionRef = React.createRef();
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
    notifySuccess = () => toast('انبار با شناسه ' + this.state.dbid + ' با موفقیت ویرایش شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    notifyError = (error) => toast( error , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyInfo = () => toast('در حال انبار با شناسه ' + this.state.dbid + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    save() {
        if(!this.validate())
            return;
        axios.post(stockRoomEditApi, { ID: this.state.dbid, Title: this.state.title, Description: this.state.description,Address:this.state.address })
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
            this.titleInputRef.current.focus();
        }
        else if (nextprops.Show_Hide_Edit.type == 'Hide_edit') {
            this.hideSideBar();
        }
        this.titleInputRef.current.value = nextprops.Show_Hide_Edit.obj.title == undefined ? '' : nextprops.Show_Hide_Edit.obj.title;
        this.descriptionRef.current.value = nextprops.Show_Hide_Edit.obj.description == undefined ? '' : nextprops.Show_Hide_Edit.obj.description;
        this.addressInputRef.current.value=nextprops.Show_Hide_Edit.obj.address == undefined ? '':nextprops.Show_Hide_Edit.obj.address;
        if (!this.props.Is_Edited && nextprops.Show_Hide_Edit.type != 'Hide_edit') {
            this.setState({
                description: nextprops.Show_Hide_Edit.obj.description,
                dbid: parseInt(nextprops.Show_Hide_Edit.obj.id),
                title: nextprops.Show_Hide_Edit.obj.title,
                address:nextprops.Show_Hide_Edit.obj.address
            });
        }
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
                    <div className='category-add-header-text'>ویرایش انبار</div>
                </div>
                <div className='category-add-body'>
                    <div style={{ /*display: this.state.isLoading ? 'none' : 'block'*/ }}>
                        <Form.Label className='custom-label bold'>عنوان</Form.Label>
                        <Form.Control onKeyUp={this.titleKeyUp} ref={this.titleInputRef} className='form-control-custom' type="Name" aria-required={true} />
                        <Form.Label className='custom-label marg-t-20 bold'>آدرس</Form.Label>
                        <Form.Control onKeyUp={this.addressKeyUp} ref={this.addressInputRef} className='form-control-custom' as="textarea" rows="4" />
                        <Form.Label className='custom-label marg-t-20 bold'>توضیحات</Form.Label>
                        <Form.Control onKeyUp={this.descriptionKeyUp} ref={this.descriptionRef} className='form-control-custom' as="textarea" rows="4" />
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(StockEdit,axios));