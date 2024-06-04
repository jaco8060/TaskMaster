import { useContext } from "react";
import Nav from "react-bootstrap/Nav";
import { AuthContext } from "../contexts/AuthProvider";
import { MainNav, SideNavBar, TopNavBar } from "./NavBars.jsx";
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {/* <p>{`${user.username} ${user.role}, ${user.id}`}</p> */}
      <MainNav>
        <div>
          <h1>Main Content</h1>
          <p>This is where your main content will be displayed.</p>
        </div>
      </MainNav>
    </>
  );
}
