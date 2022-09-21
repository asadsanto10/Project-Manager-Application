import gravatarUrl from 'gravatar-url';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  conversationsApi,
  // eslint-disable-next-line prettier/prettier
  useGetConversationsQuery
} from '../../features/conversations/conversationsApi';
import getPartnerInfo from '../../utils/getPartnerInfo';
import Error from '../ui/Error';
import ChatItem from './ChatItem';

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth) || {};
  const dispatch = useDispatch();
  const { data: conversations, isLoading, isError, error } = useGetConversationsQuery(user.email);
  // console.log(data);
  // render content
  const { data, totalCount } = conversations || {};

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) {
      dispatch(
        conversationsApi.endpoints.getMoreConversations.initiate({
          email: user.email,
          page,
        })
      );
    }
  }, [page, dispatch, user.email]);

  useEffect(() => {
    if (totalCount > 0) {
      const more =
        Math.ceil(totalCount / Number(process.env.REACT_APP_CONVERSATIONS_PER_PAGE)) > page;

      setHasMore(more);
    }
  }, [totalCount, page]);

  let content = null;

  if (isLoading) content = <li className="mt-2 text-center">Loading...</li>;

  if (!isLoading && isError) content = <Error message={error} />;
  if (!isLoading && !isError && data?.length === 0)
    content = <li className="mt-2 text-center">No Conversation Found</li>;

  if (!isLoading && !isError && data?.length > 0)
    content = (
      <InfiniteScroll
        dataLength={data.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={window.innerHeight - 129}
      >
        {data?.map(({ message, id, timestamp, users }) => {
          const { name, email } = getPartnerInfo(users, user.email);

          return (
            <li key={id}>
              <Link to={`/inbox/${id}`}>
                <ChatItem
                  avatar={
                    gravatarUrl(email, {
                      size: 80,
                    }) || 'https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg'
                  }
                  name={name}
                  lastMessage={message}
                  lastTime={moment(timestamp).fromNow()}
                />
              </Link>
            </li>
          );
        })}
      </InfiniteScroll>
    );
  return <ul>{content}</ul>;
}
