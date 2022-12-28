import React from 'react';
import './Task.scss';
import Title from "../../../../../../../components/TaskComponents/Title/Title";
import Description from "../../../../../../../components/TaskComponents/Description/Description";
import Type from "../../../../../../../components/TaskComponents/Type/Type";
import Status from "../../../../../../../components/TaskComponents/Status/Status";
import Solution from "../../../../../../../components/TaskComponents/Solution/Solution";
import Start from "../../../../../../../components/TaskComponents/Start/Start";
import End from "../../../../../../../components/TaskComponents/End/End";
import Priority from "../../../../../../../components/TaskComponents/Priority/Priority";
import Assignees from "../../../../../../../components/TaskComponents/Assignees/Assignees";
import Link from "../../../../../../../components/TaskComponents/Link/Link";

const Task = props => {
    return (
        <tr className={'Task'}>
            <Title title={props.task.title} />
            {/*<Description description={props.task.description} />*/}
            <Type type={props.task.type} />
            <Status status={props.task.status} />
            {/*<Solution solution={props.task.solution} />*/}
            <Start start_date={props.task.start_date} />
            <End end_date={props.task.end_date} />
            <Priority priority={props.task.priority} />
            <Assignees task={props.task} engineers={props.task.engineers} />
            <Link  />
        </tr>
    );
};

export default Task;