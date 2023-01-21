import React, {useState} from 'react';
import './CreateTask.scss';
import Assignees from "../TaskComponents/Assignees/Assignees";
import {createTask} from "../../store/action/workspace.action";
import {connect} from "react-redux";
import {useNavigate} from "react-router-dom";

const selectors = {
    type: {
        1: 'Bug',
        2: 'Feature',
        3: 'Task'
    },
    status: {
        1: 'Not Started',
        2: 'In Progress',
        3: 'to be tested',
        4: 'done'
    },
    priority: {
        1: 'high',
        2: 'medium',
        3: 'low',
    }
}

const CreateTask = props => {
    const [engineers, setEngineers] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false);
    const [type, setType] = useState(1);
    const [priority, setPriority] = useState(1);
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({
        title: {
            value: '',
            rules: {
                required: true,
                max: 15,
                min: 5
            },
            valid: false,
            touched: false
        },
        description: {
            value: '',
            rules: {
                required: true,
                min: 10,
                max: 150
            },
            valid: false,
            touched: false
        },
        end_date: {
            value: new Date().toLocaleDateString('en-CA'),
            rules: {
                required: true
            },
            valid: false,
            touched: false
        }
    });
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        let value = e.target.value;
        let usersMatch = [];

        if(value && value.trim().length > 0) {
            value = value.trim().toLowerCase();

            for(let i = 0; i < props.users.length; i++) {
                if(props.users[i].username.trim().toLowerCase().includes(value) && !engineers.includes(props.users[i])) {
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

    const formValidator = (value, rules) => {
        let inputIsValid = true;
        if(!rules) {
            return true;
        }

        if(rules.required) {
            inputIsValid = value.trim() !== '' && inputIsValid;
        }

        if(rules.min) {
            inputIsValid = value.length >= rules.min && inputIsValid;
        }

        if(rules.max) {
            inputIsValid = value.length <= rules.max && inputIsValid;
        }

        return inputIsValid;
    }

    const formChangeHandler = (e) => {
        const input = e.target.closest('.Login__form--input-input');
        if(!input) return;
        console.log(input)
        const updatedInputKey = input.dataset.key;
        const updatedFormData = {
            ...form
        }

        console.log(updatedFormData)

        const updatedFormElement = {
            ...updatedFormData[updatedInputKey]
        }

        updatedFormElement.value = e.target.value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = formValidator(updatedFormElement.value, updatedFormElement.rules);
        updatedFormData[updatedInputKey] = updatedFormElement;
        let formIsValid = true;
        for(let inputKey in updatedFormData) {
            console.log(updatedFormData[inputKey].valid)
            formIsValid = updatedFormData[inputKey].valid && formIsValid;
        }
        console.log(updatedFormData)
        setForm(updatedFormData);
        setIsValid(formIsValid);
        console.log(formIsValid)
    }

    const formSubmitHandler = async e => {
        e.preventDefault();
        e.stopPropagation();
        const data = {
            title: form.title.value,
            description: form.description.value,
            type: type,
            priority: priority,
            end_date: new Date(form.end_date.value),
            engineers: engineers,
            workspace_id: props.workspace.id
        }

        if(isValid && engineers.length) {
            setSending(true);
            await props.createTask(data);
            setForm({
                title: {
                    value: '',
                    rules: {
                        required: true,
                        max: 15,
                        min: 5
                    },
                    valid: false,
                    touched: false
                },
                description: {
                    value: '',
                    rules: {
                        required: true,
                        min: 10,
                        max: 150
                    },
                    valid: false,
                    touched: false
                },
                end_date: {
                    value: new Date().toLocaleDateString('en-CA'),
                    rules: {
                        required: true
                    },
                    valid: false,
                    touched: false
                }
            });
            setEngineers([]);
            setUsers([]);
            setSending(false);
            setType(1);
            setPriority(1);
            setIsValid(false);
            props.closeAdding();
        }
    }

    return (
        <div className={'CreateTask'}>
            <form onSubmit={formSubmitHandler} onChange={formChangeHandler} className="CreateTask__form">
                <div className="CreateTask__element">
                    <label htmlFor="title" className="CreateTask__element-label">Title:</label>
                    <input value={form.title.value} data-key={'title'} className={`Login__form--input-input ${!form.title.valid && form.title.touched && 'CreateTask__notValid'}`} type="text" placeholder={'Title'} id={'title'}/>
                </div>
                <div className="CreateTask__element">
                    <label htmlFor="description" className="CreateTask__element-label">Description:</label>
                    <textarea value={form.description.value} data-key={'description'} className={`Login__form--input-input ${!form.description.valid && form.description.touched && 'CreateTask__notValid'}`} placeholder={'Description'} id={'desc'}/>
                </div>
                <div className="CreateTask__element">
                    <label htmlFor="type" className="CreateTask__element-label">Type:</label>
                    <select data-key={'type'} value={type} onChange={e => setType(e.target.value)} name="type" id="type">
                        {
                            Object.keys(selectors.type).map((key, i) => (
                                <option value={key}>{selectors.type[key]}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="CreateTask__element">
                    <label htmlFor="priority">Priority:</label>
                    <select value={priority} onChange={e => setPriority(e.target.value)} data-key={'priority'} name="priority" id="priority">
                        {
                            Object.keys(selectors.priority).map((key, i) => (
                                <option value={+key}>{selectors.priority[key]}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="CreateTask__element">
                    <label htmlFor="end-date" className="CreateTask__element-label">End Date:</label>
                    <input
                        data-key={'end_date'}
                        className={`Login__form--input-input ${!form.end_date.valid && 'CreateTask__notValid'}`}
                        id={'end-date'}
                        type="date"
                    />
                </div>
                <div className="CreateTask__element CreateTask__assignees">
                    <label htmlFor="assignees" className="CreateTask__element-label">Engineers:</label>
                    <div className="CreateTask__engineers">
                        {
                            engineers.map((eng, i) => (
                                <p onClick={e => {
                                    const restEngineers = engineers.filter(u => u.id !== eng.id);
                                    setEngineers(restEngineers);
                                }}>{eng.username}</p>
                            ))
                        }
                    </div>
                    <input onBlur={e => {
                    }} onFocus={e => setSearching(true)} placeholder={'Search for engineer'} value={searchTerm} onChange={handleSearchChange} type="text" className={`CreateTask__search ${!engineers.length && 'CreateTask__notValid'}`}/>
                    {
                        searching && (
                            <div className="CreateTask__results">
                                <p onClick={e => {
                                    setSearchTerm('');
                                    setSearching(false)
                                    setUsers([])
                                }} className={'CreateTask__search-close'}><i className="fa-solid fa-circle-xmark"></i></p>
                                {
                                    users.length > 0 ? (
                                        users.map((user, i) => (
                                            <p onClick={e => {
                                                setEngineers([...engineers, user]);
                                                const restUsers = users.filter(u => u.id !== user.id);
                                                setUsers(restUsers);
                                            }} className={'CreateTask__result'}>{user.username}</p>
                                        ))
                                    ) : (
                                        <p>Search results will show here</p>
                                    )
                                }
                            </div>

                        )
                    }
                </div>
                <div className="CreateTask__buttons">
                    <button onClick={props.closeAdding} className="CreateTask__button CreateTask__cancel" type={'button'}>cancel</button>
                    <button disabled={!isValid || !engineers.length} className="CreateTask__button CreateTask__submit" type={'submit'}>{!sending ? 'submit' : <i className="fa-solid fa-circle-notch"></i>}</button>
                </div>
            </form>
            <div onClick={e => {
                props.closeAdding()
            }} className="CreateTask__backdrop"></div>
        </div>
    );
};

export default connect(null, {createTask}) (CreateTask);