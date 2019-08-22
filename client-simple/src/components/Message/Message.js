import React from "react";
import format from "date-fns/format";
import "./Message.style.scss";
import {Avatar} from "antd";

const MessageText = ({ children, variant = "", avatarUrl }) => {
  const avatar = avatarUrl ? <Avatar size={45} src={avatarUrl}/> : <Avatar size={45} icon="user"/>;
  return (
    <div className="message__text--flexbox">
      {!variant && avatar}
      <span className={"message__text " + (variant && `message__text--${variant}`)}>
        {children}
      </span>
      {variant && avatar}
    </div>
  );
};

const Message = ({ author, timestamp, toRight = "", children }) => {
  return (
    <div className={"message " + (toRight && "message--right")}>
      <div className="message__user">
        <span className={"message__username " + (toRight && "message__username--right")}>{author}</span>
        <span className="message__date">{format(timestamp, "hh:mm:ss")}</span>
      </div>
      {children}
    </div>
  );
};

export { Message, MessageText};