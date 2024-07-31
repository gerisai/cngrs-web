import { useState, useContext } from 'react';
import { Avatar, List, Button, notification, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../hooks/UserContext';
import HomeLayout from './HomeLayout';
import useUser from '../hooks/useUser';
import Loading from './Loading';
import Error from './Error';
import Unathorized from './Unathorized';
import NewUser from '../components/NewUser';
import evaluateRole from '../util/roleValidation';

const { Title } = Typography;

function Users() {
  const { user } = useContext(UserContext);
  const { readUsers } = useUser();
  const [open, setOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  
  const { data: users , isLoading, error } = useQuery({
    queryFn: () => readUsers(),
    queryKey: ['users'],
    retry: false
  });

  if (isLoading) {
    return <Loading/>;
  }

  if (error) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbbiden')) return <Unathorized/>;
    return <Error message={error.message}/>;
  }

  return (
      <HomeLayout>
        {contextHolder}
        <List
          locale={{
            emptyText: <Title>Sin usuarios</Title>
          }}
          dataSource={users.map((user) => {
            return {
              username: user.username,
              name: user.name,
              role: user.role
            }
          })}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                title={<a href={`${import.meta.env.VITE_WEB_URL}/users/${item.username}`}>{item.name}</a>}
                description={item.role}
              />
            </List.Item>
          )}
        />
        { evaluateRole(user.role, { resource: 'user', verb: 'CREATE' }, { it: user.name }) ?
          <Button type="primary" size="large" onClick={() => setOpen(true)}>
            Crear
          </Button>
        : null }
          <NewUser open={open} setOpen={setOpen} notificationApi={api}/>
      </HomeLayout>
  )
}

export default Users;