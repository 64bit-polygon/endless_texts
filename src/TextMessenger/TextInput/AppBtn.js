import * as React from 'react';
import styles from "./styles.module.scss";
import cx from "classnames";
import photos from "../../assets/img/photos.png";
import appstore  from "../../assets/img/appstore.svg";
import faceapps from "../../assets/img/faceapps.png";
import applepay from "../../assets/img/applepay.png";
import animalface  from "../../assets/img/animalface.png";
import racket from "../../assets/img/racket.png";
import heartapp from "../../assets/img/heartapp.png";

const imgs = {
  photos,
  appstore,
  faceapps,
  applepay,
  animalface,
  racket,
  heartapp
}

const AppBtn = ({img, width, height, className}) => {
  let imgProps = {
    width: width ? width : null,
    height: height ? height : null
  }

  return (
    <div className={cx(styles.appBtn, styles[className])}>
      <img src={imgs[img]} {...imgProps} alt="" />
    </div>
  )
}

export default AppBtn;
