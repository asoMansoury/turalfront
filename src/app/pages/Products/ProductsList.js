import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import '../pulseDesignStyles/pulseDesignStyles.scss';
import editImage from '../pulseDesignImages/edit1.svg';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Show_add, Show_edit, Is_not_edited, Is_not_deleted_one, Is_not_deleted_group, Is_not_added } from '../_redux/Actions/categoryActions';
import { connect } from "react-redux";
import Skeleton from 'react-loading-skeleton';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { faIR } from '@material-ui/core/locale';
import CostCategoryRemoveByIds from './CostCategoryModalDeleteGroup';
import {JobGetAllApi,JobGetByIDApi} from '../commonConstants/ApiConstants'
import { useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../Config';
import { Preloader, Oval } from 'react-preloader-icon';
import { tableConfig } from '../Config';
import toast, { Toaster } from 'react-hot-toast';
import { toastConfig } from '../Config';
import EnhancedTableHead from '../component/UI/EnhancedTableHead';

function createData(jobID, executedDate) {
  return { jobID, executedDate };
}

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

const headRows = [
  { id: 'id', numeric: true, disablePadding: true, label: 'شناسه' },
  { id: 'title', numeric: false, disablePadding: true, label: 'تاریخ سرشکن' },
  { id: 'title', numeric: false, disablePadding: true, label: 'دانلود فایل گزارش ' },
];

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

const EnhancedTableToolbar  = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  const addCategoryShow = props.onAddClick;
  return (
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
              <span className='tabelhead'>لیست   عملیات ماهیانه</span>
            </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <CostCategoryRemoveByIds selected={props.selected} />
        )
          :
          <></>
          }
      </div>
    </Toolbar>
  );
};

const useStyles = makeStyles(theme => ({
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

export function ProductsList(props) {

  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(tableConfig.rowsPerPageDefault);
  const [isLoading, setIsLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [srchTitle, setSrchTitle] = React.useState('');
  const [count, setCount] = React.useState(0);
  const [inSrch, setInSrch] = React.useState(false);
  const [isEditingOrDeletingOneOrAdding, setIsEditingOrDeletingOneOrAdding] = React.useState(false);
  const [isDeletingGroup, setIsDeletingGroup] = React.useState(false);

  const setFakeData = (count) => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({ id: i });
    }
    setRows(temp);
  }

  const notifyError = () => toast('خطا در ارتباط با سرور. اطلاعات بارگزاری نشد.', { duration: toastConfig.duration, style: toastConfig.errorStyle });

  const getData = (nRows, page, title, inSearch, iseditingORdeletingORadding, isdeletinggroup) => {

    axios.get(JobGetAllApi)
      .then(res => {
        let result = res.data.jobDtos;
        console.log(result)
        setCount(res.data.numberRows);
        let temp = [];
        for (let i = 0; i < nRows * (page - 1); i++) {
          temp.push({});
        }
        result.forEach(item => {
          temp.push(createData(item.jobID, item.executedDate));
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
  useEffect(() => {
    let paginationArrows = Array.from(document.getElementsByTagName('div')).find(x => x.className.includes('MuiTablePagination-actions'));
    paginationArrows.style.position = 'absolute';
  });
  useEffect(() => {
    setFakeData(tableConfig.rowsPerPageDefault);
    getData(tableConfig.rowsPerPageDefault, 1, '', false, false, false);
  }, []);
  useEffect(() => {
    if (props.Is_Edited || props.Is_Deleted_One || props.Is_Added) {
      setIsEditingOrDeletingOneOrAdding(true);
      getData(rowsPerPage, page + 1, srchTitle, false, true, false);
      props.notEdited();
      props.notDeletedOne();
      props.notAdded();
      if (props.Is_Deleted_One)
        setSelected([]);
    }
    else if (props.Is_Deleted_Group) {
      setIsDeletingGroup(true);
      setIsLoading(true);
      getData(rowsPerPage, 1, '', false, false, true);
      props.notDeletedGroup();
      setPage(0);
      setSelected([]);
    }
  }, [props]);

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

  function setKeyUpSrch(e) {
    if (isEditingOrDeletingOneOrAdding)
      return;
    setSrchTitle(e.target.value);
    setInSrch(true);
    setPage(0);
    getData(rowsPerPage, 1, e.target.value, true, false, false);
  }

  function addCategoryShow() {
    props.showAddFunction();
  }
  function editCategoryShow(e) {
    let id = e.currentTarget.getAttribute('dbid');
    fetch(JobGetByIDApi+id).then(function(response) {
      return response.blob();
    }).then(function(myBlob) {
      var objectURL = URL.createObjectURL(myBlob);
      let a = document.createElement('a');
      a.href = objectURL;
      a.download = 'ProductList.xlsx';
      a.click();
    });
  }
  const isSelected = id => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (

    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} selected={selected} onAddClick={addCategoryShow} />
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
                        <TableCell className={classes.cell_short} padding="checkbox">
                            <Checkbox
                              onClick={event => handleClick(event, row.id)}
                              checked={isItemSelected}
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </TableCell>
                          <TableCell className={classes.cell_short} align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.jobID}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.executedDate}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              <div className="delete-img-con btn-for-select" dbid={row.jobID} onClick={editCategoryShow}><img className='edit-img btn-for-select' src={editImage} /></div>
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
  
  );
}

const mapStateToProps = (state => {
  return {
    Is_Edited: state.costCategory.Is_Edited,
    Is_Deleted_One: state.costCategory.Is_Deleted_One,
    Is_Deleted_Group: state.costCategory.Is_Deleted_Group,
    Is_Added: state.costCategory.Is_Added,
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
export default connect(mapStateToProps, mapDispatchToProps)(ProductsList);