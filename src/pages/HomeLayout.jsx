import { useContext } from 'react';
import { AppstoreOutlined, UserOutlined, TableOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, FloatButton, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
// Project imports
import { UserContext } from '../hooks/UserContext';
import { NotificationContext } from '../hooks/NotificationContext';
import Unathorized from './Unathorized';
import Loading from './Loading';
import useAuth from '../hooks/useAuth';
import evaluateRole from '../util/roleValidation';

const { Content, Header, Footer } = Layout;
const { Title } = Typography;

const HomeLayout = ({ children }) => {
  const { user, isLoading } = useContext(UserContext);
  const api = useContext(NotificationContext);
  const { logoutUser } = useAuth();

  const { mutateAsync: logout } = useMutation({
    mutationFn: async () => {
      try {
        await logoutUser();
        navigate('/login');
      } catch(err) {
        api.error({ message: 'Error', description: err.message, placement: 'top', showProgress: true });
      }
    }
  });

  const navigate = useNavigate();


  if(isLoading) {
    return <Loading/>
  }

  if (!user) {
    return (
      <Unathorized/>
    )
  }

  return (
    <>
    <Layout className='main-flex'>
      <Layout>
      <Header className='header'>
          <Image alt='cnrgs-logo' preview={false} width={50} src='/CNGRS.svg' />
          <Title>{user.name}</Title>
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
          { evaluateRole(user.role, { resource: 'user', verb: 'LIST' }, { it: user.name }) ?
          <FloatButton icon={<TeamOutlined />} tooltip={<div>Usuarios</div>} onClick={() => navigate('/users')}/> 
          : null }
          <FloatButton icon={<UserOutlined />} tooltip={<div>Usuario</div>} onClick={() => navigate(`/users/${user.username}`)}/>
          <FloatButton icon={<TableOutlined />} tooltip={<div>Jóvenes</div>} onClick={() => navigate('/people')}/>
        </FloatButton.Group>
      </Layout>
    </Layout>
    </>
  );
};
export default HomeLayout;