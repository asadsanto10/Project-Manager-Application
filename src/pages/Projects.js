/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unknown-property */
import React from 'react';
import Footer from '../components/dashboard/Footer';
import Header from '../components/dashboard/Header';
import Backlog from '../components/dashboard/ProjectsBoard/Backlog/Backlog';
import Blocked from '../components/dashboard/ProjectsBoard/Blocked/Blocked';
import Doing from '../components/dashboard/ProjectsBoard/Doing/Doing';
import Done from '../components/dashboard/ProjectsBoard/Done/Done';
import ProjectBoardHeading from '../components/dashboard/ProjectsBoard/ProjectBoardHeading';
import Ready from '../components/dashboard/ProjectsBoard/Ready/Ready';
import Review from '../components/dashboard/ProjectsBoard/Review/Review';

const Projects = () => {
  return (
    <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
      <Header />
      <ProjectBoardHeading />
      <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
        <Backlog />
        <Ready />
        <Doing />
        <Review />
        <Blocked />
        <Done />

        <div className="flex-shrink-0 w-6" />
      </div>
      <Footer />
    </div>
  );
};

export default Projects;
