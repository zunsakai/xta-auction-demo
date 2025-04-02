import React, { useState } from 'react'
import { Button, Empty, Form, InputNumber, Layout, Modal, Typography, message } from 'antd'
import { useCreateAuction } from '../../query'

const { Content } = Layout

type FieldType = {
  startingPrice: number
  minIncrement: number
}

interface EmptyAuctionProps {
  msg?: string
}

const EmptyAuction = (props: EmptyAuctionProps) => {
  const [messageApi, contextHolder] = message.useMessage({
    top: 80,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  // Use the create auction mutation
  const createAuctionMutation = useCreateAuction()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      const { startingPrice, minIncrement } = values
      createAuctionMutation.mutate(
        {
          startingPrice: startingPrice * Math.pow(10, -6),
          minIncrement: minIncrement * Math.pow(10, -6),
        },
        {
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

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  return (
    <Content style={{ textAlign: 'center', margin: '0 auto', marginTop: 100 }}>
      {contextHolder}
      <Empty description={<Typography.Text>{props?.msg || 'No auction data available'}</Typography.Text>}>
        <Button type="primary" onClick={showModal}>
          Create Now
        </Button>
      </Empty>
      <Modal
        centered
        title="Create an auction"
        open={isModalOpen}
        onOk={handleOk}
        okText={'Create'}
        onCancel={handleCancel}
        confirmLoading={createAuctionMutation.isPending}
      >
        <Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete="off">
          <Form.Item<FieldType>
            label="Starting price"
            name="startingPrice"
            rules={[{ required: true, message: 'Please input starting price!' }]}
          >
            <InputNumber
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value?.replace(/(,*)/g, '') as unknown as number}
              style={{ width: '100%' }}
              addonAfter="₫"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Min increment"
            name="minIncrement"
            rules={[{ required: true, message: 'Please input min increment!' }]}
          >
            <InputNumber
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value?.replace(/(,*)/g, '') as unknown as number}
              style={{ width: '100%' }}
              addonAfter="₫"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  )
}

export default EmptyAuction
