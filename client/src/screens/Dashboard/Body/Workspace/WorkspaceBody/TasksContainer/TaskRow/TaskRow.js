import React from 'react';
import './TaskRow.scss';
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

const TaskRow = props => {
    return (
        <tr className={`TaskRow ${props.task.status == 4 && 'TaskRow__done'}`}>
            <Title title={props.task.title} />
            {/*<Description description={props.task.description} />*/}
            <Type task={props.task} type={props.task.type} />
            <Status task={props.task} status={props.task.status} />
            {/*<Solution solution={props.task.solution} />*/}
            <Start start_date={props.task.start_date} />
            <End task={props.task} end_date={props.task.end_date} />
            <Priority task={props.task} priority={props.task.priority} />
            <Assignees task={props.task} engineers={props.task.engineers} />
            <Link task={props.task} />
        </tr>
    );
};

export default TaskRow;