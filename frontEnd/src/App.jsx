import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8081/users");
        const data = await response.json();
        setData(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th>id</th>
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
