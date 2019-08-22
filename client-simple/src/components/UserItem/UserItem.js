import React, { Component } from "react";
import gql from "graphql-tag";
import {graphql, compose} from "react-apollo";
import {Avatar, Switch, message} from "antd";
import "./UserItem.style.scss";
import {TYPE_PRIVATE_MESSAGE} from "../Sidebar/SidebarDropDown";
import withUserContext from "../withUserContext";

class UserItem extends Component {
  state = {
    checked: false,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isThisUserInChatroom !== this.props.isThisUserInChatroom) {
      this.setState({checked: this.props.isThisUserInChatroom});
    }
  }

  renderAvatar = (profileUser) => {
    if(profileUser) if(profileUser.avatarUrl) return <Avatar size={70} src={profileUser.avatarUrl}/>;
    return <Avatar size={70} icon="user"/>;
  };

  switchHandler = (e) => {
    if(this.props.userId === this.props.ownerId)  {
      message.error("You cannot remove room owner");
      return;
    }
    this.setState({checked: e});
    if(e) {
      this.props.addToChatroom().then(()=>{
        this.props.context.addNotification(this.props.userId, {
          description: "You have been added to private chatroom!",
          url: "/pchat/"+this.props.chatId,
          type: TYPE_PRIVATE_MESSAGE,
        });
      });
    }
    else {
      this.props.removeFromChatroom();
    }
    this.props.refetchChatroom();
  };

  render() {
    const {getUserById} = this.props.thisUserQuery;

    return (
      <div className="userItem__container">
        {this.renderAvatar(getUserById)}
        <div>
          {getUserById && (getUserById.profile.firstName +" "+getUserById.profile.lastName)}
        </div>
        <Switch checked={this.state.checked} onChange={this.switchHandler}/>
      </div>
    );
  }
}

const GET_USER = gql`
  query($_id: String!) {
    getUserById(_id: $_id) {
      avatarUrl
      _id
      profile
      {
        firstName
        lastName
      }
    }
  }
`;

const withThisUser = graphql(GET_USER, {
  options: (props) => ({variables: {_id: props.userId}}),
  name: "thisUserQuery",
});

const ADD_TO_CHATROOM = gql`
  mutation ($chatroom: String!, $friendId: String!) {
    addToChatroom(chatroom: $chatroom, friendId: $friendId){
      _id
    }
  }
`;

const withAddToChatroom = graphql(ADD_TO_CHATROOM, {
  options: (props) => ({ variables: { chatroom: props.chatId, friendId: props.userId }}),
  name: "addToChatroom"
});

const REMOVE_FROM_CHATROOM = gql`
  mutation ($chatroom: String!, $friendId: String!) {
    removeFromChatroom(chatroom: $chatroom, friendId: $friendId){
      _id
    }
  }
`;

const withRemoveFromChatroom = graphql(REMOVE_FROM_CHATROOM, {
  options: (props) => ({ variables: { chatroom: props.chatId, friendId: props.userId }}),
  name: "removeFromChatroom"
});

export default compose(withThisUser, withAddToChatroom,withRemoveFromChatroom)(withUserContext(UserItem));
