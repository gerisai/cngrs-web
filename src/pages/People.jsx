import { List, Button, AutoComplete, Flex, Space, Badge, Skeleton, Cascader } from 'antd';
import { useState, createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { EnvironmentOutlined, HomeOutlined, CheckCircleOutlined, QrcodeOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
// Project imports
import { useUser } from '../lib/context/user';
import usePeople from '../hooks/usePeople';
import Error from './Error';
import Unathorized from './Unathorized';
import Person from '../components/Person';
import EmptyList from '../components/EmptyList';
import BulkCreate from '../components/BulkCreate';
import canRoleDo from '../util/roleValidation';
import { pageSize, personFilters, emptyPeopleFilter, getStaticCategory, staticCategories } from '../util/constants';

const { SHOW_CHILD } = Cascader;

const IconText = ({ icon, text }) => (
  <Space>
    {createElement(icon)}
    {text || 'N/A'}
  </Space>
);

function People() {
  const [filter,setFilter] = useState(emptyPeopleFilter);
  const [filterOptions,setFilterOptions] = useState(personFilters); // Load categories
  const [appliedFilter,setAppliedFilter] = useState([]); // Preserve filter UI across updates
  
  const { user } = useUser();
  const { readPeople, readPeopleNames, getPeopleCategory } = usePeople();
  const navigate = useNavigate();

  // Drawer render state
  const [open, setOpen] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [personId, setPersonId] = useState(null);

  // Search state
  const [search, setSearch] = useState(null); // Search
  const [searchInput,setSearchInput] = useState(''); // Search input
  const [options, setOptions] = useState([]); // Autocomplete

  const { data: queryPeople , isPending, fetchNextPage, hasNextPage, error } = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) => {
      console.log(filter)
      return readPeople({ name: search, ...filter, limit: pageSize, page: pageParam })
    },
    getNextPageParam: (lastPage, allPages) => {
        return lastPage.length >= pageSize ? allPages.length + 1 : undefined
    },
    queryKey: ['people', { search }, { filter }],
    retry: false
  });

  const { data: peopleNames } = useQuery({
    queryFn: () => readPeopleNames(),
    queryKey: ['peopleNames'],
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
    const newFilter = structuredClone(emptyPeopleFilter);
    if (value.length !== 0) {
      if (value[value.length - 1] < 2) return // Parent selection
      for (const f of value) {
        const [name,val] = f;
        newFilter[name] = newFilter[name].concat([val]);
      }
      setFilter(newFilter);
    }
    else {
      setFilter(emptyPeopleFilter);
    }
    setAppliedFilter(value);
  };

  const loadCategory = async (selectedOptions) => {
    let category;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (staticCategories.includes(targetOption.value)) {
      category = getStaticCategory(targetOption.value);
      targetOption.children = category;
    }
    else { 
      category = await getPeopleCategory(targetOption.value);
      targetOption.children = category.map(c => ({ label: c, value: c }));
    }
    setFilterOptions([...filterOptions]);
  }

  const onSelect = (match) => {
    setSearch(match);
    setOptions([]);
  };

  const handleAutocomplete = (value) => {
    if (peopleNames) {
      const matches = peopleNames.filter(({ name }) => name.includes(value.toUpperCase()));
      setOptions(!value ? [] : matches.map(p => ({ value: p.name })));
    }
  };

  return (
      <>
      <Flex gap='small' wrap justify='space-between' >
      { canRoleDo(user.role, 'CREATE', 'person') ?
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
          showCheckedStrategy={SHOW_CHILD}
          style={{
            width: '100%'
          }}
          value={appliedFilter}
          options={filterOptions}
          placeholder="Filtrar..."
          onChange={onChange}
          loadData={loadCategory}
          maxTagCount="responsive"
          defaultValue={[]}
          multiple
        />
      </Flex>
      <div id="scrollableDiv" className='scroll'>
      <InfiniteScroll
        dataLength={queryPeople.pages.flat().length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        scrollableTarget="scrollableDiv"
      >
      <List
        style={{ marginTop: 20 }}
        locale={{
          emptyText: <EmptyList/>
        }}
        dataSource={queryPeople.pages.flat()}
          renderItem={(item, index) => (
            <List.Item
              extra={
                <Button type="link" onClick={() => navigate(`/person/${item.personId}`)} icon={<QrcodeOutlined/>}/>
              }
            >
              <List.Item.Meta
                title={<>
                  <a onClick={() => {
                    setActionType('Editar')
                    setPersonId(item.personId)
                    setOpen(true)
                    }}>{item.name}</a>
                    { item.accessed ?
                    <Badge offset={[5,-3]} count={<CheckCircleOutlined style={{color: '#52c41a' }}/> }/>
                    : null
                    }
                  </>
                }
                description={
                  <Flex gap='middle'>
                    <IconText icon={EnvironmentOutlined} text={item.zone}/>
                    <IconText icon={HomeOutlined} text={item.branch}/>
                  </Flex>
                }
              />
            </List.Item>
          )}
        />
        </InfiniteScroll>
        </div>
        { open ?
        <Person open={open} setOpen={setOpen} type={actionType} personId={personId} />
        : null }
        { openBulk ?
            <BulkCreate open={openBulk} setOpen={setOpenBulk} type={'asistentes'} />
          : null }
        </>
  )
}

export default People;