import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import logoImage from '../../assets/images/lws-logo-dark.svg';
import { userLoggedOut } from '../../features/auth/authSlice';

const Header = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const handelShowHide = () => {
    setShow((prevState) => !prevState);
  };

  const handelLogout = () => {
    dispatch(userLoggedOut());
    localStorage.removeItem('auth');
  };
  return (
    <div className="flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
      <img src={logoImage} alt="logo" className="h-10 w-10" />
      <div className="ml-10">
        <NavLink
          to="/projects"
          // className="mx-2 text-sm font-semibold text-indigo-700"
          className={({ isActive }) =>
            `${
              isActive ? 'text-indigo-700 ' : 'text-gray-600 '
            }mx-2 text-sm font-semibold hover:text-indigo-700`
          }
        >
          Projects
        </NavLink>
        <NavLink
          to="/teams"
          // className="mx-2 text-sm font-semibold text-gray-600 hover:text-indigo-700"
          className={({ isActive }) =>
            `${
              isActive ? 'text-indigo-700 ' : 'text-gray-600 '
            }mx-2 text-sm font-semibold hover:text-indigo-700`
          }
        >
          Team
        </NavLink>
      </div>
      <div
        type="button"
        className="flex items-center justify-center ml-auto overflow-hidden rounded-full cursor-pointer font-bold"
      >
        {user.name}
      </div>

      <div className="relative ml-3">
        <div>
          <button
            onClick={handelShowHide}
            type="button"
            className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <img className="h-8 w-8 rounded-full" src={user.avatarUrl} alt="avater" />
          </button>
        </div>

        <div
          className={`${
            !show && 'hidden'
          } absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabIndex="-1"
        >
          <button
            onClick={handelLogout}
            type="button"
            href="#"
            className="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            tabIndex="-1"
            id="user-menu-item-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
