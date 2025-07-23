import { useEffect, useState } from 'react';

type User = {
  id: number;
  email: string;
  name: string;
  createdAt: string;
};

function BackendTest() {
  const BackendURL = import.meta.env.VITE_API_URL;
  

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BackendURL}/Users`) 
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl">Backend Response</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BackendTest;