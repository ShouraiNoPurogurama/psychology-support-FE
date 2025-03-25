import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeartbeat, FaHistory, FaAllergies, FaBrain, FaNotesMedical, FaCalendarAlt } from "react-icons/fa";
import Loader from "../../Web/Loader";
import HistoryPatient from "./HistoryPatient";

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [activeTab, setActiveTab] = useState("profile"); // Trạng thái để điều khiển tab

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await fetch(`https://psychologysupport-profile.azurewebsites.net/patients/${id}`);
                if (!response.ok) throw new Error("Failed to fetch patient data");
                const data = await response.json();
                setCustomer(data.patientProfileDto);

                const imageResponse = await fetch(
                    `https://psychologysupport-image.azurewebsites.net/image/get?ownerType=User&ownerId=${data.patientProfileDto.userId}`
                );
                setProfileImage(
                    imageResponse.ok
                        ? (await imageResponse.json()).url
                        : "https://cdn-healthcare.hellohealthgroup.com/2023/05/1684813854_646c381ea5d030.57844254.jpg?w=1920&q=100"
                );
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id]);

    if (loading) return <Loader />;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl font-bold bg-red-100">Error: {error}</div>;
    if (!customer) return <div className="min-h-screen flex items-center justify-center text-gray-600 text-2xl font-bold bg-gray-100">Customer not found</div>;

    // Determine gender styling
    const genderStyles = {
        Male: { bg: "bg-blue-500", border: "border-blue-600", text: "text-blue-600", gradient: "from-blue-500 to-cyan-500" },
        Female: { bg: "bg-pink-500", border: "border-pink-600", text: "text-pink-600", gradient: "from-pink-500 to-purple-500" },
        Other: { bg: "bg-purple-500", border: "border-purple-600", text: "text-purple-600", gradient: "from-purple-500 to-indigo-500" }
    };
    const genderStyle = genderStyles[customer.gender] || genderStyles.Other;

    return (
        <motion.div
            className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                    {/* Profile Card with Tabs */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-200"
                        whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={`relative h-36 bg-gradient-to-r ${genderStyle.gradient}`}>
                            <div className="absolute inset-0 opacity-30">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="white" opacity="0.2" />
                                    <path d="M20 80 Q50 20 80 80" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
                                </svg>
                            </div>
                            <motion.img
                                src={profileImage}
                                alt={customer.fullName}
                                className="w-36 h-36 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-white shadow-lg object-cover"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            />
                        </div>
                        <div className="pt-20 pb-8 px-6 text-center">
                            <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                                {customer.fullName}
                            </h2>
                            <motion.div
                                className={`inline-block mt-3 px-4 py-2 rounded-full ${genderStyle.bg} text-white font-bold text-lg shadow-md border ${genderStyle.border}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                {customer.gender}
                            </motion.div>
                            <div className="mt-6 space-y-5">
                                {[
                                    { icon: FaPhone, color: "text-purple-500", text: customer.contactInfo.phoneNumber },
                                    { icon: FaEnvelope, color: "text-cyan-500", text: customer.contactInfo.email },
                                    { icon: FaMapMarkerAlt, color: "text-pink-500", text: customer.contactInfo.address }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center justify-center gap-2 text-gray-700"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.2 + 0.5 }}
                                    >
                                        <item.icon className={`${item.color} text-lg`} />
                                        <span className="text-sm font-medium">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                            {/* Tab Buttons */}
                            <div className="mt-6 flex justify-center gap-4">
                                <motion.button
                                    onClick={() => setActiveTab("profile")}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === "profile" ? "bg-purple-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Profile
                                </motion.button>
                                <motion.button
                                    onClick={() => setActiveTab("history")}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === "history" ? "bg-purple-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    History
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Dynamic Content in Second Column */}
                    <div className="lg:col-span-3 space-y-2">
                        {activeTab === "profile" ? (
                            <>
                                {/* Medical History */}
                                <motion.div
                                    className="bg-white rounded-2xl shadow-xl p-4 border-2 border-cyan-200"
                                    whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                                >
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 mb-6">
                                        <FaHeartbeat className="text-cyan-500" /> Medical History
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-2 text-gray-800 bg-cyan-50 p-3 rounded-lg">
                                            <FaCalendarAlt className="text-purple-500" />
                                            <span className="font-medium">Diagnosed: {new Date(customer.medicalHistory.diagnosedAt).toLocaleDateString()}</span>
                                        </p>
                                        <div className="grid gap-1">
                                            <div className="bg-purple-50 p-4 rounded-lg">
                                                <p className="font-semibold text-purple-700 mb-2">Mental Disorders:</p>
                                                {customer.medicalHistory.specificMentalDisorders.map(disorder => (
                                                    <motion.div
                                                        key={disorder.id}
                                                        className="flex items-start gap-2 mb-2"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <FaBrain className="text-purple-500 mt-1" />
                                                        <span className="text-gray-800"><strong>{disorder.name}:</strong> {disorder.description}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="bg-pink-50 p-4 rounded-lg">
                                                <p className="font-semibold text-pink-700 mb-2">Physical Symptoms:</p>
                                                {customer.medicalHistory.physicalSymptoms.map(symptom => (
                                                    <motion.div
                                                        key={symptom.id}
                                                        className="flex items-start gap-2 mb-2"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <FaHeartbeat className="text-pink-500 mt-1" />
                                                        <span className="text-gray-800"><strong>{symptom.name}:</strong> {symptom.description}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <p className="flex items-center gap-2 text-gray-800 bg-green-50 p-3 rounded-lg">
                                                <FaAllergies className="text-green-500" />
                                                <span className="font-medium">Allergies: <span className="text-green-700">{customer.allergies}</span></span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Medical Records */}
                                <motion.div
                                    className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200"
                                    whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                                >
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2 mb-6">
                                        <FaHistory className="text-purple-500" /> Medical Records
                                    </h3>
                                    <div className="space-y-6">
                                        {customer.medicalRecords.map(record => (
                                            <motion.div
                                                key={record.id}
                                                className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <p className="flex items-center gap-2 text-gray-800 mb-2">
                                                    <FaNotesMedical className="text-cyan-500" />
                                                    <span className="font-medium"><strong>Notes:</strong> {record.notes}</span>
                                                </p>
                                                <p className="flex items-center gap-2 text-gray-800 mb-2">
                                                    <FaHeartbeat className={`text-${record.status === "Processing" ? "yellow" : "green"}-500`} />
                                                    <span className="font-medium">
                                                        <strong>Status:</strong>
                                                        <span className={`text-${record.status === "Processing" ? "yellow" : "green"}-600`}>{record.status}</span>
                                                    </span>
                                                </p>
                                                <p className="flex items-center gap-2 text-gray-800">
                                                    <FaCalendarAlt className="text-purple-500" />
                                                    <span className="font-medium">Created: {new Date(record.createdAt).toLocaleDateString()}</span>
                                                </p>
                                                {record.specificMentalDisorders?.length > 0 && (
                                                    <div className="mt-4 bg-cyan-50 p-4 rounded-lg">
                                                        <p className="font-semibold text-cyan-700 mb-2">Disorders:</p>
                                                        {record.specificMentalDisorders.map(disorder => (
                                                            <div key={disorder.id} className="flex items-start gap-2 mb-2">
                                                                <FaBrain className="text-cyan-500 mt-1" />
                                                                <span className="text-gray-800"><strong>{disorder.name}:</strong> {disorder.description}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            /* Patient History */
                            <motion.div
                                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200"
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                            >
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2 mb-4">
                                    <FaHistory className="text-blue-500" /> Patient History
                                </h3>
                                <HistoryPatient />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Back Button */}
                <motion.button
                    onClick={() => navigate("/manager/viewCustomer")}
                    className="mt-8 w-full max-w-md mx-auto block bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:from-purple-700 hover:to-cyan-700 transition-all"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                >
                    Back to Customers
                </motion.button>
            </div>
        </motion.div>
    );
};

export default CustomerDetail;