import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const baseClass =
    ' py-3 px-6 rounded-2xl border border-gray-700/50 transition-colors';

  const activeClass =
    'bg-blue-500/60 border-blue-400 text-white';

  return (
    <div className=" flex min-w-[300px] max-w-[1000px] mx-6 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 p-6 shadow-xl rounded-2xl gap-4 text-white flex-col">

      <div className='flex flex-row gap-4'>

      <NavLink
        to="/"
        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ''}`
        }
      >
        Encrypt / Decrypt
      </NavLink>

      <NavLink
        to="/simulation"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : ''}`
        }
      >
        Visualization
      </NavLink>

      </div>

    </div>
  );
}
