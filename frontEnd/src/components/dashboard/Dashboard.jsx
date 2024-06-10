import { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import { AuthContext } from "../../contexts/AuthProvider.jsx";
import { MainNav, SideNavBar, TopNavBar } from "./NavBars.jsx";
import UserTabs from "./UserTabs.jsx";
import UserTable from "./manage roles/UserTable.jsx";
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {/* <p>{`${user.username} ${user.role}, ${user.id}`}</p> */}
      <MainNav>
        <div>
          <h1>Main Content</h1>
          <p>This is where your main content will be displayed.</p>
          <UserTable />
        </div>
      </MainNav>
    </>
  );
}
