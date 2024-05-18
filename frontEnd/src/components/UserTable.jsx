import Table from "react-bootstrap/Table";
import useFetchData from "../hooks/useFetchData";
function UserTable() {
  const { data, loading, error } = useFetchData("/users");

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, index) => (
          <tr key={index}>
            <td>{d.id}</td>
            <td>{d.username}</td>
            <td>{d.email}</td>
            <td>{d.role}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UserTable;
