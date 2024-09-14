import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { FaHome, FaPlusCircle, FaImages } from "react-icons/fa";
import Minter from "./components/Minter";
import NFTGallery from "./components/NFTGallery";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <nav className="bg-white shadow-xl fixed h-full z-30 w-64">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-xl font-bold text-gray-800">
                NFT Minting Engine
              </h1>
            </div>
            <ul className="flex-grow py-4">
              <NavItem to="/" icon={<FaHome size={20} />} text="Home" />
              <NavItem
                to="/mint"
                icon={<FaPlusCircle size={20} />}
                text="Mint NFT"
              />
              <NavItem
                to="/gallery"
                icon={<FaImages size={20} />}
                text="NFT Gallery"
              />
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 ml-64">
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-6xl p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mint" element={<Minter />} />
                <Route path="/gallery" element={<NFTGallery />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

function NavItem({ to, icon, text }) {
  return (
    <li className="mb-2">
      <Link
        to={to}
        className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-150 ease-in-out"
      >
        <span className="mr-3">{icon}</span>
        <span>{text}</span>
      </Link>
    </li>
  );
}

function Home() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to NFT Minting Engine
      </h2>
      <p className="text-gray-600 mb-4">
        This application allows you to mint your own NFTs and view a gallery of
        existing NFTs.
      </p>
      <p className="text-gray-600">
        Use the sidebar menu to navigate between minting new NFTs and viewing
        the NFT gallery.
      </p>
    </div>
  );
}

export default App;
