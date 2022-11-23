import React, {useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import './VerifyCode.scss';
import {connect} from "react-redux";
import {resetPassword} from "../../store/action/auth.action";

const VerifyCode = (props) => {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [matchNewPassword, setMatchNewPassword] = useState('');

    const navigate = useNavigate();

    const formSubmitHandler = e => {
        e.preventDefault();
        if(!code.length < 5 && newPassword === matchNewPassword) {
            props.resetPassword(code, newPassword, props.email, navigate)
        }
    }
    return (
        <div className={'VerifyCode'}>
            <form onSubmit={formSubmitHandler} className="VerifyCode__form">
                <div className="VerifyCode__form--header">
                    <h2>Reset Your Password!</h2>
                </div>
                <div className="VerifyCode__form--element">
                    <label htmlFor="code" className="VerifyCode__form--label">Code:</label>
                    <div className="VerifyCode__form--input">
                        <input onChange={e => setCode(e.target.value)} name={'code'} value={code} type="text" placeholder={'Enter the code here!'} className={`VerifyCode__form--input-input ${code.length < 5 && 'VerifyCode__form--input-invalid'}`}/>
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    {
                        props.error && props.error.type === 'code' && (
                            <div className="VerifyCode__form--element-error">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <p>{props.error?.msg?.toLowerCase()}</p>
                            </div>
                        )
                    }
                </div>

                <div className="VerifyCode__form--element">
                    <label htmlFor={'new-password'} className="VerifyCode__form--label">Enter The New Password Again:</label>
                    <div className="VerifyCode__form--input">
                        <input onChange={e => setNewPassword(e.target.value)} name={'new-password'} value={newPassword} type="text" placeholder={'Enter the new password!'} className={`VerifyCode__form--input-input ${code.length < 5 && 'VerifyCode__form--input-invalid'}`}/>
                        <i className="fa-solid fa-envelope"></i>
                    </div>

                </div>
                <div className="VerifyCode__form--element">
                    <label htmlFor="email" className="VerifyCode__form--label">Enter The New Password Again:</label>
                    <div className="VerifyCode__form--input">
                        <input onChange={e => setMatchNewPassword(e.target.value)} name={'match-new-password'} value={matchNewPassword} type="text" placeholder={'Enter the password again!'} className={`VerifyCode__form--input-input ${code.length < 5 && 'VerifyCode__form--input-invalid'}`}/>
                        <i className="fa-solid fa-envelope"></i>
                    </div>

                </div>
                <div className="VerifyCode__form--element">
                    <button disabled={code.length < 5} type={'submit'} className="VerifyCode__form--button"><p>Reset</p></button>
                </div>
                <div className="VerifyCode__form--element">
                    <p className="VerifyCode__form--not-registered">Not a member? <NavLink to={'/register'}>Register</NavLink></p>
                </div>
            </form>

        </div>
    );
};

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        email: state.auth.resetEmail
    }
}

export default connect(mapStateToProps, {resetPassword}) (VerifyCode);
