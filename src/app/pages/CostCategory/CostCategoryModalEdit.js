import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { Preloader, Oval } from 'react-preloader-icon';

function CostCategoryModalEdit(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    };

    return (
        <>
            <span onClick={handleShow} className='pointer label label-lg label-light-success label-inline btn-height'>{props.title}</span>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span className='modal-header-desc'>{props.headerTitle} </span>
                        <span className='modal-header-desc'>{props.name}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='description-modal'>
                        {props.text}
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
export default CostCategoryModalEdit;