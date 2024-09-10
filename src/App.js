import React from "react";
import Minter from "./components/Minter";
import NFTGallery from "./components/NFTGallery";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col gap-10 items-center justify-center px-4 sm:px-6 lg:px-8">
      <Minter />
      <NFTGallery />
    </div>
  );
}

export default App;
