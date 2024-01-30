import * as React from "react";
import styles from "./styles.module.scss";
import cx from "classnames";

const animationSteps = ["preAnimate", "animating", "postAnimate"];

const DateTime = ({ isAnimating }) => {
  const [curStep, setAnimationStep] = React.useState(isAnimating ? 0 : 2);
  const [time] = React.useState(new Date());
  let hour = time.getHours();
  const period = hour < 12 ? "AM" : "PM";
  if ( hour === 0 ) {
    hour = 12;
  } else if ( hour > 12 ) {
    hour = hour - 12;
  }
  let minute = time.getMinutes();
  minute = minute > 9 ? minute : `0${minute}`;

  if (curStep === 0) {
    setTimeout(() => {
      setAnimationStep(1);
    }, 50);
  }

  return (
    <div className={cx(styles.dateMask, styles[animationSteps[curStep]])}>
      <div className={styles.innerWrap}>
        <div className={styles.date}>
          <span className={styles.day}>Today</span>
          <span className={styles.time}>{`${hour}:${minute} ${period}`}</span>
        </div>
      </div>
    </div>
  );
}

export default DateTime;

