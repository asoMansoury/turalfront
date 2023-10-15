import React, { useEffect } from 'react';
import CategoryModalDelete from './UsersModalDelete';
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
import BuildIcon from '@material-ui/icons/Build';
import { tableConfig,toastConfig } from '../Config';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { connect } from "react-redux";
import {AdminUserSearchApi} from '../commonConstants/ApiConstants';
import { Show_add, Show_edit, Is_not_edited, Is_not_deleted_one, Is_not_deleted_group, Is_not_added } from '../_redux/Actions/usersActions';
import { useDispatch, useSelector } from "react-redux";
import UsersModalDeleteGroup from './UsersModalDeleteGroup';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import { useHistory } from 'react-router-dom';
import { usersGranPath } from '../commonConstants/RouteConstant';
import checkRequests from '../component/ErrroHandling';
import { addCommas } from 'persian-tools2';

const headRows = [
  { id: 'id', numeric: true, disablePadding: true, label: 'شناسه' },
  { id: 'fullName', numeric: false, disablePadding: true, label: 'نام و نام خانوادگی' },
  { id: 'userName', numeric: true, disablePadding: false, label: 'نام کاربری' },
  { id: 'mobile', numeric: true, disablePadding: false, label: 'شماره تلفن' },
  { id: 'email', numeric: true, disablePadding: false, label: 'ایمیل' },
  { id: 'description', numeric: false, disablePadding: false, label: 'روش پرداخت' },
  { id: 'description', numeric: false, disablePadding: false, label: 'دستمزد(ریال)' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'تاریخ ایجاد' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'عملگر ها' },
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
                <span className='tabelhead'>لیست کاربران</span>
              </Typography>
            )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
           actionsPermission.find(z=>z.id==7)!==undefined? <UsersModalDeleteGroup selected={props.selected} />:<></>
          )
            :
            actionsPermission.find(z=>z.id==5)!==undefined? (<Button onClick={addCategoryShow} className='btn-height2 create-btn' variant="info">افزودن کاربر</Button>):<></>
          }
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


  
  export function UsersList(props) {
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
    const dispatch = useDispatch();
    const controllerPersmission = useSelector(state=>state.tokenReducer.TokenObject.userInfo.controllerDtos);
    const actionsPermission =useSelector(state=>state.tokenReducer.TokenObject.userInfo.actionDtos);
    const notifyError = () => toast('خطا در ارتباط با سرور. اطلاعات بارگزاری نشد.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    function createData(id, fullName, userName,email,mobile, description,createdDate,name,family,salaryTypeFK_ID,employeerTypeFK_ID,salaryPerHour,salaryPerMonth,maxWorkPerHour,maxWorkPerDay) {
      return {  fullName, userName,email,mobile,createdDate, description,id,name,family,salaryTypeFK_ID,employeerTypeFK_ID,salaryPerHour, salaryPerMonth,maxWorkPerHour,maxWorkPerDay };
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
      dispatch(Show_add());
    }
    function grantUser(e){
      let id = e.currentTarget.getAttribute('dbid');
      history.push({
        pathname:usersGranPath,
        state:{data:id}
      });
    }
    function editShowSlider(e) {
      let id = e.currentTarget.getAttribute('dbid');
      let name = e.currentTarget.getAttribute('name');
      let family = e.currentTarget.getAttribute('family');
      let email = e.currentTarget.getAttribute('email');
      let fullName = e.currentTarget.getAttribute('fullName');
      let userName = e.currentTarget.getAttribute('userName');
      let description = e.currentTarget.getAttribute('description');
      let mobile = e.currentTarget.getAttribute('mobile');
      let salaryID = e.currentTarget.getAttribute('salaryID');
      let emplooyerID = e.currentTarget.getAttribute('emplooyerID');
      let salaryPerHour =e.currentTarget.getAttribute('salaryPerHour');
      let salaryPerMonth =e.currentTarget.getAttribute('salaryPerMonth');
      let maxWorkPerDay =e.currentTarget.getAttribute('maxWorkPerDay');
      let maxWorkPerHour =e.currentTarget.getAttribute('maxWorkPerHour');
      let salaryPayment = 0;
      if(parseInt(salaryID)===14) 
        salaryPayment = salaryPerHour;
      else
        salaryPayment= salaryPerMonth;
      dispatch(Show_edit({
        id:id,
        name:name,
        family:family,
        email:email,
        fullName:fullName,
        userName:userName,
        description:description,
        mobile:mobile,
        maxWorkPerDay:maxWorkPerDay,
        maxWorkPerHour:maxWorkPerHour,
        salaryID:parseInt(salaryID),
        emplooyerID:emplooyerID,
        salaryPayment:salaryPayment
      }));
    }

    const isSelected = id => selected.indexOf(id) !== -1;
  
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
    const getData = (nRows, page, title, inSearch, iseditingORdeletingORadding, isdeletinggroup) => {
      let generateApi = AdminUserSearchApi+'?Title=' + title +'&Page=' + page + '&Row=' + nRows+'&sort=date:desc';
      axios.get(generateApi)
        .then(res=>{
          let result = res.data.userDtos;

          setCount(res.data.numberRows);
          let temp = [];
          for (let i = 0; i < nRows * (page - 1); i++) {
            temp.push({});
          }
          result.forEach(item => {
            temp.push(createData(item.id,item.fullName,
            item.userName,
            item.email,
            item.phoneNumber,
            item.description==null?'':item.description,
            item.createdDate,
            item.firstName,
            item.lastName,
            item.salaryTypeFK_ID,
            item.employeerTypeFK_ID,
            item.salaryPerHour,
            item.salaryPerMonth,
            item.maxWorkPerHour,
            item.maxWorkPerDay
            ))
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
        <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <Paper className={classes.paper}>
            <EnhancedTableToolbar numSelected={selected.length} selected={selected}   onAddClick={showAddSlider}/>
            {
              actionsPermission.find(z=>z.id==4)!==undefined?
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
                size={dense ? 'small' : 'medium'}>
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
                            key={index + 'usersList'}
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
                                {row.fullName}
                              </div>
                            </TableCell>
                            <TableCell className={classes.cell_short} align="center">
                              <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                              <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                {row.userName}
                              </div>
                            </TableCell>
                            <TableCell className={classes.cell_short} align="center">
                              <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                              <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                {row.mobile}
                              </div>
                            </TableCell>
                            <TableCell className={classes.cell_short} align="center">
                              <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                              <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                {row.email}
                              </div>
                            </TableCell>

                            <TableCell className={classes.cell_short} align="center">
                              <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                              <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.salaryTypeFK_ID===14?'ساعتی':'روزانه'}
                              </div>
                            </TableCell>
                            <TableCell className={classes.cell_short} align="center">
                              <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                              <div style={{ display: !isLoading ? 'block' : 'none' }}>
                                {row.salaryTypeFK_ID===14?addCommas(row.salaryPerHour):addCommas(row.salaryPerMonth)}
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
                                actionsPermission.find(z=>z.id==98)!==undefined?
                                  <div className="delete-img-con btn-for-select"  dbid={row.id} userRow={row} onClick={grantUser} ><BuildIcon style={{color: '#6610f2'}}></BuildIcon> </div>
                                :<></>
                                }
                              {
                                actionsPermission.find(z=>z.id==3)!==undefined?
                                <div className="delete-img-con btn-for-select" dbid={row.id} 
                                        name={row.name}
                                        family={row.family}
                                        email={row.email}
                                        fullName={row.fullName}
                                        userName={row.userName}
                                        description={row.description}
                                        salaryID={row.salaryTypeFK_ID}
                                        emplooyerID={row.employeerTypeFK_ID}
                                        salaryPerHour ={row.salaryPerHour}
                                        salaryPerMonth ={row.salaryPerMonth}
                                        maxWorkPerDay = {row.maxWorkPerDay}
                                        maxWorkPerHour = {row.maxWorkPerHour}
                                        mobile={row.mobile}
                                        userRow={row} onClick={editShowSlider} ><img className='edit-img btn-for-select' src={editImage} /></div>
                                :<></>
                              }
                                {
                                  actionsPermission.find(z=>z.id==2)!==undefined?
                                  <CategoryModalDelete dbid={row.id} name={row.title} />
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
              onChangeRowsPerPage={handleChangeRowsPerPage}/>
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
      Is_Edited: state.users.Is_Edited,
      Is_Deleted_One: state.users.Is_Deleted_One,
      Is_Deleted_Group: state.users.Is_Deleted_Group,
      Is_Added: state.users.Is_Added,
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

export default connect(mapStateToProps, mapDispatchToProps)(checkRequests(UsersList,axios));