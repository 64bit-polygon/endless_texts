import rawMessages from "./rawMessages";
import emojiRegex from "emoji-regex";
import { withoutEmoji } from "emoji-aware";

const regex = emojiRegex();

const splitMessages = messages => {
  return messages.split(/[\r\n]+/).reverse();
}

const messages = splitMessages(rawMessages)

const chance = (percentChance) => {
  const min = Math.ceil(0);
  const max = Math.floor(100);
  const int = Math.floor(Math.random() * (max - min + 1)) + min;
  return int <= percentChance;
}

const calcDelay = (message, hasAbortion) => {
  const delay = message.length * 15;
  return delay + (hasAbortion ? delay * 1.5 : 0);
}

const getAbortMessageCnt = () => {
  const abortMessage = chance(20);
  if ( abortMessage ) {
    return 1;
  }

  return 0;
}

const hasDate = () => {
  return false;
  // return chance(5);
}

const isJSON = messageText => messageText[0] === "{";

const addLineBreaks = messageText => {
  if (isJSON(messageText)) {
    return { textWithBreaks: messageText, lineCnt: 1 };
  }
  const maxChars = 40;
  const words = messageText.split(' ');
  const lines = [''];
  let lineCnt = 0;
  words.forEach( word => {
    const amendedLine = `${lines[lineCnt]} ${word}`;
    if (amendedLine.length > maxChars) {
      lineCnt++;
      lines[lineCnt] = word;
    } else {
      lines[lineCnt] = amendedLine;
    }
  });
  lineCnt++;
  const textWithBreaks = lines.join("<br />").trimStart();
  return { textWithBreaks, lineCnt };
}

const isEmoji = messageText => {
  const text = messageText.replace(/\s/g, "");

  if ( !regex.exec(text) ) {
    return false;
  }
  
  const charsWithoutEmoji = withoutEmoji(text);

  if (charsWithoutEmoji.length === 0 ) {
    return true;
  }
  
  let isAllEmoji = true;
  for (let i = 0; i < charsWithoutEmoji.length; i++) {
    const char = charsWithoutEmoji[i];
    if (char.toLowerCase() !== char.toUpperCase()) {
      isAllEmoji = false;
      break;
    }
  }

  return isAllEmoji
}

const addDimensionsCalculator = () => {
  const dimensionsCalculator = document.createElement("div");
  dimensionsCalculator.setAttribute("id", "dimensionsCalculatorWrap");
  dimensionsCalculator.innerHTML = '<div id="dimensionsCalculator"></div>';
  document.body.appendChild(dimensionsCalculator);
}

const removeDimensionsCalculator = () => {
  const dimensionsCalculator = document.getElementById("dimensionsCalculatorWrap");
  document.body.removeChild(dimensionsCalculator);
}

const getDimensions = messageText => {
  const dimensionsCalculator = document.getElementById("dimensionsCalculator");
  dimensionsCalculator.innerHTML = messageText;
  const width = dimensionsCalculator.offsetWidth;
  const height = dimensionsCalculator.offsetHeight;

  return { width, height };
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getDriftingClass = () => ""//`drifting${getRandomInt(1, 5)}`;

export default (() => {
  addDimensionsCalculator();
  let formattedMessages = [];
  messages.forEach( (messageText, messageIndex) => {
    const message = {};
    const isAnEmoji = isEmoji(messageText);
    const messageObj = messageText[0] === "{" ? JSON.parse(messageText) : {type: "text"};
    let textWithBreaks = messageText;
    let lineCnt;
    let width = messageObj.width || 0;
    let height = messageObj.height || 0;
    const nonTextClass = messageObj.class || "";

    if (messageObj.type === "text") {
      const lineBreaks = addLineBreaks(messageText);
      textWithBreaks = lineBreaks.textWithBreaks;
      lineCnt = lineBreaks.textWithBreaks;
      const dimensions = getDimensions(textWithBreaks);
      width = dimensions.width;
      height = dimensions.height;
    }
    message.messageText = textWithBreaks;

    if (messageObj.type === "gif") {
      message.messageText =
`
<div data-type="${messageObj.type}">
  <img src="/assets/img/${messageObj.img}" />
</div>
`
    }

    if (messageObj.type === "png") {
      message.messageText =
`
<div data-type="${messageObj.type}">
  <img src="/assets/img/${messageObj.img}" data-img="png" />
</div>
`
    }

    if (messageObj.type === "link") {
      const imgElem = messageObj.img ? `<div data-class="linkImg"><img src="/assets/img/${messageObj.img}" data-class==${nonTextClass} /></div>` : "";
      const linkTitle = messageObj.title ? `<div data-class="title">${messageObj.title}</div>` : "";
      const linkUrl = messageObj.url ? `<div data-class="url">${messageObj.url}</div>` : "";
      message.messageText =
`
<div data-type="${messageObj.type}">
  ${imgElem}
  <div data-class="linkContent">
    ${linkTitle}
    ${linkUrl}
  </div>
</div>
`
    }

    message.type = messageObj.type;
    message.width = width;
    message.height = height;
    message.lineCnt = lineCnt;
    message.isEmoji = isAnEmoji;
    message.nonTextClass = nonTextClass;
    message.driftingClass = getDriftingClass();

    const hasDateTime = hasDate();
    message.hasDate = hasDateTime;
    message.previousId = `message-${messageIndex + 1}`;
    const nextMessage = formattedMessages[messageIndex - 1];
    if (nextMessage && nextMessage.hasDate) {
      message.showTail = true;
    }
    const abortMessageCnt = getAbortMessageCnt();
    message.abortMessageCnt = abortMessageCnt;
    message.delay = calcDelay(messageText, !!abortMessageCnt);
    message.id = `message-${messageIndex}`;
    message.runCnt = 0;
    
    formattedMessages.push(message);
  })
  formattedMessages[0].previousId = `message-${formattedMessages.length - 1}`;

  removeDimensionsCalculator();
  return formattedMessages;
})();
