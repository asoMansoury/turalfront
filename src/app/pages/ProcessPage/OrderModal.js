import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useState } from 'react';
import { Preloader, Oval } from 'react-preloader-icon';
import { Form, Row, Col, Button } from 'react-bootstrap';

function RemainModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    };
    const [dataView, setDataView] = useState([]);
    const [prodName, setProdName] = useState('');
    const [prodId, setProdId] = useState(0);
    const [wareHouseNo, setWareHouseNo] = useState(0);
    useEffect(() => {
        let view = [];
        view.push(
            <Row style={{textAlign:'center', fontWeight: 'bold', borderBottom:'1px solid #ebedf3', paddingBottom:'15px'}}>
                <Col md='4'>
                    شناسه انبار
                </Col>
                <Col md='4'>
                    نام انبار
                </Col>
                <Col md='4'>
                    موجودی
                </Col>
            </Row>
        )
        for (let i = 0; i < props.data.length; i++) {
            view.push(
                <Row style={{textAlign:'center', fontWeight: 'normal',borderBottom : (i == props.data.length-1) ? 'none' : '1px solid #ebedf3', paddingBottom:'10px',paddingTop:'10px'}}>
                    <Col md='4'>
                        {props.data[i].id}
                    </Col>
                    <Col md='4'>
                        {props.data[i].title}
                    </Col>
                    <Col md='4'>
                        {props.data[i].currentCount}
                    </Col>
                </Row>
            );
        }
        setDataView(view);

        setProdName(props.prodName);
        setProdId(props.prodId);

        let wareHouseNoo = 0;
        for(let i = 0; i < props.data.length; i++){
            if(props.data[i].currentCount > 0)
                wareHouseNoo++;
        }
        setWareHouseNo(wareHouseNoo);
    }, [props]);

    return (
        <>
            <span onClick={handleShow} style={{ width: '100%', height: '83%', fontSize: '13px' }} className={wareHouseNo > 0 ? 'pointer label label-lg label-inline btn-height label-light-success ' : 'pointer label label-lg label-inline btn-height label-light-danger'} >در {wareHouseNo} انبار موجود میباشد</span>
            <Modal size='lg' show={show} onHide={handleClose}>
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
                        بستن
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default RemainModal;