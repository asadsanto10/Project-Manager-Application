/* eslint-disable no-prototype-builtins */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { useGetProjectsQuery } from '../../../features/projects/projectsApi';
import Error from '../../ui/Error';
import ProjectBoardItems from './ProjectBoardItems';

const ProjectBoard = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const { data: projectsData, isLoading, isError, error } = useGetProjectsQuery(user.email) || {};

  const filterStage = (type) => {
    return projectsData?.filter((p) => p.stage === type);
  };

  // console.log(projectsData);
  let content = '';
  if (isLoading) content = <h3 className="mt-2 text-center">Loading...</h3>;

  if (!isLoading && isError) content = <Error message={error} />;
  if (!isLoading && !isError && projectsData?.length === 0)
    content = <h3 className="mt-2 text-center">No Projets Found</h3>;

  if (!isLoading && !isError && projectsData?.length > 0) {
    content = (
      <DndProvider backend={HTML5Backend}>
        <ProjectBoardItems projectsData={filterStage('backlog')} stage="Backlog" />
        <ProjectBoardItems projectsData={filterStage('ready')} stage="Ready" />
        <ProjectBoardItems projectsData={filterStage('doing')} stage="Doing" />
        <ProjectBoardItems projectsData={filterStage('review')} stage="Review" />
        <ProjectBoardItems projectsData={filterStage('blocked')} stage="Blocked" />
        <ProjectBoardItems projectsData={filterStage('done')} stage="Done" />
      </DndProvider>
    );
  }

  return content;
};

export default ProjectBoard;
