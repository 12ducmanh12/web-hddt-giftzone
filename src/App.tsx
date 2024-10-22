import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/bill/:billId" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
