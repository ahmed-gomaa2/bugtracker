import React, {useEffect, useState} from 'react';
import './Assignees.scss';
import nameFormat from "../../../utls/name.format";
import {connect} from "react-redux";
import randomColor from "../../../utls/random.color";
import AssigneesModify from "./Assignees.Modify/Assignees.Modify";

const Assignees = props => {
    const [modify, setModify] = useState(false);

    return (
        <td className={'Assignees'}>
            {
                props.engineers.map((e, i) => (
                    <p key={i} style={{border: `1px solid ${randomColor()}`}}>{nameFormat(e.username)}</p>
                ))
            }
            {
                props.task.owner && (
                    <>
                        <p className={'Assignees__add'} onClick={e => {
                            if(props.task.status === 4) return;
                            setModify(!modify);
                        }}><i className="fa-solid fa-plus"></i></p>
                        <div style={{display: `${modify ? 'block' : 'none'}`}} onClick={e => setModify(false)} className="Assignees__backdrop"></div>
                        <AssigneesModify setModify={setModify} task={props.task} modify={modify} engineers={props.engineers} />
                    </>
                )
            }
        </td>
    );
};

const mapStateToProps = state => {
    return {
        users: state.auth.users
    }
}

export default connect(mapStateToProps) (Assignees);