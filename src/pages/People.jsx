import { List, Typography, Button, AutoComplete, Flex, Space } from 'antd';
import { useState, createElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';
// Project imports
import { useUser } from '../lib/context/user';
import usePeople from '../hooks/usePeople';
import Loading from './Loading';
import Error from './Error';
import Unathorized from './Unathorized';
import Person from '../components/Person';
import canRoleDo from '../util/roleValidation';

const { Title } = Typography;

const IconText = ({ icon, text }) => (
  <Space>
    {createElement(icon)}
    {text}
  </Space>
);

function People() {
  const { user } = useUser();
  const { readPeople } = usePeople();

  // Drawer render state
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [personId, setPersonId] = useState(null);

  // Search state
  const [options, setOptions] = useState([]);

  // Filter state
  const [people, setPeople] = useState(null);

  const { data: queryPeople , isPending, error } = useQuery({
    queryFn: () => readPeople(),
    queryKey: ['people'],
    retry: false
  });

  if (isPending) {
    return <Loading/>;
  }

  if (error) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbbiden')) return <Unathorized/>;
    return <Error message={error.message}/>;
  }

  let data = queryPeople ? queryPeople.map((person,i) => ({
      key: i,
      personId: person.personId,
      name: person.name,
      zone: person.zone,
      branch: person.branch,
      registered: person.registered
  })) : null;
  const personNames = data ? data.map((person) => person.name) : null;

  const onSelect = (match) => {
    setPeople(data.filter((person) => person.name.name === match));
  };

  const handleSearch = (value) => {
    setPeople(null)
    const matches = personNames.filter((name) => name.includes(value.toUpperCase()));
    setPeople(data.filter((person) => person.name.includes(value.toUpperCase()))); // filter in real time
    setOptions(!value ? [] : matches.map(m => ({ value: m })));
  };

  return (
      <>
      <Flex gap='small' wrap style={{ marginBottom: 20 }} justify='space-between' >
      { canRoleDo(user.role, 'CREATE', 'person') ?
          <Button type="primary" size="large" onClick={() => {
          setActionType('Crear')
          setOpen(true)
          }}>
            Crear
          </Button>
        : null }
      <AutoComplete
        popupMatchSelectWidth={252}
        style={{
          width: 300
        }}
        options={options}
        onSelect={onSelect}
        onSearch={handleSearch}
        size="large"
        placeholder='Buscar...'
      />
      </Flex>
      <List
        style={{ marginTop: 20 }}
        locale={{
          emptyText: <Title>Sin asistentes</Title>
        }}
        dataSource={people || data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={<a onClick={() => {
                    setActionType('Editar')
                    setPersonId(item.personId)
                    setOpen(true)
                    }}>{item.name}</a>}
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
        { open ?
        <Person open={open} setOpen={setOpen} type={actionType} personId={personId} />
        : null } 
        </>
  )
}

export default People;