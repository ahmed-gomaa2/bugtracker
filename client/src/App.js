import './App.css';
import Navbar from "./components/UI/Navbar/Navbar";
import {Route, Router, Routes} from "react-router-dom";
import Register from "./screens/Register/Register";
import {connect} from "react-redux";

function App() {
  return (
    <div className="App">
        <Navbar />
        <Routes>
            <Route exact path={'/register'} element={<Register />} />
        </Routes>
    </div>
  );
}

const mapStateToProps = state => {
    console.log(state);
    return {
        msg: state.msg
    }
}

export default connect(mapStateToProps) (App);
