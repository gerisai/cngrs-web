import './App.css';
import { ConfigProvider } from 'antd';
import { Route , Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { notification } from 'antd';
// Project imports
import customTheme from './theme.jsx';
import { UserContext } from './hooks/UserContext';
import { NotificationContext } from './hooks/NotificationContext';
import useGetAuthUser from './hooks/useGetAuthUser';
import Login from './pages/Login';
import Person from './pages/Person';
import People from './pages/People';
import Users from './pages/Users';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  const { user, authLoading, setUser, setAuthLoading } = useGetAuthUser();
  const [api, contextHolder] = notification.useNotification();

  return (
    <ConfigProvider theme={ customTheme }>
    <QueryClientProvider client={ queryClient }>
    <UserContext.Provider value={{ user, setUser, authLoading, setAuthLoading}}>
    <NotificationContext.Provider value={ api }>
      { contextHolder }
      <Routes>
        <Route path='/' element={ <People/> } />
        <Route path='/login' element={ <Login/> } />
        <Route path='/person/:personId' element={ <Person/> } />
        <Route path='/people' element={ <People/> } />
        <Route path='/users' element={ <Users/> } />
        <Route path='*' element={ <NotFound/> } />
      </Routes>
    </NotificationContext.Provider>
    </UserContext.Provider>
    </QueryClientProvider>
    </ConfigProvider>
  )
}

export default App
