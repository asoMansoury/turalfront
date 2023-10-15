import React, { useEffect, useRef, useState } from 'react';
import { SideBarConfig, toastConfig } from '../../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { faIR } from '@material-ui/core/locale';
import {  makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import {processListPath} from '../../commonConstants/RouteConstant';
import {ProcessGetByIDApi} from '../../commonConstants/ApiConstants';
import {addCommas} from 'persian-tools2';
import Print from '@material-ui/icons/Print';
import checkRequests from '../../component/ErrroHandling';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  divider: {
    height: theme.spacing(2),
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  inputBackGround: {
    background: '#f8f8f8',
    border: '2px solid black'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    padding:theme.spacing(2)
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  rootDiv: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    // position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  }
}));
const theme = createMuiTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#8950FC',
    },
    secondary: {
      main: '#8950FC',
    },
  },

}, faIR);
export const ProcessPDF = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [processDto,setProcessDto] = useState();
  const [processUserDto,setProcessUserDto] = useState();
  const [initialBalance,setInitialBalance] = useState([]);
  const [showPrint,setShowPrint] = useState(true);
  useEffect(() => {
    
     var dbid = localStorage.getItem("processData");
     getProcessInformation(dbid);
    document.getElementById('kt_subheader').remove();
    document.getElementById('kt_quick_user').remove();
    document.getElementById('kt_header').remove();
    document.getElementById('kt_aside').remove();
    document.getElementById('kt_header_mobile').remove();
    document.getElementById('kt_wrapper').style.padding = "0"; 
    document.getElementById('kt_wrapper').querySelector('.container').style.margin ="0px";
  }, []);

  function getProcessInformation(id){
    axios.get(ProcessGetByIDApi+'/'+id).then((res)=>{
      console.log("red ",res.data)
      if(res.data.hasError===false){
        res.data.processDto.title="اطلاعات فرایند : " + res.data.processDto.title
        setProcessDto(res.data.processDto);
        setProcessUserDto(res.data.processUserDtos);
        setInitialBalance(res.data.initialBalanceDtos);
      } 
    }).catch((error)=>{
          
    });
}
function printPDF(){
  setShowPrint(false);
  window.print();

  setTimeout(()=>{
    setShowPrint(true)
  },1000)
}

  return (
    <div  onload="window.print()" id="divcontents" style={{width:'210mm'}}>   
    {
      
      processDto!=undefined?
      <>
      <div className={classes.rootDiv}>
          <ThemeProvider theme={theme}>
            <Paper className={classes.paper}>
              <Row className='marg-t-10' style={{marginRight: '10px',fontSize: '16px',fontWeight: 'bold',marginTop:'20px'}}>
                    <Col md='6' style={{marginTop:'40px'}}>
                      <Form.Label>تاریخ اجرا :  {processDto.issueDatePersian}</Form.Label>
                    </Col>
                    <Col md='6' style={{marginTop:'40px'}}>
                      <Form.Label>کد فرایند :  {processDto.code}</Form.Label>
                    </Col>
              </Row>
              <Form style={{ padding: '21px' }}>
                <Form.Group>
                  <Row className='marg-t-10' style={{borderRadius: '22px',fontSize: '15px',background: '#e4e6ef'}}>
                    <Col md='2' >
                      <Form.Label style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>خروجی نهایی : </Form.Label>
                    </Col>
                    <Col md='3'>
                      <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{processDto.isFinalStep===true?'است':'نیست'} </Form.Label>
                    </Col>
                    <Col md='2' >
                      <Form.Label style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>نوع انجام فرایند </Form.Label>
                    </Col>
                    <Col md='3'>
                      <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{parseInt(processDto.contractorTypeID)===17?'پیمانکار':'داخلی'} </Form.Label>
                    </Col>
                  </Row>
                  

                  <Row className='marg-t-10' style={{marginRight: '10px',fontSize: '16px',fontWeight: 'bold'}}>
                    <Col md='12' style={{marginTop:'20px'}}>
                      <Form.Label>مواد اولیه مصرفی</Form.Label>
                    </Col>
                  </Row>
                  <Row  style={{fontSize: '15px',background:'#8950fc',borderRadius: '22px'}}>
                      <Col md='2' >
                        <Form.Label style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>نام محصول : </Form.Label>
                      </Col>
                      <Col md='2'>
                        <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px',color: 'white'}}>قیمت واحد </Form.Label>
                      </Col>
                      <Col md='2'>
                        <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px',color: 'white'}}> تعداد </Form.Label>
                      </Col>
                      <Col md='2'>
                        <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px',color: 'white'}}> واحد اندازه گیری </Form.Label>
                      </Col>
                  </Row>
                  {
                    initialBalance.map((item,index)=>{
                      return  (
                        <>

                        <Row  style={{fontSize: '15px',background: '#e4e6ef',borderRadius: '22px'}}>
                          <Col md='2'>
                            <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.title} </Form.Label>
                          </Col>
                          <Col md='2'>
                            <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{addCommas(item.price)} ریال</Form.Label>
                          </Col>
                          <Col md='2'>
                            <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.usedCount} </Form.Label>
                          </Col>
                          <Col md='2'>
                            <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.unitName} </Form.Label>
                          </Col>
                        </Row>
                        </>

                      )                  
                    })
                  }
                  <Row>
                      <Col md='4'></Col>
                      <Col md='4'></Col>
                      <Col md='4' style={{marginTop: '20px !important',padding:0 }}>
                            <div style={{background:'#8950fc',borderRadius: '22px'}} class="alert alert-primary" role="alert">قیمت تمام شده : { addCommas(processDto.totalPrice)} ریال</div>
                      </Col>
                  </Row>

                  <Row  style={{marginRight: '10px',fontSize: '16px',fontWeight: 'bold'}}>
                    <Col md='12' >
                      <Form.Label>حقوق/دستمزد</Form.Label>
                    </Col>
                  </Row>
                  {
                    processDto.contractorTypeID===18&&processUserDto!=undefined?
                    <Row  style={{background:'#8950fc',fontSize: '15px',borderRadius: '22px'}}>
                      <Col md='3' >
                        <Form.Label style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>نام کاربر : </Form.Label>
                      </Col>
                      <Col md='3' >
                          <Form.Label style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>روش پرداخت دستمزد : </Form.Label>
                      </Col>
                      <Col md='3' >
                          <Form.Label style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>ساعتی/روزانه: </Form.Label>
                      </Col>
                    </Row>
                    :<></>
                  }

                  {
                    processDto.contractorTypeID===18&&processUserDto!=undefined?
                    processUserDto.map((item,index)=>{
                      return  (
                        <Row  style={{background: '#e4e6ef',fontSize: '15px',borderRadius: '22px'}}>
                        <Col md='3'>
                          <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.userName} </Form.Label>
                        </Col>
                        <Col md='3'>
                          <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.salaryTypeName} </Form.Label>
                        </Col>
                        <Col md='3'>
                          <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{addCommas(item.salaryPerUnit)} ریال</Form.Label>
                        </Col>
                      </Row>
                      )                  
                    })
                  :
                    <>
                      <Row  style={{fontSize: '15px',background: '#e4e6ef',borderRadius: '22px'}}>
                        <Col md='2' >
                          <Form.Label style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>نام پیمانکار : </Form.Label>
                        </Col>
                        <Col md='2' >
                          <Form.Label style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>{processDto.contractorFullName} </Form.Label>
                        </Col>
                      </Row>
                    
                    </>
                  }



                  <Row className='marg-t-10' style={{background: '#e4e6ef',borderRadius: '22px'}}>
                    <Col md='2' >
                      <Form.Label style={{fontSize: '15px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>توضیحات </Form.Label>
                    </Col>
                    <Col md='12' style={{marginRight: '31px'}}>
                      <Form.Label style={{fontSize: '15px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{processDto.description} </Form.Label>
                    </Col>
                  </Row>
                  <Row style={{background: '#e4e6ef'}}>

                  </Row>
                </Form.Group>
              </Form>
            </Paper>
            </ThemeProvider>
        <Toaster position={toastConfig.position} />
      </div>
                  {
                    showPrint?
                    <div id="printBtn" className="row" style={{marginTop:'100px'}}>
                        <div className='category-add-footer' style={{width:'100%',right:0}}>
                          <Print style={{color: '#6610f2'}} onClick={printPDF}></Print>
                        </div>
                    </div>
                    :<></>
                  }


      </>
      :
      <></>
      
      }
    </div>

  );
}



export default checkRequests(ProcessPDF,axios);