import React from 'react';
import TeamsItem from './TeamsItem';

const TeamsItems = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-10 mt-4 gap-6 overflow-auto">
      <TeamsItem />
    </div>
  );
};

export default TeamsItems;
