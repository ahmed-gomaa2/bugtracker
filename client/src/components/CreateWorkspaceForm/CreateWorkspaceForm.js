import React, {useState} from 'react';
import './CreateWorkspaceForm.scss';
import {connect} from "react-redux";
import {createWorkspace} from "../../store/action/workspace.action";
import {toggleWorkspaceCreateForm} from "../../store/action/ui.action";

const CreateWorkspaceForm = props => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const formSubmitHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        console.log('hello')

        if(name.trim().length > 0 && desc.trim().length > 0) {
            console.log('hello again')
            const workspace = {
                name: name,
                description: desc
            }

            props.createWorkspace(workspace);

            setName('');
            setDesc('');

            props.toggleWorkspaceCreateForm();
        }
    }

    return (
        <div className={`CreateWorkspaceForm ${props.toggleForm && 'CreateWorkspaceForm__show'}`}>
            <div onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                props.toggleWorkspaceCreateForm();
            }} className="CreateWorkspaceForm__backdrop"></div>
            <form onSubmit={formSubmitHandler} className="CreateWorkspaceForm__form">
                <div className="CreateWorkspaceForm__form--header">
                    <h3>Create New Workspace</h3>
                </div>
                <div className="CreateWorkspaceForm__form--element">
                    <label htmlFor="name" className="CreateWorkspaceForm__form--element-label">Nam:</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} name={'name'} className="CreateWorkspaceForm__form--element-input"/>
                </div>
                <div className="CreateWorkspaceForm__form--element">
                    <label htmlFor="name" className="CreateWorkspaceForm__form--element-label">Description: </label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} name={'name'} className="CreateWorkspaceForm__form--element-input"/>
                </div>
                <div className="CreateWorkspaceForm__form--buttons">
                    <button type={"submit"} disabled={name.trim().length === 0 || desc.trim().length === 0} className="CreateWorkspaceForm__form--buttons-button CreateWorkspaceForm__form--buttons-submit">Submit</button>
                    <button type={'cancel'} onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        props.toggleWorkspaceCreateForm();
                    }} className="CreateWorkspaceForm__form--buttons-button CreateWorkspaceForm__form--buttons-cancel">Cancel</button>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        toggleForm: state.ui.toggleWorkspaceCreate
    }
}

export default connect(mapStateToProps, {createWorkspace, toggleWorkspaceCreateForm}) (CreateWorkspaceForm);
