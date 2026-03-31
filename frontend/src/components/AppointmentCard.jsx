import React from "react";
import { Button, Input } from "antd";

const AppointmentCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
      <h3 className="text-xl font-semibold mb-6 text-red-500">Quick Appointment</h3>

      <div className="space-y-4">
        <Input size="large" placeholder="Patient Name" />
        <Input size="large" placeholder="Phone Number" />
        <Input size="large" placeholder="Select Department" />

        <Button type="primary" block size="large" className="bg-red-500 border-none rounded-xl hover:!bg-red-600">
          Book Appointment
        </Button>
      </div>
    </div>
  );
};

export default AppointmentCard;