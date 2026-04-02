import React, { useContext } from "react";
import { Descriptions } from "antd";
import PatientLayout from "../../components/PatientLayout";
import Context from "../../util/context";

export default function PatientProfile() {
  const { session } = useContext(Context);

  return (
    <PatientLayout>
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Profile</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">Your CureSync account details</h3>
        <p className="mt-2 text-sm text-slate-500">This lightweight page keeps essential patient identity info visible inside the new dashboard shell.</p>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <Descriptions column={1} labelStyle={{ color: "#64748b", fontWeight: 600 }} contentStyle={{ color: "#0f172a" }}>
            <Descriptions.Item label="Name">{session?.name || "-"}</Descriptions.Item>
            <Descriptions.Item label="Email">{session?.email || "-"}</Descriptions.Item>
            <Descriptions.Item label="Mobile">{session?.mobileNumber || "-"}</Descriptions.Item>
            <Descriptions.Item label="Gender">{session?.gender || "-"}</Descriptions.Item>
            <Descriptions.Item label="Date of birth">{session?.dob ? new Date(session.dob).toLocaleDateString() : "-"}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </PatientLayout>
  );
}
