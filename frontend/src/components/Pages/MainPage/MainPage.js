import React, { Component } from "react";
import { withFuncProps } from "../../withFuncProps";
import RecordTable from "../../Functions/Table/RecordTable/RecordTable";
import './MainPage.css';
import { useNavigate } from "react-router-dom";


export function withNavigation(Component) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowData: null
        };
    }

    handleRowSelected = (selectedData) => {
        this.setState({ selectedRowData: selectedData }, ()=>{
            this.props.navigate('/edit-existing-client', { state: { selectedRow: selectedData } });
        });
    };

    render() {

        return (
            <div className="main-page-body">
                <div className="main-page-container">
                    <div className="record-table-section">
                        <RecordTable
                            onRowSelected={this.handleRowSelected} 
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withFuncProps(withNavigation(MainPage));
