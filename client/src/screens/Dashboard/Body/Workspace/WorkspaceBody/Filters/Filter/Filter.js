import React from 'react';
import {filterTasks} from "../../../../../../../store/action/workspace.action";
import {connect} from "react-redux";

const Filter = props => {
    const getKeyValue = (e) => {
        const filtersKeys = Object.keys(props.filters[props.filter]);
        for(let key of filtersKeys) {
            if(e.target.value === props.filters[props.filter][key]) return key;
        }
    }
    const filterChangeHandler = e => {
        e.preventDefault();
        props.filterTasks(props.filter, +getKeyValue(e));
    }
    return (
        <div className="Filters__element">
            <label htmlFor="type" className="Filters__element-label">{props.filter.toUpperCase()}: </label>
            <select onChange={filterChangeHandler} name="type" id="type" className="Filters__element-select">
                {
                    Object.keys(props.filters[props.filter]).map((v, i) => (
                        <option key={i}>{props.filters[props.filter][v]}</option>
                    ))
                }
            </select>
        </div>
    );
};

export default connect(null, {filterTasks}) (Filter);