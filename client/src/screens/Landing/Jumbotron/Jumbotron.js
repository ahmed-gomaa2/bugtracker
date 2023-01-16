import React from 'react';
import './Jumbotron.scss';
import {NavLink} from "react-router-dom";

const types= {
    1: {
        name: 'bug',
        icon: <i className="fa-solid fa-bug"></i>
    },

    2: {
        name: 'feature',
        icon: <i className="fa-solid fa-microchip"></i>
    },
    3: {
        name: 'task',
        icon: <i className="fa-solid fa-list-check"></i>
    }
}

const Jumbotron = props => {
    return (
        <div className={'Jum'}>
            <div className="Jum__desc">
                <div className="Jum__desc-container">
                    <h1 className="Jum__header">
                        Track your applications bugs and new features
                    </h1>
                    <p className="Jum__desc-p">A simple, fast, scalable management application that helps you manage bugs and boost your productivity.  </p>
                    <p className="Jum__button"><NavLink to={'/register'}>sign up for free</NavLink></p>
                </div>
            </div>
            <div className="Jum__anim">
                <div className="Jum__anim-circle">
                    <div className="Jum__anim-type"><i className="fa-solid fa-bug"></i><span>Bugs</span></div>
                    <div className="Jum__anim-type"><i className="fa-solid fa-microchip"></i><span>Features</span></div>
                    <div className="Jum__anim-type"><i className="fa-solid fa-list-check"></i><span>Tasks</span></div>
                    <div className="Jum__anim-type">Track Your Application</div>
                </div>
            </div>
        </div>
    );
};

export default Jumbotron;