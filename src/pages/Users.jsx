import { useState } from 'react';
import { Avatar, List, Button, Typography, Flex, Skeleton, AutoComplete } from 'antd';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
// Project imports
import { useUser } from '../lib/context/user';
import useUsers from '../hooks/useUsers';
import Error from './Error';
import Unathorized from './Unathorized';
import User from '../components/User';
import BulkCreate from '../components/BulkCreate';
import canRoleDo from '../util/roleValidation';
import { LangMappings } from '../util/i8n';
import { pageSize } from '../util/constants';

const { Title } = Typography;

function Users() {
  const { user } = useUser();
  const { readUsers, readUsersNames } = useUsers();


   // Drawer render state
  const [open, setOpen] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [username, setUsername] = useState(null);

  // Search state
  const [search, setSearch] = useState(null); // Search
  const [searchInput,setSearchInput] = useState(''); // Search input
  const [options, setOptions] = useState([]); // Autocomplete

  const { data: users , isPending, fetchNextPage, hasNextPage, error } = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) => {
      return readUsers({ name: search, limit: pageSize, page: pageParam })
    },
    getNextPageParam: (lastPage, allPages) => {
        return lastPage.length >= pageSize ? allPages.length + 1 : undefined
    },
    queryKey: ['people', { search }],
    retry: false
  });

  const { data: usersNames } = useQuery({
    queryFn: () => readUsersNames(),
    queryKey: ['usersNames'],
    retry: false
  });

  if (isPending) {
    return (
      <Flex align='center' justify='center'>
        <Skeleton active />
      </Flex>
    );
  }

  if (error) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbbiden') || error.message.includes('TokenExpiredError')) return <Unathorized/>;
    return <Error message={error.message}/>;
  }

  const onSelect = (match) => {
    setSearch(match);
    setOptions([]);
  };

  const handleAutocomplete = (value) => {
    if (usersNames) {
      const matches = usersNames.filter(({ name }) => name.includes(value.toUpperCase()));
      setOptions(!value ? [] : matches.map(p => ({ value: p.name })));
    }
  };

  return (
      <>
      <Flex gap='small' wrap style={{ marginBottom: 20 }} justify='space-between'>
        { canRoleDo(user.role, 'CREATE', 'user') ?
          <Flex gap='small' wrap style={{ marginBottom: 20 }}>
          <Button type="primary" size="large" onClick={() => {
            setActionType('Crear')
            setOpen(true)
          }}>
            Crear
          </Button>
          <Button size="large" onClick={() => setOpenBulk(true)}>
              Crear muchos
          </Button>
          </Flex>
        : null }
        <AutoComplete
          allowClear
          onClear={() => setSearch(null)}
          popupMatchSelectWidth={252}
          style={{
            width: 300
          }}
          options={options}
          value={searchInput}
          onChange={(value) => setSearchInput(value)}
          onSelect={onSelect}
          onSearch={handleAutocomplete}
          size="large"
          placeholder='Buscar...'
        />
      </Flex>
      <div id="scrollableDiv" className='scroll'>
      <InfiniteScroll
        dataLength={users.pages.flat().length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        scrollableTarget="scrollableDiv"
      >
        <List
          style={{ marginTop: 20 }}
          locale={{
            emptyText: <Title>Sin usuarios</Title>
          }}
          dataSource={users.pages.flat()}
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
        </InfiniteScroll>
        </div>
          { open ?
          <User open={open} setOpen={setOpen} type={actionType} username={username} />
          : null }
          { openBulk ?
            <BulkCreate open={openBulk} setOpen={setOpenBulk} type={'usuarios'} />
          : null }
      </>
  )
}

export default Users;