import moment from 'moment';
import React from 'react';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';

const ProjectTaskItem = ({
  id,
  teamName,
  teamColor,
  projectTitle,
  creator,
  avatarUrl,
  stage,
  date,
}) => {
  const { user } = useSelector((state) => state.auth) || {};
  const [{ isDragging }, dragItem] = useDrag(() => ({
    type: 'projectCard',
    item: { id, stage },
    // end: (item, monitor) => {
    //   const dropResult = monitor.getDropResult();

    //   if (item && dropResult) {
    //     console.log(item);
    //     console.log(dropResult);
    //   }
    // },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragItem}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
      draggable="true"
    >
      {stage === 'backlog' && user.email === creator && (
        <button
          type="button"
          className="absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
        >
          <svg
            className="w-4 h-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      )}
      <span
        style={{ background: teamColor, color: '#fff' }}
        className="flex items-center h-6 px-3 text-xs font-semibold  rounded-full"
      >
        {teamName}
      </span>
      <h4 className="mt-3 text-sm font-medium">{projectTitle}</h4>
      <div className="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 text-gray-300 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-1 leading-none">{moment(date).format('D MMM  YYYY')}</span>
        </div>

        <img alt="avater" className="w-6 h-6 ml-auto rounded-full" src={avatarUrl} />
      </div>
    </div>
  );
};

export default ProjectTaskItem;
