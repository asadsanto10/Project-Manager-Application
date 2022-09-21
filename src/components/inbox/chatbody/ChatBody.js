// import Blank from "./Blank";
import { useParams } from 'react-router-dom';
import { useGetMessagesQuery } from '../../../features/messages/messagesApi';
import Error from '../../ui/Error';
import ChatHead from './ChatHead';
import Messages from './Messages';
import Options from './Options';

export default function ChatBody() {
  const { id } = useParams();

  const { data: messages, isError, isLoading, error } = useGetMessagesQuery(id);
  const { data, totalCount } = messages || {};
  // console.log(data);

  // render content
  let content = null;

  if (isLoading) content = <div>Loading...</div>;

  if (!isLoading && isError) content = <Error message={error} />;
  if (!isLoading && !isError && data?.length === 0) content = <div>No Messages yet</div>;

  if (!isLoading && !isError && data?.length > 0)
    content = (
      <>
        <ChatHead {...(data[0] || {})} />
        <Messages messages={data} totalCount={totalCount} paramsId={id} />
        <Options info={data[0]} />
      </>
    );

  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">
        {content}
        {/* <Blank /> */}
      </div>
    </div>
  );
}
