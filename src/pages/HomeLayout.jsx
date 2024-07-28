import { useContext } from 'react';
import { AppstoreOutlined, UserOutlined, TableOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, FloatButton, Image, Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import Unathorized from './Unathorized';
import Loading from './Loading';
import useAuth from '../hooks/useAuth';

const { Content, Header, Footer } = Layout;
const { Title } = Typography;

const HomeLayout = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [api, contextHolder] = notification.useNotification();

  if(isLoading) {
    return <Loading/>
  }

  if (!user) {
    return (
      <Unathorized/>
    )
  }

  const logout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch(err) {
      api.error({ message: 'Error', description: err.message, placement: 'top', showProgress: true });
    }
  }


  return (
    <>
    {contextHolder}
    <Layout className='main-flex'>
      <Layout>
      <Header className='header'>
          <Image alt='cnrgs-logo' preview={false} width={50} src='/CNGRS.svg' />
          <Title>CNGRS</Title>
      </Header>
        <Content style={{ margin: '24px 24px'}}>
          <div className='content'>
            { children }
          </div>
        </Content>
        <Footer className='footer'>
        CNGRS Web ©{new Date().getFullYear()} Made with 💜
      </Footer>
        <FloatButton.Group shape="circle" style={{ right: 24 }} icon={<AppstoreOutlined />} trigger="click" type="primary">
          <FloatButton icon={<LogoutOutlined />} tooltip={<div>Cerrar Sesión</div>} onClick={logout}/>
          { (user.role === 'admin' || user.role === 'root') ?
          <FloatButton icon={<TeamOutlined />} tooltip={<div>Usuarios</div>} onClick={() => navigate('/users')}/> 
          : null }
          <FloatButton icon={<UserOutlined />} tooltip={<div>Usuario</div>} onClick={() => navigate('/user')}/>
          <FloatButton icon={<TableOutlined />} tooltip={<div>Jóvenes</div>} onClick={() => navigate('/people')}/>
        </FloatButton.Group>
      </Layout>
    </Layout>
    </>
  );
};
export default HomeLayout;