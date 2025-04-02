import React, { useEffect, useState } from 'react'
import type { TableColumnsType } from 'antd'
import { Tag, Button, Card, Col, Form, InputNumber, Layout, message, Row, Spin, Statistic, Table } from 'antd'
import { BidResponse, useBid, useGetCurrentAuction } from '../../query'
import EmptyAuction from './EmptyAuction'
import { LoadingOutlined } from '@ant-design/icons'
import { vndFormat } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const { Content } = Layout
const { Countdown } = Statistic

interface DataType {
  key: React.Key
  bidTime: string
  userEmail: string
  userId: string
  amount: string
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Bid Time',
    dataIndex: 'bidTime',
  },
  {
    title: 'User Email',
    dataIndex: 'userEmail',
    render: (text, record) => {
      const token = localStorage.getItem('accessToken')
      const userId = token ? (jwtDecode(token) as any).sub : null

      return (
        <span>
          {text} {record.userId === userId && <Tag color="green">you</Tag>}
        </span>
      )
    },
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
  },
]

const Auction: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage({
    top: 80,
  })
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { mutate: placeBidMutation, isPending } = useBid()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [refetchInterval, setRefetchInterval] = useState(1000)
  const {
    data: currentAuction,
    isLoading,
    error,
    historyIsLoading,
    historyData,
  } = useGetCurrentAuction(refetchInterval)

  useEffect(() => {
    setRefetchInterval((error as any)?.statusCode === 404 ? 0 : 10000)
  }, [error])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
    } else {
      try {
        const decoded = jwtDecode(token) as any
        setCurrentUserId(decoded.sub)
      } catch (error) {
        console.error('Invalid token', error)
        localStorage.removeItem('accessToken')
        navigate('/login')
      }
    }
  }, [])

  if (isLoading) {
    return (
      <Content style={{ textAlign: 'center', margin: '0 auto', marginTop: 100 }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Content>
    )
  }

  if (error?.message || !currentAuction) {
    return <EmptyAuction msg={error?.message} />
  }

  const onFinishAuction = async () => {
    messageApi.open({
      type: 'info',
      content: 'Auction has ended',
    })
    await new Promise(resolve => setTimeout(resolve, 5000))
    window.location.reload()
  }

  const placeBid = () => {
    form.validateFields().then(values => {
      const { newAmount } = values
      placeBidMutation(
        { auctionId: currentAuction?.id, amount: newAmount * Math.pow(10, -6) },
        {
          onSuccess: (data: BidResponse) => {
            messageApi.open({
              type: 'success',
              content: `Bid placed successfully! Current price: ${vndFormat(data.currentPrice * Math.pow(10, 6))}`,
            })
            form.resetFields()
          },
          onError: (error: any) => {
            Array.isArray(error.message)
              ? error.message?.forEach((msg: string) =>
                  messageApi.open({
                    type: 'error',
                    content: msg,
                  })
                )
              : messageApi.open({
                  type: 'error',
                  content: error.message,
                })
          },
        }
      )
    })
  }

  // Check if current user is the highest bidder
  const isHighestBidder = historyData?.bids?.at(0)?.userId === currentUserId

  return (
    <Card>
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Countdown
            title="Time remaining"
            value={new Date(currentAuction.endTime).getTime()}
            format="mm:ss"
            onFinish={onFinishAuction}
          />
        </Col>
      </Row>
      <Row gutter={[16, 24]}>
        <Col xs={24} sm={8} md={8} lg={4}>
          <Statistic title="Starting price" value={vndFormat(currentAuction.startingPrice * Math.pow(10, 6))} />
        </Col>
        <Col xs={24} sm={8} md={8} lg={4}>
          <Statistic title="Bid increment" value={vndFormat(currentAuction.minIncrement * Math.pow(10, 6))} />
        </Col>
        <Col xs={24} sm={8} md={8} lg={4}>
          <Statistic
            title="Current price"
            value={vndFormat(currentAuction.currentPrice * Math.pow(10, 6))}
            suffix={isHighestBidder && <Tag color="green">you</Tag>}
          />
          <Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete="off">
            <Form.Item<{ newAmount: number }> name="newAmount">
              <InputNumber
                style={{ marginTop: 32 }}
                name={'newAmount'}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value?.replace(/(,*)/g, '') as unknown as number}
                addonAfter="₫"
              />
            </Form.Item>
            <Button style={{ marginTop: 16 }} type="primary" onClick={placeBid} loading={isPending}>
              Place a new bid
            </Button>
          </Form>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12}>
          <Statistic title="Auction history" value={' '} />
          <Table<DataType>
            columns={columns}
            dataSource={
              historyData?.bids?.map(bid => ({
                ...bid,
                key: bid.id,
                amount: vndFormat(bid.amount * Math.pow(10, 6)),
              })) as DataType[]
            }
            size="small"
            loading={historyIsLoading}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default Auction
