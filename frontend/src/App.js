import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EnterCode from "./components/Pages/EnterCode/EnterCode";
import MainPage from "./components/Pages/MainPage/MainPage";
import CreateClient from "./components/Pages/CreateClient";
import EditExistingClient from "./components/Pages/EditExistingClient";
import TopNavBar from "./components/Functions/TopNavBar/TopNavBar";
import Draft from './components/Pages/DraftPage/DraftPage';
import PageNotFound from './components/Pages/ErrorPage/PageNotFound/PageNotFound';

class App extends Component {
  render() {
    return (
      <Router>
        <TopNavBar/>
        <Routes>
          <Route path="/" element={<EnterCode/>} />
          <Route path="/MainPage" element={<MainPage/>}/>
          <Route path="/draft" element={<Draft/>} />
          <Route path="/create-client" element={<CreateClient />} />
          <Route path="/edit-existing-client" element={<EditExistingClient />} />
          <Route path="*" element={<PageNotFound />} /> {/* Catch-all route for 404 */}
        </Routes>
      </Router>
    );
  }
}

export default App;
