import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {fetchWorkspaceData, deleteTask, changeTitle, changeDescription, changeSolution} from "../../../../../store/action/workspace.action";
import './Task.scss';
import Type from "../../../../../components/TaskComponents/Type/Type";
import Status from "../../../../../components/TaskComponents/Status/Status";
import Start from "../../../../../components/TaskComponents/Start/Start";
import End from "../../../../../components/TaskComponents/End/End";
import Priority from "../../../../../components/TaskComponents/Priority/Priority";
import Assignees from "../../../../../components/TaskComponents/Assignees/Assignees";
import {toggleTaskOpen} from "../../../../../store/action/ui.action";

const Task = props => {
    const [title, setTitle] = useState(props.task.title);
    const [desc, setDesc] = useState(props.task.description);
    const [sol, setSol] = useState(props.task.solution)

    useEffect(() => {
        
    }, []);

    const changeTitleHandler = e => {
        if(title !== props.task.title && title.length > 4) {
            props.changeTitle(title, props.task.id, props.task.workspace_id);
        } else {
            console.log('not changed');
        }
    }

    const descChangeHandler = e => {
        if(desc !== props.task.description && desc.length > 1) {
            props.changeDescription(desc, props.task.id, props.task.workspace_id);
        }
    }

    const solChangeHandler = e => {
        if(sol!== props.task.solution && sol.length > 1) {
            props.changeSolution(sol, props.task.id, props.task.workspace_id);
        }
    }

    return (
        <div className={'Task col-xl-4 col-lg-5 col-md-6 col-sm-8 col-12'}>
            <div className="Task__container bg-white">
                <nav className="Task__nav navbar p-3">
                    <b aria-expanded="false" data-bs-toggle="dropdown" className="Task__nav-title text-light text-capitalize">{props.task.title}</b>
                    <div className="dropdown">
                        <b className="Task__dropdown-btn text-white" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            <i className="fa-solid fa-ellipsis"></i>
                        </b>
                        <ul className="dropdown-menu py-0 dropdown-menu-end bg-primary">
                            <li onClick={e => {
                                props.deleteTask(props.task.workspace_id, props.task.id);
                                props.setOpenTask(false);
                            }} className={'Task__dropdown-item border rounded'}><a className=" dropdown-item text-white " ><i
                                className="fa-solid fa-trash"></i>Delete </a></li>
                        </ul>
                    </div>
                </nav>
                <div className="Task__content px-4 pt-2">
                    <div className="Task__content-name my-3">
                        <form onBlur={e => changeTitleHandler(e)}>
                            <input onChange={e => setTitle(e.target.value)} className={'border-0 h2'} type="text" value={title}/>
                        </form>
                    </div>
                    <table className="Task__content-container table table-borderless">
                        <tr>
                            <td className={'border-0 col-4'}>
                                <p>type</p>
                            </td>
                            <td className={'col-4'}>
                                <Type task={props.task} type={props.task.type} />
                            </td>

                        </tr><tr>
                            <td className={'mx-3'}>
                                <p>status</p>
                            </td>
                            <td>
                                <Status task={props.task} status={props.task.status} />
                            </td>

                        </tr><tr>
                            <td className={'mx-3'}>
                                <p>created</p>
                            </td>
                            <td>
                                <Start start_date={props.task.start_date} />
                            </td>

                        </tr><tr>
                            <td className={'mx-3'}>
                                <p>end</p>
                            </td>
                            <td>
                                <End task={props.task} end_date={props.task.end_date} />
                            </td>

                        </tr><tr>
                            <td className={'mx-3'}>
                                <p>priority</p>
                            </td>
                            <td>
                                <Priority task={props.task} priority={props.task.priority} />
                            </td>

                        </tr><tr>
                            <td className={'mx-3'}>
                                <p>engineers</p>
                            </td>
                            <td>
                                <Assignees task={props.task} engineers={props.task.engineers} />
                            </td>

                        </tr>
                    </table>
                    {
                        props.task.owner ? (
                            <form onBlur={descChangeHandler} className="form mx-2">
                                <label htmlFor="" className={'my-2'}>Description: </label>
                                <textarea onChange={e => setDesc(e.target.value)} className="border-0 w-100 mx-2" value={desc}/>
                            </form>
                        ) : (
                            <div className={'Task__desc my-4'}>
                                <h3>Description</h3>
                                <p className={'mx-3'}>{props.task.description}</p>
                            </div>
                        )
                    }
                    {
                        props.task.owner ? (
                            <div className={'Task__solution mx-2 my-4'}>
                                <h6>Solution</h6>
                                <p className={'mx-3'}>{props.task.solution}</p>
                            </div>
                        ) : (
                            <form onBlur={solChangeHandler} className="form mx-2">
                                <label htmlFor="" className={'my-2'}>Solution: </label>
                                <textarea placeholder={'Write your solution here!'} onChange={e => setSol(e.target.value)} className="border-0 w-100 mx-2" value={sol}/>
                            </form>
                        )
                    }
                </div>
            </div>
            <div onClick={e => props.toggleTaskOpen()} className="Task__close"><i className="fa-solid fa-angles-right"></i></div>
            <div onClick={e => props.toggleTaskOpen()} className="Task__backdrop"></div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        task: state.workspaces.currentSelectedTask
    }
}

export default connect(mapStateToProps, {deleteTask, changeTitle, changeDescription, changeSolution, toggleTaskOpen}) (Task);