import React, { Component } from "react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { withRouter } from "react-router-dom";
import withUserContext from "../../withUserContext";
import {message} from "antd";

class ChatroomLabel extends Component {
  gotoChatroom(evt, roomId, isPrivate, canEnterChannel) {
    evt.preventDefault();
    evt.stopPropagation();

    if (!isPrivate && roomId) this.props.history.push(`/chat/${roomId}`);
    else if (isPrivate && roomId && canEnterChannel) this.props.history.push(`/pchat/${roomId}`);
    else message.error("You cannot join this channel");
  }

  canEnterChannel = (isPrivate, users, loggedUser) => {
    if(!isPrivate) return true;
    if(!loggedUser) return false;
    let result = false;
    users.map((user)=>{
      if(user._id===loggedUser._id) result = true;
    });
    return result;
  };

  render() {
    const { chatroom: { _id, name, description, latitude, longitude, isPrivate, users } } = this.props;
    const canEnterChannel = this.canEnterChannel(isPrivate, users, this.props.context.userState.user);

    return <MarkerWithLabel
      position={{ lat: latitude, lng: longitude }}
      labelClass="chatrooms-map__label"
      labelAnchor={{ x: -20, y: 20 }}
      onClick={(e) => this.gotoChatroom(e, _id, isPrivate, canEnterChannel)}
    >
      <div className={"chatrooms-map__label-content"}>
        <h2 className="chatrooms-map__label-title">#{name}</h2>
        {description ? <p>{description}</p> : ""}
      </div>
    </MarkerWithLabel>;
  }
}

export default withUserContext(withRouter(ChatroomLabel));