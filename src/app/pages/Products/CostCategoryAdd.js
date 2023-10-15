import React from 'react';
import { Hide_add } from '../_redux/Actions/costCategoryActions';
import { connect } from "react-redux";
import { SideBarConfig, toastConfig } from '../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { API_URL } from '../Config';
import axios from 'axios';
import { Is_added } from '../_redux/Actions/costCategoryActions';
import {CostCategoryInsertApi} from '../commonConstants/ApiConstants';
import checkRequests from '../component/ErrroHandling';
export class CostCategoryAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftSideBar: -SideBarConfig.width,
        }
        this.closeClick = this.closeClick.bind(this);
        this.save = this.save.bind(this);

        this.titleInputRef = React.createRef();
        this.descInputRef = React.createRef();
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
    notifySuccess = (title) => toast('دسته بندی ' + title + ' با موفقیت افزوده شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    notifyError = (title) => toast( title , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    notifyInfo = (title) => toast(  title , { duration: toastConfig.duration, style: toastConfig.infoStyle });

    save() {
        if(!this.validate())
            return;
        let title = this.titleInputRef.current.value;
        let desc = this.descInputRef.current.value;
        var data = {
            Title:title,
            Description:desc
        }
        axios.post(CostCategoryInsertApi, data)
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
        this.notifyInfo(' در حال اضافه کردن هزینه سرفصل'+title);
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
                    <div className='category-add-header-text'>افزودن دسته بندی</div>
                </div>
                <div className='category-add-body'>
                    <Form.Label className='custom-label bold'>عنوان</Form.Label>
                    <Form.Control ref={this.titleInputRef} className='form-control-custom' type="Name" aria-required={true} />
                    <Form.Label className='custom-label marg-t-20 bold'>توضیحات</Form.Label>
                    <Form.Control ref={this.descInputRef} className='form-control-custom' as="textarea" rows="4" />
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
        Show_Hide_Add: state.costCategory.Show_Hide_Add,
        Is_Added: state.costCategory.Is_Added
    };
});
const mapDispatchToProps = (dispatch) => ({
    // showFunction: () => dispatch(Show_add()),
    hideFunction: () => dispatch(Hide_add()),
    added: () => dispatch(Is_added())
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(CostCategoryAdd,axios));