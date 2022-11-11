import React from 'react';
import './WorkspacesContainer.scss';
import {connect} from "react-redux";
import {deleteWorkspace} from "../../../../store/action/workspace.action";
import Toolbar from "./Toolbar/Toolbar";
import WorkspacesList from "../WorkspacesList/WorkspacesList";

const WorkspacesContainer = props => {
    return (
        <div className={'WorkspacesContainer'}>
            <Toolbar />
            <div className="WorkspacesContainer__body">
                <WorkspacesList />
            </div>
        </div>
    );
};

export default connect(null, {deleteWorkspace}) (WorkspacesContainer);
