import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Preloader, Oval } from 'react-preloader-icon';
import { API_URL, toastConfig } from '../Config';
import axios from 'axios';
import toast from 'react-hot-toast';
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined';
import {InitialBalancePrintWastageApi,InitialBalanceGetWastageApi} from '../commonConstants/ApiConstants';
import { Form, Row, Col } from 'react-bootstrap';
import checkRequests from '../component/ErrroHandling';
import { useDispatch, useSelector } from "react-redux";
function BalanceWastage(props) {
    const [show, setShow] = useState(false);
    const [model,setModel]=useState([]);
    const Token = useSelector(state=>state.tokenReducer.TokenObject.userInfo.token);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        axios.get(InitialBalanceGetWastageApi+props.dbid).then((response)=>{
            if(response.data.hasError==false){
                console.log(response.data.initialBalanceDtos)
                setModel(response.data.initialBalanceDtos);
                setShow(true);
            }else{
                notifyError(response.data.errorMessage);
                setShow(false);
            }
        }).catch((error)=>{

        })

    };
    const notifyError = (title) => toast( title , { duration: toastConfig.duration, style: toastConfig.errorStyle });
    function PrintExcel(){
        const myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer '+Token);
        fetch(InitialBalancePrintWastageApi+props.dbid,{
          headers:myHeaders
        }).then(function(response) {
          return response.blob();
        }).then(function(myBlob) {
          var objectURL = URL.createObjectURL(myBlob);
          let a = document.createElement('a');
          a.href = objectURL;
          a.download = 'Wastages.xlsx';
          a.click();
        });
    }
    return (
        <>
            <div onClick={handleShow} className="delete-img-con btn-for-select"><DeleteSweepOutlinedIcon style={{color: '#6610f2'}}></DeleteSweepOutlinedIcon></div>
            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span className='modal-header-desc'>
                            مشاهده ضایعات {props.title}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row>
                <Col md='2' style={{marginTop: '20px !important' }}>
                    <Form.Label className='custom-label bold'>شناسه</Form.Label>
                </Col>
                <Col md='4' style={{marginTop: '20px !important' }}>
                    <Form.Label className='custom-label bold'> عنوان خروجی فرایند</Form.Label>
                </Col>
                <Col md='2' style={{marginTop: '20px !important' }}>
                    <Form.Label className='custom-label bold'>عنوان ماده اولیه</Form.Label>
                </Col>
                <Col md='2' style={{marginTop: '20px !important' }}>
                    <Form.Label className='custom-label bold'>تعداد ضایعات</Form.Label>
                </Col>
            </Row>
                    {
                        model.map((item,index)=>{
                            return (
                                        <Row key={index}>
                                            <Col md='2' >
                                                <Form.Control
                                                    value={item.id}
                                                    disabled='disabled'
                                                    className='custom-label marg-t-20 bold'  ></Form.Control>
                                            </Col>
                                                <Col md='4' style={{marginTop: '20px !important' }}>
                                                <Form.Control
                                                disabled='disabled'
                                                value={item.flowTitle}
                                                indexItem = {index}
                                                className='custom-label marg-t-20 bold' placeholder="مقدار ضایعات" ></Form.Control>
                                            </Col>
                                            <Col md='2' >
                                                <Form.Control
                                                    value={item.title}
                                                    disabled='disabled'
                                                    className='custom-label marg-t-20 bold'  ></Form.Control>
                                            </Col>
                                            <Col md='2' >
                                                <Form.Control
                                                    value={item.count}
                                                    disabled='disabled'
                                                    className='custom-label marg-t-20 bold'  ></Form.Control>
                                            </Col>
                                            
                                        </Row>
                                    )
                                })
                    }
                    <div style={{marginTop:'20px'}}></div>
                 <Row >
                    <Col md='6' >
                        <div style={{backgroundImage: 'linear-gradient(to right, #6a75ca, #9666f7)',borderRadius: '22px'}} class="alert alert-primary" role="alert"> مجموع ضایعات : { model.reduce((total, item) => total + item.count, 0)} عدد</div>
                    </Col>
                </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button  variant="secondary" onClick={handleClose}>
                        انصراف
                    </Button>
                    <Button style={{backgroundImage: 'linear-gradient(to right, #6a75ca, #9666f7)'}} variant="primary" onClick={PrintExcel}>
                        دریافت فایل اکسل
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}



export default checkRequests(BalanceWastage,axios);