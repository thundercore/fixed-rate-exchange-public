import React from "react";
import Navbar from "components/Navbar";
import "./index.css";
import "bulma";
import { HashRouter } from "react-router-dom";
import RenderRoutes from "utils/routes";
import Footer from "components/Footer";
import WalletConnector from "components/WalletConnector.js";

function App() {
  return (
    <main className="bg-gray-200 min-h-screen p-4">
      <HashRouter>
        <WalletConnector>
          <Navbar />
          <RenderRoutes />
          <Footer />
        </WalletConnector>
      </HashRouter>
    </main>
  );
}

export default App;
