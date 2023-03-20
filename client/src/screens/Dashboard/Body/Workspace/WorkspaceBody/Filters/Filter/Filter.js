import React from 'react';
import {filterWorkspaceTasks, filterAssignedTasks} from "../../../../../../../store/action/workspace.action";
import {connect} from "react-redux";
import './Filter.scss';

const Filter = props => {
    const getKeyValue = (e) => {
        const filtersKeys = Object.keys(props.filters[props.filter]);
        for(let key of filtersKeys) {
            if(e.target.value === props.filters[props.filter][key]) return key;
        }
    }
    const filterChangeHandler = e => {
        e.preventDefault();
        if(props.type === 0) {
            props.filterWorkspaceTasks(props.filter, +getKeyValue(e));
        }else {
            props.filterAssignedTasks(props.filter, +getKeyValue(e));
        }
    }
    return (
        <div className="Filters__element">
            <label htmlFor="type" className="Filters__element-label small">{props.filter.toUpperCase()}: </label>
            <select onChange={filterChangeHandler} name="type" id="type" className="Filters__element-select small">
                {
                    Object.keys(props.filters[props.filter]).map((v, i) => (
                        <option className={'small'} key={i}>{props.filters[props.filter][v]}</option>
                    ))
                }
            </select>
        </div>
    );
};

export default connect(null, {filterWorkspaceTasks, filterAssignedTasks}) (Filter);