import React from 'react';
import Footer from '../components/dashboard/Footer';
import Header from '../components/dashboard/Header';
import TeamsHeading from '../components/dashboard/Teams/TeamsHeading';
import TeamsItems from '../components/dashboard/Teams/TeamsItems';

const Teams = () => {
  return (
    <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
      <Header />
      <TeamsHeading />
      <TeamsItems />
      <Footer />
    </div>
  );
};

export default Teams;
