import React, { Component } from "react";
import './RecordTable.css';
import AgGridTable from '../AgGridTable/AgGridTable.js';
import { getRecords } from '../../../../connector.js';
import ClientSearch from "../ClientSearch";


class RecordTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                { headerName: "Name", field: "name", sortable: true, flex: 1 },
                { headerName: "Company", field: "company", sortable: true, flex: 1.5 },
                // { headerName: "Hobby", field: "hobby", sortable: true, flex: 1 },
                { headerName: "Important Date", cellRenderer: this.importantDateFormatter, sortable: true, cellStyle: { 'white-space': 'pre' }, flex: 2, wrapText: true, autoHeight: true },
                // { headerName: "Family", field: "familySituation", sortable: true, flex: 1 }
            ],
            defaultColDef: { sortable: true, resizable: true },
            domLayout: 'autoHeight',
            suppressHorizontalScroll: true,
            records: null, // To store the fetched records
            loading: true, // Show loading state
            error: false, 
            searchTerm: '',
        };
        this.gridApi = null;
    }

    componentDidMount() {
        this.loadRecordsWithRetry(10, 3000); // Call the retry logic with 10 attempts and 3-second intervals
    }

    importantDateFormatter = (params) => {
        const today = new Date();
        const date = params.data.importantDatesAndNotes;
    
        if (!date || date.length === 0) {
            return '';
        }
    
        const closestDate = date.reduce((closest, current) => {
            const currentImportantDate = new Date(current.importantDate);
    
            if (isNaN(currentImportantDate)) return closest;
    
            const currentDifference = Math.abs(currentImportantDate - today);
            const closestDifference = Math.abs(new Date(closest.importantDate) - today);
    
            // Choose the closest date; if the difference is the same, pick the most recently created entry
            if (
                currentDifference < closestDifference ||
                (currentDifference === closestDifference &&
                    new Date(current.createdAt) > new Date(closest.createdAt))
            ) {
                return current;
            }
    
            return closest;
        }, date[0]);
    
        // Format the closest date and return the corresponding note
        const formattedDate = new Date(closestDate.importantDate).toISOString().split('T')[0];
        return `${formattedDate}\n${closestDate.note || ''}`;
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

    handleSearch = (searchTerm) => {
        this.setState({ searchTerm });
    };

    getFilteredData = () => {
        const { searchTerm, records } = this.state;
        if (!searchTerm) return records;
        return records.filter(item =>
            (item.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.jobTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    };
    render() {
        const { loading, error } = this.state;

        const filteredData = this.getFilteredData();

        return (
            <div className="record-body">
                <div className="record-container">
                    <ClientSearch onSearch={this.handleSearch} />
                    <div className="record-table-section">
                        {loading && <div className="norecord-message">Loading...</div>}
                        {error && <div className="norecord-message">Error fetching records. Please refresh the page.</div>}
                        {!loading && !error && (
                            <AgGridTable
                                rowData={filteredData}
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
            </div>
        );
    }
}

export default RecordTable;
