import React from 'react';
import './Body.scss';
import {connect} from "react-redux";
import {Outlet} from "react-router-dom";

const Body = props => {
    return (
        <div style={!props.toggleSidebar ? {flex: 0.9} : {flex: 0.7}} className={'Body'}>
            <Outlet />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        toggleSidebar: state.ui.toggleSidebar
    }
}

export default connect(mapStateToProps) (Body);
