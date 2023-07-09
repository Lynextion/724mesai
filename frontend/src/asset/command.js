import { Dropdown, Space } from 'antd';

const items = [
  {
    label: <a href="https://www.antgroup.com">1st menu item</a>,
    key: '0',
  },
  {
    label: <a href="https://www.aliyun.com">2nd menu item</a>,
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];
const Command = () => (
  <Dropdown
    menu={{
      items,
    }}
    trigger={['click']}

    className="commandDropdown"
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Click me
       
      </Space>
    </a>
  </Dropdown>

)
export default Command