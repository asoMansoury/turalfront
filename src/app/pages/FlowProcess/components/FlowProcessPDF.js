import React, { useEffect, useRef, useState } from 'react';
import { SideBarConfig, toastConfig } from '../../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {  makeStyles } from '@material-ui/core/styles';
import { CardComponentReport } from '../../component/UI/CardComponentReport'
import { useHistory } from 'react-router-dom';
import moment from 'moment-jalaali';
import {DatePickerComponent} from '../../component/DatePickerComponent/DatePickerComponent';
import {flowProcessListPath} from '../../commonConstants/RouteConstant';
import {FlowProcessGetByIDApi} from '../../commonConstants/ApiConstants';
import {addCommas} from 'persian-tools2'
import Print from '@material-ui/icons/Print'
import { faIR } from '@material-ui/core/locale';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import checkRequests from '../../component/ErrroHandling';

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
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  rootDiv: {
    flexGrow: 0,
  },
  paper: {
    // position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
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
  },
  fontLabel:{
    fontSize: '15px'
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
export const FlowProcessPDF = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [processDto,setProcessDto] = useState();
  const [initialBalance,setInitialBalance] = useState();
  const [flowProcessDto,setFlowProcessDto] = useState();
  const [userSalaryDtos,setUserSalaryDtos] = useState([]);
  const [wastagesDto,setWastagesDto] = useState([]);
  const [stockRoomInitialBalanceDtos,setStockRoomInitialBalanceDtos] = useState([]);
  const [showPrint,setShowPrint] = useState(true);
  const options = {
    orientation: 'landscape',
    unit: 'in',
    format: [4,2]
};
  const pdfRef = useRef();
  useEffect(() => {
    var dbid = localStorage.getItem("flowProcessData");
    getFlowProcessInformation(dbid);
    document.getElementById('kt_subheader').remove();
    document.getElementById('kt_quick_user').remove();
    document.getElementById('kt_header').remove();
    document.getElementById('kt_aside').remove();
    document.getElementById('kt_header_mobile').remove();
    document.getElementById('kt_wrapper').style.padding = "0"; 
    document.getElementById('kt_wrapper').querySelector('.container').style.margin ="0px";
  }, []);

  function getFlowProcessInformation(id){
    var generatedApi = FlowProcessGetByIDApi+id;
    axios.get(generatedApi).then((res)=>{
      if(res.data.hasError===false){
        setInitialBalance(res.data.flowProcessDto.initialBalanceDto);
        setFlowProcessDto(res.data.flowProcessDto);
        setUserSalaryDtos(res.data.flowProcessDto.userSalaryDtos);
        setWastagesDto(res.data.flowProcessDto.wastagesDto);
        setProcessDto(res.data.flowProcessDto.processDto);
        setStockRoomInitialBalanceDtos(res.data.flowProcessDto.stockRoom_InitialBalanceDtos);
        console.log(res.data.flowProcessDto.initialBalanceDto)
      } 
    })
  }

  function generatePDF(){
    setShowPrint(false);
    window.print();
  
    setTimeout(()=>{
      setShowPrint(true)
    },1000)
  }
  return (
    <>
    <div  style={{width:'210mm',padding:'0 !important'}}>
        {
        flowProcessDto!=undefined&&processDto!=undefined?
            <>
          <div className={classes.rootDiv}>

            <ThemeProvider theme={theme}>
              <Paper className={classes.paper}>
                    <Row  style={{marginRight: '10px',fontSize: '19px',fontWeight: 'bold' }}>
                          <Col md='6'>
                            <Form.Label className={classes.fontLabel} style={{textAlign: 'right',marginTop:'10px'}}>عنوان خروجی : {flowProcessDto.title}</Form.Label>
                          </Col>
                          <Col md='6' style={{marginTop:'10px'}}>
                            <Form.Label className={classes.fontLabel} >تاریخ ایجاد :  {flowProcessDto.createdDate}</Form.Label>
                          </Col>
                    </Row>
                    <Row  style={{marginRight: '10px',fontSize: '19px',fontWeight: 'bold' }}>
                          <Col md='6' style={{marginTop:'10px'}}>
                            <Form.Label className={classes.fontLabel} >فرایند انتخابی:  {processDto.title}</Form.Label>
                          </Col>
                          <Col md='6' style={{marginTop:'10px'}}>
                            <Form.Label className={classes.fontLabel} >کد خروجی :  {flowProcessDto.code}</Form.Label>
                          </Col>
                    </Row>
                    <Form style={{ padding: '21px',paddingTop:'0px' }}>
                      <Form.Group>

                    <Row className='marg-t-10' style={{marginRight: '5px',fontSize: '16px',fontWeight: 'bold'}}>
                      <Col md='12' style={{marginTop:'5px'}}>
                        <Form.Label>مواد اولیه مصرفی</Form.Label>
                      </Col>
                    </Row>
                      <Row  style={{background: '#8950fc',borderRadius: '22px'}}>
                              <Col md='3' >
                                <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>عنوان </Form.Label>
                              </Col>
                              <Col md='2' >
                                  <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>تعداد استفاده </Form.Label>
                              </Col>
                              <Col md='2' >
                                  <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}> تعداد پرتی</Form.Label>
                              </Col>
                              <Col md='2' >
                                  <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>واحد اندازه گیری  </Form.Label>
                              </Col>
                              <Col md='3' >
                                  <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>قیمت هر واحد(ریال)  </Form.Label>
                              </Col>

                          </Row>
                        {
                          wastagesDto.map((item,index)=>{
                            console.log("wastage",item)
                            return  (
                              <Row  style={{background: '#e4e6ef',borderRadius: '22px'}}>
                              <Col md='3'>
                                <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.title} </Form.Label>
                              </Col>
                              <Col md='2'>
                                <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.usedCount} </Form.Label>
                              </Col>
                              <Col md='2'>
                                <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.count} </Form.Label>
                              </Col>
                              <Col md='2'>
                                <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.unitName} </Form.Label>
                              </Col>
                              <Col md='3'>
                                <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{addCommas(item.price)} </Form.Label>
                              </Col>

                            </Row>
                            )                  
                          })
                        }

                      <Row  style={{marginRight: '5px',fontSize: '16px',fontWeight: 'bold'}}>
                      <Col md='12' style={{marginTop:'5px'}}>
                        <Form.Label>حقوق/دستمزد</Form.Label>
                      </Col>
                    </Row>
                        {
                          processDto.contractorTypeID===17?
                          <Row  style={{borderRadius: '22px',background: '#e4e6ef'}}>
                          <Col md='2' >
                            <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>عنوان پیمانکار :</Form.Label>
                          </Col>
                          <Col md='3'>
                            <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{processDto.contractorFullName} </Form.Label>
                          </Col>
                          <Col md='2' >
                            <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}> اجرت پیمانکار :</Form.Label>
                          </Col>
                          <Col md='3'>
                            <Form.Label style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{addCommas(flowProcessDto.hire)} ریال</Form.Label>
                          </Col>
                        </Row>
                        :
                        <>
                        <Row  style={{background: '#8950fc',borderRadius: '22px'}}>
                        <Col md='2' >
                          <Form.Label style={{fontSize: '14px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>نام کاربر </Form.Label>
                        </Col>
                        <Col md='2' >
                            <Form.Label style={{fontSize: '14px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>روش پرداخت </Form.Label>
                        </Col>
                        <Col md='3' >
                            <Form.Label style={{fontSize: '14px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}> دستمزد ساعت/روزانه</Form.Label>
                        </Col>
                        <Col md='2' >
                            <Form.Label style={{fontSize: '14px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>ساعت/روز کار  </Form.Label>
                        </Col>
                        <Col md='3' >
                            <Form.Label style={{fontSize: '14px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>مجموع دستمزد پرداختی</Form.Label>
                        </Col>
                      </Row>
                      {
                            userSalaryDtos.map((item,index)=>{
                            return  (
                              <Row  style={{background: '#e4e6ef',borderRadius: '22px'}}>
                              <Col md='2'>
                                <Form.Label style={{fontSize: '14px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.userName} </Form.Label>
                              </Col>
                              <Col md='2'>
                                <Form.Label style={{fontSize: '14px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.salaryTypeName} </Form.Label>
                              </Col>
                              <Col md='3'>
                                <Form.Label style={{fontSize: '14px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{addCommas(parseInt(item.salary))} ریال </Form.Label>
                              </Col>
                              <Col md='2'>
                                <Form.Label style={{fontSize: '14px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.sumHours} </Form.Label>
                              </Col>
                              <Col md='3'>
                                <Form.Label style={{fontSize: '14px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{addCommas((parseInt(item.salary)*parseInt(item.sumHours)))} ریال </Form.Label>
                              </Col>
                            </Row>
                            )                  
                          })
                      }
                        <Row>
                            <Col md='4'></Col>
                            <Col md='4'>
                              
                            </Col>
                            <Col md='4' style={{marginTop: '20px !important',padding:0  }}>
                                  <div style={{background:'#8950fc',borderRadius: '22px'}} class="alert alert-primary" role="alert">دستمزد پرداختی    : { addCommas(flowProcessDto.totalPrice)} ریال</div>
                            </Col>
                        </Row>
                        </>

                        }

                  <Row  style={{marginRight: '5px',fontSize: '16px',fontWeight: 'bold'}}>
                      <Col md='12' style={{marginTop:'5px'}}>
                        <Form.Label>خروجی فرایند</Form.Label>
                      </Col>
                    </Row>
                        {
                          flowProcessDto.isNewMaterial===true?
                              <>
                              <Row  style={{background:'#8950fc',borderRadius: '22px'}}>
                                  <Col md='2' >
                                    <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>عنوان  </Form.Label>
                                  </Col>
                                  <Col md='2' >
                                      <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>تعداد</Form.Label>
                                  </Col>
                                  <Col md='2' >
                                      <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>واحد</Form.Label>
                                  </Col>
                                  <Col md='4' >
                                      <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>قیمت واحد </Form.Label>
                                  </Col>

                              </Row>
                              <Row  style={{background: '#e4e6ef',borderRadius: '22px'}}>
                                  <Col md='2'>
                                    <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{initialBalance.title} </Form.Label>
                                  </Col>
                                  <Col md='2'>
                                    <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{initialBalance.count} </Form.Label>
                                  </Col>
                                  <Col md='2'>
                                    <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{initialBalance.unitName} </Form.Label>
                                  </Col>
                                  <Col md='4'>
                                    <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{addCommas(initialBalance.price)} ریال</Form.Label>
                                  </Col>

                                </Row>
                              </>             
                              :<></>
                        }
                        {
                          flowProcessDto.isNewMaterial===false?
                          <>
                            <Row  style={{background:'#8950fc',borderRadius: '22px'}}>
                              <Col md='2' >
                                <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>انبار </Form.Label>
                              </Col>
                              <Col md='2' >
                                  <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>محصول </Form.Label>
                              </Col>
                              <Col md='2' >
                                  <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}> تولیدی</Form.Label>
                              </Col>
                              <Col md='2' >
                                  <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>موجودی فعلی </Form.Label>
                              </Col>
                              <Col md='2' >
                                  <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}> قیمت </Form.Label>
                              </Col>
                          </Row>
                          {
                                stockRoomInitialBalanceDtos.map((item,index)=>{
                                return  (
                                  <Row  style={{background: '#e4e6ef',borderRadius: '22px'}}>
                                  <Col md='2'>
                                    <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.title} </Form.Label>
                                  </Col>
                                  <Col md='2'>
                                    <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.initialTitle} </Form.Label>
                                  </Col>
                                  <Col md='2'>
                                    <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.addedCount} </Form.Label>
                                  </Col>
                                  <Col md='2'>
                                    <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.currentCount} </Form.Label>
                                  </Col>
                                  <Col md='2'>
                                    <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{addCommas(item.pricePerUnit)} ریال </Form.Label>
                                  </Col>
                                </Row>
                                )                  
                              })
                          }
                            <Row>
                                <Col md='4'></Col>
                                <Col md='4'></Col>
                                <Col md='4' style={{marginTop: '20px !important' ,padding:0 }}>
                                      <div style={{background:'#8950fc',borderRadius: '22px'}} class="alert alert-primary" role="alert">هزینه مواد اولیه    : { addCommas(processDto.totalPrice)} ریال</div>
                                </Col>
                            </Row>
                          </>
                            :
                            <></>
                        }



                      <Row>
                            <Col md='4'></Col>
                            <Col md='2'></Col>
                            <Col md='6' style={{marginTop: '20px !important',padding:0 }}>
                                  <div style={{background:'#8950fc',borderRadius: '22px'}} class="alert alert-primary" role="alert">قیمت تمام شده خروجی : { addCommas(flowProcessDto.finalCost)} ریال</div>
                            </Col>
                        </Row>

                        <Row className='marg-t-10' style={{background: '#e4e6ef',borderRadius: '22px'}}>
                          <Col md='2' >
                            <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>توضیحات </Form.Label>
                          </Col>
                          <Col md='12' style={{marginRight: '31px'}}>
                            <Form.Label className={classes.fontLabel}  style={{fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{flowProcessDto.description} </Form.Label>
                          </Col>
                        </Row>
                      </Form.Group>
                    </Form>
              <Toaster position={toastConfig.position} />
              </Paper>
            </ThemeProvider>
            {
              showPrint?
              <div className="row" style={{marginTop:'100px'}}>
                  <div className='category-add-footer' style={{width:'100%',right:0}}>
                      <Print style={{color: '#6610f2'}} onClick={generatePDF}></Print>
                  </div>
              </div>
              :<></>
            }

                            
          </div>
            </>
          
            :
            <></>
        }
    </div>
    </>


  );
}



export default checkRequests(FlowProcessPDF,axios)