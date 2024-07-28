import './App.css';
import { ConfigProvider } from 'antd';
import { Route , Routes } from 'react-router-dom';
import customTheme from './theme.jsx';
import { UserContext } from './hooks/UserContext';
import useGetUser from './hooks/useGetUser';
import Login from './pages/Login';
import Person from './pages/Person';
import People from './pages/People';
import User from './pages/User';
import NotFound from './pages/NotFound';


function App() {
  const { user, setUser, isLoading } = useGetUser(); 

  return (
    <ConfigProvider theme={ customTheme }>
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      <Routes>
        <Route path='/login' element={ <Login/> } />
        <Route path='/person' element={ <Person/> } />
        <Route path='/people' element={ <People/> } />
        <Route path='/user' element={ <User/> } />
        <Route path='*' element={ <NotFound/> } />
      </Routes>
    </UserContext.Provider>
    </ConfigProvider>
  )
}

export default App
