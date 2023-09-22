import React, { Component } from "react";

let headersArray = [];
let filtersArray = [];
let templatesArray = [];

let props = {
    url: "fma.pk/api/blah",
    pageSize: 20,
    headers: headersArray,
    filters: filtersArray,
    templates: templatesArray,
    search: "?search"
}

const TableComponent = () => (
    <div className="table-component">
        <Table
            url="fma.pk/api/xyz"
            pageSize={20}
            headers={headersArray}
            filters={filtersArray}
            search="?search"
        />
    </div>
);

class RootComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                page: 1,
                total: 1,
                pageSize: 20,
                lastPage: 30,
                initialCount: 0,
                skip: 0,
                previos: null,
                next: null
            },
            sort: {
                key: "",
                order: "",
                column: ""
            },
            data: [],
            url: "",
            search: {
                isActive: false,
                param: null
            },
            isLoading: false
        }
    }

    componentDidMount() {
        const { url, pageSize, search, } = this.props;

        this.setState({
            url: url,
            pageSize: pageSize,
            search: {
                isActive: search !== null ? true : false,
                param: search !== null ? search : null
            }
        }, () => this.populateTable());
    }

    populateTable = () => { }
}