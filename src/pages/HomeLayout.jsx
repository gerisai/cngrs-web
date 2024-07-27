import { AppstoreOutlined, UserOutlined, TableOutlined } from '@ant-design/icons';
import { Layout, FloatButton, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Content, Header, Footer } = Layout;
const { Title } = Typography;

const HomeLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
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
        CNGRS Web ©{new Date().getFullYear()} Made by Forni with 💜
      </Footer>
        <FloatButton.Group shape="circle" style={{ right: 24 }} icon={<AppstoreOutlined />} trigger="click" type="primary">
          <FloatButton icon={<UserOutlined />} tooltip={<div>Usuario</div>} onClick={() => navigate('/user')}/>
          <FloatButton icon={<TableOutlined />} tooltip={<div>Lista</div>} onClick={() => navigate('/people')}/>
        </FloatButton.Group>
      </Layout>
    </Layout>
  );
};
export default HomeLayout;