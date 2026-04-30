import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Drawer, Form, Input, Select, InputNumber, message, Table, Tag } from "antd";
import {
  SafetyOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/AdminLayout";
import Context from "../../util/context";
import API from "../../api/api";

export default function AdminDoctors() {
  const { session } = useContext(Context);
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Availability State
  const [availDrawerVisible, setAvailDrawerVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [availLoading, setAvailLoading] = useState(false);
  const [availForm] = Form.useForm();

  useEffect(() => {
    if (session?.hospitalId) {
      fetchDoctors();
      fetchDepartments();
    }
  }, [session]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      // Backend expects /doctor/:hospitalId
      const { data } = await API.get(`/doctor/${session.hospitalId}`);
      if (data && data.doctors) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      message.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await API.get("/department");
      if (data && data.departments) {
        setDepartments(data.departments);
      }
    } catch (error) {
      message.error("Failed to load departments");
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await API.post("/doctor", values);
      message.success("Doctor created successfully");
      setDrawerVisible(false);
      form.resetFields();
      fetchDoctors();
    } catch (error) {
      if (error.response?.status === 400) {
        message.error(error.response.data.message || "Doctor with this email already exists");
      } else {
        message.error("Failed to create doctor");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAvailabilities = async (doctorId) => {
    setAvailLoading(true);
    try {
      const { data } = await API.get(`/doctor-availability/${doctorId}/${session.hospitalId}`);
      if (data && data.availabilities) {
        setAvailabilities(data.availabilities);
      }
    } catch (error) {
      message.error("Failed to load availabilities");
    } finally {
      setAvailLoading(false);
    }
  };

  const handleManageAvail = (doctor) => {
    setSelectedDoctor(doctor);
    setAvailDrawerVisible(true);
    fetchAvailabilities(doctor._id);
  };

  const onAvailFinish = async (values) => {
    try {
      const payload = {
        ...values,
        doctorId: selectedDoctor._id,
        hospitalId: session.hospitalId,
        departmentId: selectedDoctor.departmentId?._id || selectedDoctor.departmentId,
      };
      await API.post("/doctor-availability/create", payload);
      message.success("Availability added successfully");
      availForm.resetFields();
      fetchAvailabilities(selectedDoctor._id);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to add availability");
    }
  };

  const deleteAvail = async (id) => {
    try {
      await API.delete(`/doctor-availability/${id}`);
      message.success("Availability deleted");
      fetchAvailabilities(selectedDoctor._id);
    } catch (error) {
      message.error("Failed to delete availability");
    }
  };

  const columns = [
    {
      title: "Doctor",
      key: "doctor",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={36} style={{ background: "linear-gradient(135deg,#ef4444,#ec4899)", fontWeight: 600 }}>
            {record.name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()}
          </Avatar>
          <div>
            <span
              onClick={() => navigate(`/admin/doctors/${record._id}/appointments`)}
              className="text-sm font-semibold text-gray-800 block cursor-pointer hover:text-pink-600 transition"
            >
              {record.name}
            </span>
            <span className="text-xs text-gray-400">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
      render: (v) => <span className="text-sm text-gray-600 font-medium">{v}</span>,
    },
    {
      title: "Department",
      key: "department",
      render: (_, record) => (
        <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-md font-semibold flex items-center gap-1 w-fit">
          <MedicineBoxOutlined /> {record.departmentId?.name || "N/A"}
        </span>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      render: (v) => <span className="text-sm text-gray-500">{v} Years</span>,
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      render: (v) => <span className="text-sm text-gray-600">{v}</span>,
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
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/doctors/${record._id}/appointments`)}
            className="w-8 h-8 rounded-lg bg-gray-50 text-pink-500 hover:bg-pink-50 transition flex items-center justify-center"
            title="View Appointments"
          >
            <CalendarOutlined />
          </button>
          <button
            onClick={() => handleManageAvail(record)}
            className="w-8 h-8 rounded-lg bg-gray-50 text-emerald-500 hover:bg-emerald-50 transition flex items-center justify-center"
            title="Manage Availability"
          >
            <ClockCircleOutlined />
          </button>
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
    <AdminLayout title="Doctors Directory" subtitle="Manage hospital doctors">
      <div className="space-y-6">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 opacity-10 group-hover:opacity-20 transition" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Doctors</p>
                <h3 className="text-2xl font-bold text-gray-800">{doctors.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-lg">
                <SafetyOutlined />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 opacity-10 group-hover:opacity-20 transition" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Active Today</p>
                <h3 className="text-2xl font-bold text-gray-800">{doctors.filter(d => d.isActive).length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-lg">
                <SafetyOutlined />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 relative overflow-hidden flex items-center justify-center">
            <button
              onClick={() => setDrawerVisible(true)}
              className="w-full h-full min-h-[88px] rounded-xl border-2 border-dashed border-red-300 bg-red-50 hover:bg-red-100 text-red-500 font-semibold flex items-center justify-center gap-2 transition"
            >
              <PlusOutlined /> Add New Doctor
            </button>
          </div>
        </div>

        {/* ── Table Container ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800 text-base">Doctor Roster</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Search doctors..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="rounded-lg bg-gray-50 border-transparent hover:border-pink-200 focus:border-pink-300 w-64"
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={doctors}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="caresync-table"
          />
        </div>

        {/* ── Add Doctor Drawer ── */}
        <Drawer
          title={<span className="text-gray-800 font-bold">Add New Doctor</span>}
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
              label={<span className="font-medium text-gray-600">Full Name</span>}
              rules={[{ required: true, message: "Please enter doctor's name" }]}
            >
              <Input placeholder="Dr. John Doe" className="rounded-lg py-2" />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="font-medium text-gray-600">Email Address</span>}
              rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
            >
              <Input placeholder="doctor@hospital.com" className="rounded-lg py-2" />
            </Form.Item>

            <Form.Item
              name="mobileNumber"
              label={<span className="font-medium text-gray-600">Mobile Number</span>}
              rules={[{ required: true, message: "Please enter mobile number" }]}
            >
              <Input placeholder="+91 9876543210" className="rounded-lg py-2" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="specialization"
                label={<span className="font-medium text-gray-600">Specialization</span>}
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="e.g. Cardiologist" className="rounded-lg py-2" />
              </Form.Item>

              <Form.Item
                name="experience"
                label={<span className="font-medium text-gray-600">Experience (Yrs)</span>}
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber placeholder="5" className="w-full rounded-lg py-1" min={0} />
              </Form.Item>
            </div>

            <Form.Item
              name="departmentId"
              label={<span className="font-medium text-gray-600">Department</span>}
              rules={[{ required: true, message: "Please select a department" }]}
            >
              <Select
                placeholder="Select Department"
                className="rounded-lg"
                size="large"
                options={departments.map((d) => ({ label: d.name, value: d._id }))}
              />
            </Form.Item>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-pink-100 flex justify-end gap-3 z-10">
              <Button onClick={() => setDrawerVisible(false)} className="rounded-lg">Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 border-none shadow-md shadow-pink-200"
              >
                Create Doctor
              </Button>
            </div>
          </Form>
        </Drawer>

        {/* ── Manage Availability Drawer ── */}
        <Drawer
          title={<span className="text-gray-800 font-bold">Manage Availability - {selectedDoctor?.name}</span>}
          placement="right"
          onClose={() => { setAvailDrawerVisible(false); setSelectedDoctor(null); }}
          open={availDrawerVisible}
          width={500}
          destroyOnClose
          styles={{ header: { borderBottom: "1px solid #fce7f3" } }}
        >
          <div className="space-y-6">
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
              <h4 className="text-sm font-bold text-pink-700 mb-3 flex items-center gap-2">
                <PlusOutlined /> Add Availability
              </h4>
              <Form form={availForm} layout="vertical" onFinish={onAvailFinish} size="small">
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item name="dayOfWeek" label="Day" rules={[{ required: true }]}>
                    <Select placeholder="Select Day">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                        <Select.Option key={day} value={day}>{day}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="slotDuration" label="Duration (Min)" rules={[{ required: true }]}>
                    <Select placeholder="Min">
                      {[15, 20, 30, 45, 60].map(m => (
                        <Select.Option key={m} value={m}>{m} mins</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item name="startTime" label="Start (e.g. 10:00)" rules={[{ required: true }]}>
                    <Input placeholder="10:00" />
                  </Form.Item>
                  <Form.Item name="endTime" label="End (e.g. 13:00)" rules={[{ required: true }]}>
                    <Input placeholder="13:00" />
                  </Form.Item>

                </div>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  className="bg-pink-600 border-none rounded-lg mt-2 h-9 font-semibold"
                >
                  Add Slot Range
                </Button>
              </Form>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <CalendarOutlined /> Existing Availabilities
              </h4>
              <div className="space-y-3">
                {availLoading ? (
                  <div className="text-center py-4 text-gray-400">Loading...</div>
                ) : availabilities.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <CalendarOutlined style={{ fontSize: 24, marginBottom: 8, display: "block" }} />
                    No availability set
                  </div>
                ) : (
                  availabilities.map(a => (
                    <div key={a._id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-pink-200 transition group shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                          {a.dayOfWeek.substring(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-sm">{a.dayOfWeek}</div>
                          <div className="text-xs text-gray-500">
                            {a.startTime} - {a.endTime} • {a.slotDuration} min slots
                          </div>
                        </div>
                      </div>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => deleteAvail(a._id)}
                        className="opacity-0 group-hover:opacity-100 transition"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Drawer>

      </div>
    </AdminLayout>
  );
}
