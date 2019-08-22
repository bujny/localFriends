import React, {Component} from "react";
import {SidebarItem, SidebarMessage} from "../Sidebar/Sidebar";

class SidebarFriends extends Component {

  showUsers = () => {
    const {chatroom} = this.props;
    if (chatroom)
      return chatroom.users.map(({_id, profile}) => <SidebarItem key={_id} title={`${profile.firstName}`} url={`/profile/${_id}`}/>);
    return <SidebarMessage>No users in this channel</SidebarMessage>;
  };

  render() {
    return (
      <div>
        {this.showUsers()}
      </div>
    );
  }

}

export default SidebarFriends;