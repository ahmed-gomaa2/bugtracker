import React from 'react';
import './WorkspacesList.scss';
import WorkspacesItem from "./WorkspacesListItem/WorkspacesListItem";
import {connect} from "react-redux";
import {toggleWorkspaceCreateForm} from "../../../../store/action/ui.action";
import Spinner from "../../../../components/UI/Spinner/Spinner";

const WorkspacesList = props => {
    return (
        <div className="Home__workspaces my-3 ">
            <div className="Home__workspaces--header">
                <h2>Workspaces</h2>
                <p onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.toggleWorkspaceCreateForm();
                }} className="Home__workspaces--add">
                    <i className="fa-solid fa-plus"></i>
                    <span>Add New</span>
                </p>
            </div>
            {
                props.fetchingWorkspaces ? <Spinner /> : (
                    <div className="Home__workspaces--menu">
                        {
                            props.workspaces.map((ws, i) => (
                                <WorkspacesItem ws={ws} key={i} />
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
};

const mapStateToProps = state => {
    return {
        workspaces: state.workspaces.workspaces,
        fetchingWorkspaces: state.workspaces.fetchingWorkspaces
    }
}

export default connect(mapStateToProps, {toggleWorkspaceCreateForm}) (WorkspacesList);
