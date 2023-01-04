import React from 'react';
import './Filters.scss';
import Filter from "./Filter/Filter";

const filters = {
    type: {
        0: 'All',
        1: 'Bug',
        2: 'Feature',
        3: 'Task'
    },
    status: {
        0: 'All',
        1: 'Not Started',
        2: 'In Progress',
        3: 'to be tested',
        4: 'done'
    },
    priority: {
        0: 'All',
        1: 'high',
        2: 'medium',
        3: 'low',
    }

}

const Filters = props => {
    return (
        <div className={'Filters'}>
            <div className="Filters__container">
                {
                    Object.keys(filters).map((k, i) => (
                        <Filter key={i} filter={k} index={i} filters={filters} />
                    ))
                }
            </div>
        </div>
    );
};

export default Filters;