import React, { Component } from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage as LastPageIcon
} from '@material-ui/icons';
class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: 0,
            page: 0,
            skip: 0,
            initialCount: 0,
            lastPage: 0,
            total: 0,
            previos: null,
            next: null
        };
    }

    componentDidMount() {
        this.setState({
            data: this.props.data,
            page: this.props.query.page,
            skip: this.props.query.skip,
            initialCount: this.props.query.initialCount,
            lastPage: this.getLastPage(this.props.data, this.props.query.total),
            total: this.props.query.total,
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
            page: nextProps.query.page,
            skip: nextProps.query.skip,
            initialCount: nextProps.query.initialCount,
            lastPage: this.getLastPage(nextProps.data, nextProps.query.total),
            total: nextProps.query.total,
        })
    }

    onClickFirstBtn = () => {
        this.setState({ page: 1, skip: 0 }, () => {
            this.props.handlePagination(this.state);
        });
    }

    onClickNextBtn = () => {
        let currentPage = +this.state.page;
        currentPage = currentPage + 1;
        let currentCount = this.state.initialCount;
        currentCount = currentCount + 10;
        this.setState({ page: +currentPage, skip: this.state.skip + 20, initialCount: currentCount }, () => {
            this.props.handlePagination(this.state);
        });
    }

    onClickPrevBtn = () => {
        let currentPage = +this.state.page;
        currentPage = currentPage - 1;
        let currentCount = this.state.initialCount;
        currentCount = currentCount - 10;
        this.setState({ page: +currentPage, initialCount: currentCount, skip: this.state.skip - 20 }, () => {
            this.props.handlePagination(this.state);
        })
    }

    onClickLastBtn = () => {
        this.setState({ page: this.state.lastPage, skip: this.state.total - 20 }, () => {
            this.props.handlePagination(this.state);
        })
    }

    getFirstRowCount = (page) => {
        return ((page - 1) * 10) + 1;
    }

    getLastRowCount = (c, l, t) => {
        if (c !== l) {
            return ((c - 1) * 10) + 10;
        }
        else {
            return t;
        }
    }

    getLastPage = (rowsPerPage, totalCountOfRows) => {
        let skip = parseInt(totalCountOfRows / rowsPerPage);
        return skip * +rowsPerPage;
    }

    render() {
        let currentPage, lastPage, totalCount, skip, rowsPerPage;
        rowsPerPage = +this.state.data;
        skip = +this.state.skip;
        if (this.state.data) {
            currentPage = skip / rowsPerPage + 1;
            totalCount = +this.state.total;
            lastPage = parseInt(totalCount / rowsPerPage) + 1;
        }
        let firstBtn, nextBtn, prevBtn, lastBtn;
        if (skip === 0) {
            firstBtn = true;
            prevBtn = true;
        }
        if (totalCount < rowsPerPage) {
            nextBtn = true;
            lastBtn = true;
        }
        else if (lastPage === currentPage) {
            lastBtn = true
        }
        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{ margin: 20 }}>
                <Grid item>
                    <small>
                        Page {`${(currentPage)} of ${lastPage}`}
                    </small>
                </Grid>
                <Grid item>
                    <ButtonGroup size="small">
                        <IconButton style={{ margin: 5 }} onClick={this.onClickFirstBtn} disabled={firstBtn}><FirstPageIcon /></IconButton>
                        <IconButton style={{ margin: 5 }} onClick={this.onClickPrevBtn} disabled={prevBtn}><KeyboardArrowLeft /></IconButton>
                        <IconButton style={{ margin: 5 }} onClick={this.onClickNextBtn} disabled={nextBtn}><KeyboardArrowRight /></IconButton>
                        <IconButton style={{ margin: 5 }} onClick={this.onClickLastBtn} disabled={lastBtn}><LastPageIcon /></IconButton>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }
}

export default Pagination;