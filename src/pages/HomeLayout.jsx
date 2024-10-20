import { useState } from 'react';
import { AppstoreOutlined, UserOutlined, TableOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, FloatButton, Button, Image, Typography, Avatar, Flex, Upload, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
// Project imports
import { useUser } from '../lib/context/user';
import { useNotification } from '../lib/context/notification';
import User from '../components/User';
import Unathorized from './Unathorized';
import useUsers from '../hooks/useUsers';
import canRoleDo from '../util/roleValidation';

const { Content, Header, Footer } = Layout;
const { Title } = Typography;

const HomeLayout = ({ children }) => {
  const { user, logout } = useUser();
  const api = useNotification();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // current user edit
  const [avatarLoading, setAvalarLoading] = useState(false); 
  const { uploadAvatar } = useUsers();

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
        api.success({message: 'Éxito', description: 'Foto actualizada', placement: 'top'});
      } catch (err) {
        api.error({ message: 'Error', description: `Error al actualizar la foto: ${err}`, placement: 'top'});
      } finally {
        setAvalarLoading(false);
      }
    },
    maxCount: 1
  }

  const { mutateAsync: logoutUser } = useMutation({
    mutationFn: async () => {
      try {
        await logout();
        navigate('/login');
      } catch(err) {
        api.error({ message: 'Error', description: err.message, placement: 'top', showProgress: true });
      }
    }
  });

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
              { avatarLoading ? <Spin size="large" /> : <Avatar shape="square" src={user.avatar} size="large" icon={<UserOutlined />} /> }
            </Upload>
            <Title style={{ marginLeft: 10, marginTop: 20 }}>{user.name.split(' ')[0]}</Title>
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
          <FloatButton icon={<LogoutOutlined />} tooltip={<div>Cerrar Sesión</div>} onClick={logoutUser}/>
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
