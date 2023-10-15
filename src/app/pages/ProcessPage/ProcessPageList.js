import React, { useEffect } from 'react';
import CategoryModalEdit from '../Category/CategoryModalEdit';
import Skeleton from 'react-loading-skeleton';
import editImage from '../pulseDesignImages/edit1.svg';


import {Form, Row, Col,Button} from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import { faIR } from '@material-ui/core/locale';
import Checkbox from '@material-ui/core/Checkbox';
import { Preloader, Oval } from 'react-preloader-icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from '../component/UI/EnhancedTableHead';
import { tableConfig,toastConfig } from '../Config';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { connect } from "react-redux";
import {ProcessSearchApi} from '../commonConstants/ApiConstants';
import { Show_add, Show_edit, Is_not_edited, Is_not_deleted_one, Is_not_deleted_group, Is_not_added } from '../_redux/Actions/processActions';
import { useDispatch, useSelector } from "react-redux";
import Print from '@material-ui/icons/Print'
import ProcessModalDeleteGroup from './ProcessModalDeleteGroup';
import ProcessModalDelete from './ProcessModalDelete';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import { useHistory } from 'react-router-dom';
import {processEditPath,processPath,ProcessPDFPath} from '../commonConstants/RouteConstant';
import checkRequests from '../component/ErrroHandling';
const headRows = [
    { id: 'Id', numeric: false, disablePadding: true, label: 'شناسه' },
    { id: 'Code', numeric: false, disablePadding: true, label: 'کد' },
    { id: 'Title', numeric: false, disablePadding: true, label: 'عنوان' },
    { id: 'ProcessDefinitionTitle', numeric: false, disablePadding: true, label: 'نوع فرایند' },
    { id: 'IssueDate', numeric: false, disablePadding: true, label: 'تاریخ اجرا' },
    { id: 'IsFinalStep', numeric: false, disablePadding: true, label: 'خروجی نهایی' },
    { id: 'ContractorTypeName', numeric: false, disablePadding: true, label: 'روش انجام' },
    { id: 'Description', numeric: false, disablePadding: true, label: 'توضیحات' },
    { id: 'createDate', numeric: false, disablePadding: false, label: 'تاریخ ایجاد' },
    { id: 'operation', numeric: false, disablePadding: true, label: 'عملگرها' },
  ];
  
  function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }
  
  function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
  }
  

  const useToolbarStyles = makeStyles(theme => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: '#8950FC',
          backgroundColor: '#f3f6f9',
        }
        : {
          color: '#8950FC',
          backgroundColor: '#f3f6f9',
        },
    spacer: {
      flex: '1 1 100%',
    },
    title: {
      flex: '0 0 auto',
    },
  }));
  
  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
    const addCategoryShow = props.onAddClick;
    const controllerPersmission = useSelector(state=>state.tokenReducer.TokenObject.userInfo.controllerDtos);
    const actionsPermission =useSelector(state=>state.tokenReducer.TokenObject.userInfo.actionDtos);
    return (
      <>
      {
        controllerPersmission!=undefined&&actionsPermission!=undefined?
        <Toolbar
            className={clsx(classes.root, {
              [classes.highlight]: numSelected > 0,
            })}
          >
            <div className={classes.title}>
              {numSelected > 0 ? (
                <Typography color="inherit" variant="subtitle1">
                  {numSelected} مورد انتخاب شده است
                </Typography>
              ) : (
                  <Typography variant="h6" id="tableTitle">
                    <span className='tabelhead'>لیست فرایندها</span>
                  </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
              {numSelected > 0 ? (
               actionsPermission.find(z=>z.id==74)!==undefined? <ProcessModalDeleteGroup selected={props.selected} />:<></>
              )
                :
                (actionsPermission.find(z=>z.id==73)!==undefined?<Button onClick={addCategoryShow} className='btn-height2 create-btn' variant="info">افزودن فرایند</Button>:<></>)}
            </div>
          </Toolbar>
        
        :<></>

      }
      </>

    );
  };

  const useStyles = makeStyles(theme => ({
    divider: {
      height: theme.spacing(2),
    },
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    tableWrapper: {
      overflowX: 'auto',
    },cell_short: {
      fontSize: "12px !important"
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


  
  export function ProcessPageList(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isLoading, setIsLoading] = React.useState(true);
    const [inSrch, setInSrch] = React.useState(false);
    const [count, setCount] = React.useState(0);
    const [isEditingOrDeletingOneOrAdding, setIsEditingOrDeletingOneOrAdding] = React.useState(false);
    const [srchTitle, setSrchTitle] = React.useState('');
    const reduxProps = useSelector(state=>state.stockroomReducer);
    const [isDeletingGroup, setIsDeletingGroup] = React.useState(false);
    const history = useHistory();
    const notifyError = () => toast('خطا در ارتباط با سرور. اطلاعات بارگزاری نشد.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    const controllerPersmission = useSelector(state=>state.tokenReducer.TokenObject.userInfo.controllerDtos);
    const actionsPermission =useSelector(state=>state.tokenReducer.TokenObject.userInfo.actionDtos);
    function createData(id,title,code,processDefinitionTitle,issueDate,isFinalStep,contractorTypeName, description,createdDate,contractorTypeID,processDefinitionID,contractorFullName,userContractorID) {
      return {id,title,code,processDefinitionTitle,issueDate,isFinalStep,contractorTypeName, description,createdDate,contractorTypeID ,processDefinitionID,contractorFullName,userContractorID};
    }
    const setFakeData = (count) => {
      const temp = [];
      for (let i = 0; i < count; i++) {
        temp.push({ id: i });
      }
      setRows(temp);
    }
    useEffect(() => {
      setFakeData(tableConfig.rowsPerPageDefault);
      getData(tableConfig.rowsPerPageDefault, 1, '', false, false, false);
    }, []);

    useEffect(() => {
      if (reduxProps.Is_Edited || reduxProps.Is_Deleted_One || reduxProps.Is_Added) {
        setIsEditingOrDeletingOneOrAdding(true);
        getData(rowsPerPage, page + 1, srchTitle, false, true, false);
        props.notEdited();
        props.notDeletedOne();
        props.notAdded();
        if (reduxProps.Is_Deleted_One)
          setSelected([]);
      }
      else if (reduxProps.Is_Deleted_Group) {
        setIsDeletingGroup(true);
        setIsLoading(true);
        getData(rowsPerPage, 1, '', false, false, true);
        props.notDeletedGroup();
        setPage(0);
        setSelected([]);
      }
    }, [reduxProps]);


    function setKeyUpSrch(e) {
      if (isEditingOrDeletingOneOrAdding)
        return;
      setSrchTitle(e.target.value);
      setInSrch(true);
      setPage(0);
      getData(rowsPerPage, 1, e.target.value, true, false, false);
    }
    
    function handleRequestSort(event, property) {
      const isDesc = orderBy === property && order === 'desc';
      setOrder(isDesc ? 'asc' : 'desc');
      setOrderBy(property);
    }
  
    function handleSelectAllClick(event) {
      if (event.target.checked) {
        const newSelecteds = rows.map(n => n.id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    }
  
    function handleClick(event, id) {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
  
      setSelected(newSelected);
    }

    function handleChangePage(event, newPage) {
      if (isLoading)
      return;
      setFakeData(count);
      setIsLoading(true);
      setPage(newPage);
      getData(rowsPerPage, newPage + 1, srchTitle, false, false, false);
    }
  
    function handleChangeRowsPerPage(event) {
      if (isLoading)
      return;
      setFakeData(count);
      setIsLoading(true);
      setRowsPerPage(event.target.value);
      setPage(0);
      getData(event.target.value, 1, srchTitle, false, false, false);
    }

    function showAddSlider() {
      // dispatch(Show_add());
      history.push({
        pathname:processPath
      });
    }
    function editShowSlider(e) {
      let id = e.currentTarget.getAttribute('dbid');
      let title = e.currentTarget.getAttribute('title');
      let desc = e.currentTarget.getAttribute('description');
      let row = e.currentTarget.getAttribute('rowData');
      history.push({
        pathname:processEditPath,
        state:{data:JSON.parse(row)}
      });
    }

    function printPdf(e) {
      let id = e.currentTarget.getAttribute('dbid');
      localStorage.setItem("processData", id);
      window.open("/#/process/ProcessPDF", "_blank") //to open new page
    }

    

    const isSelected = id => selected.indexOf(id) !== -1;
  
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
    const getData = (nRows, page, title, inSearch, iseditingORdeletingORadding, isdeletinggroup) => {
      let generateApi = ProcessSearchApi+'?Title=' + title +'&Page=' + page + '&Row=' + nRows+'&sort=date:desc';
      axios.get(generateApi)
        .then(res=>{
          let result = res.data.processDtos;
          setCount(res.data.numberRows);
          let temp = [];
          for (let i = 0; i < nRows * (page - 1); i++) {
            temp.push({});
          }
          result.forEach(item => {
            temp.push(createData(item.id,item.title,item.code,item.processDefinitionTitle,item.issueDate,item.isFinalStep,item.contractorTypeName,item.description,item.createdDate,item.contractorTypeID,item.processDefinitionID,item.contractorFullName,item.userContractorID))
          });
          setRows(temp);
          setIsLoading(false);
          
          
        if (inSearch) {
          setTimeout(() => {
            setInSrch(false);
          }, 1000);
        }
        if (iseditingORdeletingORadding) {
          setTimeout(() => {
            setIsEditingOrDeletingOneOrAdding(false);
          }, 1000);
        }
        if (isdeletinggroup) {
          setTimeout(() => {
            setIsDeletingGroup(false);
          }, 1000);
        }
        })
        .catch(error => {
          setIsLoading(true);
          setIsEditingOrDeletingOneOrAdding(false);
          setInSrch(false);
          setIsDeletingGroup(false);
        });
    }

    return (
      <>
      {
        controllerPersmission!=undefined&&actionsPermission!=undefined?
          <div className={classes.root} >
          <ThemeProvider theme={theme}>
            <Paper className={classes.paper}>
              <EnhancedTableToolbar numSelected={selected.length} selected={selected}   onAddClick={showAddSlider}/>
              {
                actionsPermission.find(z=>z.id==77)!==undefined?
                <Row className='marg-t-10'>
                  <Col md='4' className='marg-r-15'>
                    <Form.Control onKeyUp={setKeyUpSrch} className='form-control-custom' type="Name" aria-required={true} placeholder="جست و جو ..." />
                  </Col>
                  <Col md='4'>
                    <div className='preloader-cat-list' style={{ display: (inSrch || isEditingOrDeletingOneOrAdding) ? 'flex' : 'none' }}>
                      <Preloader
                        use={Oval}
                        size={30}
                        strokeWidth={8}
                        strokeColor="#8950FC"
                        duration={500}
                      />
                    </div>
                  </Col>
                </Row>
                :<></>
              }

              <div className={classes.tableWrapper}>
                <Table
                  className={classes.table + ' marg-t-10'}
                  aria-labelledby="tableTitle"
                  size={dense ? 'small' : 'medium'}
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                    headRows={headRows}
                  />
                  <TableBody>
                    {stableSort(rows, getSorting(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <>
                            <TableRow
                              hover
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  onClick={event => handleClick(event, row.id)}
                                  checked={isItemSelected}
                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              </TableCell>
                              <TableCell className={classes.cell_short} align="center">
                                <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                                <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                  {row.id}
                                </div>
                              </TableCell>
                              <TableCell className={classes.cell_short} align="center">
                                <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                                <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                  {row.code}
                                </div>
                              </TableCell>
                              <TableCell className={classes.cell_short} align="center">
                                <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                                <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                  {row.title}
                                </div>
                              </TableCell>
                              <TableCell className={classes.cell_short} align="center">
                                <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                                <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                  {row.processDefinitionTitle}
                                </div>
                              </TableCell>
                              <TableCell className={classes.cell_short} align="center">
                                <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                                <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                  {row.issueDate}
                                </div>
                              </TableCell>
                              <TableCell className={classes.cell_short} align="center">
                                <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                                <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                  {row.isFinalStep===true?<span>بلی</span>:<span>خیر</span>}
                                </div>
                              </TableCell>
                              <TableCell  className={classes.cell_short} align="center">
                                <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                                <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                  {row.contractorTypeName}
                                </div>
                              </TableCell>
                              <TableCell className={classes.cell_short} align="center">
                                <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                                <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                  {row.description === '' ? <span className='pointer label label-lg label-light-danger label-inline btn-height'>فاقد توضیحات</span> : <CategoryModalEdit dbid={row.id} title="مشاهده توضیحات" name={row.title} text={row.description} />}
                                </div>
                              </TableCell>
                              <TableCell className={classes.cell_short} align="center">
                                <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                  <div className='create-date'>{row.createdDate}</div>
                                </div>
                                <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                              </TableCell>
                              
                              <TableCell className={classes.cell_short} align="center">
                                <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                                <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                  {
                                      actionsPermission.find(z=>z.id==70)!==undefined?
                                      <div className="delete-img-con btn-for-select" rowData={JSON.stringify(row)} dbid={row.id}  title={row.title} description={row.description} onClick={editShowSlider} ><img className='edit-img btn-for-select' src={editImage} /></div>
                                    :<></>
                                  }
                                  <div className="delete-img-con btn-for-select"  dbid={row.id}   onClick={printPdf} ><Print style={{color: '#6610f2'}}></Print> </div>
                                  {
                                      actionsPermission.find(z=>z.id==74)!==undefined?
                                        <ProcessModalDelete dbid={row.id} name={row.title} />
                                      :<></>
                                  }
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 49 * emptyRows, display: 'none' }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <TablePagination className='MuiTablePagination-root MuiTypography-root'
                rowsPerPageOptions={tableConfig.rowsPerPageOpt}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
          </ThemeProvider>
          <Toaster position={toastConfig.position} />
          </div>
        :<></>
      }
      </>

    );
  }



const mapStateToProps = (state => {
    return {
      Is_Edited: state.process.Is_Edited,
      Is_Deleted_One: state.process.Is_Deleted_One,
      Is_Deleted_Group: state.process.Is_Deleted_Group,
      Is_Added: state.process.Is_Added,
    };
});
  
const mapDispatchToProps = (dispatch) => ({
  showAddFunction: () => dispatch(Show_add()),
  showEditFunction: (obj) => dispatch(Show_edit(obj)),
  notEdited: () => dispatch(Is_not_edited()),
  notDeletedOne: () => dispatch(Is_not_deleted_one()),
  notDeletedGroup: () => dispatch(Is_not_deleted_group()),
  notAdded: () => dispatch(Is_not_added()),
});

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(ProcessPageList,axios));