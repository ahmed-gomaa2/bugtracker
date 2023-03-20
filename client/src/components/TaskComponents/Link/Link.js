import React from 'react';
import {NavLink} from "react-router-dom";
import './Link.scss';
import {connect} from "react-redux";
import {changeSelectedTask} from "../../../store/action/workspace.action";
import {toggleTaskOpen} from "../../../store/action/ui.action";

const Link = props => {
    return (
        <td className={'Link'}>
            <p onClick={e => {
                props.toggleTaskOpen();
                props.changeSelectedTask(props.task);
            }} style={{color: `${props.task.status == 4 && 'lightblue'}`}} >{props.task.title}</p>
        </td>
    );
};

export default connect(null, {changeSelectedTask, toggleTaskOpen}) (Link);