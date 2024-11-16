import React from 'react';
import PropTypes from 'prop-types';
import Avatar from "react-avatar";

function Members({ username }) {
  return (
    <div className="flex items-start justify-start mb-2">
      <Avatar
        name={username.toString()}
        size={40}
        round="14px"
        className='mt-2 '
      />
      <span className='ml-2 mt-4 text-2xl text-gray-400'>{username.toString()}</span>
    </div>
  );
}

// Define prop types
Members.propTypes = {
  username: PropTypes.string.isRequired, 
};

export default Members;
