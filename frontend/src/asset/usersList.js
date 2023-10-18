import { SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table,Tag } from 'antd';
import axios from 'axios';
import UserScreen from './userScreen';


const Paneller = ({companyId}) => {

  const axiosInstance = axios.create({
    baseURL:"http://localhost:4000",
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': "7aad182c-0877-4952-927a-baed5451fd84",
      },
})


  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [data,setData] = useState([
   
  ])
  const searchInput = useRef(null);

  const collectUsers = async () =>{
    const body = {
      companyId:companyId
    }

    await axiosInstance.post("/collect-users",{body}).then((result) =>{
      result.data.map((info,key)=>{
        console.log({key:key,name:info.name,id:info.id,isAdmin:info.isadmin,email:info.email,role:[info.role]})
        setData( (previous) => { return ( [{key:key,name:info.name,id:info.id,isAdmin:String(info.isadmin),email:info.email,role:[info.role]}])})
      })
    })

  }
  
  const deleteUser = async (userId) =>{
    const body = {
      userId:userId
    }
    console.log(body)

    await axiosInstance.post("/removeUser",{body}).then((result) =>{
      console.log(result.data)
      collectUsers()
    })

  }



  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: '30%',
      ...getColumnSearchProps('id'),
     
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'IsAdmin',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      ...getColumnSearchProps('isAdmin'),
      
    },
    {
      title:'Email',
      dataIndex:'email',
      index:'email',
      ...getColumnSearchProps('email')
    },
    {
      title:'Role',
      dataIndex:'role',
      filters:[
        {
          text:'Aktif',
          value:'Aktif'
        },
        {
          text:'Pasif',
          value:'Pasif',
        },
        {
          text:'Aktif Değil',
          value:'Aktif Değil'
        }
      ],
      onFilter: (value, record) => {if(record.durum == value) {return record.durum}},
      filterSearch: true,
      render: (tags) => (
        <span>
          {tags.map((tag) => {
            
            return (
              <Tag color={'Black'} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title:'Ayarlar',
      key:'ayarlar',
      dataIndex:'ayarlar',
      render: (text,record) =>(
        <Space size="small">
          <Button onClick={(e) => {console.log(record.id)}}>AktifLeştir</Button>
          <Button onClick={(e) => {deleteUser(record.id)}}>Dekative et</Button>
          <Button onClick={(e) => {console.log(record.id)}}>Pasifleştir</Button>
        </Space>
      )
    }
  ];

  useEffect(() =>{
    collectUsers()
  },[])


  return <Table columns={columns} dataSource={data} rowKey={(record) => record.id}/>;
};
export default Paneller;