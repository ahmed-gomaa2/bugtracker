import React, {useEffect, useState} from 'react';
import './EditWorkspaceForm.scss';
import {connect} from "react-redux";
import {editWorkspace} from "../../store/action/workspace.action";
import {toggleWorkspaceEditForm} from "../../store/action/ui.action";

const EditWorkspaceForm = props => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    useEffect(() => {
        console.log('Hello')
        setName(props.editedWorkspace?.name);
        setDesc(props.editedWorkspace?.description);
    }, [props.editedWorkspace]);

    const formSubmitHandler = e => {
        e.preventDefault();

        console.log(props.editedWorkspace);

        if(name !== props.editedWorkspace?.name || desc !== props.editedWorkspace?.description) {
            const workspace = {
                id: props.workspaceId,
                name: name,
                description: desc
            }

            props.editWorkspace(workspace);
            props.toggleWorkspaceEditForm(workspace.id);
        }
    }

    return (
        <div className={`EditWorkspaceForm ${props.toggleEditWorkspace && 'editWorkspaceForm__show'}`}>
            <div onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                props.toggleWorkspaceEditForm(props.editedWorkspace.id);
            }} className="EditWorkspaceForm__backdrop"></div>
            <form onSubmit={formSubmitHandler} action="" className="EditWorkspaceForm__form">
                <div className="EditWorkspaceForm__header">
                    <h3>Edit Workspace</h3>
                </div>
                <div className="EditWorkspaceForm__element">
                    <label htmlFor="" className="EditWorkspaceForm__label">Name:</label>
                    <input type="text" onChange={e => setName(e.target.value)} value={name} className="EditWorkspaceForm__input"/>
                </div>
                <div className="EditWorkspaceForm__element">
                    <label htmlFor="" className="EditWorkspaceForm__label">Description:</label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} className="EditWorkspaceForm__input"/>
                </div>
                <div className="EditWorkspaceForm__buttons">
                    <button type={"submit"} className="EditWorkspaceForm__button EditWorkspaceForm__edit">Edit</button>
                    <button type={'cancel'} onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        props.toggleWorkspaceEditForm(props.editedWorkspace.id);
                    }} className="EditWorkspaceForm__button EditWorkspaceForm__cancel">Cancel</button>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        editedWorkspace: state.workspaces.workspaces?.filter(ws => ws.id === state.ui.editedWorkspaceId)[0],
        toggleEditWorkspace: state.ui.toggleWorkspaceEdit,
        workspaceId: state.ui.editedWorkspaceId
    }
}

export default connect(mapStateToProps, {editWorkspace, toggleWorkspaceEditForm}) (EditWorkspaceForm);
