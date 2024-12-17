import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import EnterCode from "./components/Pages/EnterCode/EnterCode";
import MainPage from "./components/Pages/MainPage/MainPage";
import CreateClient from "./components/Pages/CreateClient";
import EditExistingClient from "./components/Pages/EditExistingClient";
import TopNavBar from "./components/Functions/TopNavBar/TopNavBar";
import Draft from './components/Pages/DraftPage/DraftPage';
import PageNotFound from './components/Pages/ErrorPage/PageNotFound/PageNotFound';

// conditionally render TopNavBar
const Layout = ({ children }) => {
  const location = useLocation();

  // Hide TopNavBar only when rendering PageNotFound
  const is404 = location.pathname !== "/" && !["/MainPage", "/draft", "/create-client", "/edit-existing-client"].includes(location.pathname);

  return (
    <>
      {!is404 && <TopNavBar />}
      {children}
    </>
  );
};

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<EnterCode />} />
            <Route path="/MainPage" element={<MainPage />} />
            <Route path="/draft" element={<Draft />} />
            <Route path="/create-client" element={<CreateClient />} />
            <Route path="/edit-existing-client" element={<EditExistingClient />} />
            <Route path="*" element={<PageNotFound />} /> {/* Catch-all route */}
          </Routes>
        </Layout>
      </Router>
    );
  }
}

export default App;
