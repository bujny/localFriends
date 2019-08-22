import React, {Component} from "react";
import "../../pages/Profile/Profile.style.scss";
import {Descriptions, Tooltip} from "antd";
import VerifiedSvg from "../../assets/svg/verified.svg";
import NotVerifiedSvg from "../../assets/svg/not-verified.svg";



const ProfileDescription = (props) => {
  const {getUserById} = props.thisUserQuery;
  let email = {address: "", verified: false};
  if (getUserById) if (getUserById.emails) email = getUserById.emails[0];

  return (
    <div className="profile__element">
      <Descriptions title="User Info">
        <Descriptions.Item
          label="First Name">{getUserById && getUserById.profile.firstName}</Descriptions.Item>
        <Descriptions.Item label="Last Name">{getUserById && getUserById.profile.lastName}</Descriptions.Item>
        <Descriptions.Item label="Email">{email.address} <Tooltip
          title={email.verified ? "Verified email" : "Not verified email"}><img
            src={email.verified ? VerifiedSvg : NotVerifiedSvg}
            className="actions__img" alt=""/></Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="Role">{getUserById && getUserById.roles}</Descriptions.Item>
        <Descriptions.Item
          label="Since">{getUserById && getUserById.createdAt.slice(0, getUserById.createdAt.indexOf("T"))}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};



export default ProfileDescription;