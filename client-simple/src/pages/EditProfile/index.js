import React, {Component} from "react";
import {compose, graphql} from "react-apollo";
import withUserContext from "../../components/withUserContext";
import gql from "graphql-tag";
import Sidebar, {SidebarArea} from "../../components/Sidebar/Sidebar";
import SidebarFriends from "../../components/Sidebar/SidebarFriends";
import {message, Form, Input, Button} from "antd";
import "./EditProfile.style.scss";
import {withRouter} from "react-router-dom";


class EditProfile extends Component {

  state = {
    firstName: "",
    lastName: "",
    avatarUrl: "",
  };

  updateFirstNameHandler = (e) => {
    e.preventDefault();
    this.props.updateUser({variables: {key: "profile.firstName", value: this.state.firstName}}).then(() => {
      this.props.context.getUser().then(()=>message.info("First name updated."));
    });
  };

  updateLastNameHandler = (e) => {
    e.preventDefault();
    this.props.updateUser({variables: {key: "profile.lastName", value: this.state.lastName}}).then(() => {
      this.props.context.getUser().then(()=>message.info("Last name updated."));
    });
  };

  updateAvatarUrlHandler = (e) => {
    e.preventDefault();
    this.props.updateUser({variables: {key: "avatarUrl", value: this.state.avatarUrl}}).then(() => {
      this.props.context.getUser().then(()=>message.info("Avatar url updated."));
    });
  };

  onFirstNameTextChange = (event) => {
    this.setState({firstName: event.target.value});
  };

  onLastNameTextChange = (event) => {
    this.setState({lastName: event.target.value});
  };

  onAvatarUrlTextChange = (event) => {
    this.setState({avatarUrl: event.target.value});
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {user} = this.props.context.userState;

    if (prevProps.context.userState.user !== user) {
      if (user == null) this.props.history.push("/");
      else {
        this.setState({
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          avatarUrl: user.avatarUrl,
        });
      }
    }
  }

  render() {
    const {userState} = this.props.context;

    return (
      <div className="page">
        <Sidebar>
          {userState.user && (
            <SidebarArea heading="Your Friends">
              <SidebarFriends assignCurrentUserFriendsQuery={() => {
              }}/>
            </SidebarArea>
          )}
        </Sidebar>
        <section className="page__content">
          <header className="page__header">
            <h2 className="page__heading">Edit Profile</h2>
          </header>
          <div>
            <div className="edit__profile__element">
              <Form onSubmit={(e) => this.updateFirstNameHandler(e)} layout="inline" className="edit__profile__form">
                <Form.Item label="Edit first name">
                  <Input onChange={this.onFirstNameTextChange} value={this.state.firstName}/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="edit__profile__element">
              <Form onSubmit={(e) => this.updateLastNameHandler(e)} layout="inline" className="edit__profile__form">
                <Form.Item label="Edit last name" className="edit__profile__input">
                  <Input onChange={this.onLastNameTextChange} value={this.state.lastName}/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="edit__profile__element">
              <Form onSubmit={(e) => this.updateAvatarUrlHandler(e)} layout="inline" className="edit__profile__form">
                <Form.Item label="Edit avatar url">
                  <Input onChange={this.onAvatarUrlTextChange} value={this.state.avatarUrl}/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const UPDATE_USER = gql`
  mutation($key: String!, $value: String!) {
    updateUser(key: $key, value: $value) {
      _id
      avatarUrl
      profile {
        firstName      
      }
    }
  }
`;

const withUpdateUser = graphql(UPDATE_USER, {
  name: "updateUser",
});

export default compose(withUpdateUser)(withRouter((withUserContext(EditProfile))));