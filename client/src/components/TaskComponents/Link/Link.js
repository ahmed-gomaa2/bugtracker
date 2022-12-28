import React from 'react';
import {NavLink} from "react-router-dom";

const Link = props => {
    return (
        <td className={'Link'}>
            <NavLink to={''}><i className="fa-solid fa-link"></i></NavLink>
        </td>
    );
};

export default Link;