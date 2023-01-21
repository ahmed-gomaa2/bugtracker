import React from 'react';
import './Landing.scss';
import Jumbotron from "./Jumbotron/Jumbotron";
import Overlook from "./Overlook/Overlook";
import Features from "./Features/Features";

const Landing = () => {
    return (
        <div className={'Landing'}>
            <Jumbotron />
            <Overlook />
            <Features />
        </div>
    );
};

export default Landing;
