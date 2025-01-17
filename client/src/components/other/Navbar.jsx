import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the side drawer
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {/* Navbar */}
      <div className="w-full h-[120px] bg-emerald-600 rounded-b-3xl flex justify-between p-4 items-center">
        {/* Toggle Button */}
        <div
          onClick={toggleDrawer}
          className="text-white text-4xl cursor-pointer ml-5"
        >
          {isOpen ? <MenuOpenIcon style={{ fontSize: '40px', color: 'white', cursor: 'pointer' }} /> : <MenuIcon style={{ fontSize: '40px', color: 'white', cursor: 'pointer' }} />}
        </div>
        <h1 className="text-3xl font-bold text-white mr-5">IOITIVE</h1>
      </div>

      {/* Side Drawer */}
      <div
        className={`fixed top-24 left-0 h-full w-72 bg-emerald-600 shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-20`}
      >
        <div className="p-5 text-white ">
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <ul className="space-y-4">
            <li className="cursor-pointer hover:text-emerald-300">Home</li>
            <li className="cursor-pointer hover:text-emerald-300">About</li>
            <li className="cursor-pointer hover:text-emerald-300">Services</li>
            <li className="cursor-pointer hover:text-emerald-300">Contact</li>
          </ul>
        </div>
      </div>

      {/* Overlay (to close drawer when clicking outside) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-10"
          onClick={toggleDrawer}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
