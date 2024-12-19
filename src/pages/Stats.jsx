import { UnorderedListOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Flex, Skeleton } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Pie } from '@ant-design/charts';
// Project imports
import usePeople from '../hooks/usePeople';

function Stats() {
  const { getPeopleStats } = usePeople();

  const { data: accessed , isPending: accessLoading , error: accessError } = useQuery({
    queryFn: () => getPeopleStats({ accessed: 1 }),
    queryKey: ['person', 'accessed'],
    retry: false
  });

  const { data: total , isPending: totalPending, error: totalError } = useQuery({
    queryFn: () => getPeopleStats(),
    queryKey: ['person', 'total'],
    retry: false
  });

  if (accessLoading || totalPending) {
    return (
      <Flex align='center' justify='center'>
        <Skeleton active />
      </Flex>
    );
  }

  if (accessError || totalError) {
    const message = accessError.message || totalError.message;
    if (message.includes('Unauthorized') || error.message.includes('Forbbiden') || error.message.includes('TokenExpiredError')) return <Unathorized/>;
    return <Error message={message}/>;
  }

  return (
    <>
    <Row gutter={[16,16]}>
      <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
        <Card bordered={false}>
          <Statistic
            title="Confirmados"
            value={total}
            prefix={<UnorderedListOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
        <Card bordered={false}>
          <Statistic
            title="Registrados"
            valueStyle={{ color: '#52c41a' }}
            value={accessed}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
        <Card bordered={false}>
          <Statistic
            title="Por registrar"
            valueStyle={{ color: '#cf1322' }}
            value={total - accessed}
            prefix={<CloseCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
    <Row>
      <Col xs={0} sm={24} md={24} lg={24} xl={24} xxl={24}>
        <Pie
          angleField='value'
          colorField= 'type'
          style={{
            padding: 0,
            margin: 0
          }}
          scale={{
            color: {
              range: ['#00BFDD', '#EDEDED']
            }
          }}
          innerRadius={0.6}
          data={[
            { type: 'Registrados', value: accessed},
            { type: 'Total', value: total}
          ]}
          label={false}
          legend={false}
          tooltip={false}
          annotations={[
            {
              type: 'text',
              tooltip: false,
              style: {
                text: `${Math.trunc((accessed / total) * 100)}%`,
                x: '50%',
                y: '50%',
                textAlign: 'center',
                fontSize: 40,
                fontStyle: 'bold',
              },
            },
          ]}
        />
      </Col>
    </Row>
    </>
  )
}

export default Stats;