// src/components/App.js

import useFetchData from "../hooks/useFetchData"; // Adjust the path as needed
import "../styles/App.css";

function App() {
  const { data, loading, error } = useFetchData("/users");

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <tr key={index}>
              <td>{d.username}</td>
              <td>{d.password}</td>
              <td>{d.role}</td>
              <td>{d.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
