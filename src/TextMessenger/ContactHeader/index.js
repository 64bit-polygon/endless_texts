import * as React from "react";
import styles from "./styles.module.scss";
import bluearrow from "../../assets/img/bluearrow.svg";
import grayarrow from "../../assets/img/grayarrow.svg";
import thumbnail from "../../assets/img/thumbnail.png";

const ContactHeader = () => (
  <div className={styles.contactHeader}>
    <img src={bluearrow} alt="" className={styles.backArrow} />
    <div className={styles.thumbnailMask}>
      <img src={thumbnail} alt="" className={styles.thumbnail} />
    </div>
    <div className={styles.thumbnail} />
    <div className={styles.nameRow}>
      <div className={styles.name}>
        <span role="img" aria-label="recipient">Nate</span>
      </div>
      <img src={grayarrow} alt="" className={styles.nameArrow} />
    </div>
  </div>
);

export default ContactHeader;

