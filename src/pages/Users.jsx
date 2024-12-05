import { useState } from 'react';
import { List, Button, Flex, Skeleton, AutoComplete, Cascader } from 'antd';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
// Project imports
import { useUser } from '../lib/context/user';
import useUsers from '../hooks/useUsers';
import Error from './Error';
import Unathorized from './Unathorized';
import User from '../components/User';
import EmptyList from '../components/EmptyList';
import BulkCreate from '../components/BulkCreate';
import canRoleDo from '../util/roleValidation';
import { LangMappings } from '../util/i8n';
import { pageSize, userFilters, emptyUsersFilter } from '../util/constants';

function Users() {
  const [filter,setFilter] = useState(emptyUsersFilter);
  const [appliedFilter,setAppliedFilter] = useState([]); // Preserve filter UI across updates
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
      return readUsers({ name: search, ...filter, limit: pageSize, page: pageParam })
    },
    getNextPageParam: (lastPage, allPages) => {
        return lastPage.length >= pageSize ? allPages.length + 1 : undefined
    },
    queryKey: ['people', { search }, { filter }],
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

  const onChange = (value) => {
    if (value.length < 2) return // Parent selection
    setFilter({
      [value[0]]: value[1]
    })
    setAppliedFilter(value);
  };

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
      <Flex gap='small' wrap justify='space-between' >
        { canRoleDo(user.role, 'CREATE', 'user') ?
        <Flex gap='small' wrap>
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
        <Cascader
          variant='filled'
          style={{
            width: '100%'
          }}
          value={appliedFilter}
          options={userFilters}
          placeholder="Filtrar..."
          onChange={onChange}
          changeOnSelect
          maxTagCount="responsive"
          defaultValue={[]}
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
            emptyText: <EmptyList/>
          }}
          dataSource={users.pages.flat()}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
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