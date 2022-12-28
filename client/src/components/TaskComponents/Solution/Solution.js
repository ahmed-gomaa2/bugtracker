import React, {useState} from 'react';

const Solution = props => {
    const [editing, setEditing] = useState(false);
    return (
        <td className={'Solution'}>
            {
                editing ? (
                    <form>
                        <input />
                        <button>Edit</button>
                    </form>
                ) : (
                    <p>{props.solution}</p>
                )
            }
        </td>
    );
};

export default Solution;