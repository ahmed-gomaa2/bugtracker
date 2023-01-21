import React from 'react';
import {NavLink} from "react-router-dom";
import './Link.scss';

const Link = props => {
    return (
        <td className={'Link'}>
            <NavLink style={{color: `${props.task.status == 4 && 'lightblue'}`}} to={`/dashboard/workspaces/${props.task.workspace_id}/task/${props.task.id}`}>{props.task.title}</NavLink>
        </td>
    );
};

export default Link;