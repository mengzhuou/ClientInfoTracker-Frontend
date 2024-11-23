import React, { Component } from "react";
import './RecordTable.css';
import AgGridTable from '../AgGridTable/AgGridTable.js';
import { getRecords } from '../../../../connector.js';

class RecordTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                { headerName: "Name", field: "name", sortable: true, flex: 1 },
                { headerName: "Company", field: "company", sortable: true, flex: 1 },
                { headerName: "Hobby", field: "hobby", sortable: true, flex: 1 },
                { headerName: "Important Date", cellRenderer: this.importantDateFormatter, sortable: true, cellStyle: { 'white-space': 'pre' }, flex: 2, wrapText: true, autoHeight: true },
                { headerName: "Family", field: "familySituation", sortable: true, flex: 1 }
            ],
            defaultColDef: { sortable: true, resizable: true },
            domLayout: 'autoHeight',
            suppressHorizontalScroll: true,
            records: null, // To store the fetched records
            loading: true, // Show loading state
            error: false, // Track if there's an error
        };
        this.gridApi = null;
    }

    componentDidMount() {
        this.loadRecordsWithRetry(10, 3000); // Call the retry logic with 10 attempts and 3-second intervals
    }

    importantDateFormatter = (params) => {
        let date = params.data.importantDate;

        if (!date) {
            date = '';
        } else {
            const time = new Date(date);
            date = time.toISOString().split('T')[0];
        }
        if (!params.data.note) {
            params.data.note = '';
        }
        return date + '\n' + params.data.note;
    };

    dateFormatter = (params) => {
        if (!params.value) {
            return '';
        }
        const date = new Date(params.value);
        if (!isNaN(date)) {
            return date.toISOString().split('T')[0];
        }
        return params.value;
    };

    loadRecords = async () => {
        const records = await getRecords();
        return records.reverse();
    };

    loadRecordsWithRetry = (maxAttempts, delay) => {
        let attempts = 0;
        
        const attemptFetch = async () => {
            try {
                const records = await this.loadRecords();
                this.setState({ records, loading: false, error: false });
            } catch (error) {
                attempts++;
                console.error(`Attempt ${attempts} failed. Error loading records:`, error);

                if (attempts < maxAttempts) {
                    setTimeout(attemptFetch, delay); 
                } else {
                    this.setState({ loading: false, error: true });
                    console.error("Max attempts reached. Failed to fetch records.");
                }
            }
        };

        attemptFetch(); 
    };

    onGridReady = (params) => {
        this.gridApi = params.api; 
    };

    onSelectionChanged = () => {
        if (this.gridApi && this.props.onRowSelected) {
            const selectedRows = this.gridApi.getSelectedRows();
            this.props.onRowSelected(selectedRows); 
        }
    };

    render() {
        const { loading, error, records } = this.state;

        return (
            <div className="body">
                <div className="RecordPageContainer">
                    {loading && <div>Loading...</div>}
                    {error && <div>Error fetching records. Retrying...</div>}
                    {!loading && !error && (
                        <AgGridTable
                            rowData={records}
                            columnDefs={this.state.columnDefs}
                            defaultColDef={this.state.defaultColDef}
                            domLayout={this.state.domLayout}
                            suppressHorizontalScroll={this.state.suppressHorizontalScroll}
                            onGridReady={this.onGridReady}
                            onSelectionChanged={this.onSelectionChanged}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default RecordTable;
