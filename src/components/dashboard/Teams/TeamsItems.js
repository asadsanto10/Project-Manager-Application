import React from 'react';
import { useSelector } from 'react-redux';
import { useGetTeamsQuery } from '../../../features/teams/teamsApi';
import Error from '../../ui/Error';
import TeamsItem from './TeamsItem';

const TeamsItems = () => {
  const { user } = useSelector((state) => state.auth) || {};

  const {
    data: teamsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTeamsQuery(user.email) || {};
  // console.log(teamsData);
  let content;

  if (isLoading) content = <li className="mt-2 text-center">Loading...</li>;

  if (!isLoading && isError) content = <Error message={error} />;
  if (!isLoading && !isError && teamsData?.length === 0)
    content = <li className="mt-2 text-center">No Conversation Found</li>;

  if (!isLoading && !isError && teamsData?.length > 0) {
    content = teamsData.map((teamData) => (
      <TeamsItem key={teamData.id} {...teamData} refetch={refetch} />
    ));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-10 mt-4 gap-6 overflow-auto">
      {content}
    </div>
  );
};

export default TeamsItems;
