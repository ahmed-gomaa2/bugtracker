import React from 'react';
import './Navbar.scss';
import {NavLink} from "react-router-dom";

const Navbar = props => {
    return (
        <>
            <div className={'Navbar'}>
                <div className="Navbar__container">
                    <NavLink to={'/'} className="Navbar__logo">BugTracker</NavLink>
                    <div className="Navbar__auth">
                        <div className="Navbar__links">
                            <NavLink activeClassName={'Navbar__active-login'} to={'/login'} className={({isActive}) => {
                                const linkClasses = ['Navbar__login'];
                                if(isActive) linkClasses.push('Navbar__active-login');

                                return linkClasses.join(' ');
                            }}><p>Login</p></NavLink>
                            <NavLink activeClassName={'Navbar__active-register'} to={'/register'} className={({isActive}) => {
                                const linkClasses = ['Navbar__register'];
                                if(isActive) linkClasses.push('Navbar__active-register');

                                return linkClasses.join(' ');
                            }}><p>Register</p></NavLink>
                        </div>
                    </div>
                </div>
            </div>
            {props.children}
        </>
    );
};

export default Navbar;
