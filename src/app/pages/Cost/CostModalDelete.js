import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import deleteImage from '../pulseDesignImages/delete.svg';
import { Is_deleted_one } from '../_redux/Actions/costCategoryActions';
import { connect } from "react-redux";
import { API_URL, toastConfig } from '../Config';
import {CostRemoveByIds} from '../commonConstants/ApiConstants'
import axios from 'axios';
import toast from 'react-hot-toast';
import checkRequests from '../component/ErrroHandling';
function CostModalDelete(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    };
    const notifySuccess = () => toast(' هزینه با شناسه ' + props.dbid + ' با موفقیت حذف شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    const notifyError = () => toast('عملیات حذف  هزینه با شناسه ' + props.dbid + ' با خطا مواجه شد.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    const notifyInfo = () => toast('در حال حذف  هزینه با شناسه ' + props.dbid + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    const deleteBtn = () => {
        axios.put(CostRemoveByIds, { ids: [parseInt(props.dbid)] })
            .then(res => {
                notifySuccess();
                props.deletedOne();
            }).catch((error)=>{
          
            });
        setShow(false);
        notifyInfo();
    }

    return (
        <>
            <div onClick={handleShow} className="delete-img-con btn-for-select"><img className='delete-img btn-for-select' src={deleteImage} /></div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span className='modal-header-desc'>
                            پیام سیستم
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span className='description-modal'>
                        دسته بندی {props.name} با شناسه {props.dbid} حذف میشود. تایید میکنید؟
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        انصراف
                    </Button>
                    <Button variant="primary" onClick={deleteBtn}>
                        تایید
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const mapStateToProps = (state => {
    return {

    };
});
const mapDispatchToProps = (dispatch) => ({
    deletedOne: () => dispatch(Is_deleted_one())
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(CostModalDelete,axios));