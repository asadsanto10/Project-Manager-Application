import gravatarUrl from 'gravatar-url';
import { useSelector } from 'react-redux';

export default function ChatHead({ sender, receiver }) {
  // console.log(sender);

  const {
    user: { email },
  } = useSelector((state) => state.auth) || {};

  const partner = sender.email === email ? receiver : sender;

  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <img
        className="object-cover w-10 h-10 rounded-full"
        src={gravatarUrl(partner.email, { size: 80 })}
        alt={partner.name}
      />
      <span className="block ml-2 font-bold text-gray-600">{partner.name}</span>
    </div>
  );
}
