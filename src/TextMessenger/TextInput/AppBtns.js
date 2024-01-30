import * as React from 'react';
import styles from "./styles.module.scss";
import AppBtn from "./AppBtn";
import { appBtns } from "./constants";

const AppBtns = () => {
  return (
    <div className={styles.appBtns}>
      {appBtns.map(
        ({img, width, height, className}) => (
          <AppBtn img={img} width={width} height={height} className={className} key={`${img}${className}`} />
        )
      )}
    </div>
  );
}

export default AppBtns;
