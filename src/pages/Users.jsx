import { useState } from 'react';
import { Avatar, List, Button, Typography, Flex } from 'antd';
import { useQuery } from '@tanstack/react-query';
// Project imports
import { useUser } from '../lib/context/user';
import useUsers from '../hooks/useUsers';
import Loading from './Loading';
import Error from './Error';
import Unathorized from './Unathorized';
import User from '../components/User';
import canRoleDo from '../util/roleValidation';
import { LangMappings } from '../util/i8n';

const { Title } = Typography;

function Users() {
  const { user } = useUser();
  const { readUsers } = useUsers();

  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [username, setUsername] = useState(null);

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
      <>
      <Flex gap='small' wrap style={{ marginBottom: 20 }} justify='space-between' >
        { canRoleDo(user.role, 'CREATE', 'user') ?
          <Button type="primary" size="large" onClick={() => {
          setActionType('Crear')
          setOpen(true)
          }}>
            Crear
          </Button>
        : null }
      </Flex>
        <div className='scroll'>
        <List
          style={{ marginTop: 20 }}
          locale={{
            emptyText: <Title>Sin usuarios</Title>
          }}
          dataSource={users.map((user) => {
            return {
              username: user.username,
              name: user.name,
              role: user.role,
              avatar: user.avatar
            }
          })}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${item.name}`} />}
                title={<a onClick={() => {
                    setActionType('Editar')
                    setUsername(item.username)
                    setOpen(true)
                    }}>{item.name}</a>}
                description={ LangMappings.user.roles[item.role] }
              />
            </List.Item>
          )}
        />
        </div>
          { open ?
          <User open={open} setOpen={setOpen} type={actionType} username={username} />
          : null }
      </>
  )
}

export default Users;