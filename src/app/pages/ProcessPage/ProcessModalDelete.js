import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import deleteImage from '../pulseDesignImages/delete.svg';
import { Is_deleted_one } from '../_redux/Actions/processActions';
import { connect } from "react-redux";
import { toastConfig } from '../Config';
import axios from 'axios';
import toast from 'react-hot-toast';
import {ProcessRemoveByIdsApi} from '../commonConstants/ApiConstants';
import checkRequests from '../component/ErrroHandling';
function ProcessDelete(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    };
    const notifySuccess = () => toast('فرایند با شناسه ' + props.dbid + ' با موفقیت حذف شد.', { duration: toastConfig.duration, style: toastConfig.successStyle });
    const notifyError = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.errorStyle });
    const notifyInfo = () => toast('در حال حذف فرایند با شناسه ' + props.dbid + ' ...', { duration: toastConfig.duration, style: toastConfig.infoStyle });
    const deleteBtn = () => {
        axios.put(ProcessRemoveByIdsApi, { ids: [parseInt(props.dbid)] })
            .then(res => {
                if(res.data.hasError==false){
                    notifySuccess();
                    props.deletedOne();
                }else{
                    notifyError(res.data.errorMessage);
                }

            }).catch((error)=>{
          
            });
        setShow(false);
        notifyInfo();
    }

    return (
        <>
            <div onClick={handleShow} className="delete-img-con btn-for-select" style={{color: '#6610f2'}}><img className='delete-img btn-for-select' src={deleteImage} /></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(ProcessDelete,axios));