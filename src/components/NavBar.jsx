import React from 'react';

export default function NavBar() {

  return (
    <div className='h-screen flex min-w-[300px] bg-gray-900/80 backdrop-blur-md border border-gray-700/50  p-6 shadow-xl gap-4 text-white flex-col '>
      <div className='bg-gray-800/60 py-3 px-6 rounded-2xl  border border-gray-700/50'>Encrypt/Decrypt</div>
      <div className='bg-gray-800/60 py-3 px-6 rounded-2xl  border border-gray-700/50'>Visualization</div>
      <div className='bg-gray-800/60 py-3 px-6 rounded-2xl  border border-gray-700/50'>Settings</div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
