import React from 'react';
import './Home.scss';
import HomeToolbar from "./HomeToolbar/HomeToolbar";
import WorkspacesList from "../WorkspacesList/WorkspacesList";
import Toolbar from "../../../../components/HOC/Toolbar/Toolbar";

const Home = props => {
    return (
        <div className={'Home'}>
            <Toolbar>
                <HomeToolbar />
            </Toolbar>
            <div className="Home__body">
                <WorkspacesList />
            </div>
        </div>
    );
};

export default Home;
