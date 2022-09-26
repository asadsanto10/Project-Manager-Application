import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { useUpdateProjectMutation } from '../../../features/projects/projectsApi';
import AddProjectModal from './AddProjectModal';
import ProjectTaskItem from './ProjectTaskItem';

const ProjectBoardItems = ({ projectsData: data, stage }) => {
  // modal
  const [opened, setOpened] = useState(false);
  const addProjectModalControll = () => {
    setOpened((prevState) => !prevState);
  };
  const { user } = useSelector((state) => state.auth) || {};
  const [projectsData, setProjectData] = useState([]);
  const { search } = useSelector((state) => state.projects) || {};
  // console.log(search);

  useEffect(() => {
    if (data) {
      const filterSearch = data.map((project) => {
        if (search) {
          return project.projectTitle.toLowerCase().match(search.toLowerCase())
            ? { ...project, titleMatch: true }
            : { ...project, titleMatch: false };
        }
        return project;
      });

      setProjectData(filterSearch);
    }
  }, [data, search]);

  const [updateProject] = useUpdateProjectMutation();

  const [{ isOver }, dropItem] = useDrop(() => ({
    accept: 'projectCard',
    drop: (item) => {
      // console.log(item);
      return updateProject({
        id: item.id,
        email: user.email,
        data: {
          ...item,
          stage: stage.toLowerCase(),
        },
      });
      // console.log(monitor);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // console.log(projectsData);

  return (
    <div
      ref={dropItem}
      className="flex flex-col flex-shrink-0 w-72 rounded-t-lg"
      style={{ background: isOver && '#ffffff61' }}
    >
      <div className="flex items-center flex-shrink-0 h-10 px-2">
        <span className="block text-sm font-semibold">{stage}</span>
        <span className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30">
          {projectsData?.length}
        </span>
        {stage === 'Backlog' && (
          <button
            onClick={addProjectModalControll}
            type="button"
            className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex flex-col pb-2 overflow-auto px-2">
        {projectsData.map((project) => (
          <ProjectTaskItem key={project.id} {...project} />
        ))}
      </div>

      <AddProjectModal open={opened} control={addProjectModalControll} />
    </div>
  );
};

export default ProjectBoardItems;
