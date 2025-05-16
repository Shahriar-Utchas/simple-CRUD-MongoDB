import React, { use, useState } from 'react';
import { Link } from 'react-router';
const Users = ({ userPromise }) => {
    const initialUsers = use(userPromise);
    const [users, setUsers] = useState(initialUsers);
    const handleSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const newUser = { name, email };
        console.log(newUser);

        // Here you can send the name to the server
        fetch('http://localhost:4000/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newUser)

        })
            .then(res => res.json())
            .then(data => {
                console.log(`data after creating in DB `, data);
                if (data.insertedId) {
                    newUser._id = data.insertedId;
                    const newUsers = [...users, newUser];
                    setUsers(newUsers);
                    alert('user created successfully');
                    e.target.reset();
                }
            })
    }
    const handleDelete = (id) => {
        console.log(id);
        fetch(`http://localhost:4000/users/${id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                console.log(`After Delete`, data);
                if (data.deletedCount > 0) {
                    const remaining = users.filter(user => user._id !== id);
                    setUsers(remaining);
                    alert('user deleted successfully');
                }

            })
    }
    const handleUpdateUser = (id) => (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const updatedUser = { name, email };

        fetch(`http://localhost:4000/users/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
            .then(res => res.json())
            .then(data => {
                console.log(`After Update`, data);
                if (data.modifiedCount > 0) {
                    const remaining = users.filter(user => user._id !== id);
                    const updated = users.find(user => user._id === id);
                    updated.name = name;
                    updated.email = email;
                    const newUsers = [...remaining, updated];
                    setUsers(newUsers);
                    alert('user updated successfully');
                }
            })
    }

    return (
        <div>
            users: {users.length}
            <form action="" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder='enter name' />
                <br />
                <input type="email" name="email" placeholder='enter email' />
                <br />
                <input type="submit" />
            </form>

            <h1>Users</h1>
            {
                users.map(user => <div key={user._id}>
                    <h3>Name: {user.name}</h3>
                    <p>E-mail: {user.email}</p>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                    <a href={`http://localhost:4000/users/update/${user._id}`}>
                        <button>Update</button>

                    </a>

                    <form onSubmit={handleUpdateUser(user._id)}>
                        <input type="text" name='name' defaultValue={user.name} />
                        <br />
                        <input type="text" name='email' defaultValue={user.email} />
                        <br />
                        <input type="submit" value="update user" />
                    </form>

                </div>)
            }
        </div>
    );
};

export default Users;