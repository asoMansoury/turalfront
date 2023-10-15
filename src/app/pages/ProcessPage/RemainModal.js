import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useState } from 'react';
import { Preloader, Oval } from 'react-preloader-icon';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { ConfirmAddRow } from '../_redux/Actions/processActions';
import {useDispatch,useSelector} from 'react-redux'

function RemainModal(props) {
    const [show, setShow] = useState(false);
    const [dataView, setDataView] = useState([]);
    const [model,setModel] = useState([]);
    const [prodName, setProdName] = useState('');
    const [prodId, setProdId] = useState(0);
    const [wareHouseNo, setWareHouseNo] = useState(0);
    const confirmAddRow = useDispatch();

    const handleClose = () => {
        props.handleClose();
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    };
    const handleConfirm = (e)=>{
        setShow(false);
        props.handleConfirm(e)
    }
    function onlyUnique(array,key) {
        const arrayUniqueByKey = [...new Map(array.map(item =>
        [item[key], item])).values()];
        return arrayUniqueByKey;
    }

    
    useEffect(() => {
        let view = [];
        view.push(
            <Row style={{textAlign:'center', fontWeight: 'bold', borderBottom:'1px solid #ebedf3', paddingBottom:'15px'}}>
                <Col md='3'>
                    شناسه انبار
                </Col>
                <Col md='3'>
                    نام انبار
                </Col>
                <Col md='3'>
                    موجودی
                </Col>
                <Col md='3'>
                    تعداد مورد نیاز
                </Col>
            </Row>
        )
        var formData = onlyUnique(props.data.filter(z=>z.initialBalanceEntitiesFK_ID===prodId),"id");
        for (let i = 0; i < formData.length; i++) {
            view.push(
                <Row style={{textAlign:'center', fontWeight: 'normal',borderBottom : (i == props.data.filter(z=>z.initialBalanceEntitiesFK_ID===prodId).length-1) ? 'none' : '1px solid #ebedf3', paddingBottom:'10px',paddingTop:'10px'}}>
                    <Col md='3'>
                        {props.data.filter(z=>z.initialBalanceEntitiesFK_ID===prodId)[i].id}
                    </Col>
                    <Col md='3'>
                        {props.data.filter(z=>z.initialBalanceEntitiesFK_ID===prodId)[i].title}
                    </Col>
                    <Col md='3'>
                        {props.data.filter(z=>z.initialBalanceEntitiesFK_ID===prodId)[i].currentCount}
                    </Col>
                    <Col md='3'>
                        <Form.Control value={props.data.filter(z=>z.initialBalanceEntitiesFK_ID===prodId)[i].count} currentCount={props.data.filter(z=>z.initialBalanceEntitiesFK_ID===prodId)[i].currentCount} indexItem={i}  prodId={props.prodId} id={props.data.filter(z=>z.initialBalanceEntitiesFK_ID===prodId)[i].id} onChange={props.inputCountKeyUp} className='form-control-custom' type="Name" aria-required={true} />
                    </Col>
                </Row>
            );
        }
        setDataView(view);
        setProdName(props.prodName);
        setProdId(props.prodId);
        let wareHouseNoo = 0;
        for(let i = 0; i <formData.length; i++){
            if(props.data.filter(z=>z.initialBalanceEntitiesFK_ID===prodId)[i].currentCount > 0)
                wareHouseNoo++;
        }
        setWareHouseNo(wareHouseNoo);
    }, [props]);

    return (
        <>
            <span onClick={handleShow} style={{ width: '100%', height: '83%', fontSize: '13px' }} className={wareHouseNo > 0 ? 'pointer label label-lg label-inline btn-height label-light-success ' : 'pointer label label-lg label-inline btn-height label-light-danger'} >در {wareHouseNo} انبار موجود میباشد</span>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span className='modal-header-desc'>موجودی محصول</span>
                        <span className='modal-header-desc'>&nbsp;{prodName}</span>
                        <span className='modal-header-desc'>&nbsp;با شناسه</span>
                        <span className='modal-header-desc'>&nbsp;{prodId}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{paddingTop: '33px'}}>
                    <div className='description-modal'>
                        {dataView}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        انصراف
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        تایید
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default RemainModal;