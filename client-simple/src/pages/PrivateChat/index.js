import React, {Component} from "react";
import gql from "graphql-tag";
import {graphql, compose} from "react-apollo";
import {message} from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatMessages from "../../components/Chat/ChatMessages";
import PrivateChatUsers from "../../components/Chat/PrivateChatUsers";
import Button from "../../components/Button/Button";
import withSocket from "../../components/withSocket";
import "./PrivateChat.style.scss";
import _ from "lodash";
import withUserContext from "../../components/withUserContext";
import Modal from "../../components/Modal/Modal";
import UserItem from "../../components/UserItem/UserItem";

class PrivateChat extends Component {
  state = {
    inputMessageText: "",
    modalOpen: false,
  };

  refetchChatRoom = () => {
    if (this.props.chatroom) {
      this.props.chatroom.refetch();
    }
  };

  componentDidMount = async () => {
    const {socket} = this.props;
    const {chatId} = this.props.match.params;

    socket.on("connection", this.emitJoinSocketRoomRequest(chatId));
  };

  emitJoinSocketRoomRequest = chatId => {
    const {socket} = this.props;
    socket.emit("join", chatId);
  };

  loggedUserId = () => _.get(this.props, ["context", "userState", "user", "id"], null);
  loggedUserName = () => _.get(this.props, ["context", "userState", "user", "profile", "firstName"], null);
  loggedUserAvatarUrl = () => _.get(this.props, ["context", "userState", "user", "avatarUrl"], null);

  prepareDataForMutation = () => {
    const {inputMessageText: msg} = this.state;
    const {chatId: chatroom} = this.props.match.params;
    const loggedUserId = this.loggedUserId();

    return {
      from: loggedUserId,
      msg,
      chatroom,
      nickname: this.loggedUserName(),
      avatarUrl: this.loggedUserAvatarUrl() || null,
    };
  };

  handleFormSubmit = e => {
    e.preventDefault();

    const {inputMessageText} = this.state;
    const {mutate} = this.props;

    if (inputMessageText.length > 0) {
      this.setState({inputMessageText: ""});
      return mutate({variables: this.prepareDataForMutation()});
    } else {
      message.error("Message is empty");
    }

  };

  onEnterPress = e => {
    if (e.which === 13 && e.shiftKey === false) {
      this.handleFormSubmit(e);
    }
  };

  checkPermission = () => {
    if (this.props.chatroom.chatroom) {
      const {chatroom} = this.props.chatroom;
      const {userState} = this.props.context;

      let noPermission = true;
      if (userState.user)
        chatroom.users.forEach((user) => {
          if (user._id === userState.user._id) noPermission = false;
        });
      if (noPermission) this.props.history.push(`/`);
    }
  };

  addUsersHandler = () => {
    this.setState({modalOpen: true});
  };

  closeModal = () => {
    this.setState({modalOpen: false});
  };

  isThisUserInChatRoom = (userId) => {
    let result = false;
    const {chatroom} = this.props.chatroom;
    if (!chatroom) return null;
    chatroom.users.forEach((chatUser) => {
      if (chatUser._id === userId) {
        result = true;
      }
    });
    return result;
  };

  renderUserItems = () => {
    let userItems = [];
    const {userState} = this.props.context;
    const {chatroom} = this.props.chatroom;
    if (userState.user) userState.user.friends.forEach((user) => {
      userItems.push(
        <UserItem key={user._id} userId={user._id} chatId={this.props.match.params.chatId} ownerId={chatroom && chatroom.owner._id}
          isThisUserInChatroom={this.isThisUserInChatRoom(user._id)} refetchChatroom={this.refetchChatRoom}/>
      );
    });
    return userItems;
  };

  renderModal() {
    const {modalOpen} = this.state;
    const {chatroom} = this.props;

    return (
      <Modal
        id="add_users"
        heading="Add users to your channel"
        desc={null}
        modalOpen={modalOpen}
        closeModal={() => this.closeModal()}>
        <div className="chat__list">
          {this.renderUserItems()}
        </div>
      </Modal>
    );
  }

  render() {
    const {inputMessageText} = this.state;
    const {match} = this.props;
    const {chatroom} = this.props.chatroom;
    this.checkPermission();

    return (
      <div className="page">
        <Sidebar>
          <PrivateChatUsers chatroom={chatroom}/>
        </Sidebar>

        <section className="page__content">
          <div className="chat__wrapper">
            <header className="page__header">
              <h2 className="page__heading">Private chat: {chatroom && chatroom.name}</h2>
              <Button href="/" additionalClass="chat__back" isLink>To Channel List</Button>
              <Button onClick={this.addUsersHandler} additionalClass="chat__back">Add / remove users to this channel</Button>
            </header>

            <div className="chat__content">
              <ChatMessages match={match}/>
            </div>

            <div className="chat__footer">
              <form className="form chat__form" onSubmit={this.handleFormSubmit}>
                <textarea
                  value={inputMessageText}
                  name="message"
                  id="message"
                  className="chat__textarea"
                  placeholder="Enter your message here..."
                  onKeyPress={this.onEnterPress}
                  onChange={e => this.setState({inputMessageText: e.target.value})}
                />
                <Button variant="primary" additionalClass="chat__btn">Send</Button>
              </form>
            </div>
          </div>
        </section>
        {this.renderModal()}
      </div>
    );
  }
}


const GET_CURRENT_CHATROOM = gql`
    query($_id: String!) {
        chatroom(_id: $_id) {
            name
            owner {
            _id
            }
            users {
                _id
                avatarUrl
                profile {
                    firstName
                }
            }
        }
    }
`;

const ADD_MESSAGE = gql`
  mutation ($guestId: String, $guestName: String, $msg: String!, $chatroom: ID!, $nickname: String!, $avatarUrl: String) {
    addMessage(message: {guestId: $guestId, guestName: $guestName, msg: $msg, chatroom: $chatroom, nickname: $nickname, avatarUrl: $avatarUrl})
  }
`;

const withCurrentChatroom = graphql(GET_CURRENT_CHATROOM, {
  options: (props) => ({variables: {_id: props.match.params.chatId}}),
  name: "chatroom",
});

const withAddMessage = graphql(ADD_MESSAGE);

export default compose(withCurrentChatroom, withAddMessage)(withSocket(withUserContext(PrivateChat)));