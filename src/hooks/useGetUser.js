import { useState, useEffect } from 'react';

export default function useGetUser() {
    const [ user, setUser ] = useState(null);
    const [ isLoading, setLoading ] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')); // TODO: Shoulnd't use local storage, saving some money
        setUser(user);
        setLoading(false);
    }, []);
    return {
    user,
    setUser,
    isLoading
    }
}