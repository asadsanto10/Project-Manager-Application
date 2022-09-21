/* eslint-disable jsx-a11y/label-has-associated-control */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  conversationsApi,
  useAddConversationMutation,
  // eslint-disable-next-line prettier/prettier
  useEditConversationMutation
} from '../../features/conversations/conversationsApi';

import { useGetUserQuery } from '../../features/users/usersApi';
import validateEmailCheck from '../../utils/validEmailCheck';
import Error from '../ui/Error';

/* eslint-disable jsx-a11y/no-static-element-interactions */
export default function Modal({ open, control }) {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [userCheckEmail, setUserCheckEmail] = useState(false);
  const [conversations, setConversations] = useState(undefined);

  const { data } = useGetUserQuery(to, { skip: !userCheckEmail });
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};

  const dispatch = useDispatch();

  const [addConversation, { isSuccess: isAddConversationSuccess }] = useAddConversationMutation();
  const [editConversation, { isSuccess: isEditConversationSuccess }] =
    useEditConversationMutation();

  useEffect(() => {
    if (data?.length > 0 && email !== data[0]?.email) {
      dispatch(
        conversationsApi.endpoints.getConversation.initiate({
          userEmail: email,
          participantEmail: to,
        })
      )
        .unwrap()
        .then((resData) => {
          setConversations(resData);
        })
        .catch((error) => console.log(error));
    }
  }, [data, dispatch, email, to]);

  const deboundeHandler = (fn, delay) => {
    let timeOut;
    return (...args) => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const doSearch = (e) => {
    if (validateEmailCheck(e.target.value)) {
      setUserCheckEmail(true);

      setTo(e.target.value);
    }
  };

  const handelEmailSearch = deboundeHandler(doSearch, 500);

  // listen conversation add/edit success
  useEffect(() => {
    if (isAddConversationSuccess || isEditConversationSuccess) {
      control();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddConversationSuccess, isEditConversationSuccess]);

  const handelSubmit = (e) => {
    e.preventDefault();
    if (conversations?.length > 0) {
      // edit conversations
      editConversation({
        sender: email,
        id: conversations[0]?.id,
        data: {
          participants: `${email}-${data[0]?.email}`,
          users: [user, data[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    } else if (conversations?.length === 0) {
      // add conversation
      addConversation({
        sender: email,
        data: {
          id: Math.floor(Math.random() * 100000),
          participants: `${email}-${data[0]?.email}`,
          users: [user, data[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    }
  };

  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        />
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Send message</h2>
          <form className="mt-8 space-y-6" onSubmit={handelSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  // value={to}
                  onChange={handelEmailSearch}
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  id="message"
                  name="message"
                  type="message"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={
                  conversations === undefined || (data?.length > 0 && email === data[0]?.email)
                }
              >
                Send Message
              </button>
            </div>

            {data?.length === 0 && <Error message="User Does not exist" />}
            {data?.length > 0 && email === data[0]?.email && (
              <Error message="You cannot send messages yourself" />
            )}
          </form>
        </div>
      </>
    )
  );
}
