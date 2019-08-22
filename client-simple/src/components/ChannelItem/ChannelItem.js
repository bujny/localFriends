import React from "react";
import UserSmallSvg from "../../assets/svg/user-small.svg";
import VerifiedSvg from "../../assets/svg/verified.svg";
import NotVerifiedSvg from "../../assets/svg/not-verified.svg";
import Button from "../Button/Button";
import "./ChannelItem.style.scss";
import {Icon, Tooltip} from "antd";
import withUserContext from "../withUserContext";

const ChannelItem = ({ id, title, users, verified, toggleModal, isPrivate, context }) => {
  return (
    <div className="channel">
      <h3 className="channel__title">{title}</h3>
        
      <div className="actions">
        <span className="actions__item">
          {renderJoin(isPrivate,context.userState.user, users, toggleModal, id)}
        </span>

        <span className="actions__separator"></span>

        <span className="actions__item">
          <span className="actions__value">{(users && users.length) || 0}</span>
          <img src={UserSmallSvg} className="actions__img" alt="" />
        </span>

        <span className="actions__separator"></span>

        <span className="actions__item">
          {renderType(verified,isPrivate, users, context.userState.user)}
        </span>
      </div>
    </div>
  );
};

const renderJoin = (isPrivate, loggedUser, users, toggleModal, id) => {
  if(isPrivate) {
    if(!canEnterChannel(isPrivate,users,loggedUser)) {
      return null;
    }
    const url = "/pchat/"+id;
    return <Button variant="primary" href={url} isLink>Join</Button>;
  }
  const url = "/chat/"+id;
  if(loggedUser) return <Button variant="primary" href={url} isLink>Join</Button>;
  return <Button variant="primary" onClick={() => toggleModal(id)} isLink>Join</Button>;
};

const renderType = (verified, isPrivate, users, loggedUser) => {
  if(isPrivate) return <Tooltip title={canEnterChannel(isPrivate,users,loggedUser)?"Available private channel":"Private channel"} key="PRIVATE_CHANNEL">
    <Icon type={canEnterChannel(isPrivate,users,loggedUser)?"unlock":"lock"} className="actions__img"/>
  </Tooltip>;
  return <Tooltip title={verified? "Verified": "Not verified"+" channel"} key="PUBLIC_CHANNEL">
    <img src={verified ? VerifiedSvg : NotVerifiedSvg} className="actions__img" alt="" />
  </Tooltip>;
};

const canEnterChannel = (isPrivate, users, loggedUser) => {
  if(!isPrivate) return true;
  if(!loggedUser) return false;
  let result = false;
  users.map((user)=>{
    if(user._id===loggedUser._id) result = true;
  });
  return result;
};

export default withUserContext(ChannelItem);