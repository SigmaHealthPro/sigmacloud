import React, { useState } from 'react';
import {  Input, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Form , Popconfirm, Pagination} from 'antd';



const initialData = [
    {
        key: '1',
        jurisdiction: 'Michigan-JD1',
        organization: 'CVS Pharmacy',
        facilityName: 'Troy',
        address: '123 Main',
        city: 'Troy',
        state: 'MI',
        zipCode: '48098',
        status: 'Danger',
      },
      {
        key: '2',
        jurisdiction: 'Michigan-JD1',
        organization: 'CVS Pharmacy',
        facilityName: 'Rochester Hills',
        address: '124 Main',
        city: 'Rochester Hills',
        state: 'MI',
        zipCode: '48099',
        status: 'Danger',
      },
  ];
  
const DataTable = () => {
    const [data, setData] = useState(initialData);
    const [editingKey, setEditingKey] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm(); 
    const showModal = () => {
        setIsModalVisible(true);
      };
    
      const edit = (record) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
        setIsModalVisible(true);
      };
    
      const handleDelete = (key) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
      };
    
      const handleCancel = () => {
        setEditingKey('');
        setIsModalVisible(false);
      };
      const rowSelection = {
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        // You can also configure `getCheckboxProps` if you need to conditionally disable checkboxes
      };
      
      const handleOk = () => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            addNewRow(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      };
      const handleSave = (key) => {
        form.validateFields()
          .then((row) => {
            const newData = [...data];
            const index = newData.findIndex(item => key === item.key);
    
            if (index > -1) {
              const item = newData[index];
              newData.splice(index, 1, { ...item, ...row });
              setData(newData);
              setEditingKey('');
            } else {
              newData.push(row);
              setData(newData);
            }
            setIsModalVisible(false);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      };

      const addNewRow = (row) => {
        const newRow = { ...row, key: Date.now().toString() }; // Unique key for each new row
        setData([...data, newRow]);
        setIsModalVisible(false);
      };

  const columns = [
    {
      title: 'Jurisdiction',
      dataIndex: 'jurisdiction',
      key: 'jurisdiction',
    },
    {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
    },
    {
      title: 'Facility Name',
      dataIndex: 'facilityName',
      key: 'facilityName',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Zip Code',
      dataIndex: 'zipCode',
      key: 'zipCode',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: status => (
        <Tag color={status === 'Danger' ? 'volcano' : 'green'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button type="link" onClick={() => edit(record)} icon={<EditOutlined />} />
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)} style={{backgroundColor: '#095df4'}}>
              <Button type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
  ];
  return (
    <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <Button
    icon={<PlusOutlined />}
    onClick={showModal}
    style={{ marginBottom: 16, backgroundColor: '#095df4', color: '#fff', borderRadius: '22px' }}
  >
    Add New
  </Button>
  
  <span style={{ lineHeight: '32px', marginLeft: 'auto' }}>All Pages (1-20)</span>
 
</div>
      <Modal title="Add New Site" visible={isModalVisible} onOk={() => handleSave(editingKey)} onCancel={handleCancel}>
    <Form form={form} layout="vertical" name="addNewSiteForm">
      <Form.Item name="jurisdiction" label="Jurisdiction" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="organization" label="Organization" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="facilityName" label="Facility Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="address" label="Address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="city" label="City" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="state" label="State" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="zipCode" label="Zip Code" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </Form>
  </Modal>
  <Table 
  rowSelection={rowSelection}
  columns={columns} 
  dataSource={data} 
  pagination={false}
  
/>

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
              icon={<PlusOutlined />}
              onClick={showModal}
              style={{ marginBottom: 16, backgroundColor: '#095df4', color: '#fff', borderRadius: '22px' }}
            >
              Add New
            </Button>
            
            <span style={{ lineHeight: '32px', marginLeft: 'auto' }}>All Pages (1-20)</span>
          </div>
    </>
  )
}

export default DataTable