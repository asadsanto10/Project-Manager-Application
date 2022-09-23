/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateTeamAssignMutation } from '../../../features/teams/teamsApi';
import { useGetUserQuery } from '../../../features/users/usersApi';
import validateEmailCheck from '../../../utils/validEmailCheck';
import Error from '../../ui/Error';

const AssignTeamModal = ({ id, teamName, teamColor, assign, open, control, refetch }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userCheckEmail, setUserCheckEmail] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user } = useSelector((state) => state.auth) || {};

  const { data } = useGetUserQuery(userEmail, { skip: !userCheckEmail });
  const [updateTeamAssign, { isSuccess, isLoading }] = useUpdateTeamAssignMutation();

  // console.log(assign);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      userEmail !== '' &&
      userEmail.trim() &&
      !(data?.length > 0 && user.email === data[0]?.email) &&
      !assign?.includes(userEmail)
    ) {
      setSuccess(false);
      updateTeamAssign({
        id,
        data: {
          assign: [...assign, userEmail],
        },
      });

      e.target.reset();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setSuccess(true);
      // control();
      setUserEmail('');
      setUserCheckEmail(false);
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  // success message hide
  setTimeout(() => {
    setSuccess(false);
  }, 10000);

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
    if (validateEmailCheck(e.target.value)) {
      setSuccess(false);
      setUserCheckEmail(true);
      setUserEmail(e.target.value);
    }
  };

  const handelEmailCheck = deboundeHandler(doCheck, 500);
  // console.log(userEmail);
  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        />
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Assign Member for <span style={{ color: teamColor }}>{teamName}</span> Team
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="User Email"
                  // value={}
                  onChange={handelEmailCheck}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                // disabled={isLoading}
                disabled={
                  isLoading ||
                  data?.length === 0 ||
                  (data?.length > 0 && user.email === data[0]?.email) ||
                  assign?.includes(userEmail)
                }
              >
                Assign user
              </button>
            </div>

            {/* error */}

            {(data?.length === 0 && <Error message="Sorry user does not exist!" />) ||
              (data?.length > 0 && user.email === data[0]?.email && (
                <Error message="You have already assignd the team" />
              )) ||
              (assign?.includes(userEmail) && (
                <Error message="This email is already assigned to the team" />
              ))}

            {success && (
              <div className="flex items-center">
                <div className="relative bg-green-200 max-w-xl px-4 py-2 text-green-800 rounded shadow w-full">
                  <span className="block text-sm">Member Assign Successfully</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </>
    )
  );
};

export default AssignTeamModal;
