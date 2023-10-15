import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from './EnhancedTableHead';
import {Form, Row, Col} from 'react-bootstrap';
import Checkbox from '@material-ui/core/Checkbox';
import deleteImage from '../../pulseDesignImages/delete.svg';
import editImage from '../../pulseDesignImages/edit.svg';
import TooltipComponent from './TooltipComponent';
import {  makeStyles } from '@material-ui/core/styles';
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
    },
  }));

  function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
  }
  

export const TableComponent=(props)=>{
    const classes = useStyles();
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [order, setOrder] = React.useState('asc');
    const [dense, setDense] = React.useState(false);


    function handleChangeDense(event) {
        setDense(event.target.checked);
      }
    
    function handleClick(event, id) {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
  
        setSelectedItem(props.rowsTable.filter(z=>z.id===id)[0]);
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
      
    function handleRequestSort(event, property) {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
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
  
    const isSelected = id => selected.indexOf(id) !== -1;
    const emptyRows = props.rowsPerPage - Math.min(props.rowsPerPage, props.rowsPerPage.length - page * props.rowsPerPage);

    return (
        <>
        <Paper className={classes.paper}>
          {props.tableHeader}
          {props.searchBar}
          <div className={classes.tableWrapper}>

            <Table
              className={classes.table + ' marg-t-10'}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}>
              <EnhancedTableHead headRows={props.headRows}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={props.handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={props.rowsTable.length}/>
              <TableBody>
                {stableSort(props.rowsTable, getSorting(order, orderBy))
                  .slice(page * props.rowsPerPage, page * props.rowsPerPage + props.rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={event => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>

                        <TableCell align="center">
                          {row.description === '' ? <span className='pointer label label-lg label-light-danger label-inline btn-height'>ندارد</span> : <TooltipComponent Title="توضیحات">{row.description}</TooltipComponent>}
                        </TableCell>
                        <TableCell align="center"><TooltipComponent Title="مشاهده آدرس">{row.address}</TooltipComponent></TableCell>
                        <TableCell align="center">{row.price}</TableCell>
                        <TableCell align="center">{row.categoryName}</TableCell>
                        <TableCell align="center">{row.unitName}</TableCell>
                        <TableCell align="center">{row.materialName}</TableCell>
                        <TableCell align="center">{row.code}</TableCell>
                        <TableCell align="center">{row.title}</TableCell>
                        <TableCell align="center">{row.id}</TableCell>
                        <TableCell align="center">
                          <div className="delete-img-con"><img className='delete-img' src={editImage} row={row.id} onClick={props.removeSelectedHandle} src={deleteImage} /></div>
                          <div className="delete-img-con" ><img row={row.id} className='edit-img' src={editImage}  onClick={props.handleEditClick}/></div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          
          </div>
          {props.tablePaginationRender}
        </Paper>
      
        </>
    )
}

export default TableComponent;
