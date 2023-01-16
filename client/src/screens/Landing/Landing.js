import React from 'react';
import './Landing.scss';
import Jumbotron from "./Jumbotron/Jumbotron";
import Features from "./Overlook/Overlook";

const Landing = () => {
    return (
        <div className={'Landing'}>
            <Jumbotron />
            <Features />
        </div>
    );
};

export default Landing;
