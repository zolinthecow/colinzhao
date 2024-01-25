import Image from 'next/image';

import AIIcon from '~/images/AIIcon.png';

type Props = {
  text: string;
};

const AITextBubble: React.FC<Props> = ({ text }) => {
  return (
    <div className="flex flex-row w-3/4 mt-2 mb-2">
      <Image src={AIIcon} alt="AI Icon" className="w-10 h-10 mr-2" />
      <div className="flex flex-1 flex-col">
        <span className="font-semibold text-md text-foreground mt-3 mb-3">
          AI Chat
        </span>
        <p className="text-md text-foreground">{text}</p>
      </div>
    </div>
  );
};

export default AITextBubble;
