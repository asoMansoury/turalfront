import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Preloader, Oval } from 'react-preloader-icon';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { IndeterminateCheckBoxTwoTone } from "@material-ui/icons";
import { addCommas } from "persian-tools2";

function SalaryModal(props) {
    const [data,setData]=useState([]);
    const [model,setModel]=useState([]);
    const [,setCounter]=useState(0);
    useEffect(()=>{
        setData(props.processUsers);
    },[props.processUsers]);

    function  workPerHourOnChange(e){
        var count = parseInt(e.target.value);
        if(count.toString()==='NaN')
            count=0;
        if(count.toString() =='')
            count=0;
        e.target.value = count;
        var itemIndex= e.target.getAttribute('data-indexitem');
        var tmpArray = data;
        var currentItem = tmpArray[itemIndex];

        if(currentItem.salaryTypeFK_ID===14){
            if(count>currentItem.maxWorkPerHour)
                count = currentItem.maxWorkPerHour;
        }else{
            if(count>currentItem.maxWorkPerDay)
                count = currentItem.maxWorkPerDay;
        }

        currentItem.SumHours= count;
        tmpArray[itemIndex] = currentItem;
        setData(tmpArray);
        setCounter(i=>i+1);
    }

   function handleConfirm(e){
        props.handleConfirm(data);
        
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} size="lg"> 
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span className='modal-header-desc'>ورود دستمزد کارگران</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{paddingTop: '33px'}}>
                    <div className='description-modal'>
                    <Row style={{textAlign:'center', fontWeight: 'bold', borderBottom:'1px solid #ebedf3', paddingBottom:'15px'}}>

                        <Col md='3'>
                            نام و نام خانوادگی
                        </Col>
                        <Col md='2'>
                            نوع پرداختی
                        </Col>
                        <Col md='2'>
                            دستمزد
                        </Col>
                        <Col md='2'>
                            ساعت کار
                        </Col>
                        <Col md='3'>
                            ساعت/روز مجاز
                        </Col>
                    </Row>
                    {
                        props.processUsers.map((item,index)=>{
                            return(
                                <Row key={index} style={{textAlign:'center', fontWeight: 'normal'}}>
                                    <Col md='1' style={{display:'none'}}>
                                        {item.id}
                                    </Col>                                    
                                    <Col md='1' style={{marginTop:'24px',display:'none'}}>
                                        {item.userID}
                                    </Col>
                                    <Col md='3' style={{marginTop:'24px'}}>
                                        {item.userName}
                                    </Col>
                                    <Col md='2' style={{marginTop:'24px'}}>
                                        {item.salaryTypeName}
                                    </Col>
                                    <Col md='2' style={{marginTop:'24px'}}>
                                        {addCommas(item.salary)} ریال
                                    </Col>
                                    <Col md='2'>
                                        <Form.Control data-indexitem={index}
                                            value = {data[index]!=undefined?data[index].SumHours:0}
                                            onChange={workPerHourOnChange} className='custom-label marg-t-20 bold' placeholder="ساعت کار" ></Form.Control>{item.salaryTypeFK_ID===14?'ساعت':'روز'} 

                                    </Col>
                                    {
                                        item.salaryTypeFK_ID===14?
                                            <Col md='3' style={{marginTop:'24px'}}>
                                                {item.maxWorkPerHour} ساعت
                                            </Col>
                                            :
                                            <Col md='3' style={{marginTop:'24px'}}>
                                                {item.maxWorkPerDay} روز
                                            </Col>
                                    }

                                </Row>
                            )
                        })
                    }

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={props.handleClose}>
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
export default SalaryModal;