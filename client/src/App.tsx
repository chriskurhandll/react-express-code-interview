import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState<any[]>([]);
  const [sortField, setSortField] = useState<string>('');

  // API call to get users and their ID from backend

  const fetchUsers = async (sortField: string) => {
    try {
      let url = 'http://localhost:3001/api/users';
      if (sortField) {
        url += `?sort=${sortField}`;
      }

      const response = await axios.get(url);
      // console.log("Incoming Response Data: ", response.data)
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(sortField);
  }, [sortField]);

  return (
    <div className="app-container">
      <h1 className="header">Users</h1>

      <div className="sort-container">
        <label className="sort-label" htmlFor="sortField">Sort by:</label>
        <select
          id="sortField"
          className="sort-dropdown"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="">Select a field</option>
          <option value="name">Name</option>
          <option value="id">ID</option>
        </select>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">ID</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user: any, index: number) => (
              <tr key={index} className="user-row">
                <td className="table-data">{user.name}</td>
                <td className="table-data">{user.id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="no-users">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
