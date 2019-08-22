import React, {Component} from "react";
import {Avatar, Icon, Tooltip, Modal, message} from "antd";
import "../../pages/Profile/Profile.style.scss";
import gql from "graphql-tag";
import {compose, graphql} from "react-apollo";
import withUserContext from "../withUserContext";
import {TYPE_FRIEND_REQUEST} from "../Sidebar/SidebarDropDown";

const {confirm} = Modal;


class ProfileActions extends Component {

  addFriendHandler = () => {
    const {getUserById} = this.props.thisUserQuery;
    confirm({
      title: "Do you want to add this user to your friends?",
      content: "",
      onOk: () => {
        const addNotificationPromise = this.props.context.addNotification(this.props.thisUserId, {
          description: this.props.context.userState.user.profile.firstName + " wants to be your friend!",
          url: "/profile/" + this.props.context.userState.user._id,
          type: TYPE_FRIEND_REQUEST,
        });
        const createFriendRequestPromise = this.props.createFriendRequest();
        Promise.all([addNotificationPromise, createFriendRequestPromise]).then(() => {
          message.success("Friend request sent!");
          this.props.getFriendRequest.refetch();
        });
      },
      onCancel() {
      },
    });
  };

  removeFriendHandler = () => {
    confirm({
      title: "Do you want to remove this user from your friends?",
      content: "",
      onOk: () => {
        this.props.removeFromFriends().then(() => {
          this.props.thisUserQuery.refetch();
          this.props.refetchCurrentUserFriends();
        });
      },
      onCancel() {
      },
    });

  };

  areTheyFriends = (profileUser, currentUser) => {
    let result = false;
    profileUser.friends.forEach((friend) => {
      if (friend._id === currentUser.id) result = true;
    });
    return result;
  };

  renderAddFriend = (profileUser, currentUser) => {
    const output = [];
    if (profileUser && currentUser) {
      if (!this.areTheyFriends(profileUser, currentUser))
        output.push(
          <Tooltip title="Add to friends" key="ADD_FRIEND">
            <Icon type="plus-circle" theme="twoTone" className="profile__icon" twoToneColor="#6f45a0" onClick={this.addFriendHandler}/>
          </Tooltip>);
      else {
        output.push(
          <Tooltip title="Remove from friends" key="REMOVE_FRIEND">
            <Icon type="minus-circle" theme="twoTone" className="profile__icon" twoToneColor="#6f45a0" onClick={this.removeFriendHandler}/>
          </Tooltip>);
        output.push(this.renderSendMessage());
      }
      return output;
    }
  };

  sendMessageHandler = () => {
    if (!this.props.getDirectChatRoom.getDirectChatRoom) {
      this.props.createNewDirectChatRoom()
        .then(() => this.props.getDirectChatRoom.refetch()
          .then(() => this.props.history.push(`/direct/${this.props.getDirectChatRoom.getDirectChatRoom._id}`)));
    } else this.props.history.push(`/direct/${this.props.getDirectChatRoom.getDirectChatRoom._id}`);
  };

  renderSendMessage = () => {
    return (<Tooltip title="Send message" key="SEND_MESSAGE">
      <Icon type="message" theme="twoTone" className="profile__icon" twoToneColor="#6f45a0" onClick={this.sendMessageHandler}/>
    </Tooltip>);
  };

  renderEditProfile = () => {
    return (
      <Tooltip title="Edit profile" key="EDIT_PROFILE">
        <a href="/edit/">
          <Icon type="tool" theme="twoTone" className="profile__icon" twoToneColor="#6f45a0"/>
        </a>
      </Tooltip>
    );
  };

  renderFriendRequestSent = () => {
    return (
      <Tooltip title="Friend request has been sent" key="FRIEND_REQUEST_SENT">
        <Icon type="check-circle" theme="twoTone" className="profile__icon" twoToneColor="#6f45a0"/>
      </Tooltip>
    );
  };

  renderActions = (profileUser, currentUser, getFriendRequest) => {
    const output = [];
    if (profileUser && currentUser) {
      if (currentUser.id === profileUser._id) {
        output.push(this.renderEditProfile());
      } else {
        if (getFriendRequest) output.push(this.renderFriendRequestSent());
        else output.push(this.renderAddFriend(profileUser, currentUser));
      }
      return output;
    }
  };

  renderAvatar = (profileUser) => {
    if (profileUser) if (profileUser.avatarUrl) return <Avatar size={120} src={profileUser.avatarUrl}/>;
    return <Avatar size={120} icon="user"/>;
  };

  render() {
    const {getUserById} = this.props.thisUserQuery;
    const {userState} = this.props.context;
    const {getFriendRequest} = this.props.getFriendRequest;

    return (
      <div className="profile__element">
        {this.renderAvatar(getUserById)}
        {this.renderActions(getUserById, userState.user, getFriendRequest)}
      </div>
    );
  }
}

const REMOVE_FROM_FRIENDS = gql`
    mutation ($friendId: String!) {
    removeFromFriends(friendId: $friendId){
        _id
            friends
        {
          _id
        }
    }
  }
`;

const withRemoveFromFriends = graphql(REMOVE_FROM_FRIENDS, {
  options: (props) => ({variables: {friendId: props.thisUserId}}),
  name: "removeFromFriends"
});

const GET_DIRECT_CHATROOM = gql`
    query ($friendId: String!) {
    getDirectChatRoom(friendId: $friendId){
        _id
    }
  }
`;

const withGetDirectChatRoom = graphql(GET_DIRECT_CHATROOM, {
  options: (props) => ({variables: {friendId: props.thisUserId}}),
  name: "getDirectChatRoom"
});

const CREATE_NEW_DIRECT_CHATROOM = gql`
    mutation ($friendId: String!) {
    createNewDirectChatRoom(friendId: $friendId){
      _id
    }
  }
`;

const createNewDirectChatRoom = graphql(CREATE_NEW_DIRECT_CHATROOM, {
  options: (props) => ({variables: {friendId: props.thisUserId}}),
  name: "createNewDirectChatRoom"
});

const CREATE_FRIEND_REQUEST = gql`
  mutation ($fromUser: String!, $toUser: String!) {
    createFriendRequest(fromUser: $fromUser, toUser: $toUser){
        _id
    }
  }
`;

const withCreateFriendRequest = graphql(CREATE_FRIEND_REQUEST, {
  name: "createFriendRequest",
  options: (props) => {
    return {
      variables: {
        fromUser: props.context.userState.user ? props.context.userState.user._id : "null",
        toUser: props.thisUserId
      }
    };
  },
});

const GET_FRIEND_REQUEST = gql`
  query ($fromUser: String!, $toUser: String!) {
    getFriendRequest(fromUser: $fromUser, toUser: $toUser){
        _id
    }
  }
`;

const withGetFriendRequest = graphql(GET_FRIEND_REQUEST, {
  name: "getFriendRequest",
  options: (props) => ({
    variables: {
      fromUser: props.context.userState.user ? props.context.userState.user._id : "null",
      toUser: props.thisUserId
    }
  }),
});

export default (withUserContext(compose(withRemoveFromFriends, withGetDirectChatRoom, createNewDirectChatRoom, withCreateFriendRequest, withGetFriendRequest)(ProfileActions)));

