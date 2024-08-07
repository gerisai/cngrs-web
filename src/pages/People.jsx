import { Table, Typography, Button, AutoComplete, Row, Col } from 'antd';
import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
// Project imports
import { UserContext } from '../hooks/UserContext';
import HomeLayout from './HomeLayout';
import usePeople from '../hooks/usePeople';
import Loading from './Loading';
import Error from './Error';
import Unathorized from './Unathorized';
import Person from '../components/Person';
import canRoleDo from '../util/roleValidation';

const { Text, Title } = Typography;

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function People() {
  const { user } = useContext(UserContext);
  const { readPeople } = usePeople();

  // Drawer render state
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [personId, setPersonId] = useState(null);

  // Search state
  const [options, setOptions] = useState([]);

  // Filter state
  const [people, setPeople] = useState(null);

  const { data: queryPeople , isLoading, error } = useQuery({
    queryFn: () => readPeople(),
    queryKey: ['people'],
    retry: false
  });

  if (isLoading) {
    return <Loading/>;
  }

  if (error) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbbiden')) return <Unathorized/>;
    return <Error message={error.message}/>;
  }

  let data = queryPeople ? queryPeople.map((person,i) => ({
      key: i,
      name: {personId: person.personId, name: person.name}, // must be passed to state eventually in columns
      zone: person.zone,
      branch: person.branch,
      registered: person.registered
  })) : null;
  const personNames = data ? data.map((person) => person.name.name) : null;
  const zones = data ? data.map((person) => person.zone).filter(onlyUnique) : null;
  const branches = data ? data.map((person) => person.branch).filter(onlyUnique) : null;


  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a onClick={() => {
        setActionType('Editar')
        setPersonId(text.personId)
        setOpen(true)
      }}>{text.name}</a>,
    },
    {
      title: 'Zona',
      dataIndex: 'zone',
      key: 'zone',
      filters: zones.map((zone) => ({ text: zone, value: zone })),
      onFilter: (filter, record) => record.zone.includes(filter)
    },
    {
      title: 'Localidad',
      dataIndex: 'branch',
      key: 'branch',
      filters: branches.map((branch) => ({ text: branch, value: branch })),
      onFilter: (filter, record) => record.branch.includes(filter)
    },
    {
      title: 'Registrado',
      dataIndex: 'registered',
      key: 'registered',
      render:  (text) => <Text>{text ? 'Si' : 'No'}</Text>,
      filters: [true, false].map((registered)=> ({ text: registered ? 'Si' : 'No', value: registered})),
      onFilter: (filter, record) => record.registered === filter
    }
  ]

  const onSelect = (match) => {
    setPeople(data.filter((person) => person.name.name === match));
  };

  const handleSearch = (value) => {
    setPeople(null)
    const matches = personNames.filter((name) => name.includes(value.toUpperCase()));
    setPeople(data.filter((person) => person.name.name.includes(value.toUpperCase()))); // filter in real time
    setOptions(!value ? [] : matches.map(m => ({ value: m })));
  };

  return (
      <HomeLayout>
      <Row style={{ marginBottom: 20 }} justify="space-between">
      <Col>
      { canRoleDo(user.role, 'CREATE', 'person') ?
          <Button type="primary" size="large" onClick={() => {
          setActionType('Crear')
          setOpen(true)
          }}>
            Crear
          </Button>
        : null }
      </Col>
      <Col>
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
      </Col>
      </Row>
        <Table 
          locale={{
            emptyText: <Title>Sin registros</Title>
          }}
          pagination={false}
          columns={columns}
          dataSource={ people || data } 
        />
          { open ?
          <Person open={open} setOpen={setOpen} type={actionType} personId={personId} />
          : null }
      </HomeLayout>
  )
}

export default People;