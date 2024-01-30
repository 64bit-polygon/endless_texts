import * as React from 'react';
import styles from "./styles.module.scss";
import AppBtns from "./AppBtns";
import SvgBtn from "./SvgBtn";

const TextInput = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.inputRow}>
        <SvgBtn className="cameraBtn" fileName="camera" />
        <SvgBtn className="appStoreBtn" fileName="appstoreBlack" />
        <div className={styles.textInput}>
          <div className={styles.placeHolder}>iMessage</div>
          <SvgBtn className="speechBtn" fileName="speech" />
        </div>
      </div>
      <AppBtns />
    </div>
  );
}

export default TextInput;