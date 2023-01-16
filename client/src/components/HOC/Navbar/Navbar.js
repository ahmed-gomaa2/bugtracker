import React, {useEffect, useRef} from 'react';
import './Navbar.scss';
import {NavLink} from "react-router-dom";
import body from "../../../screens/Dashboard/Body/Body";

const Navbar = props => {
    useEffect(() => {
        const dummy = document.querySelector('.dummy');
        const sticky = document.querySelector('.Navbar');
        const stickyNav = (entries) => {
            console.log(entries[0].isIntersecting);
            if(entries[0].isIntersecting) {
                sticky.classList.remove('Navbar__sticky');
            }else {
                sticky.classList.add('Navbar__sticky');
            }
        }
        const headerObserver = new IntersectionObserver(stickyNav, {
            root: null,
            threshold: 0,
            rootMargin: `200px`
        });
        headerObserver.observe(dummy);
    }, []);
    return (
        <>
            <div className="dummy"></div>
            <div className={'Navbar'}>
                <div className="Navbar__container">
                    <NavLink to={'/'} className="Navbar__logo"><span className={'Navbar__bug'}>B</span><span className={'Navbar__tracker'}>T</span></NavLink>
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
