import React, {Component} from "react";
import {SidebarItem, SidebarMessage} from "./Sidebar";
import withUserContext from "../withUserContext";
import gql from "graphql-tag";
import {compose, graphql} from "react-apollo";

class SidebarFriends extends Component{

  componentDidMount() {
    const query = this.props.currentUserQuery;
    if (query) {
      this.props.assignCurrentUserFriendsQuery(query);
    }
  }

  showFriends = (thisUser) => {
    if (thisUser) {
      if (thisUser.friends && thisUser.friends.length > 0)
        return thisUser.friends.map(({_id, profile}) => <SidebarItem key={_id} title={`${profile.firstName}`} url={`/profile/${_id}`}/>);
      return <SidebarMessage>You have no friends looser</SidebarMessage>;
    }
  };

  render() {
    const {getUserById} = this.props.currentUserQuery;

    return (
      <div>
        {this.showFriends(getUserById)}
      </div>
    );
  }

}

const GET_USER = gql`
  query($_id: String!) {
    getUserById(_id: $_id) {
    _id
      friends
        {
          _id
          profile {
            firstName
          }
        }
    }
  }
`;


const withCurrentUser = graphql(GET_USER, {
  options: (props) => {
    return {variables: {_id: props.context.userState.user._id}};
  },
  name: "currentUserQuery",
});

export default (withUserContext(compose(withCurrentUser)(SidebarFriends)));