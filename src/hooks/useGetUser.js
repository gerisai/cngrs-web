import { useState, useEffect } from 'react';

export default function useGetUser() {
    const [ user, setUser ] = useState(null);
    const [ isLoading, setLoading ] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
        setLoading(false);
    }, []);
    return {
    user,
    setUser,
    isLoading
    }
}