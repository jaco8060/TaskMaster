import { useContext } from "react";

import { AuthContext } from "../contexts/AuthProvider";
import { TopNavBar } from "./NavBars.jsx";
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {/* <p>{`${user.username} ${user.role}, ${user.id}`}</p> */}
      <TopNavBar />
    </>
  );
}
