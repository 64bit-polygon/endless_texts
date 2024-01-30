import * as React from 'react';
import styles from "./styles.module.scss";
import ContactHeader from "./ContactHeader/index";
import TextInput from "./TextInput/index";
import Messages from "./Messages/index";

const TextMessenger = () => {
  return (
    <div className={styles.app}>
      <ContactHeader />
      <Messages />
      <TextInput />
    </div>
  );
}

export default TextMessenger;