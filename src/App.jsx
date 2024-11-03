import './App.css';
import { ConfigProvider } from 'antd';
import { Route , Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Project imports
import customTheme from './theme.jsx';
import { UserProvider } from './lib/context/user';
import { NotificationProvider } from './lib/context/notification';
import Login from './pages/Login';
import HomeLayout from './pages/HomeLayout';
import Person from './pages/Person';
import People from './pages/People';
import Users from './pages/Users';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {

  return (
    <ConfigProvider theme={ customTheme }>
    <QueryClientProvider client={ queryClient }>
    <UserProvider>
    <NotificationProvider>
      <Routes>
        <Route path='/' element={ <HomeLayout/> }>
          <Route path='/person/:personId' element={ <Person/> } />
          <Route path='/people' element={ <People/> } />
          <Route path='/users' element={ <Users/> } />
        </Route>
        <Route path='/login' element={ <Login/> } />
        <Route path='*' element={ <NotFound/> } />
      </Routes>
    </NotificationProvider>
    </UserProvider>
    </QueryClientProvider>
    </ConfigProvider>
  )
}

export default App
