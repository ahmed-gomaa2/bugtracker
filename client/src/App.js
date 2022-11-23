import './App.css';
import Navbar from "./components/HOC/Navbar/Navbar";
import {Route, Router, Routes} from "react-router-dom";
import Register from "./screens/Register/Register";
import {connect} from "react-redux";
import Login from "./screens/Login/Login";
import {useEffect} from "react";
import {loadUser} from "./store/action/auth.action";
import Spinner from "./components/UI/Spinner/Spinner";
import Dashboard from "./screens/Dashboard/Dashboard";
import ProtectedRoute from "./components/HOC/ProtectedRoute/ProtectedRoute";
import Home from "./screens/Dashboard/Body/Home/Home";
import Workspace from "./screens/Dashboard/Body/Workspace/Workspace";
import Settings from "./screens/Dashboard/Body/Settings/Settings";
import Landing from "./screens/Landing/Landing";
import Workspaces from "./screens/Dashboard/Body/WorkspacesContainer/WorkspacesContainer";
import SendCode from "./screens/SendCode/SendCode";
import VerifyCode from "./screens/VerifyCode/VerifyCode";

function App(props) {
    useEffect(() => {
        props.loadUser();
    }, []);

  return (
    <div className="App">
        {
            !props.loadingUser ? (
                <>
                    <Routes>
                        <Route exact path={'/register'} element={
                            <ProtectedRoute isAuthenticated={!props.isAuthenticated} route={'/dashboard'}>
                                <Navbar>
                                    <Register />
                                </Navbar>
                            </ProtectedRoute>
                        } />
                        <Route exact path={'/login'} element={
                            <ProtectedRoute isAuthenticated={!props.isAuthenticated} route={'/dashboard'}>
                                <Navbar>
                                    <Login />
                                </Navbar>
                            </ProtectedRoute>
                        } />
                        <Route exact path={'/send-code'} element={
                            <ProtectedRoute isAuthenticated={!props.isAuthenticated} route={'/dashboard'}>
                                <Navbar>
                                    <SendCode />
                                </Navbar>
                            </ProtectedRoute>
                        } />
                        <Route exact path={'/verify-code'} element={
                            <ProtectedRoute isAuthenticated={!props.isAuthenticated} route={'/dashboard'}>
                                <Navbar>
                                    <VerifyCode />
                                </Navbar>
                            </ProtectedRoute>
                        } />
                        <Route exact path={'/'} element={
                            <ProtectedRoute isAuthenticated={!props.isAuthenticated} route={'/dashboard'}>
                                <Landing />
                            </ProtectedRoute>
                        } />

                        <Route exact path={'/dashboard'} element={
                            <ProtectedRoute isAuthenticated={props.isAuthenticated} route={'/login'}>
                                <Dashboard />
                            </ProtectedRoute>
                        } >
                            <Route exact path={'/dashboard/home'} element={<Home />} />
                            <Route exact path={'/dashboard/workspaces'} element={<Workspaces />} />
                            <Route exact path={'/dashboard/workspaces/:workspace_id'} element={<Workspace />} />
                            <Route exact path={'/dashboard/settings'} element={<Settings />} />
                        </Route>
                    </Routes>
                </>

            ): (
                <Spinner />
            )
        }
    </div>
  );
}

const mapStateToProps = state => {
    return {
        msg: state.msg,
        loadingUser: state.auth.loading,
        isAuthenticated: state.auth.authenticated
    }
}

export default connect(mapStateToProps, {loadUser}) (App);
