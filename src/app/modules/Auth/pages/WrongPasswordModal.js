import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button,Form,Row,Col } from 'react-bootstrap';
import { useState } from 'react';
import { Preloader, Oval } from 'react-preloader-icon';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
function WrongPasswordModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        props.setShowModal(false);
    }
    const handleShow = () => {
        setShow(true);
    };

    return (
        <>
            <Modal aria-labelledby="contained-modal-title-vcenter" centered show={props.showModal} onHide={handleClose}>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md='4'></Col>
                            <Col md='4' style={{margin: '0 auto',textAlign: 'center'}}>
                                <CancelOutlinedIcon style={{color:'#f27474',fontSize:'86px'}}></CancelOutlinedIcon>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row style={{marginTop:'60px'}}>
                            <Col md='md-4'></Col>
                            <Col md='md-4' style={{margin: '0 auto'}}>
                                <div className='description-modal'>
                                    نام کاربری اشتباه وارد شده است.
                                </div>
                            </Col>
                            <Col md='md-4'></Col>
                        </Row>
                        <Row style={{marginTop:'60px'}}>
                            <Col md='md-4'></Col>
                            <Col md='md-4' style={{margin: '0 auto'}}>
                                <Button style={{backgroundImage: 'linear-gradient(to right, #6a75ca, #9666f7)'}} variant="primary" size='lg' onClick={handleClose}>
                                    بستن
                                </Button>
                            </Col>
                            <Col md='md-4'></Col>

                        </Row>
                    </Form>


                </Modal.Body>
            </Modal>
        </>
    );
}
export default WrongPasswordModal;