import React, { useState, useEffect } from 'react'; // Import useEffect and useState

import ProfileProductItem from './ProfileProductItem';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

function ProfileProductsList({ userApps, id, savedApp }) {
  const loading = useSelector((state) => state.user.loading);

  // State to control whether to show the spinner or content
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    // Use a setTimeout to hide the spinner after 2 seconds
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 2000); // 2000 milliseconds (2 seconds)

    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts
    };
  }, []); // Empty dependency array to run this effect only once

  if (userApps?.length === 0) {
    return <h3>No items</h3>;
  } else {
    if (loading || showSpinner) {
      // Show the spinner while loading or for the extra 2 seconds
      return <Spinner />;
    }
    return (
      <>
        {userApps?.map((info) => (
          <ProfileProductItem info={info} id={info._id} key={info._id} savedApp={savedApp} />
        ))}
      </>
    );
  }
}

export default ProfileProductsList;
