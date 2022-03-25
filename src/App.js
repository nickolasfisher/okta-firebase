import "./App.css";

import { BrowserRouter as Router } from "react-router-dom";
import AppWithRouterAccess from "./AppWithRouterAccess";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <Router>      
        <AppWithRouterAccess />
    </Router>
  );
}

export default App;
