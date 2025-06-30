import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Issuer from "./Issuer";
import Wallet from "./Wallet";
import Verifier from "./Verifier";

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/issuer" style={{ marginRight: 10 }}>Issuer</Link>
        <Link to="/wallet" style={{ marginRight: 10 }}>Wallet</Link>
        <Link to="/verifier">Verifier</Link>
      </nav>
      <Routes>
        <Route path="/issuer" element={<Issuer />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/verifier" element={<Verifier />} />
        <Route path="*" element={<Issuer />} />
      </Routes>
    </Router>
  );
}

export default App;
