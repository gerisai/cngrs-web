import { useContext, useState } from 'react';
import { AppstoreOutlined, UserOutlined, TableOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, FloatButton, Image, Typography, Avatar, Flex, Upload, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// Project imports
import { UserContext } from '../hooks/UserContext';
import { NotificationContext } from '../hooks/NotificationContext';
import User from '../components/User';
import Unathorized from './Unathorized';
import Loading from './Loading';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import canRoleDo from '../util/roleValidation';

const { Content, Header, Footer } = Layout;
const { Title } = Typography;

const HomeLayout = ({ children }) => {
  const { user, authLoading } = useContext(UserContext);
  const api = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // current user edit
  const [avatarLoading, setAvalarLoading] = useState(false); 
  const { logoutUser } = useAuth();
  const { uploadAvatar } = useUser();

  const avatarProps = {
    name: 'avatar',
    showUploadList: false,
    accept: '.png,.jpeg',
    async customRequest ({ file }) {
      const data = new FormData();
      data.append('avatar', file);
      try {
        setAvalarLoading(true);
        await uploadAvatar(user.username, data);
        queryClient.invalidateQueries(['user']);
        api.success({message: 'Éxito', message: 'Foto actualizada', placement: 'top'});
        setAvalarLoading(false);
      } catch (err) {
        api.error({ message: 'Error', description: `Error al actualizar la foto: ${err}`, placement: 'top'});
        setAvalarLoading(false);
      }
    },
    maxCount: 1
  }

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

  if(authLoading) {
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
          <Flex justify='center' align='center'>
            <Upload {...avatarProps}>
              { avatarLoading ? <Spin size="large" /> : <Avatar src={user.avatar} size="large" icon={<UserOutlined />} /> }
            </Upload>
            <Title style={{ marginLeft: 10 }}>{user.name.split(' ')[0]}</Title>
          </Flex>
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
          { canRoleDo(user.role, 'LIST', 'user') ?
          <FloatButton icon={<TeamOutlined />} tooltip={<div>Usuarios</div>} onClick={() => navigate('/users')}/> 
          : null }
          <FloatButton icon={<UserOutlined />} tooltip={<div>Usuario</div>} onClick={() => setOpen(true)}/>
          <FloatButton icon={<TableOutlined />} tooltip={<div>Jóvenes</div>} onClick={() => navigate('/people')}/>
        </FloatButton.Group>
        { open ?
          <User open={open} setOpen={setOpen} type={'Editar'} username={user.username} />
        : null }
      </Layout>
    </Layout>
    </>
  );
};

export default HomeLayout;