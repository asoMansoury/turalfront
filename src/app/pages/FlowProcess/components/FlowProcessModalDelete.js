import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import deleteImage from '../../pulseDesignImages/delete.svg';
import { Is_deleted_one } from '../../_redux/Actions/processActions';
import { connect } from "react-redux";
import { toastConfig } from '../../Config';
import axios from 'axios';
import toast from 'react-hot-toast';
import {FlowProcessRemoveByIds} from '../../commonConstants/ApiConstants';
import checkRequests from '../../component/ErrroHandling';
function FlowProcessDelete(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    };
    const notifySuccess = () => toast('جریان فرایند با شناسه ' + props.dbid + ' با موفقیت حذف شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    const notifyError = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.errorStyle });
    const notifyInfo = () => toast('در حال حذف جریان فرایند با شناسه ' + props.dbid + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    const deleteBtn = () => {
        axios.put(FlowProcessRemoveByIds, { ids: [parseInt(props.dbid)] })
            .then(res => {
                if(res.data.hasError==false){
                    notifySuccess();
                    props.deletedOne();
                }else{
                    notifyError(res.data.errorMessage);
                }

            })
            .catch(error => {
                console.log(error)
                notifyError(error.message);
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
                        فرایند {props.name} با شناسه {props.dbid} حذف میشود. تایید میکنید؟
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

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(FlowProcessDelete,axios));