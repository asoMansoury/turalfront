import React,{useEffect,useState} from 'react';
import DropDown from '../../component/UI/DropDown';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { CardComponent } from '../../component/UI/CardComponent';
import toast, { Toaster } from 'react-hot-toast';
import { SideBarConfig, toastConfig } from '../../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';

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
      flexGrow: 1,
      marginBottom:'130px'
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
  
export const WastageAdd = (props)=>{
    const classes = useStyles();
    const [initialBalance,setInitialBalance] = useState([]);
    const [model,setModel]=useState([]);
    const [,setCounter]=useState(0);

    function getData(){
        return model;
    }
    function countKeyUp(e){
        let indexItem = e.target.getAttribute("indexItem");
        var tmpArray = model;
        var currentItem = tmpArray[indexItem];
        var count = parseInt(e.target.value);
        if(count.toString()==='NaN'){
            e.target.value=0;
            count=0;
        }else{
            e.target.value=count;
        }
        if(parseInt(count)>parseInt(currentItem.usedCount)){
          count = currentItem.usedCount;
          e.target.value = count;
        }

        currentItem.count = count;
        tmpArray[indexItem] =currentItem;
        
        setModel((prevState)=>tmpArray);
        props.wastageModelHandler(tmpArray);
        setCounter(i=>i+1);

    }
    useEffect(()=>{
        if(props.processInfo!=undefined){
            setInitialBalance(props.processInfo.initialBalanceDtos);
            setModel(props.processInfo.initialBalanceDtos);
            props.wastageModelHandler(props.processInfo.initialBalanceDtos);
        }
        
    },[props.processInfo])
    return  (     
    <div className={classes.rootDiv}>
        <div className="row">
        <div className="col-md-12">
            <CardComponent
            beforeCodeTitle="ورود ضایعات"
            codeBlockHeight="400px">
            <Row>
                <Col md='2' style={{marginTop: '20px !important' }}>
                    <Form.Label className='custom-label bold'>نوع مواد اولیه</Form.Label>
                </Col>
                <Col md='4' style={{marginTop: '20px !important' }}>
                    <Form.Label className='custom-label bold'>تعداد ضایعات</Form.Label>
                </Col>
                <Col md='2' style={{marginTop: '20px !important' }}>
                    <Form.Label className='custom-label bold'>تعداد مورد استفاده</Form.Label>
                </Col>
                <Col md='2' style={{marginTop: '20px !important' }}>
                    <Form.Label className='custom-label bold'>واحد اندازه گیری</Form.Label>
                </Col>
            </Row>
            {
                model.map((item,index)=>{
                    return (
                        <Row key={index}>
                            <Col md='2' >
                                <Form.Control
                                    value={item.title}
                                    disabled='disabled'
                                    className='custom-label marg-t-20 bold'  ></Form.Control>
                            </Col>
                                <Col md='4' style={{marginTop: '20px !important' }}>
                                <Form.Control
                                value={item.count}
                                // onChange={(e)=>item.count=e.target.value}
                                onChange={countKeyUp}
                                indexItem = {index}
                                className='custom-label marg-t-20 bold' placeholder="مقدار ضایعات" ></Form.Control>
                             </Col>
                             <Col md='2' >
                                <Form.Control
                                    value={item.usedCount}
                                    disabled='disabled'
                                    className='custom-label marg-t-20 bold'  ></Form.Control>
                            </Col>
                            <Col md='2' >
                                <Form.Control
                                    value={item.unitName}
                                    disabled='disabled'
                                    className='custom-label marg-t-20 bold'  ></Form.Control>
                            </Col>
                            
                        </Row>
                    )
                })
            }

            </CardComponent>
        </div>
        </div>

     <Toaster position={toastConfig.position} />
     </div>
)
}


export default WastageAdd;