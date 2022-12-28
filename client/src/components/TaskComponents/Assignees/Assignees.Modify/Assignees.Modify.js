import React, {useEffect, useRef, useState} from 'react';
import './Assignees.Modify.scss';
import randomColor from "../../../../utls/random.color";
import nameFormat from "../../../../utls/name.format";
import {connect} from "react-redux";
import {removeEngineer, addEngineerToTask} from "../../../../store/action/workspace.action";

const AssigneesModify = props => {
    const [users, setUsers] = useState(props.engineers);
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        // props.updateSearchTerm(e.target.value)
        let value = e.target.value;
        let usersMatch = [];

        if(value && value.trim().length > 0) {
            value = value.trim().toLowerCase();

            for(let i = 0; i < props.users.length; i++) {
                if(props.users[i].username.trim().toLowerCase().includes(value)) {
                    usersMatch.push(props.users[i]);
                }
            }
            const firstLetter = value.split('').splice(0, 1);
            usersMatch.sort((a, b) => a.username.toLowerCase().split('').indexOf(firstLetter[0]) - b.username.toLowerCase().split('').indexOf(firstLetter[0]));
        }else{
            usersMatch = [];
        }
        setUsers(usersMatch.filter(u => u.id !== props.currentUser.id));
    };

    const dropdownRef = useRef();

    useEffect(() => {
        if(dropdownRef.current){
            const elRect = dropdownRef.current.getBoundingClientRect();
            const fromBottom = window.innerHeight - elRect.bottom;
            const fromRight = window.innerWidth - elRect.right;
            if(fromRight < 0 && fromBottom < 0) {
                dropdownRef.current.style.transform = `translate(-${Math.abs(fromRight)}px, -${Math.abs(fromBottom)}px)`
            } else if(fromRight < 0) {
                dropdownRef.current.style.transform = `translateX(-${Math.abs(fromRight)}px)`
            }else if(fromBottom < 0) {
                dropdownRef.current.style.transform = `translateY(-${Math.abs(fromBottom)}px)`
            } else {
                dropdownRef.current.style.transform = 'none';
            }

        }
    }, [props.modify]);



    useEffect(() => {
        return () => {
            setUsers(props.engineers);
            setSearchTerm('');
        }
    }, [props.modify]);

    const engDeleteHandler = eng => {
        props.removeEngineer(eng.id, props.task.id, props.task.workspace_id);
        props.setModify(false);
    }

    const addEngineerHandler = eng => {
        props.addEngineerToTask(eng.id, props.task.id, props.task.workspace_id)
        props.setModify(false);
    }

    return (
        <div ref={dropdownRef} className={`AssigneesModify ${!props.modify && 'AssigneesModify__modify'}`}>
            <form className="Assignees__form">
                <input value={searchTerm} onChange={handleInputChange} type="text" placeholder={'search'}/>
            </form>
            <div className="AssigneesModify__engineers">
                {
                    users.length > 0 && users.map((user, i) => (
                        props.engineers.filter(eng => eng.id === user.id).length > 0 ? (
                            <p onClick={e => engDeleteHandler(user)} className={'AssigneesModify__user'} style={{border: `1px solid red`}}>
                                <span>{nameFormat(user.username)}</span>
                                <span className={'AssigneesModify__remove'}>x</span>
                            </p>
                        ) : (
                            <p onClick={e => {
                                addEngineerHandler(user);
                            }} className={'AssigneesModify__user'} style={{border: `1px solid blue`}}>
                                {nameFormat(user.username)}
                                <span className={'AssigneesModify__add'}>+</span>
                            </p>
                        )
                    ))
                }
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        users: state.auth.users,
        currentUser: state.auth.user
    }
}

export default connect(mapStateToProps, {removeEngineer, addEngineerToTask}) (AssigneesModify);