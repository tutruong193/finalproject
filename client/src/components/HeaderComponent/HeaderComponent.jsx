import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  BellOutlined,
  LockOutlined,
  MailOutlined,
  EditOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Input,
  Modal,
  Tabs,
  Form,
  message,
  Upload,
  Typography,
} from "antd";
import { useCookies } from "react-cookie";
import { jwtTranslate } from "../../ultilis";
import * as UserService from "../../services/UserService";
import { Popover } from "antd";
import { useNavigate } from "react-router-dom";
import LogoComponent from "../LogoComponent/LogoComponent";
import NotificationComponent from "../NotificationComponent/NotificationComponent";
const { Title } = Typography;

// const HeaderComponent = () => {
//   const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
//   const accessToken = cookiesAccessToken.access_token;
//   const navigate = useNavigate();
//   const [stateUser, setStateUser] = useState({
//     name: "",
//     email: "",
//     avatar: null,
//     password: "",
//     role: [],
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("1");
//   const [form] = Form.useForm();
//   const [passwordForm] = Form.useForm();
//   const [avatarFile, setAvatarFile] = useState(null);

//   useEffect(() => {
//     const fetchDataUser = async () => {
//       try {
//         const res = await UserService.getDetailsUser(
//           jwtTranslate(accessToken)?.id
//         );
//         setStateUser(res?.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchDataUser();
//   }, [accessToken]);

//   const handleProfileClick = () => {
//     setIsModalOpen(true);
//     setActiveTab("1");
//     form.setFieldsValue({
//       name: stateUser.name,
//       email: stateUser.email,
//     });
//   };

//   const handleModalCancel = () => {
//     setIsModalOpen(false);
//     form.resetFields();
//     passwordForm.resetFields();
//     setAvatarFile(null);
//   };

//   const handleUpdateInfo = async (values) => {
//     try {
//       // Prepare form data for avatar and user info
//       const formData = new FormData();
//       formData.append("name", values.name);
//       formData.append("email", values.email);

//       // Add avatar if uploaded
//       if (avatarFile) {
//         formData.append("avatar", avatarFile);
//       }

//       // Uncomment when API is ready
//       // const res = await UserService.updateUserInfo(formData);

//       message.success("Cập nhật thông tin cá nhân thành công!");
//       setStateUser((prev) => ({
//         ...prev,
//         ...values,
//         avatar: avatarFile ? URL.createObjectURL(avatarFile) : prev.avatar,
//       }));
//       setIsModalOpen(false);
//       setAvatarFile(null);
//     } catch (error) {
//       message.error("Cập nhật thông tin thất bại!");
//     }
//   };

//   const handleAvatarChange = (info) => {
//     if (info.file.status === "done") {
//       // Get this url from response in real world
//       setAvatarFile(info.file.originFileObj);
//     } else if (info.file.status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   };

//   const handleLogoutClick = async () => {
//     await UserService.logoutUser();
//     navigate("/login");
//     window.location.reload();
//   };

//   const content = (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         padding: "10px",
//         textAlign: "center",
//       }}
//     >
//       <Avatar
//         src={stateUser.avatar}
//         icon={<UserOutlined />}
//         size={60}
//         style={{ marginBottom: "10px" }}
//       />
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "5px",
//         }}
//       >
//         <Button
//           type="link"
//           onClick={handleProfileClick}
//           style={{ color: "#1890ff" }}
//         >
//           Profile
//         </Button>
//         <Button
//           type="link"
//           onClick={handleLogoutClick}
//           style={{ color: "#1890ff" }}
//         >
//           Logout
//         </Button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="container-header">
//       <div onClick={() => navigate("/system/user/your-work")}>
//         <LogoComponent />
//       </div>
//       <div className="container-header-right">
//         <div className="header-icon">
//           {jwtTranslate(accessToken)?.role !== "admin" && (
//             <BellOutlined style={{ fontSize: "20px" }} />
//           )}
//         </div>
//         <Popover
//           placement="bottomRight"
//           trigger={"hover"}
//           title={`Welcome, ${stateUser?.name}!`}
//           content={content}
//         >
//           <div className="header-icon">
//             <Avatar src={stateUser.avatar} icon={<UserOutlined />} size={30} />
//           </div>
//         </Popover>
//       </div>

