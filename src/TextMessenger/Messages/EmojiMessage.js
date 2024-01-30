import * as React from 'react';
import styles from "./styles.module.scss";
import DateTime from "./DateTime";
import cx from "classnames";

const animationClasses = {
  "step_1": "forward-empty",
  "step_2": "forward-pre-typing",
  "step_3": "forward-typing",
  "step_4": "forward-pre-delivered",
  "step_5": "forward-delivered"
}

const getAnimationClass = (animationStep) => {
  const key = `step_${animationStep}`;
  return animationClasses[key];
}

const EmojiMessage = ({
  messageText,
  delay,
  id,
  removeHiddenMessages,
  insertMessage,
  isAnimating,
  hasDate,
  previousId
}) => {
  const staticMessage = React.useRef();
  const [showDate, setShowDate] = React.useState(hasDate && !isAnimating);
  const [dimensions, setDimensions] = React.useState({});
  const [dynamicStyles, setDynamicStyles] = React.useState({});
  const [animationStep, setAnimationStep] = React.useState(isAnimating ? 1 : 5);
  const [animationClass, setAnimationClass] = React.useState(getAnimationClass(animationStep));
  const timeOuts = {}

  const sleep = ms => {
    return new Promise(resolve => {
      timeOuts.sleep = setTimeout(resolve, ms)
    });
  }
  
  const updateAnimationStep = () => {
    const nextStep = animationStep + 1;
    setAnimationStep(nextStep);
    setAnimationClass(getAnimationClass(nextStep));
  }

  const onWrapperTransitionEnd = async(e) => {
    if ( animationStep !== 1 ) {
      return;
    }

    if ( e.target.getAttribute("id") === `${id}-wrap` ) {
      isAnimating = false;
      await sleep(1000 + Math.round(2000 * Math.random()));
      isAnimating = true;
    }

    updateAnimationStep();
  }

  const onMessageTransitionEnd = () => {
    if ( animationStep !== 2 && animationStep !== 4 ) {
      return;
    }

    if ( animationStep === 2 ) {
      setDimensions({
        height: 65,
        width: staticMessage.current.offsetWidth
      });
    }

    updateAnimationStep();
  }

  const onTypingDotsTransitionEnd = async() => {
    if ( animationStep !== 3 ) {
      return;
    }

    await sleep(delay);
    setDynamicStyles({
      height: dimensions.height,
      width: dimensions.width
    });

    if (hasDate) {
      setShowDate(true);
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
    <div className={styles.messageAndDate} id={`${id}-wrap`}>
    {showDate && <DateTime isAnimating={isAnimating} />}
      <div 
        className={cx(styles.messageWrap, styles.emoji, styles[animationClass])} 
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
            className={cx(styles.messageText, styles.emoji)}
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

export default EmojiMessage;
