import React from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './AgGridTable.css';

const AgGridTable = ({ rowData, columnDefs, defaultColDef, domLayout, suppressHorizontalScroll, onGridReady, onSelectionChanged}) => (
    <div className="ag-body">
        <div className="page-container ag-theme-alpine">
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                domLayout={domLayout}
                suppressHorizontalScroll={suppressHorizontalScroll}
                pagination={true}         
                paginationPageSize={7} 
                onGridReady={onGridReady} 
                onSelectionChanged={onSelectionChanged}
                rowSelection="single"      
            />
        </div>
    </div>
);

export default AgGridTable;