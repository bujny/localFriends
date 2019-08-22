import React, {Component} from "react";
import "../../pages/Profile/Profile.style.scss";
import {Avatar, Tooltip} from "antd";


class ProfileFriends extends Component {

  renderFriends = () => {
    let friendsArray = [];
    const {getUserById} = this.props.thisUserQuery;
    if (getUserById) {
      getUserById.friends.forEach((friend) => {
        const url = "/profile/" + friend._id;
        if (!friend.avatarUrl)
          friendsArray.push(
            <Tooltip title={friend.profile.firstName + " " + friend.profile.lastName} key={friend._id}>
              <a href={url} className="profile__friends__element">
                <Avatar size={120} icon="user"/>
              </a>
            </Tooltip>
          );
        else friendsArray.push(
          <Tooltip title={friend.profile.firstName + " " + friend.profile.lastName} key={friend._id}>
            <a href={url} className="profile__friends__element">
              <Avatar size={120} src={friend.avatarUrl}/>
            </a>
          </Tooltip>
        );
      });
      return friendsArray;
    }
  };

  render() {
    return (
      <div className="profile__element">
        <div className="profile__friends">
          <h3 className="profile__section__heading">User friends</h3>
          {this.renderFriends()}
        </div>
      </div>
    );
  }
}


export default ProfileFriends;
