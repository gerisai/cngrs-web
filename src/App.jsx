import './App.css';
import { ConfigProvider } from 'antd';
import { Route , Routes } from 'react-router-dom';
import customTheme from './theme.jsx';
import Login from './pages/Login';
import Person from './pages/Person';
import People from './pages/People';


function App() {
  return (
    <ConfigProvider 
    theme={ customTheme }
    >
      <Routes>
        <Route path='/login' element={ <Login/> } />
        <Route path='/person' element={ <Person/> } />
        <Route path='/people' element={ <People/> } />
      </Routes>
    </ConfigProvider>
  )
}

export default App
