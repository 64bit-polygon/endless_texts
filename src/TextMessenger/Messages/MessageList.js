import * as React from 'react';
import styles from "./styles.module.scss";
import cx from "classnames";
import Message from "./Message";
import useEvent from "./useEvent";

const MessageList = ({messages, removeHiddenMessages, insertMessage}) => {
  const { listen } = useEvent("HidePreviousTail");
  const [hideTailId, setHideTailId] = React.useState();
  React.useEffect(() => {
    return listen(ev => {
      setHideTailId(ev.detail)
    })
  }, [listen])
  if (!messages || !messages.length) {
      return null; 
  }

  const getId = (id, runCnt) => {
    return `${id}-${runCnt}`;
  }
  
  const deliveredMessages = messages.slice(1);
  const curMessage = messages[0];
  
  return (
    <div className={cx(styles.messagesList)}>
      <Message
        messageText={curMessage.messageText}
        initAbortMessageCnt={curMessage.abortMessageCnt}
        delay={curMessage.delay}
        id={getId(curMessage.id, curMessage.runCnt)}
        key={getId(curMessage.id, curMessage.runCnt)}
        removeHiddenMessages={removeHiddenMessages}
        insertMessage={insertMessage}
        isAnimating={true}
        isEmoji={curMessage.isEmoji}
        hasDate={curMessage.hasDate}
        showTail={curMessage.showTail}
        previousId={curMessage.previousId}
      />
      <div className={styles.deliveredMessages}>
    {deliveredMessages.map(
      ({ messageText, abortMessageCnt, delay, id, runCnt, isEmoji, hasDate, showTail, previousId }, index) => {
        return (
        <Message
          messageText={messageText}
          initAbortMessageCnt={abortMessageCnt}
          delay={delay}
          id={getId(id, runCnt)}
          key={getId(id, runCnt)}
          removeHiddenMessages={null}
          insertMessage={null}
          isAnimating={false}
          isEmoji={isEmoji}
          hasDate={hasDate}
          showTail={showTail ? showTail : (index === 0 && id !== hideTailId)}
          previousId={previousId}
        />
      )}
    )}
      </div>
    </div>
  );
}

export default MessageList;
