import React from 'react';
import './PageNotFound.css';
import errorImage from './404-error.png'; 

const PageNotFound = () => {
    return (
        <div className="page-not-found-container">
            <img src={errorImage} alt="Page Not Found" className="page-not-found-image" />
        </div>
    );
};

export default PageNotFound;
