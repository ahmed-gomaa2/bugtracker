import React from 'react';
import './Navbar.scss';
import {NavLink} from "react-router-dom";

const Navbar = props => {
    return (
        <div className={'Navbar'}>
            <div className="Navbar__container">
                <NavLink to={'/'} className="Navbar__logo">BugTracker</NavLink>
                <div className="Navbar__auth">
                    <div className="Navbar__links">
                        <NavLink to={'/login'} className="Navbar__login"><p>Login</p></NavLink>
                        <NavLink to={'/register'} className="Navbar__register"><p>Register</p></NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
