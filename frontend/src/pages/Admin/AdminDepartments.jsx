import React, { useState, useEffect, useContext } from "react";
import { Avatar, Button, Drawer, Form, Input, message, Table, Tag } from "antd";
import {
  MedicineBoxOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import Context from "../../util/context";
import API from "../../api/api";

export default function AdminDepartments() {
  const { session } = useContext(Context);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session?.hospitalId) {
      fetchDepartments();
    }
  }, [session]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/department");
      if (data && data.departments) {
        setDepartments(data.departments);
      }
    } catch (error) {
      message.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await API.post("/department", values);
      message.success("Department created successfully");
      setDrawerVisible(false);
      form.resetFields();
      fetchDepartments();
    } catch (error) {
      if (error.response?.status === 400) {
        message.error(error.response.data.message || "Department already exists");
      } else {
        message.error("Failed to create department");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Department Name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={36} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 600 }}>
            {record.name.substring(0, 2).toUpperCase()}
          </Avatar>
          <span className="text-sm font-semibold text-gray-800 block">{record.name}</span>
        </div>
      ),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (v) => v ? <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-md font-semibold font-mono tracking-widest">{v}</span> : "-",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (v) => <span className="text-sm text-gray-500 line-clamp-1 max-w-xs">{v || "-"}</span>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"} className="rounded-full px-2">
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg bg-gray-50 text-blue-500 hover:bg-blue-50 transition flex items-center justify-center">
            <EditOutlined />
          </button>
          <button className="w-8 h-8 rounded-lg bg-gray-50 text-red-500 hover:bg-red-50 transition flex items-center justify-center">
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Departments" subtitle="Manage hospital departments">
      <div className="space-y-6">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 opacity-10 group-hover:opacity-20 transition" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Departments</p>
                <h3 className="text-2xl font-bold text-gray-800">{departments.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-lg">
                <MedicineBoxOutlined />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 opacity-10 group-hover:opacity-20 transition" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Active Now</p>
                <h3 className="text-2xl font-bold text-gray-800">{departments.filter(d => d.isActive).length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-lg">
                <MedicineBoxOutlined />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 relative overflow-hidden flex items-center justify-center">
            <button
              onClick={() => setDrawerVisible(true)}
              className="w-full h-full min-h-[88px] rounded-xl border-2 border-dashed border-red-300 bg-red-50 hover:bg-red-100 text-red-500 font-semibold flex items-center justify-center gap-2 transition"
            >
              <PlusOutlined /> Add New Department
            </button>
          </div>
        </div>

        {/* ── Table Container ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800 text-base">Departments Directory</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Search departments..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="rounded-lg bg-gray-50 border-transparent hover:border-pink-200 focus:border-pink-300 w-64"
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={departments}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="caresync-table"
          />
        </div>

        {/* ── Add Department Drawer ── */}
        <Drawer
          title={<span className="text-gray-800 font-bold">Add New Department</span>}
          placement="right"
          onClose={() => { setDrawerVisible(false); form.resetFields(); }}
          open={drawerVisible}
          width={450}
          destroyOnClose
          styles={{ header: { borderBottom: "1px solid #fce7f3" }, body: { paddingBottom: 80 } }}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              label={<span className="font-medium text-gray-600">Department Name</span>}
              rules={[{ required: true, message: "Please enter department name" }]}
            >
              <Input placeholder="e.g. Cardiology" className="rounded-lg py-2" />
            </Form.Item>

            <Form.Item
              name="code"
              label={<span className="font-medium text-gray-600">Department Code</span>}
            >
              <Input placeholder="e.g. CAR-01" className="rounded-lg py-2" />
            </Form.Item>

            <Form.Item
              name="description"
              label={<span className="font-medium text-gray-600">Description</span>}
            >
              <Input.TextArea placeholder="Enter department details..." rows={4} className="rounded-lg py-2" />
            </Form.Item>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-pink-100 flex justify-end gap-3 z-10">
              <Button onClick={() => setDrawerVisible(false)} className="rounded-lg">Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 border-none shadow-md shadow-pink-200"
              >
                Create Department
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
    </AdminLayout>
  );
}
