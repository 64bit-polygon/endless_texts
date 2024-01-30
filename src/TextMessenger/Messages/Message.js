import * as React from 'react';
import TextMessage from "./TextMessage";
import EmojiMessage from "./EmojiMessage";

const Message = ({
  messageText,
  initAbortMessageCnt,
  delay,
  id,
  removeHiddenMessages,
  insertMessage,
  isAnimating,
  isEmoji,
  hasDate,
  showTail,
  previousId
}) => {
  return (
    <>
    { isEmoji ? (
      <EmojiMessage
        messageText={messageText}
        delay={delay}
        id={id}
        removeHiddenMessages={removeHiddenMessages}
        insertMessage={insertMessage}
        isAnimating={isAnimating}
        hasDate={hasDate}
        previousId={previousId}
      />
    ) : (
      <TextMessage
        messageText={messageText}
        initAbortMessageCnt={initAbortMessageCnt}
        delay={delay}
        id={id}
        removeHiddenMessages={removeHiddenMessages}
        insertMessage={insertMessage}
        isAnimating={isAnimating}
        hasDate={hasDate}
        showTail={showTail}
        previousId={previousId}
      />
    )}
    </>
  )
}

export default Message;
