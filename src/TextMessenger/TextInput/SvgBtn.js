import * as React from 'react';
import styles from "./styles.module.scss";
import cx from "classnames";
import camera from "../../assets/img/camera.svg";
import appstoreBlack  from "../../assets/img/appstoreBlack.svg";
import speech from "../../assets/img/speech.svg";

const svgs = {
  camera,
  appstoreBlack,
  speech
}

const SvgBtn = ({ fileName, className }) => (
  <div className={cx(styles.svgBtn, styles[className])}>
    <img src={svgs[fileName]} alt="" />
  </div>
)

export default SvgBtn;
