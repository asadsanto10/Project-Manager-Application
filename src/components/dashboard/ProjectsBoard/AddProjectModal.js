/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddNewProjectMutation } from '../../../features/projects/projectsApi';
import { useGetTeamNameQuery } from '../../../features/teams/teamsApi';
import Error from '../../ui/Error';

const AddProjectModal = ({ open, control }) => {
  const [teamName, setTeamName] = useState('');
  const [projectTitle, setprojectTitle] = useState('');
  const [assignd, setAssignd] = useState(false);

  const { user } = useSelector((state) => state.auth) || {};
  const { data: teamsData } =
    useGetTeamNameQuery(teamName !== '' && teamName.toLocaleLowerCase()) || {};

  const [addNewProject, { isSuccess, isLoading }] = useAddNewProjectMutation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mathcTeam = teamsData?.map((team) => team) || [];

  // check exist team name or access
  useEffect(() => {
    if (mathcTeam[0]?.assign?.includes(user.email)) {
      setAssignd(true);
    } else {
      setAssignd(false);
    }
  }, [mathcTeam, user.email]);

  const deboundeHandler = (fn, delay) => {
    let timeOut;
    return (...args) => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const doCheck = (e) => {
    // setSuccess(false);
    // setUserCheckEmail(true);
    if (e.target.value !== '') {
      setTeamName(e.target.value);
    }
  };

  const handelTeamCheck = deboundeHandler(doCheck, 500);

  // create project
  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamsData.length > 0 && assignd) {
      addNewProject({
        id: Math.floor(Math.random() * 100000),
        teamName,
        teamColor: mathcTeam[0]?.teamColor,
        projectTitle,
        creator: user.email,
        avatarUrl: user.avatarUrl,
        stage: 'backlog',
        date: new Date().getTime(),
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTeamName('');
      setprojectTitle('');
      control();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

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
                  onChange={handelTeamCheck}
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
                disabled={isLoading}
              >
                Create Project
              </button>
            </div>
            {teamName !== '' && teamsData.length === 0 && <Error message="Team Name not found" />}
            {teamName !== '' && teamsData.length > 0 && !assignd && (
              <Error message="You not assigned to this team" />
            )}
          </form>
        </div>
      </>
    )
  );
};

export default AddProjectModal;