//       <Modal
//         title={
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "#1890ff",
//             }}
//           >
//             <EditOutlined style={{ marginRight: 10 }} />
//             My profile
//           </div>
//         }
//         open={isModalOpen}
//         onCancel={handleModalCancel}
//         footer={null}
//         centered
//         width={450}
//       >
//         <Tabs
//           defaultActiveKey="1"
//           activeKey={activeTab}
//           onChange={setActiveTab}
//           centered
//           style={{ marginBottom: 20 }}
//         >
//           <Tabs.TabPane tab="Personal information" key="1">
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 marginBottom: 20,
//               }}
//             >
//               <Upload
//                 name="avatar"
//                 listType="picture-circle"
//                 className="avatar-uploader"
//                 showUploadList={false}
//                 onChange={handleAvatarChange}
//                 beforeUpload={() => false} // Prevent auto upload
//               >
//                 {avatarFile ? (
//                   <img
//                     src={URL.createObjectURL(avatarFile)}
//                     alt="avatar"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       borderRadius: "50%",
//                       objectFit: "cover",
//                     }}
//                   />
//                 ) : (
//                   <div>
//                     <CloudUploadOutlined />
//                     <div style={{ marginTop: 8 }}>Upload</div>
//                   </div>
//                 )}
//               </Upload>
//             </div>
//             <Form
//               form={form}
//               layout="vertical"
//               onFinish={handleUpdateInfo}
//               initialValues={{
//                 name: stateUser.name,
//                 email: stateUser.email,
//               }}
//             >
//               <Form.Item
//                 label="Username"
//                 name="name"
//                 rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
//               >
//                 <Input prefix={<UserOutlined />} placeholder="Tên của bạn" />
//               </Form.Item>
//               <Form.Item
//                 label="Email"
//                 name="email"
//                 rules={[
//                   { required: true, message: "Vui lòng nhập email!" },
//                   { type: "email", message: "Email không hợp lệ!" },
//                 ]}
//               >
//                 <Input prefix={<MailOutlined />} placeholder="Email của bạn" />
//               </Form.Item>
//               <Form.Item
//                 label="Company"
//                 name="company"
//                 rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
//               >
//                 <Input
//                   prefix={<UserOutlined />}
//                   placeholder="Your company name"
//                 />
//               </Form.Item>
//               <Form.Item>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   block
//                   icon={<EditOutlined />}
//                 >
//                   Cập nhật thông tin
//                 </Button>
//               </Form.Item>
//             </Form>
//           </Tabs.TabPane>
//           <Tabs.TabPane tab="Change password" key="2">
//             <Form
//               form={passwordForm}
//               layout="vertical"
//               // onFinish={handleChangePassword}
//             >
//               <Form.Item
//                 label="Old password"
//                 name="oldPassword"
//                 rules={[
//                   { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
//                 ]}
//               >
//                 <Input.Password
//                   prefix={<LockOutlined />}
//                   placeholder="Enter old password"
//                 />
//               </Form.Item>
//               <Form.Item
//                 label="New password"
//                 name="newPassword"
//                 rules={[
//                   { required: true, message: "Vui lòng nhập mật khẩu mới!" },
//                 ]}
//               >
//                 <Input.Password
//                   prefix={<LockOutlined />}
//                   placeholder="Enter new password"
//                 />
//               </Form.Item>
//               <Form.Item>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   block
//                   icon={<LockOutlined />}
//                 >
//                   Change
//                 </Button>
//               </Form.Item>
//             </Form>
//           </Tabs.TabPane>
//         </Tabs>
//       </Modal>
//     </div>
//   );
// };

// export default HeaderComponent;
const HeaderComponent = () => {
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const accessToken = cookiesAccessToken.access_token;
  const navigate = useNavigate();
  const [stateUser, setStateUser] = useState({
    name: "",
    email: "",
    avatar: null,
    password: "",
    role: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const res = await UserService.getDetailsUser(
          jwtTranslate(accessToken)?.id
        );
        setStateUser(res?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataUser();
  }, [accessToken]);

  const handleProfileClick = () => {
    setIsModalOpen(true);
    setActiveTab("1");
    form.setFieldsValue({
      name: stateUser.name,
      email: stateUser.email,
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    passwordForm.resetFields();
    setAvatarFile(null);
  };

  const handleUpdateInfo = async (values) => {
    try {
      // Prepare form data for avatar and user info
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);

      // Add avatar if uploaded
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Uncomment when API is ready
      // const res = await UserService.updateUserInfo(formData);

      message.success("Cập nhật thông tin cá nhân thành công!");
      setStateUser((prev) => ({
        ...prev,
        ...values,
        avatar: avatarFile ? URL.createObjectURL(avatarFile) : prev.avatar,
      }));
      setIsModalOpen(false);
      setAvatarFile(null);
    } catch (error) {
      message.error("Cập nhật thông tin thất bại!");
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      // Get this url from response in real world
      setAvatarFile(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleLogoutClick = async () => {
    await UserService.logoutUser();
    navigate("/login");
    window.location.reload();
  };

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <Avatar
        src={stateUser.avatar}
        icon={<UserOutlined />}
        size={60}
        style={{ marginBottom: "10px" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <Button
          type="link"
          onClick={handleProfileClick}
          style={{ color: "#1890ff" }}
        >
          Profile
        </Button>
        <Button
          type="link"
          onClick={handleLogoutClick}
          style={{ color: "#1890ff" }}
        >
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container-header">
      <div onClick={() => navigate("/system/user/your-work")}>
        <LogoComponent />
      </div>
      <div className="container-header-right">
        <div className="header-icon">
          {jwtTranslate(accessToken)?.role !== "admin" && (
            <NotificationComponent />
          )}
        </div>
        <Popover
          placement="bottomRight"
          trigger={"hover"}
          title={`Welcome, ${stateUser?.name}!`}
          content={content}
        >
          <div className="header-icon">
            <Avatar src={stateUser.avatar} icon={<UserOutlined />} size={30} />
          </div>
        </Popover>
      </div>

      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1890ff",
            }}
          >
            <EditOutlined style={{ marginRight: 10 }} />
            My profile
          </div>
        }
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        centered
        width={450}
      >
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          style={{ marginBottom: 20 }}
        >
          <Tabs.TabPane tab="Personal information" key="1">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                onChange={handleAvatarChange}
                beforeUpload={() => false} // Prevent auto upload
              >
                {avatarFile ? (
                  <img
                    src={URL.createObjectURL(avatarFile)}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div>
                    <CloudUploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateInfo}
              initialValues={{
                name: stateUser.name,
                email: stateUser.email,
              }}
            >
              <Form.Item
                label="Username"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Tên của bạn" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email của bạn" />
              </Form.Item>
              <Form.Item
                label="Company"
                name="company"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Your company name"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  icon={<EditOutlined />}
                >
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Change password" key="2">
            <Form
              form={passwordForm}
              layout="vertical"
              // onFinish={handleChangePassword}
            >
              <Form.Item
                label="Old password"
                name="oldPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter old password"
                />
              </Form.Item>
              <Form.Item
                label="New password"
                name="newPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter new password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  icon={<LockOutlined />}
                >
                  Change
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default HeaderComponent;
