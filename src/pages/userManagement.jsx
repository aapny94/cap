import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_GET_USERS } from "../apiConfig"; // Import the API endpoint
import UserList from "../components/userList";
import CreateUser from "../components/createUser";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_GET_USERS);
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleStatusChange = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleUserCreated = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleUserDeleted = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="contentFlex">
      <UserList
        users={users}
        setUsers={setUsers} // Pass the setUsers function
        onStatusChange={handleStatusChange}
        onDelete={handleUserDeleted}
      />
      <CreateUser onUserCreated={handleUserCreated} />{" "}
      {/* Pass the callback function */}
    </div>
  );
}

export default UserManagement;