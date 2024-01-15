import Image from "next/image";

import UserPfp from '~/images/UserPfp.png';

type Props = {
  text: string;
};

const UserTextBubble: React.FC<Props> = ({ text }) => {
  return (
    <div
      className="flex flex-row w-3/4 self-end justify-end mt-2 mb-2"
    >
      <div className="flex flex-1 flex-col text-right">
        <span className="font-semibold text-md text-foreground mt-3 mb-3">You</span>
        <p className="text-md text-foreground">{text}</p>
      </div>
      <Image src={UserPfp} alt="AI Icon" className="w-10 h-10 ml-2" />
    </div>
  )
};

export default UserTextBubble;
