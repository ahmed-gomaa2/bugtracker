import React from 'react';
import './SidebarFull.scss';
import {connect} from "react-redux";

const SidebarFull = props => {
    return (
        <div className={'SidebarFull'}>

        </div>
    );
};

const mapStateToProps = state => {
    return {

    }
}

export default connect(mapStateToProps) (SidebarFull);
