import React, {Component} from "react";
import withUserContext from "../../components/withUserContext";
import Sidebar, {SidebarArea} from "../../components/Sidebar/Sidebar";
import SidebarFriends from "../../components/Sidebar/SidebarFriends";
import ProfileActions from "../../components/Profile/ProfileActions";
import ProfileDescription from "../../components/Profile/ProfileDescription";
import ProfileFriends from "../../components/Profile/ProfileFriends";
import gql from "graphql-tag";
import {Button} from "antd";
import {compose, graphql} from "react-apollo";
import Modal from "../../components/Modal/Modal";

class Profile extends Component {
  state = {
    currentUserQuery: null,
    friendRequest: false,
  };

  refetchCurrentUserFriends = () => {
    if(this.state.currentUserQuery) {
      this.state.currentUserQuery.refetch();
    }
  };

  assignCurrentUserFriendsQuery = (query) => {
    this.setState({currentUserQuery:query});
  };

  rejectFriendRequest = () => {
    this.props.deleteFriendRequest().then(()=>this.setState({friendRequest: false}));
  };

  addToFriends = () => {
    const thisUserQuery = this.props.thisUserQuery;
    this.props.addToFriends().then(() => {
      thisUserQuery.refetch();
      this.props.deleteFriendRequest();
      this.refetchCurrentUserFriends();
      this.setState({friendRequest:false});
    });
  };


  renderFriendRequestModal = () => {
    const {friendRequest} = this.state;

    return (
      <Modal
        id="add_users"
        heading="Friend request"
        desc={null}
        modalOpen={friendRequest}
        closeModal={() => this.rejectFriendRequest()}>
        <p>{this.props.location.state && this.props.location.state.description}. Do you want to add this user to your friends list?</p>
        <div className="profile__friendrequest__buttons">
          <Button onClick={this.rejectFriendRequest} className="profile__friendrequest__reject" type="danger">Reject</Button>
          <Button onClick={this.addToFriends} type="primary">Bruderschaft</Button>
        </div>
      </Modal>
    );
  };


  componentDidUpdate(prevProps, prevState, snapshot) {
    const {getFriendRequest} = this.props.getFriendRequest;
    if (prevProps.getFriendRequest.getFriendRequest !== getFriendRequest) {
      if(getFriendRequest != null) this.setState({friendRequest: true});
    }

  }

  render() {
    const {userState} = this.props.context;
    const thisUserQuery = this.props.thisUserQuery;

    return (
      <div className="page">
        {this.state.friendRequest && this.renderFriendRequestModal()}
        <Sidebar userName={null}>
          {userState.user && (
            <SidebarArea heading="Your Friends">
              <SidebarFriends assignCurrentUserFriendsQuery={this.assignCurrentUserFriendsQuery}/>
            </SidebarArea>
          )}
        </Sidebar>
        <section className="page__content">
          <header className="page__header">
            <h2 className="page__heading">User Profile</h2>
          </header>
          <div>
            <ProfileActions history={this.props.history} thisUserQuery={thisUserQuery} thisUserId={this.props.match.params.userId} refetchCurrentUserFriends={this.refetchCurrentUserFriends} />
            <ProfileDescription thisUserQuery={thisUserQuery} />
            <ProfileFriends thisUserQuery={thisUserQuery} />
          </div>
        </section>
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
      friends
        {
          _id
          avatarUrl
          profile{
          firstName
          lastName
        }
        }
      roles
      createdAt
        emails {
          address
          verified
          }
    }
  }
`;

const withThisUser = graphql(GET_USER, {
  options: (props) => ({variables: {_id: props.match.params.userId}}),
  name: "thisUserQuery",
});

const ADD_TO_FRIENDS = gql`
  mutation ($friendId: String!) {
    addToFriends(friendId: $friendId){
        _id
          friends
        {
          _id
        }
    }
  }
`;

const withAddToFriends = graphql(ADD_TO_FRIENDS, {
  options: (props) => ({variables: {friendId: props.match.params.userId}}),
  name: "addToFriends"
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
  options: (props) => ({variables: {fromUser: props.match.params.userId,toUser: props.context.userState.user?props.context.userState.user._id:"null"}}),
});

const DELETE_FRIEND_REQUEST = gql`
  mutation ($friendRequestId: String!) {
    deleteFriendRequest(friendRequestId: $friendRequestId){
        _id
    }
  }
`;

const withDeleteFriendRequest = graphql(DELETE_FRIEND_REQUEST, {
  name: "deleteFriendRequest",
  options: (props) => {
    return {variables: {friendRequestId: props.getFriendRequest.getFriendRequest? props.getFriendRequest.getFriendRequest._id: "null"}};
  },
});

export default (withUserContext(compose(withThisUser, withAddToFriends, withGetFriendRequest, withDeleteFriendRequest)(Profile)));