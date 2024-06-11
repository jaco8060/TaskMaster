import { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import { AuthContext } from "../../contexts/AuthProvider.jsx";
import { MainNav } from "./NavBars.jsx";
import UserTabs from "./UserTabs.jsx";
import UserTable from "./manage roles/UserTable.jsx";
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {/* <p>{`${user.username} ${user.role}, ${user.id}`}</p> */}
      <MainNav>
        <div>
          <h1>Dashboard Home</h1>
          <p>dashboard home content</p>
        </div>
      </MainNav>
    </>
  );
}
