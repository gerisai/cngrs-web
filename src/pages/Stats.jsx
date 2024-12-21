import { UnorderedListOutlined, CheckCircleOutlined, CloseCircleOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Modal, Button, Card, Col, Row, Statistic, Flex, Skeleton, Badge } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Pie } from '@ant-design/charts';
// Project imports
import usePeople from '../hooks/usePeople';
import { colors } from '../util/constants';

function Stats() {
  const [pieOpen, setPieOpen] = useState(false);
  const { getPeopleStats, getCityStats } = usePeople();

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

  const { data: stats, isPending: statsPending, error: statsError } = useQuery({
    queryFn: () => getCityStats(),
    queryKey: ['city'],
    retry: false
  });

  if (accessLoading || totalPending || statsPending) {
    return (
      <Flex align='center' justify='center'>
        <Skeleton active />
      </Flex>
    );
  }

  if (accessError || totalError || statsError) {
    const message = accessError.message || totalError.message || statsError.message;
    if (message.includes('Unauthorized') || error.message.includes('Forbbiden') || error.message.includes('TokenExpiredError')) return <Unathorized/>;
    return <Error message={message}/>;
  }

  return (
    <>
    <Button type="primary" onClick={() => setPieOpen(true)} style={{ marginBottom: 10 }}>
        Mostrar gráfico
    </Button>
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
        <Card style={{ marginBottom: 10}} bordered={false}>
          <Statistic
            title="Confirmados"
            value={total}
            prefix={<UnorderedListOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
        <Card style={{ marginBottom: 10}} bordered={false}>
          <Statistic
            title="Registrados"
            valueStyle={{ color: '#52c41a' }}
            value={accessed}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
        <Card style={{ marginBottom: 10}} bordered={false}>
          <Statistic
            title="Por registrar"
            valueStyle={{ color: '#cf1322' }}
            value={total - accessed}
            prefix={<CloseCircleOutlined />}
          />
        </Card>
      </Col>
      <Modal title="Registro" open={pieOpen} footer={null} onCancel={() => setPieOpen(false)}>
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
      </Modal>
    </Row>
    <Row gutter={[16, 16]}>
        { stats.map((stat, index) => (
        <Col key={index} xs={24}sm={12} md={12} lg={8} xl={6} xxl={6}>
          <Badge.Ribbon  text={stat.count.male + stat.count.female} color={colors[index]}>
            <Card>
              <Flex gap='middle' align='center'>
                {stat.city}
                <Flex gap={4}>
                  <ManOutlined style={{ color: '#597ef7' }}/> {stat.count.male}
                </Flex>
                <Flex gap={4}>
                  <WomanOutlined style={{ color: '#ff85c0' }} /> {stat.count.female}
                </Flex>
              </Flex>
            </Card>
          </Badge.Ribbon>
        </Col>
        ))}
    </Row>
    </>
  )
}

export default Stats;