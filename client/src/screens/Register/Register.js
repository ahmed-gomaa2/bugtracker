import React, {useEffect, useState} from 'react';
import './Reigster.scss';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {register, resetForm} from '../../store/action/auth.action';

const Register = props => {
    const [formData, setFormData] = useState({
        username: {
            type: 'text',
            rules: {
                minLength: 6,
                required: true
            },
            valid: false,
            value: '',
            touched: false
        },
        email: {
            type: 'email',
            rules: {
                isEmail: true,
                required: true
            },
            valid: false,
            value: '',
            touched: false
        },
        password: {
            type: 'password',
            rules: {
                required: true,
                minLength: 6
            },
            valid: false,
            value: '',
            touched: false
        }
    });
    const [isValid, setIsValid] = useState(false);

    const formValidator = (value, rules) => {
        let inputIsValid = true;
        if(!rules) {
            return true;
        }
        if(rules.isEmail) {
            console.log(String(value)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ))
            inputIsValid = String(value)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ) && inputIsValid;
        }

        if(rules.required) {
            inputIsValid = value.trim() !== '' && inputIsValid;
        }

        if(rules.maxLength) {
            inputIsValid = value.length >= rules.minLength && inputIsValid;
        }

        if(rules.maxLength) {
            inputIsValid = value.length <= rules.maxLength && inputIsValid;
        }

        return inputIsValid;
    }

    const formChangeHandler = (e) => {
        const input = e.target.closest('.Register__form--input-input');
        if(!input) return;
        const updatedInputKey = input.dataset.key;
        const updatedFormData = {
            ...formData
        }

        const updatedFormElement = {
            ...updatedFormData[updatedInputKey]
        }

        updatedFormElement.value = e.target.value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = formValidator(updatedFormElement.value, updatedFormElement.rules);
        updatedFormData[updatedInputKey] = updatedFormElement;
        let formIsValid = true;
        for(let inputKey in updatedFormData) {
            formIsValid = updatedFormData[inputKey].valid && formIsValid;
        }
        setFormData(updatedFormData);
        setIsValid(formIsValid);
    }

    const formSubmitHandler = e => {
        e.preventDefault();
        const userData = {
            username: formData.username.value,
            email: formData.email.value,
            password: formData.password.value
        };

        props.register(userData);
    }

    useEffect(() => {
        props.resetForm();
    }, []);
    return (
        <div className={'Register'}>
            <form onSubmit={formSubmitHandler} onChange={formChangeHandler} className="Register__form">
                <div className="Register__form--header">
                    <h2>Nice Meeting you!</h2>
                </div>
                <div className="Register__form--element">
                    <label htmlFor="username" className={`Register__form--label`}>Username:</label>
                    <div className="Register__form--input">
                        <input data-key={'username'} value={formData.username.value} type="text" name={'username'} placeholder={'Enter your name'} className={`Register__form--input-input ${!formData.username.valid && 'Register__form--input-invalid'}`}/>
                        <i className="fa-solid fa-user"></i>
                    </div>

                </div>
                <div className="Register__form--element">
                    <label htmlFor="email" className="Register__form--label">Email:</label>
                    <div className="Register__form--input">
                        <input data-key={'email'} name={'email'} value={formData.email.value} type="email" placeholder={'Enter your email'} className={`Register__form--input-input ${!formData.email.valid && 'Register__form--input-invalid'}`}/>
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    {
                        props.error && props.error.type === 'email' && (
                            <div className="Register__form--element-error">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <p>{props.error?.msg?.toLowerCase()}</p>
                            </div>
                        )
                    }

                </div>
                <div className="Register__form--element">
                    <label htmlFor="email" className="Register__form--label">Password:</label>
                    <div className="Register__form--input">
                        <input data-key={'password'} name={'password'} value={formData.password.value} type="password" placeholder={'Enter unique password'} className={`Register__form--input-input ${!formData.password.valid && 'Register__form--input-invalid'}`}/>
                        <i className="fa-solid fa-key"></i>
                    </div>
                </div>
                <div className="Register__form--element">
                    <button disabled={!isValid} type={'submit'} className="Register__form--button"><p>Register</p></button>
                </div>
                <div className="Register__form--element">
                    <p className="Register__form--not-register">Already a member? <NavLink to={'/login'}>Login</NavLink></p>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        error: state.auth.error
    }
}

export default connect(mapStateToProps, {register, resetForm}) (Register);
