'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  handleSubmit: (value: string) => Promise<void>;
};

const AIInputBox: React.FC<Props> = ({ handleSubmit }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState('');

  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      textAreaRef.current.style.height = '0px';
      const scrollHeight = textAreaRef.current.scrollHeight;

      textAreaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [textAreaRef, value]);

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <form className="fixed bottom-6 w-full max-w-5xl flex flex-row">
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(value);
            setValue('');
          }
        }}
        className="w-full max-h-48 text-base border-2 border-input.border rounded-md bg-input.background text-input.foreground placeholder-input.placeholderForeground p-4 overflow-auto"
        placeholder="Message code assistant.."
        rows={1}
      />
      <div
        className={`absolute right-4 self-center w-8 h-8 rounded-md ${value.length > 0 ? 'bg-foreground' : 'bg-input.placeholderForeground'} hover:cursor-pointer hover:bg-zinc-800 text-input.background text-xl font-bold flex items-center justify-center`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.preventDefault();
          if (value.length === 0) return;
          handleSubmit(value);
          setValue('');
        }}
      >
        {showTooltip && (
          <div className="absolute bottom-12 flex flex-col justify-center">
            <div className="bg-zinc-900 text-input.foreground text-sm font-medium p-2 rounded-md whitespace-nowrap">
              Send message
            </div>
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-solid border-transparent border-t-zinc-900 self-center" />
          </div>
        )}
        &uarr;
      </div>
    </form>
  );
};

export default AIInputBox;
