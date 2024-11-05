import React, { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import { AuthContext, AuthContextType } from "../../contexts/AuthProvider";
import { MainNav } from "./NavBars";
import UserTabs from "./UserTabs";
import UserTable from "./manage roles/UserTable";

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext) as AuthContextType; // Type assertion for AuthContext

  return (
    <>
      {/* Uncomment this line to display user details */}
      {/* <p>{`${user?.username} ${user?.role}, ${user?.id}`}</p> */}
      <MainNav>
        <div>
          <h1>Dashboard home</h1>
          <p>dashboard home content</p>
        </div>
      </MainNav>
    </>
  );
};

export default Dashboard;
