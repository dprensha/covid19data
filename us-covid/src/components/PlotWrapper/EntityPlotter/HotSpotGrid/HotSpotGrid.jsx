import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { FormControl, MenuItem, Select } from "../../../Controls";
import styles from './HotSpotGrid.module.scss';


const HotSpotGrid = ({ data, handleCompareDropDownListChange, comparisonKPI, childrenHaveStats, isMobile, comparisonWindow }) => {
    return (
        <EnhancedTable data={data} handleCompareDropDownListChange={handleCompareDropDownListChange} comparisonKPI={comparisonKPI} childrenHaveStats={childrenHaveStats} isMobile={isMobile} comparisonWindow={comparisonWindow}/>
    )
};

export default HotSpotGrid;


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { classes, order, orderBy, numSelected, rowCount, onRequestSort, handleCompareDropDownListChange, comparisonKPI, childrenHaveStats, isMobile, comparisonWindow } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    
    let selectContents = null;
    if(isMobile) {
        selectContents = (
            <Select
                native
                style={{fontSize: "12px"}}
                value={comparisonKPI}
                onChange={(e) => {e.preventDefault(); handleCompareDropDownListChange(e)}}
            >
                <option value={"activePerCapita"}>Active Cases Per 1,000</option>
                <option value={"active"}>Active Cases</option>
                <option value={"activePctChange"}>{`Active ${comparisonWindow}-Day % Change`}</option>
                <option value={"total"}>Total Cases</option>
                <option value={"percentOfParent"}>% of Parent Active Cases</option>
                <option value={"mortalityRate"}>Mortality Rate</option>
                <option value={"deaths"}>Deaths</option>
                <option value={"hospitalizationRate"} style={childrenHaveStats ? {} : {display: "none"}}>Hospitilization Rate</option>
                <option value={"hospitalizations"} style={childrenHaveStats ? {} : {display: "none"}}>Hospitalizations</option>
                <option value={"tests"} style={childrenHaveStats ? {} : {display: "none"}}>Tests</option>
                <option value={"newCasesPerThousandTests"} style={childrenHaveStats ? {} : {display: "none"}}>New Cases per 1,000 Tests</option>
                <option value={"testsPerCapita"} style={childrenHaveStats ? {} : {display: "none"}}>Number Tested Per 1,000</option>
            </Select>
        )
    }
    else {
        selectContents = (
            <Select
                style={{fontSize: "12px"}}
                value={comparisonKPI}
                onChange={(e) => {e.preventDefault(); handleCompareDropDownListChange(e)}}
            >
                <MenuItem value={"activePerCapita"}>Active Cases Per 1,000</MenuItem>
                <MenuItem value={"active"}>Active Cases</MenuItem>
                <MenuItem value={"activePctChange"}>{`Active ${comparisonWindow}-Day % Change`}</MenuItem>
                <MenuItem value={"total"}>Total Cases</MenuItem>
                <MenuItem value={"percentOfParent"}>% of Parent Active Cases</MenuItem>
                <MenuItem value={"mortalityRate"}>Mortality Rate</MenuItem>
                <MenuItem value={"deaths"}>Deaths</MenuItem>
                <MenuItem value={"hospitalizationRate"} style={childrenHaveStats ? {} : {display: "none"}}>Hospitilization Rate</MenuItem>
                <MenuItem value={"hospitalizations"} style={childrenHaveStats ? {} : {display: "none"}}>Hospitalizations</MenuItem>
                <MenuItem value={"tests"} style={childrenHaveStats ? {} : {display: "none"}}>Tests</MenuItem>
                <MenuItem value={"newCasesPerThousandTests"} style={childrenHaveStats ? {} : {display: "none"}}>New Cases per 1,000 Tests</MenuItem>
                <MenuItem value={"testsPerCapita"} style={childrenHaveStats ? {} : {display: "none"}}>Number Tested Per 1,000</MenuItem>
            </Select>
        )
    }

    return (
        <TableHead>
            <TableRow>
                
                    <TableCell
                        align={'right'}
                        padding={'default'}
                        //sortDirection={orderBy === headCell.id ? order : false}
                        style={{width: "50px", textAlign: "left", padding: "0"}}
                    >
                        Rank
                    </TableCell>
                    <TableCell
                        align={'left'}
                        padding={'none'}
                        //sortDirection={orderBy === headCell.id ? order : false}
                    >
                        State/County
                    </TableCell>
                    <TableCell
                        style={{width: "200px"}}
                        align={'right'}
                        padding={'none'}
                    >
                    <FormControl>
                        {selectContents}
                </FormControl>
                </TableCell>
            
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

function EnhancedTable(props) {
    const { data, handleCompareDropDownListChange, comparisonKPI, childrenHaveStats, isMobile, comparisonWindow } = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('cases');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(data.length < 10 ? data.length : 10);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (event, row) => {
        const element = document.getElementById(`${row.navigableTitle}`);
        window.scrollTo(0, element.offsetTop - 120);
    }

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return (
        <div className={classes.root} style={{ paddingTop: "16px", width: "100%" }}>
            <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={'small'}
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        classes={classes}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={data.length}
                        handleCompareDropDownListChange={handleCompareDropDownListChange}
                        comparisonKPI={comparisonKPI}
                        childrenHaveStats={childrenHaveStats}
                        isMobile={isMobile}
                        comparisonWindow={comparisonWindow}
                    />
                    <TableBody>
                        {stableSort(data, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                            const isItemSelected = isSelected(row.value);
                            return (
                                <TableRow
                                    hover
                                    key={row.key}
                                    selected={isItemSelected}
                                    onClick={(event) => handleRowClick(event, row)}
                                    style={{cursor: "pointer"}}
                                >
                                    <TableCell component="th" scope="row" padding="none">{row.rank}</TableCell>
                                    <TableCell scope="row" padding="none">{row.key}</TableCell>
                                    <TableCell scope="row" align="right">{Math.round((row.value + Number.EPSILON) * 100) / 100}</TableCell>
                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 33 * emptyRows }}>
                                <TableCell colSpan={2} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    );
}
