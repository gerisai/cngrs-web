import { useState, useEffect } from 'react';

export default function useGetUser() {
    const [ user, setUser ] = useState(null);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
    }, []);
    return {
    user,
    setUser
    }
}