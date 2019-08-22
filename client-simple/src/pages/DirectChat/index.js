import React, {Component} from "react";
import gql from "graphql-tag";
import {graphql, compose} from "react-apollo";
import {message} from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import DirectChatMessages from "../../components/DirectChat/DirectChatMessages";
import Button from "../../components/Button/Button";
import withSocket from "../../components/withSocket";
import "./DirectChat.style.scss";
import _ from "lodash";
import withUserContext from "../../components/withUserContext";
import {TYPE_PRIVATE_MESSAGE} from "../../components/Sidebar/SidebarDropDown";


class Chat extends Component {
  state = {
    inputMessageText: "",
    targetUserId: "",
  };

  loggedUserId = () => _.get(this.props, ["context", "userState", "user", "id"], null);
  loggedUserName = () => _.get(this.props, ["context", "userState", "user", "profile", "firstName"], null);
  loggedUserAvatarUrl = () => _.get(this.props, ["context", "userState", "user", "avatarUrl"], null);

  componentDidMount = async () => {
    const {socket} = this.props;
    const {directId} = this.props.match.params;

    socket.on("connection", this.emitJoinSocketRoomRequest(directId));
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const currentDirectChatRoom = this.props.chatroom.getDirectChatRoomById;
    const oldDirectChatRoom = prevProps.chatroom.getDirectChatRoomById;
    const {user: currentUser} = this.props.context.userState;
    const {user: oldUser} = prevProps.context.userState;

    if(oldDirectChatRoom !== currentDirectChatRoom && currentUser) {
      currentDirectChatRoom.users.forEach((user)=>{ if(user._id!==currentUser._id) this.setState({targetUserId: user._id}); });
    }
  }

  emitJoinSocketRoomRequest = directId => {
    const {socket} = this.props;
    socket.emit("join", directId);
  };

  prepareDataForMutation = () => {
    const {inputMessageText: msg} = this.state;
    const {directId: chatroom} = this.props.match.params;
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
      return mutate({variables: this.prepareDataForMutation()}).then(()=>{
        this.props.context.addNotification(this.state.targetUserId, {
          description: this.props.context.userState.user.profile.firstName +" sent you a private message!",
          url: "/direct/"+this.props.match.params.directId,
          type: TYPE_PRIVATE_MESSAGE,
        });
      });
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
    if(this.props.chatroom.getDirectChatRoomById){
      const {getDirectChatRoomById: directChatRoom} = this.props.chatroom;
      const {userState} = this.props.context;

      let noPermission = true;
      if(userState.user)
        directChatRoom.users.forEach((user)=>{
          if(user._id===userState.user._id) noPermission=false;
        });
      if(noPermission) this.props.history.push(`/`);
    }
  };

  render() {
    const {inputMessageText} = this.state;
    const {match} = this.props;
    this.checkPermission();

    return (
      <div className="page">
        <Sidebar>
        </Sidebar>
        <section className="page__content">
          <div className="chat__wrapper">
            <header className="page__header">
              <h2 className="page__heading">Direct messaging</h2>
            </header>
            <div className="chat__content">
              <DirectChatMessages match={match}/>
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
      </div>
    );
  }
}

const GET_CURRENT_CHATROOM = gql`
    query($_id: String!) {
        getDirectChatRoomById(_id: $_id) {
            users {
                _id
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
  options: (props) => ({variables: {_id: props.match.params.directId}}),
  name: "chatroom",
});

const withAddMessage = graphql(ADD_MESSAGE);

export default compose(withCurrentChatroom, withAddMessage)(withSocket(withUserContext(Chat)));