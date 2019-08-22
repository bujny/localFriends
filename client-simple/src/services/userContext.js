import * as React from "react";
import { accountsGraphQLTransport, accountsPassword } from "./apollo";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";

const initialState = { user: undefined, loggingIn: true };

export const UserContext = React.createContext({
  userState: initialState,
  setUserState: () => {},
  getUser: () => {},
  signUp: () => {},
  logIn: () => {},
  logOut: () => {},
  addNotification: (userId, notification) => {},
  removeNotification: (notificationId) => {},
});

const GET_USER = gql`
query getUser {
  getUser {
  id
  _id
  emails {
    address
    verified
    __typename
  }
  notifications {
    _id
    
  }
  friends {
    _id
  }
  profile {
    firstName
    lastName
  }
  avatarUrl
  username
  __typename
  }
}`;

const CREATE_NOTIFICATION = gql`
  mutation ($description: String!, $url: String!, $type: String!) {
    createNotification(description: $description, url: $url, type: $type){
        _id
    }
  }
`;

const ADD_NOTIFICATION = gql`
  mutation ($userId: String!, $notificationId: String!) {
    addNotification(userId: $userId, notificationId: $notificationId){
        _id
    }
  }
`;

const REMOVE_NOTIFICATION = gql`
  mutation ($notificationId: String!) {
    removeNotification(notificationId: $notificationId){
        _id
    }
  }
`;

const DELETE_NOTIFICATION = gql`
  mutation ($notificationId: String!) {
    deleteNotification(notificationId: $notificationId){
        _id
    }
  }
`;

const _UserProvider = props => {
  const [userState, setUserState] = React.useState(initialState);

  const getUser = async () => {
    let user = null;
    try {
      const {data: {getUser}} = await props.client.query({query: GET_USER, fetchPolicy: "network-only"});
      user = getUser;
      console.log(`getUser: `, getUser);
    } catch (error) {
      _handleAuthError(error, user);

    } finally {
      setUserState({
        user: user && { ...user, _id: user.id },
        loggingIn: false,
        userRequested: true
      });
    }
  };

  // Try to fetch logged user data to populate into userState
  if (!userState.user && !userState.userRequested) getUser();

  const logIn = async (email, password) => {
    try {
      const accPass = await accountsPassword.login({ password, user: { email } });
      return await getUser();
    } catch (err) {
      _handleAuthError(err);
      return err;
    }
  };

  const signUp = async ({ firstName, lastName, email, password, isLandlord }) => {
    try {
      await accountsPassword.createUser({
        password,
        email,
        profile: {firstName, lastName}
      });
    }  catch (err) {
      _handleAuthError(err);
      return err;
    }
    await logIn(email, password);
  };

  const logOut = async () => {
    await accountsGraphQLTransport.logout();
    setUserState({ user: undefined, loggingIn: false });
    return await getUser();
  };

  const addNotification = async (userId, notification) => {
    const newNotification = await props.client.mutate({mutation: CREATE_NOTIFICATION, name: "createNotification",
      variables: {description: notification.description,
        url: notification.url,
        type: notification.type,
      }});
    await props.client.mutate({mutation: ADD_NOTIFICATION, variables: {userId: userId, notificationId: newNotification.data.createNotification._id}});
  };

  const removeNotification = async (notificationId) => {
    await props.client.mutate({mutation: REMOVE_NOTIFICATION, variables: {notificationId: notificationId}});
    await props.client.mutate({mutation: DELETE_NOTIFICATION, variables: {notificationId: notificationId}});
  };


  function _handleAuthError(err, user) {
    console.warn("Auth error: ", err);
    setUserState({
      user: user && { ...user, _id: user.id },
      loggingIn: false,
      authErr: err
    });
  }

  return <UserContext.Provider
    value={{ userState, setUserState, getUser, signUp, logIn, logOut, addNotification, removeNotification }}>
    {props.children}
  </UserContext.Provider>;
};
export const UserProvider = withApollo(_UserProvider);