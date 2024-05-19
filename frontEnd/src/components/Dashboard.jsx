import { useContext } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthProvider";
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <h1>im a dashboard</h1>
      <p>{`${user.username} ${user.role}, ${user.id}`}</p>
    </>
  );
}
