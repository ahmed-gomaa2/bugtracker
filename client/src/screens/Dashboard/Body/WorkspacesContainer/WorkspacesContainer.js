import React from 'react';
import './WorkspacesContainer.scss';
import {connect} from "react-redux";
import {deleteWorkspace} from "../../../../store/action/workspace.action";
import WorkspacesContainerToolbar from "./WorkspacesContainerToolbar/WorkspacesContainerToolbar";
import WorkspacesList from "../WorkspacesList/WorkspacesList";
import Toolbar from "../../../../components/HOC/Toolbar/Toolbar";

const WorkspacesContainer = props => {
    return (
        <div className={'WorkspacesContainer'}>
            <Toolbar>
                <WorkspacesContainerToolbar />
            </Toolbar>
            <div className="WorkspacesContainer__body">
                <WorkspacesList />
            </div>
        </div>
    );
};

export default connect(null, {deleteWorkspace}) (WorkspacesContainer);
