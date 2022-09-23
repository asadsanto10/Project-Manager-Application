/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetTeamsQuery } from '../../../features/teams/teamsApi';

const AddProjectModal = ({ open, control }) => {
  const [teamName, setTeamName] = useState('');
  const [projectTitle, setprojectTitle] = useState('');

  const { user } = useSelector((state) => state.auth) || {};
  const { data: teamsData, isLoading, isError, error } = useGetTeamsQuery(user.email) || {};

  console.log(teamsData);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
          style={{ margin: 0 }}
        />
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Add New Project
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  name="teamName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <div>
                <input
                  name="projectTitle"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Project Title"
                  value={projectTitle}
                  onChange={(e) => setprojectTitle(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                // disabled={isLoading}
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </>
    )
  );
};

export default AddProjectModal;
