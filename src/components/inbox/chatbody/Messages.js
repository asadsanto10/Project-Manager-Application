import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { messagesApi } from '../../../features/messages/messagesApi';
import Message from './Message';

export default function Messages({ messages = [], totalCount, paramsId }) {
  // console.log(messages);
  // console.log(totalCount);
  const dispatch = useDispatch();
  const {
    user: { email },
  } = useSelector((state) => state.auth) || {};

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) {
      dispatch(
        messagesApi.endpoints.getMoreMessages.initiate({
          id: paramsId,
          page,
        })
      );
    }
  }, [page, dispatch, email, paramsId]);

  useEffect(() => {
    if (totalCount > 0) {
      const more = Math.ceil(totalCount / Number(process.env.REACT_APP_MESSAGES_PER_PAGE)) > page;

      setHasMore(more);
    }
  }, [totalCount, page]);

  return (
    <div
      id="messagesScroll"
      style={{
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
      }}
    >
      <InfiniteScroll
        className="space-y-2 p-6"
        dataLength={messages.length}
        next={fetchMore}
        // style={{ display: "flex", flexDirection: "column-reverse" }}
        inverse
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="messagesScroll"
      >
        {messages
          ?.slice()
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((message) => {
            const { message: lastMessage, id, sender } = message || {};

            const justify = sender.email !== email ? 'start' : 'end';
            return <Message key={id} justify={justify} message={lastMessage} />;
          })}
      </InfiniteScroll>
    </div>
  );
}
