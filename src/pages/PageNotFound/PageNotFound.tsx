import React from 'react';
import { Link } from 'react-router-dom';
import './PageNotFound.scss';

const PageNotFound = () => {
    return (
        <div className="not-found-container">
            <h1 className='heading'>404</h1>
            <h2 className='sub-heading' >Page Not Found.</h2>
            <p className='para'>Sorry, we can't find the page .</p>
            <Link to="/" className="back-home-button">Back to Home</Link>
        </div>
    );
};

export default PageNotFound;
