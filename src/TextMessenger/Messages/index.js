import * as React from 'react';
import styles from "./styles.module.scss";
import MessageList from "./MessageList";
import defaultMessages from "../../utils/messages";

const Messages = () => {
  const [messages, setMessages] = React.useState(defaultMessages);
  const [visibleMessages, setVisibleMessages] = React.useState([]);
  const [restartIndex] = React.useState(0);

  const insertMessage = () => {
    const updatedMessages = [ ...messages ];
    const updatedVisibleMessages = [ ...visibleMessages ];
    const curMessage = JSON.parse( JSON.stringify( updatedMessages.pop() ) );
    curMessage.runCnt = curMessage.runCnt + 1;
    updatedMessages.unshift(curMessage);
    updatedVisibleMessages.unshift(curMessage);
    setMessages(updatedMessages);
    setVisibleMessages(updatedVisibleMessages);
  }

  React.useEffect(() => {
    insertMessage();
    // eslint-disable-next-line
  }, []);

  const isOffScreen = elem => {
    const bounding = elem.getBoundingClientRect();
    return bounding.bottom <= 0;
  }

  const removeHiddenMessages = () => {
    let i = visibleMessages.length - 1;
    let offScreenIndex;
    for ( i; i >= 0; i-- ) {
      const elem = document.getElementById(`${visibleMessages[i].id}-${visibleMessages[i].runCnt}-wrap`);
      if ( elem ) {
        if ( isOffScreen(elem) ) {
          offScreenIndex = i;
        } else {
          break;
        }
      }
    }
    
    if ( offScreenIndex ) {
      const newVisibleMessages = visibleMessages.slice(0, offScreenIndex);
      setVisibleMessages(newVisibleMessages);
    }
  }

  return (
    <div className={styles.messages} key={restartIndex}>
      <MessageList
        messages={visibleMessages}
        removeHiddenMessages={removeHiddenMessages}
        insertMessage={insertMessage}
      />
    </div>
  );
}

export default Messages;

