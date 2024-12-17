import React, { Component } from "react";
import { withFuncProps } from "../../withFuncProps";
import ExportButton from "../../Button/ExportButton/ExportButton"; 

import './TopNavBar.css';

class TopNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDroppedDown: false,
            animationClass: "",
            isAnimating: false
        };
        this.menuRef = React.createRef();
        this.iconRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('click', this.closeDropdown);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.closeDropdown);
    }

    closeDropdown = (e) => {
        if (this.menuRef.current && e.target !== this.menuRef.current && 
            this.iconRef.current && !this.iconRef.current.contains(e.target) &&
            !this.state.isAnimating) {
            this.setState({
                animationClass: "hide",
                isAnimating: true
            });
            setTimeout(() => this.setState({ isDroppedDown: false, isAnimating: false }), 200);
        }
    };

    toggleDropdown = (e) => {
        if (this.state.isAnimating) return;
        if (this.state.isDroppedDown) {
            this.setState({
                animationClass: "hide",
                isAnimating: true
            });
            setTimeout(() => this.setState({ isDroppedDown: false, isAnimating: false }), 200);
        } else {
            this.setState({
                animationClass: "show",
                isDroppedDown: true,
                isAnimating: true
            });
            setTimeout(() => this.setState({isAnimating: false }), 200);
        }
    };

    render() {
        if (window.location.pathname === "/") {
            return <div className="navBar"></div>;
        }
        return (
            <div className="navBar">
                <div className="navBar-left">
                    <button className="navTitle" onClick={() => this.props.navigate('/MainPage')}>
                        Zwj Info Tracker
                    </button>
                </div>

                <div className="navBar-right">
                    <ul className="nav-list">
                        <li>
                            <button className="nav-button" onClick={() => this.props.navigate('/draft')}>
                                Draft
                            </button>
                        </li>
                        <li>
                            <button className="nav-button" onClick={() => this.props.navigate('/create-client')}>
                                Create Client
                            </button>
                        </li>
                        <li><ExportButton className="nav-button"/></li>
                    </ul>
                    <div ref={this.iconRef} className="dropdownIcon" onClick={this.toggleDropdown}>
                        &#9776;
                    </div>
                    {this.state.isDroppedDown ? (
                        <ul ref={this.menuRef} className={`dropdown-container ${this.state.animationClass}`}>
                            <li>
                                <button className="dropdown-content" onClick={() => {
                                    this.props.navigate('/draft');
                                    this.toggleDropdown();
                                }}>
                                    Draft
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-content" onClick={() => {
                                    this.props.navigate('/create-client');
                                    this.toggleDropdown();
                                }}>
                                    Create Client
                                </button>
                            </li>
                            <li><ExportButton className="dropdown-content"/></li>
                        </ul>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default withFuncProps(TopNavBar);
