import React, {useState} from 'react';
import './Login.scss';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {login} from '../../store/action/auth.action';

const Login = props => {
    const [formData, setFormData] = useState({
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
        const input = e.target.closest('.Login__form--input-input');
        if(!input) return;
        const updatedInputKey = input.dataset.key;
        const updatedFormData = {
            ...formData
        }

        console.log(updatedFormData)

        const updatedFormElement = {
            ...updatedFormData[updatedInputKey]
        }

        updatedFormElement.value = e.target.value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = formValidator(updatedFormElement.value, updatedFormElement.rules);
        updatedFormData[updatedInputKey] = updatedFormElement;
        let formIsValid = true;
        for(let inputKey in updatedFormData) {
            console.log(updatedFormData[inputKey].valid)
            formIsValid = updatedFormData[inputKey].valid && formIsValid;
        }
        console.log(updatedFormData)
        setFormData(updatedFormData);
        setIsValid(formIsValid);
        console.log(formIsValid)
    }

    const formSubmitHandler = e => {
        e.preventDefault();
        const userData = {
            email: formData.email.value,
            password: formData.password.value
        };

        props.login(userData);
    }
    return (
        <div className={'Login'}>
            <form onSubmit={formSubmitHandler} onChange={formChangeHandler} className="Login__form">
                <div className="Login__form--header">
                    <h2>Welcome again!</h2>
                </div>
                <div className="Login__form--element">
                    <label htmlFor="email" className="Login__form--label">Email:</label>
                    <div className="Login__form--input">
                        <input data-key={'email'} name={'email'} value={formData.email.value} type="email" placeholder={'Enter your email'} className={`Login__form--input-input ${!formData.email.valid && 'Login__form--input-invalid'}`}/>
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    {
                        props.error && props.error.type === 'email' && (
                            <div className="Login__form--element-error">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <p>{props.error?.msg?.toLowerCase()}</p>
                            </div>
                        )
                    }

                </div>
                <div className="Login__form--element">
                    <label htmlFor="email" className="Login__form--label">Password:</label>
                    <div className="Login__form--input">
                        <input data-key={'password'} name={'password'} value={formData.password.value} type="password" placeholder={'Enter unique password'} className={`Login__form--input-input ${!formData.password.valid && 'Login__form--input-invalid'}`}/>
                        <i className="fa-solid fa-key"></i>
                    </div>
                    {
                        props.error && props.error.type === 'password' && (
                            <div className="Login__form--element-error">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <p>{props.error?.msg?.toLowerCase()}</p>
                            </div>
                        )
                    }
                </div>
                <div className="Login__form--element">
                    <button disabled={!isValid} type={'submit'} className="Login__form--button"><p>Login</p></button>
                </div>
                <div className="Login__form--element">
                    <p className="Login__form--not-Login">Not logged in? <NavLink to={'/register'}>Register</NavLink></p>
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

export default connect(mapStateToProps, {login}) (Login);
