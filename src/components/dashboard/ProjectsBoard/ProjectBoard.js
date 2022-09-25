import React from 'react';
import { useSelector } from 'react-redux';
import { useGetProjectsQuery } from '../../../features/projects/projectsApi';
import Backlog from './Backlog/Backlog';
import Blocked from './Blocked/Blocked';
import Doing from './Doing/Doing';
import Done from './Done/Done';
import Ready from './Ready/Ready';
import Review from './Review/Review';

const ProjectBoard = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const {
    data: projectsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProjectsQuery(user.email) || {};

  console.log(projectsData);

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
