import * as React from 'react';
import styles from "./styles.module.scss";
import DateTime from "./DateTime";
import cx from "classnames";
import useEvent from "./useEvent";

// have a different set of classes for removal
const forwardAnimationClasses = {
  "step_1": "forward-empty",
  "step_2": "forward-pre-typing",
  "step_3": "forward-typing",
  "step_4": "forward-pre-delivered",
  "step_5": "forward-delivered"
}

const backwardAnimationClasses = {
  "step_1": "backward-empty",
  "step_2": "backward-pre-typing"
}

const FORWARD = "forward";
const BACKWARD = "backward";

const getAnimationClass = (animationStep, direction) => {
  const key = `step_${animationStep}`;
  const classObj = direction === FORWARD ? forwardAnimationClasses : backwardAnimationClasses;
  return classObj[key];
}

const TextMessage = ({
  messageText,
  initAbortMessageCnt,
  delay,
  id,
  removeHiddenMessages,
  insertMessage,
  isAnimating,
  hasDate,
  showTail,
  previousId
}) => {
  const staticMessage = React.useRef();
  const [abortMessageCnt, setAbortMessageCnt] = React.useState(initAbortMessageCnt);
  const [showDate, setShowDate] = React.useState(hasDate && !isAnimating);
  const [dimensions, setDimensions] = React.useState({});
  const [dynamicStyles, setDynamicStyles] = React.useState({});
  const [animationStep, setAnimationStep] = React.useState(isAnimating ? 1 : 5);
  const [animationClass, setAnimationClass] = React.useState(getAnimationClass(animationStep, FORWARD));
  const [direction, setDirection] = React.useState(FORWARD);
  const timeOuts = {}
  const { broadcast } = useEvent("HidePreviousTail");

  const sleep = ms => {
    return new Promise(resolve => {
      timeOuts.sleep = setTimeout(resolve, ms)
    });
  }
  
  const updateAnimationStep = (overRideDirection = undefined) => {
    const isForward = (overRideDirection ? overRideDirection : direction) === FORWARD;
    const nextStep = animationStep + (isForward ? 1 : -1);
    if (abortMessageCnt && nextStep > 3) {
      return;
    }

    setAnimationStep(nextStep);
    setAnimationClass(getAnimationClass(nextStep, direction));
  }

  const onWrapperTransitionEnd = async(e) => {
    if ( animationStep !== 1 && direction !== BACKWARD ) {
      return;
    }

    if (e.propertyName === "height") {
      isAnimating = false;
      await sleep(Math.round(1500 * Math.random()));
      isAnimating = true;
    }

    setDirection(FORWARD);
    updateAnimationStep();
  }

  const onMessageTransitionEnd = ev => {
    if ( animationStep !== 2 && animationStep !== 4 ) {
      return;
    }

    if ( animationStep === 2 && direction === FORWARD ) {
      setDimensions({
        height: staticMessage.current.offsetHeight,
        width: staticMessage.current.offsetWidth
      });
    }

    if ( animationStep === 2 && direction === BACKWARD ) {
      return;
    }

    if ( animationStep === 4 && ev.propertyName === "opacity" ) {
      broadcast(previousId)
    }

    updateAnimationStep();
  }

  const onTypingDotsTransitionEnd = async() => {
    if ( animationStep !== 3 ) {
      return;
    }

    await sleep(delay);

    if ( abortMessageCnt && direction === FORWARD ) {
      setAbortMessageCnt( abortMessageCnt - 1 );
      setDirection(BACKWARD);
      await sleep(Math.round(2000 * Math.random()));
      updateAnimationStep(BACKWARD);
      return;
    } else {
      setDirection(FORWARD);
      setDynamicStyles({
        height: dimensions.height,
        width: dimensions.width
      });
      if (hasDate) {
        setShowDate(true);
      }
    }

    updateAnimationStep();
  }

  const onMessageTextTransitionEnd = async() => {
    if ( animationStep !== 5 ) {
      return;
    }

    await sleep(delay);

    insertMessage();
  }

  React.useEffect(() => {
    if ( isAnimating ) {
      timeOuts.animation = setTimeout(() => {
        removeHiddenMessages();
        updateAnimationStep();
      }, 300);
    }

    return () => {
      clearTimeout(timeOuts.sleep);
      clearTimeout(timeOuts.animation);
    }
    // eslint-disable-next-line
  }, [messageText]);

  return (
    <div className={cx(styles.messageAndDate, {[styles.showTail]: showTail, [styles.hasTime]: showDate})} id={`${id}-wrap`}>
    {showDate && <DateTime isAnimating={isAnimating} />}
      <div 
        className={cx(styles.messageWrap, styles[animationClass])} 
        onClick={insertMessage}
        onTransitionEnd={e => {
          if (!isAnimating) return;
          onWrapperTransitionEnd(e);
        }}
      >
        <div
          className={styles.message}
          id={id}
          onTransitionEnd={onMessageTransitionEnd}
          style={dynamicStyles}
        >
          <div
            className={styles.messageText}
            onTransitionEnd={onMessageTextTransitionEnd}
            dangerouslySetInnerHTML={{__html: messageText}}
          />
        { animationStep < 5 && (
        <>
          <div
            className={styles.typingDots}
            onTransitionEnd={onTypingDotsTransitionEnd}
          />
          <div className={styles.thinkingDots} />
        </>
        )}
          <div className={styles.speechTail} />
        </div>
      { animationStep < 3 && (
        <div className={styles.mask}>
          <div className={cx(styles.message, styles.staticMessage)} ref={staticMessage}>
            <div
              className={styles.messageText}
              dangerouslySetInnerHTML={{__html: messageText}}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default TextMessage;
