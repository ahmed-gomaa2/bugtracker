import React, {useState} from 'react';
import dateFormat from '../../../utls/date.format';
import './End.scss';
import {connect} from "react-redux";
import {changeEndDate} from "../../../store/action/workspace.action";

const End = props => {
    const [editing, setEditing] = useState(false);
    const [endDate, setEndDate] = useState(new Date(props.task.end_date).toLocaleDateString('en-CA'));

    function formatDate() {
        const date = new Date(props.task.end_date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    }
    const dateChangeHandler = e => {
        setEndDate(e.target.value);
    }

    const dateSubmitHandler = e => {
        if(endDate > new Date(props.task.start_date).toLocaleDateString('en-CA')) {
            props.changeEndDate(props.task.id, new Date(endDate), props.task.workspace_id);
        }
        setEditing(false);
    }
    return (
        <td className={'End'}>
            {
                editing ? (
                    <div className="End__select-date">
                        <div className="End__calender">
                            <input
                                style={{color: `${props.task.status == 4 && 'black'}`}}
                                value={endDate}
                                onChange={e => dateChangeHandler(e)}
                                min={props.task.start_date}
                                type="date"
                            />
                            <button onClick={dateSubmitHandler}><i className="fa-solid fa-check"></i></button>
                        </div>

                        <div onClick={e => setEditing(false)} className="End__backdrop"></div>
                    </div>
                ): (
                    <p onClick={e => setEditing(true)} className={'End__date'}><span>{dateFormat(props.end_date)}</span><i className="fa-solid fa-calendar-days"></i></p>
                )
            }
        </td>
    );
};

export default connect(null, {changeEndDate}) (End);