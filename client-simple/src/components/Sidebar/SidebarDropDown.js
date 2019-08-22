import React from "react";
import {withRouter} from "react-router-dom";
import {Icon} from "antd";
import withUserContext from "../withUserContext";

export const TYPE_FRIEND_REQUEST = "friend_request";
export const TYPE_PRIVATE_MESSAGE = "private_message";
export const TYPE_ADDED_TO_PRIVATE_CHATROOM = "private_chatroom";

export const SidebarDropDown = ({children}) => {
  return (
    <div className="sidebar__dropdown__container">
      {children}
    </div>
  );
};

const SidebarDropDownItem = ({description, url, type, history, context, _id, query, toggleDropDown}) => {
  return (
    <div className="sidebar__dropdown__tablerow">
      <div onClick={() => handleOnClick(url, history, context, _id, query, toggleDropDown, type, description)} className="sidebar__dropdown__item">
        <div>
          {description}
        </div>
        {renderNotificationType(type)}
      </div>
    </div>
  );
};

const handleOnClick = (url, history, context, _id, query, toggleDropDown, type, description) => {
  if(context.removeNotification) context.removeNotification(_id).then(()=>{
    context.getUser().then(()=>{
      query.refetch().then(()=>{
        toggleDropDown();
        history.push(url);
      });
    });
  });
};

const renderNotificationType = (type) => {
  if (type === TYPE_FRIEND_REQUEST) return <Icon className="sidebar__dropdown__icon" type="contacts" theme="twoTone" twoToneColor="#6f45a0"/>;
  if (type === TYPE_PRIVATE_MESSAGE) return <Icon className="sidebar__dropdown__icon" type="message" theme="twoTone" twoToneColor="#6f45a0"/>;
  if (type === TYPE_ADDED_TO_PRIVATE_CHATROOM) return <Icon className="sidebar__dropdown__icon" type="contacts" theme="twoTone" twoToneColor="#6f45a0"/>;
};

export default withUserContext(withRouter(SidebarDropDownItem));