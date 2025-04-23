'use client';

import React, { useState } from 'react';
import './Auth.css';

// set up signup form (different from login)
export default function SignupForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // handle when submit is clicked
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const { username, email, password } = formData;

        if (!username || !email || !password) {
            setError('Please fill out all fields.');
            return;
        }

        try {
            // calls a fetch to the signup route by using the information collected from the form.
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Signup failed.');
            } else {
                setSuccess('Signup success.');
                setFormData({ username: '', email: '', password: '' });
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('Something went wrong. Please try again.');
        }
    };

    // return the signup form with styling
    return (
        <form onSubmit={handleSubmit} className="form">
            <h2 className="heading">Signup</h2>

            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                required
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                required
            />

            <button
                type="submit"
                className="button"
            >
                Sign Up
            </button>

            {/* shows error / success message if either exists or doesnt exist */}
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </form>
    );
}
