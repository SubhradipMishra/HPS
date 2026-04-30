import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert, Button, Empty, Input, Select, Skeleton, Tag, message, Modal, Upload, Rate } from "antd";
import { CalendarCheck2, Clock3, Compass, Hospital, LocateFixed, MapPinned, Search, Stethoscope, XCircle, UploadCloud, FileText, CheckCircle2, Star } from "lucide-react";
import PatientLayout from "../../components/PatientLayout";
import Context from "../../util/context";
import API from "../../api/api";

const radiusOptions = [
  { label: "3 km", value: 3 },
  { label: "5 km", value: 5 },
  { label: "10 km", value: 10 },
  { label: "20 km", value: 20 },
];

function formatDate(dateString, options = {}) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(dateString));
}

function todayIso() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

async function geocodeLocation(query) {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Location lookup failed");
  }

  const results = await response.json();

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("No location found");
  }

  const [result] = results;

  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    label: result.display_name,
  };
}

export default function PatientAppointments() {
  const { session } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(5);
  const [form, setForm] = useState({
    hospitalId: "",
    departmentId: "",
    doctorId: "",
    date: "",
    slotTime: "",
  });
  const [messageApi, contextHolder] = message.useMessage();

  // Upload Report State
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [reportCategory, setReportCategory] = useState("Lab Report");

  // Review State
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [patientReports, setPatientReports] = useState([]);
  const [useVault, setUseVault] = useState(false);
  const [selectedVaultReport, setSelectedVaultReport] = useState(null);


  const fetchAppointments = useCallback(async () => {
    if (!session?.id) return;

    const { data } = await API.get(`/appointment/patient/${session.id}`);
    setAppointments(data.appointments || []);
  }, [session?.id]);

  useEffect(() => {
    if (!session?.id) return;

    const load = async () => {
      try {
        setLoading(true);
        await fetchAppointments();
      } catch {
        messageApi.error("Unable to load appointment workspace right now.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchAppointments, messageApi, session?.id]);

  useEffect(() => {
    const fetchPatientReports = async () => {
      if (!session?.id) return;
      try {
        const { data } = await API.get(`/patient/${session.id}`);
        setPatientReports(data.patient.reports || []);
      } catch {
        // silent
      }
    };
    fetchPatientReports();
  }, [session?.id]);

  useEffect(() => {
    if (!form.hospitalId) {
      setDepartments([]);
      return;
    }


    const loadDepartments = async () => {
      try {
        const { data } = await API.get(`/department?hospitalId=${form.hospitalId}`);
        setDepartments(data.departments || []);
      } catch {
        setDepartments([]);
        messageApi.error("Unable to load departments for this hospital.");
      }
    };

    loadDepartments();
  }, [form.hospitalId, messageApi]);

  useEffect(() => {
    if (!form.hospitalId || !form.departmentId) {
      setDoctors([]);
      return;
    }

    const loadDoctors = async () => {
      try {
        const { data } = await API.get(`/doctor/${form.hospitalId}/${form.departmentId}`);
        setDoctors(data.doctors || []);
      } catch {
        setDoctors([]);
        messageApi.error("Unable to load doctors for this department.");
      }
    };

    loadDoctors();
  }, [form.departmentId, form.hospitalId, messageApi]);

  useEffect(() => {
    if (!form.hospitalId || !form.doctorId || !form.date) {
      setSlots([]);
      return;
    }

    const loadSlots = async () => {
      try {
        setSlotLoading(true);
        const { data } = await API.get(
          `/appointment/available-slots?doctorId=${form.doctorId}&hospitalId=${form.hospitalId}&date=${form.date}`
        );
        setSlots(data.availableSlots || []);
      } catch {
        setSlots([]);
        messageApi.error("No slots are available for the selected date.");
      } finally {
        setSlotLoading(false);
      }
    };

    loadSlots();
  }, [form.date, form.doctorId, form.hospitalId, messageApi]);

  const selectedHospital = useMemo(
    () => hospitals.find((hospital) => hospital._id === form.hospitalId),
    [form.hospitalId, hospitals]
  );

  const upcomingAppointment = useMemo(
    () => appointments.find((appointment) => appointment.status === "booked") || appointments[0],
    [appointments]
  );

  const bookedCount = appointments.filter((appointment) => appointment.status === "booked").length;

  const updateForm = (field, value) => {
    setForm((current) => {
      if (field === "hospitalId") {
        return {
          ...current,
          hospitalId: value,
          departmentId: "",
          doctorId: "",
          date: "",
          slotTime: "",
        };
      }

      if (field === "departmentId") {
        return {
          ...current,
          departmentId: value,
          doctorId: "",
          date: "",
          slotTime: "",
        };
      }

      if (field === "doctorId") {
        return {
          ...current,
          doctorId: value,
          slotTime: "",
        };
      }

      if (field === "date") {
        return {
          ...current,
          date: value,
          slotTime: "",
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });

    if (field === "hospitalId") {
      setDepartments([]);
      setDoctors([]);
      setSlots([]);
    }

    if (field === "departmentId") {
      setDoctors([]);
      setSlots([]);
    }

    if (field === "doctorId" || field === "date") {
      setSlots([]);
    }
  };

  const resetBookingChain = () => {
    setForm({
      hospitalId: "",
      departmentId: "",
      doctorId: "",
      date: "",
      slotTime: "",
    });
    setDepartments([]);
    setDoctors([]);
    setSlots([]);
  };

  const findNearbyHospitals = async ({ latitude, longitude, label }) => {
    try {
      setHospitalLoading(true);
      resetBookingChain();

      const { data } = await API.get(`/hospital/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
      setSelectedLocation({
        latitude,
        longitude,
        label,
      });
      setHospitals(data.data || []);

      if (!data.data?.length) {
        messageApi.warning("No nearby hospitals found for this radius.");
      } else {
        messageApi.success("Nearby hospitals loaded.");
      }
    } catch (error) {
      setHospitals([]);
      setSelectedLocation({
        latitude,
        longitude,
        label,
      });
      messageApi.error(error?.response?.data?.message || "Unable to fetch nearby hospitals.");
    } finally {
      setHospitalLoading(false);
    }
  };

  const handleSearchLocation = async () => {
    if (!locationQuery.trim()) {
      messageApi.warning("Enter an area, city, or address first.");
      return;
    }

    try {
      setHospitalLoading(true);
      const result = await geocodeLocation(locationQuery.trim());
      await findNearbyHospitals(result);
    } catch (error) {
      messageApi.error(error.message || "Unable to convert that location into coordinates.");
    } finally {
      setHospitalLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      messageApi.error("Geolocation is not available in this browser.");
      return;
    }

    try {
      setLocating(true);

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      await findNearbyHospitals({
        latitude,
        longitude,
        label: "Current device location",
      });
    } catch {
      messageApi.error("Unable to access your current location.");
    } finally {
      setLocating(false);
    }
  };

  const handleBook = async () => {
    if (!session?.id) return;

    try {
      setBooking(true);
      await API.post("/appointment/book", {
        patientId: session.id,
        hospitalId: form.hospitalId,
        departmentId: form.departmentId,
        doctorId: form.doctorId,
        date: form.date,
        slotTime: form.slotTime,
      });
      messageApi.success("Appointment booked successfully.");
      await fetchAppointments();
      setForm((current) => ({ ...current, slotTime: "" }));
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await API.patch(`/appointment/${appointmentId}/cancel`);
      messageApi.success("Appointment cancelled.");
      await fetchAppointments();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Unable to cancel this appointment.");
    }
  };

  const handleUploadReport = async () => {
    if (!selectedAppointmentId) return;
    
    if (useVault && !selectedVaultReport) {
      return messageApi.error("Please select a report from your vault.");
    }
    
    if (!useVault && fileList.length === 0) {
      return messageApi.error("Please select a file to upload.");
    }

    try {
      setUploading(true);
      
      if (useVault) {
        await API.patch(`/appointment/${selectedAppointmentId}/link-report-vault`, {
          reportFileName: selectedVaultReport.fileName,
          category: selectedVaultReport.category
        });
      } else {
        const formData = new FormData();
        formData.append("report", fileList[0]);
        formData.append("category", reportCategory);

        await API.patch(`/appointment/${selectedAppointmentId}/patient-report`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      messageApi.success("Report attached successfully.");
      setUploadModalVisible(false);
      setFileList([]);
      setSelectedVaultReport(null);
      await fetchAppointments();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Failed to attach report.");
    } finally {
      setUploading(false);
    }
  };


  const handleSubmitReview = async () => {
    if (!selectedAppointmentId) return;
    try {
      setReviewLoading(true);
      await API.patch(`/appointment/${selectedAppointmentId}/review`, {
        review: reviewText,
        rating: rating,
      });
      messageApi.success("Thank you for your feedback!");
      setReviewModalVisible(false);
      setReviewText("");
      setRating(5);
      await fetchAppointments();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <PatientLayout>
      {contextHolder}

      <Modal
        title={<div className="flex items-center gap-2 text-slate-800"><Star size={20} className="text-amber-500 fill-amber-500" /> Rate your Experience</div>}
        open={reviewModalVisible}
        onCancel={() => { setReviewModalVisible(false); setReviewText(""); setRating(5); }}
        footer={[
          <Button key="cancel" onClick={() => { setReviewModalVisible(false); setReviewText(""); setRating(5); }}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={reviewLoading}
            onClick={handleSubmitReview}
            className="bg-slate-900 border-none h-10 px-6 rounded-xl"
          >
            Submit Feedback
          </Button>
        ]}
      >
        <div className="py-6 space-y-6">
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-4">How was your consultation with the doctor?</p>
            <Rate value={rating} onChange={(v) => setRating(v)} className="text-3xl" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Share your thoughts</label>
            <Input.TextArea
              rows={4}
              placeholder="Tell us about your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="rounded-2xl border-slate-200 focus:border-sky-400 focus:ring-sky-100"
            />
          </div>
        </div>
      </Modal>

      <Modal
        title={<div className="flex items-center gap-2 text-slate-800"><UploadCloud size={20} className="text-sky-600" /> Upload Medical Report</div>}
        open={uploadModalVisible}
        onCancel={() => { setUploadModalVisible(false); setFileList([]); setReportCategory("Lab Report"); }}
        footer={[
          <Button key="cancel" onClick={() => { setUploadModalVisible(false); setFileList([]); setReportCategory("Lab Report"); }}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={uploading}
            disabled={!useVault && fileList.length === 0 || useVault && !selectedVaultReport}
            onClick={handleUploadReport}
            className="bg-slate-900 border-none h-10 px-6 rounded-xl"
          >
            {useVault ? "Link from Vault" : "Upload Now"}
          </Button>

        ]}
      >
        <div className="py-4 space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-2xl">
             <button 
               onClick={() => setUseVault(false)}
               className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition ${!useVault ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
             >
               Upload New
             </button>
             <button 
               onClick={() => setUseVault(true)}
               className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition ${useVault ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
             >
               Pick from Vault
             </button>
          </div>

          {!useVault ? (
            <div className="space-y-6">
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload a document directly to this appointment. This file will also be saved to your vault.
              </p>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Category</label>
                <Select 
                  value={reportCategory}
                  onChange={(v) => setReportCategory(v)}
                  className="w-full h-11"
                  options={[
                    { label: "Lab Report", value: "Lab Report" },
                    { label: "Prescription", value: "Prescription" },
                    { label: "MRI / X-Ray", value: "MRI/X-Ray" },
                    { label: "Other", value: "Other" },
                  ]}
                />
              </div>
              <Upload
                onRemove={() => setFileList([])}
                beforeUpload={(file) => {
                  setFileList([file]);
                  return false;
                }}
                fileList={fileList}
                maxCount={1}
              >
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50 hover:bg-slate-100 hover:border-sky-300 transition-all cursor-pointer w-full group">
                   <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition">
                      <FileText size={24} className="text-slate-400 group-hover:text-sky-500" />
                   </div>
                   <p className="text-sm font-bold text-slate-700">Click to Select Document</p>
                   <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                </div>
              </Upload>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Select a previously uploaded document from your personal medical vault.
              </p>
              {patientReports.length === 0 ? (
                <Empty description="Your vault is empty" className="py-8" />
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
                  {patientReports.map((report) => (
                    <div 
                      key={report._id}
                      onClick={() => setSelectedVaultReport(report)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${selectedVaultReport?._id === report._id ? "border-sky-500 bg-sky-50" : "border-slate-100 hover:border-slate-200"}`}
                    >
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedVaultReport?._id === report._id ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                            <FileText size={16} />
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-slate-800 leading-tight">{report.category}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Uploaded {new Date(report.uploadDate).toLocaleDateString()}</p>
                         </div>
                      </div>
                      {selectedVaultReport?._id === report._id && <CheckCircle2 size={16} className="text-sky-500" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </Modal>

      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-sky-50 rounded-full blur-3xl group-hover:bg-sky-100 transition-colors" />
            <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-sky-700">Intelligent Booking System</p>
                </div>
                <h3 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                  Find care that's <span className="text-sky-600 italic">closer</span> to you.
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 font-medium">
                  Select your area, set a search radius, and our smart engine will instantly connect you with the best nearby hospitals and specialized doctors.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 backdrop-blur-sm px-6 py-4 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Your Active Visits</p>
                <p className="mt-1 text-4xl font-black text-slate-900 leading-none">{bookedCount}</p>
              </div>
            </div>
          </div>


          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-rose-50 rounded-full blur-2xl opacity-60" />
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-rose-400 mb-4 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-rose-400" /> Upcoming Consultation
            </p>
            {upcomingAppointment ? (
              <div className="mt-4 space-y-4 relative z-10">
                <div className="inline-flex rounded-xl bg-slate-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                   {formatDate(upcomingAppointment.date, { weekday: "short", day: "2-digit", month: "short" })}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 leading-tight">
                    Dr. {upcomingAppointment.doctorId?.name || "Assigning..." }
                  </h4>
                  <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                    {upcomingAppointment.departmentId?.name} Department
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                    <Clock3 size={14} className="text-sky-500" />
                    <span>{upcomingAppointment.slotTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                    <Hospital size={14} className="text-rose-500" />
                    <span>{upcomingAppointment.hospitalId?.name?.split(" ")[0]}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                  <CalendarCheck2 size={24} className="text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-400 tracking-tight">No upcoming visits</p>
              </div>
            )}
          </div>

        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-sky-500 mb-2">How it works</p>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Smart Booking Tutorial</h3>
            </div>

            <div className="space-y-6">
              {[
                { step: "01", title: "Set Location", desc: "Enter your area or use GPS to find hospitals near you.", icon: <LocateFixed size={18} className="text-sky-500" /> },
                { step: "02", title: "Pick Hospital", desc: "Choose from a list of hospitals within your preferred radius.", icon: <Hospital size={18} className="text-rose-500" /> },
                { step: "03", title: "Select Specialist", desc: "Browse doctors by department and view their availability.", icon: <Stethoscope size={18} className="text-emerald-500" /> },
                { step: "04", title: "Confirm Slot", desc: "Pick a date and a live time slot to finalize your booking.", icon: <Clock3 size={18} className="text-amber-500" /> },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    {idx !== 3 && <div className="w-0.5 h-full bg-slate-100 my-1" />}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      {item.icon}
                      <h4 className="text-sm font-black text-slate-800">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
               <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <CheckCircle2 size={12} /> Pro Tip
               </p>
               <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                  Upload your previous medical reports while booking. This helps doctors prepare for your consultation in advance.
               </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Configuration</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">Book your appointment</h3>
              </div>
              <div className="hidden md:flex gap-1">
                 {[1,2,3,4,5,6].map(i => <div key={i} className={`w-6 h-1.5 rounded-full ${i <= (form.slotTime ? 6 : form.date ? 5 : form.doctorId ? 4 : form.departmentId ? 3 : form.hospitalId ? 2 : 1) ? "bg-sky-500" : "bg-slate-100"}`} />)}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-100 bg-slate-50/50 p-6">
                <div className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  <MapPinned size={14} className="text-sky-500" />
                  <span>1. Location & Range</span>
                </div>


                <div className="grid gap-4 md:grid-cols-[1fr,160px]">
                  <Input
                    size="large"
                    value={locationQuery}
                    onChange={(event) => setLocationQuery(event.target.value)}
                    placeholder="Enter locality, city, or address"
                    prefix={<Search size={16} className="text-slate-400" />}
                  />
                  <Select
                    size="large"
                    value={radius}
                    onChange={(value) => setRadius(value)}
                    options={radiusOptions}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    type="primary"
                    size="large"
                    loading={hospitalLoading}
                    onClick={handleSearchLocation}
                    style={{ background: "#0f172a", borderColor: "#0f172a" }}
                  >
                    Find Nearby Hospitals
                  </Button>
                  <Button
                    size="large"
                    loading={locating}
                    onClick={handleUseCurrentLocation}
                    icon={<LocateFixed size={16} />}
                  >
                    Use Current Location
                  </Button>
                </div>

                {selectedLocation && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                      <Compass size={16} className="mt-0.5 text-slate-400" />
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900">{selectedLocation.label}</p>
                        <p>
                          Latitude {selectedLocation.latitude.toFixed(5)} , Longitude {selectedLocation.longitude.toFixed(5)}
                        </p>
                        <p>Search radius: {radius} km</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">2. Nearby hospital</label>
                  <Select
                    value={form.hospitalId || undefined}
                    placeholder={hospitalLoading ? "Loading hospitals..." : "Select nearby hospital"}
                    className="w-full"
                    size="large"
                    loading={hospitalLoading}
                    disabled={!hospitals.length}
                    onChange={(value) => updateForm("hospitalId", value)}
                    options={hospitals.map((hospital) => ({
                      label: `${hospital.name} (${hospital.distanceInKM ?? "-"} km)`,
                      value: hospital._id,
                    }))}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">3. Department</label>
                  <Select
                    value={form.departmentId || undefined}
                    placeholder="Select department"
                    className="w-full"
                    size="large"
                    disabled={!form.hospitalId}
                    onChange={(value) => updateForm("departmentId", value)}
                    options={departments.map((department) => ({
                      label: department.name,
                      value: department._id,
                    }))}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">4. Doctor</label>
                  <Select
                    value={form.doctorId || undefined}
                    placeholder="Select department doctor"
                    className="w-full"
                    size="large"
                    disabled={!form.departmentId}
                    onChange={(value) => updateForm("doctorId", value)}
                    options={doctors.map((doctor) => ({
                      label: `${doctor.name} - ${doctor.specialization}`,
                      value: doctor._id,
                    }))}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">5. Date</label>
                  <Input
                    type="date"
                    size="large"
                    min={todayIso()}
                    value={form.date}
                    disabled={!form.doctorId}
                    onChange={(event) => updateForm("date", event.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">6. Available slots</h4>
                    <p className="text-sm text-slate-500">The selected date checks real backend availability before booking.</p>
                  </div>
                  {slotLoading && <span className="text-sm text-slate-400">Loading slots...</span>}
                </div>

                <div className="flex flex-wrap gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, slotTime: slot }))}
                      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                        form.slotTime === slot
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                  {!slotLoading && form.date && slots.length === 0 && (
                    <Alert
                      type="info"
                      showIcon
                      className="w-full"
                      message="No slots are open for that date"
                      description="Try a different date or select another doctor."
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-600">
                  {form.slotTime ? (
                    <>
                      Selected slot:
                      <span className="ml-2 font-semibold text-slate-900">{form.slotTime}</span>
                    </>
                  ) : (
                    "Complete the location-to-slot flow to finish booking."
                  )}
                </div>
                <Button
                  type="primary"
                  size="large"
                  loading={booking}
                  disabled={!form.hospitalId || !form.departmentId || !form.doctorId || !form.date || !form.slotTime}
                  onClick={handleBook}
                  style={{ background: "#0f172a", borderColor: "#0f172a" }}
                >
                  Confirm Appointment
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Selection Summary</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <MapPinned size={18} className="mt-0.5 text-slate-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Location</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {selectedLocation?.label || "No location selected"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{radius} km radius</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Hospital size={18} className="mt-0.5 text-slate-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Hospital</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {selectedHospital?.name || "Not selected"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedHospital?.distanceInKM != null ? `${selectedHospital.distanceInKM} km away` : "Distance available after hospital search"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Stethoscope size={18} className="mt-0.5 text-slate-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Doctor</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {doctors.find((doctor) => doctor._id === form.doctorId)?.name || "Not selected"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <CalendarCheck2 size={18} className="mt-0.5 text-slate-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Visit Window</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {form.date ? formatDate(form.date, { weekday: "long", day: "2-digit", month: "short", year: "numeric" }) : "Date not selected"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{form.slotTime || "Time slot not selected"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Appointment History</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Upcoming and past visits</h3>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              {appointments.length} total records
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton active paragraph={{ rows: 2 }} />
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ) : appointments.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Your appointment history will appear here" />
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 flex-1">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Physician</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                           <Stethoscope size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 leading-tight">{appointment.doctorId?.name || "Doctor"}</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-0.5">{appointment.doctorId?.specialization || "General"}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Medical Center</p>
                      <p className="text-sm font-black text-slate-800 leading-tight truncate">{appointment.hospitalId?.name || "Hospital"}</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">{appointment.departmentId?.name || "OPD"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Schedule</p>
                      <p className="text-sm font-black text-slate-800 leading-tight">{formatDate(appointment.date, { day: "2-digit", month: "short" })}</p>
                      <p className="text-[10px] text-sky-600 font-black mt-0.5 flex items-center gap-1"><Clock3 size={10} /> {appointment.slotTime}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Booking Status</p>
                      <div className="mt-1">
                        <Tag 
                          className={`rounded-full px-3 py-0.5 border-none text-[10px] font-black uppercase tracking-widest ${
                            appointment.status === "completed" ? "bg-emerald-50 text-emerald-600" : 
                            appointment.status === "booked" ? "bg-sky-50 text-sky-600" : 
                            "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {appointment.status}
                        </Tag>
                      </div>
                    </div>
                  </div>


                  <div className="flex items-center gap-3">
                    {appointment.status === "booked" && (
                      <>
                        <Button 
                          icon={appointment.patientReport ? <CheckCircle2 size={16} className="text-green-500" /> : <UploadCloud size={16} />} 
                          className="rounded-xl h-10 px-4 border-slate-200 text-slate-600 font-medium hover:border-sky-400 hover:text-sky-600 transition-all"
                          onClick={() => {
                            setSelectedAppointmentId(appointment._id);
                            setUploadModalVisible(true);
                          }}
                        >
                          {appointment.patientReport ? "Update Report" : "Upload Report"}
                        </Button>
                        <Button 
                          danger 
                          icon={<XCircle size={16} />} 
                          onClick={() => handleCancel(appointment._id)}
                          className="rounded-xl h-10 px-4"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {appointment.status === "completed" && (
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-3">
                          {appointment.review ? (
                            <div className="flex flex-col items-end gap-1">
                              <Rate disabled defaultValue={appointment.rating} className="text-[12px]" />
                              <div className="max-w-[200px] text-right">
                                <p className="text-[11px] text-slate-600 italic leading-tight line-clamp-2">
                                  "{appointment.review}"
                                </p>
                              </div>
                            </div>
                          ) : (
                            <Button 
                              icon={<Star size={14} />} 
                              onClick={() => {
                                setSelectedAppointmentId(appointment._id);
                                setReviewModalVisible(true);
                              }}
                              className="rounded-xl h-9 px-4 border-amber-200 text-amber-600 font-bold hover:border-amber-400 hover:text-amber-700 transition-all bg-amber-50/50"
                            >
                              Rate Visit
                            </Button>
                          )}
                          {appointment.patientReport && (
                            <Tag 
                              color="success" 
                              className="rounded-full px-3 py-1 flex items-center gap-1 border-none bg-green-50 text-green-700 font-bold cursor-pointer hover:bg-green-100"
                              onClick={() => window.open(`http://localhost:7070/uploads/prescriptions/${appointment.patientReport}`, "_blank")}
                            >
                              <CheckCircle2 size={12} /> {appointment.patientReportCategory || "Report"} Attached
                            </Tag>
                          )}
                        </div>
                        {appointment.reportReview && (
                          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3 max-w-[280px]">
                            <p className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                              <FileText size={10} /> Doctor's Feedback on Report
                            </p>
                            <p className="text-xs text-sky-800 leading-relaxed italic">
                              "{appointment.reportReview}"
                            </p>
                          </div>
                        )}
                      </div>

                    )}
                    {appointment.prescriptionFile && (
                      <Tag 
                        color="error" 
                        className="rounded-full px-3 py-1 flex items-center gap-1 border-none bg-rose-50 text-rose-600 font-bold cursor-pointer hover:bg-rose-100"
                        onClick={() => window.open(`http://localhost:7070/uploads/prescriptions/${appointment.prescriptionFile}`, "_blank")}
                      >
                        <FileText size={12} /> Prescription
                      </Tag>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PatientLayout>
  );
}
