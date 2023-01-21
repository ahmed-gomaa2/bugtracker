import React from 'react';
import {NavLink} from "react-router-dom";
import './Link.scss';

const Link = props => {
    return (
        <td className={'Link'}>
            <NavLink to={`/dashboard/workspaces/${props.task.workspace_id}/task/${props.task.id}`}><i className="fa-solid fa-link"></i></NavLink>
        </td>
    );
};

export default Link;