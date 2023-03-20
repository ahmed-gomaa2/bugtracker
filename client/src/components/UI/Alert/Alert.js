import React from 'react';
import {connect} from "react-redux";
import './Alert.scss'

const Alert = (props) => {
    return (
        <div className={'Alert'}>
            {
                props.alerts.map(alert => (
                    <div key={alert.id} className={`Alert__item Alert__item-${alert.alertType}`}>
                        {alert.msg}
                    </div>
                ))
            }
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        alerts: state.notifications.alerts
    }
}

export default connect(mapStateToProps) (Alert);