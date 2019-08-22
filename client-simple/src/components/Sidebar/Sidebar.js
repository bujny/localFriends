import React, {Component} from "react";
import MenuIconSvg from "../../assets/svg/menu.svg";
import LeaveSvg from "../../assets/svg/leave.svg";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/logo2.png";
import Button from "../Button/Button";
import "./Sidebar.style.scss";
import {UserContext} from "../../services/userContext";
import {Link} from "react-router-dom";
import {Avatar, Badge, Menu, Dropdown, Icon} from "antd";
import gql from "graphql-tag";
import {graphql, compose} from "react-apollo";
import withUserContext from "../withUserContext";
import SidebarDropDownItem, {SidebarDropDown} from "./SidebarDropDown";

const SidebarMessage = ({children}) => {
  return (
    <div className="sidebar__message">
      <span className="sidebar__text">{children}</span>
    </div>
  );
};

const SidebarItem = ({title, url, exitUrl}) => {
  return (
    <div className="sidebar__item">
      <a href={url} className="sidebar__title">{title}</a>
      {exitUrl && (
        <a href={exitUrl}>
          <img src={LeaveSvg} className="sidebar__icon" alt="Leave Channel"/>
        </a>
      )}
    </div>
  );
};

const SidebarArea = ({heading, children}) => {
  return (
    <div className="sidebar__area">
      <h2 className="sidebar__heading sidebar__heading--small">{heading}</h2>
      {children}
    </div>
  );
};

class Sidebar extends Component {
  state = {
    sidebarOpen: false,
    dropDown: false,
  };

  getUserName(userState = {user: {}}) {
    const {user} = userState;
    if (!user) return "Guest";
    else return user.profile && user.profile.firstName;
  }

  getUrlToUserProfile(userState = {user: {}}) {
    const {user} = userState;
    if (!user) return "#";
    return "/profile/" + user._id;
  }

  renderAccountsActions(userState, {logOut = () => null}) {
    if (!userState.user)
      return <p className="sidebar__acc-actions"><a href="/login" className="sidebar__link">Login</a> or <a
        href="/register" className="sidebar__link">register</a> if you don't have an account yet!</p>;
    else {
      // DK: NOBODY GOT TIME FOR THAT（╯°□°）╯︵ ┻━┻
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return <p className="sidebar__acc-actions"><a onClick={logOut} className="sidebar__link">Logout</a></p>;
    }
  }

  renderAvatar = (user) => {
    if (user.avatarUrl) return <Avatar shape="square" size={90} src={user.avatarUrl}/>;
    return <Avatar shape="square" size={90} icon="user"/>;
  };

  renderDropDown = () => {
    const {getUserById} = this.props.currentUserQuery;
    if (!getUserById || !this.state.dropDown) return;
    if (!getUserById.notifications) return;
    let items = [];
    getUserById.notifications.forEach((notification) => {
      items.push(<SidebarDropDownItem toggleDropDown={this.toggleDropDown} key={notification._id} query={this.props.currentUserQuery} _id={notification._id} description={notification.description} url={notification.url} type={notification.type}/>);
    });
    return (
      <SidebarDropDown>
        {items}
      </SidebarDropDown>
    );
  };

  toggleDropDown = (notifications) => {
    if(!this.state.dropDown && (notifications == null || notifications.length===0)) return;
    this.setState((prevState) => {
      return {dropDown: !prevState.dropDown};
    });
  };

  renderAvatarWithBadge = (userState) => {
    const {user} = userState;
    if (!user) return;
    return (<Badge className="sidebar__badge" onClick={()=>this.toggleDropDown(user.notifications)} count={user.notifications ? user.notifications.length : 0}>{this.renderAvatar(user)}</Badge>);
  };

  render() {
    const {sidebarOpen} = this.state;
    const isActive = sidebarOpen ? "is-active" : "";

    return (
      <>
        <button className="sidebar__toggler" onClick={() => this.setState({sidebarOpen: !this.state.sidebarOpen})}>
          <img src={MenuIconSvg} alt=""/>
        </button>

        <section className={"sidebar " + isActive}>
          <header className="sidebar__header">
            <UserContext.Consumer>
              {({logOut, userState}) => <>
                <Link to="/">
                  <img src={logo2} className="sidebar__img" alt=""/>
                </Link>
                <div className="sidebar__relative">
                  {this.renderAvatarWithBadge(userState)}
                  {this.renderDropDown()}
                </div>
                <h1 className="sidebar__heading">Hello, <Link
                  to={this.getUrlToUserProfile(userState)}>{this.getUserName(userState)}</Link></h1>
                {this.renderAccountsActions(userState, {logOut})}
              </>}
            </UserContext.Consumer>
          </header>

          <div className="sidebar__content">
            {this.props.children}
          </div>

          <UserContext.Consumer>
            {({userState}) => <>
              <footer className="sidebar__footer">
                {userState.user ? (
                  <Button href="/create" variant="primary" additionalClass="sidebar__btn" isLink>Create Channel</Button>
                ) : (
                  <Button href="/register" variant="primary" additionalClass="sidebar__btn" isLink>Create
                    Account</Button>
                )}
              </footer>
            </>}
          </UserContext.Consumer>
        </section>
      </>
    );
  }
}

const GET_USER = gql`
  query($_id: String!) {
    getUserById(_id: $_id) {
      _id
      notifications
        {
          _id
          description
          url
          type
        }
    }
  }
`;


const withCurrentUser = graphql(GET_USER, {
  options: (props) => {
    return {variables: {_id: props.context.userState.user ? props.context.userState.user._id : "null", meta: null}};
  },
  name: "currentUserQuery",
});

export default (withUserContext(compose(withCurrentUser)(Sidebar)));
export {SidebarArea, SidebarItem, SidebarMessage};