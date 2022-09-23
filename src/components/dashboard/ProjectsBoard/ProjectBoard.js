import React from 'react';
import Backlog from './Backlog/Backlog';
import Blocked from './Blocked/Blocked';
import Doing from './Doing/Doing';
import Done from './Done/Done';
import Ready from './Ready/Ready';
import Review from './Review/Review';

const ProjectBoard = () => {
  return (
    <>
      <Backlog />
      <Ready />
      <Doing />
      <Review />
      <Blocked />
      <Done />
    </>
  );
};

export default ProjectBoard;
