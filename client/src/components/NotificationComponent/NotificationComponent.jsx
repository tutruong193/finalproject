import React, { useState } from 'react';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Badge, Dropdown, List, Avatar, Typography, Button, Tooltip } from 'antd';

const { Text } = Typography;

// Fake notification data
const mockNotifications = [
  {
    id: 1,
    type: 'like',
    user: {
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
    },
    content: 'liked your post',
    time: '2 mins ago',
    read: false
  },
  {
    id: 2,
    type: 'comment',
    user: {
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
    },
    content: 'commented on your photo',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    type: 'tag',
    user: {
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
    },
    content: 'tagged you in a post',
    time: '3 hours ago',
    read: true
  }
];

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  const NotificationContent = (
    <div style={{ width: 350, maxHeight: 500, overflowY: 'auto' , backgroundColor: "white"}}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '10px 15px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Text strong>Notifications</Text>
        <div>
          <Tooltip title="Mark all as read">
            <Button 
              type="text" 
              icon={<CheckOutlined />} 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </Button>
          </Tooltip>
        </div>
      </div>
      
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{ 
              backgroundColor: item.read ? 'white' : '#f0f8ff',
              padding: '10px 15px',
              cursor: 'pointer'
            }}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.user.avatar} />}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>{item.user.name}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                </div>
              }
              description={item.content}
            />
          </List.Item>
        )}
      />

      {notifications.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#999' 
        }}>
          No notifications
        </div>
      )}
    </div>
  );

  return (
    <Dropdown 
      overlay={NotificationContent} 
      trigger={['click']}
      placement="bottomRight"
      overlayStyle={{ width: 400 }}
    >
      <Badge count={unreadCount} size="small">
        <BellOutlined style={{ fontSize: "20px", cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationComponent;