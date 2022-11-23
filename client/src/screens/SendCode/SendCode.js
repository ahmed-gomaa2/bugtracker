import React, {useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import './SendCode.scss';
import {sendCode} from "../../store/action/auth.action";
import {connect} from "react-redux";

const SendCode = (props) => {
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const isEmail = email => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const formSubmitHandler = e => {
        e.preventDefault();

        if(isEmail(email)) {
            const formData = {
                email
            }
            props.sendCode(formData, navigate);

            setEmail('');
        }

    }
    return (
        <div className={'ResetPassword'}>
            <form onSubmit={formSubmitHandler} className="ResetPassword__form">
                <div className="ResetPassword__form--header">
                    <h2>Reset Your Password!</h2>
                </div>
                <div className="ResetPassword__form--element">
                    <label htmlFor="email" className="ResetPassword__form--label">Email:</label>
                    <div className="ResetPassword__form--input">
                        <input onChange={e => setEmail(e.target.value)} data-key={'email'} name={'email'} value={email} type="email" placeholder={'Enter your email'} className={`ResetPassword__form--input-input ${!isEmail(email) && 'ResetPassword__form--input-invalid'}`}/>
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    {
                        props.error && props.error.type === 'email' && (
                            <div className="ResetPassword__form--element-error">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <p>{props.error?.msg?.toLowerCase()}</p>
                            </div>
                        )
                    }

                </div>
                <div className="ResetPassword__form--element">
                    <button disabled={!isEmail(email)} type={'submit'} className="ResetPassword__form--button"><p>Send Code</p></button>
                </div>
                <div className="ResetPassword__form--element">
                    <p className="ResetPassword__form--not-registered">Not a member? <NavLink to={'/register'}>Register</NavLink></p>
                </div>
            </form>

        </div>
    );
};

const mapStateToProps = state => {
    return {

    }
}

export default connect(null, {sendCode}) (SendCode);
