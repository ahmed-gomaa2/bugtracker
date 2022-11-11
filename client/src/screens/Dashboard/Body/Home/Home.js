import React from 'react';
import './Home.scss';
import Toolbar from "./Toolbar/Toolbar";
import WorkspacesList from "../WorkspacesList/WorkspacesList";

const Home = props => {
    return (
        <div className={'Home'}>
            <Toolbar />
            <div className="Home__body">
                <WorkspacesList />
            </div>
        </div>
    );
};

export default Home;
