'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Prediction from '@/components/Prediction'
import RecordBook from '@/components/RecordBook'
import DoctorProfile from '@/components/DoctorProfile'
import PatientRecords from '@/components/PatientRecords'
import { Activity, Database, TrendingUp, Info, Users } from 'lucide-react'

const DoctorDashboardPage = () => {
  const [activeSection, setActiveSection] = useState<'prediction' | 'records' | 'patients'>('prediction')

  return (
    <section className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 py-12">
      <div className="max-container padding-container">
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="bold-40 text-gray-90">Doctor Dashboard</h1>
              <p className="text-gray-60 regular-16">Disease Outbreak Prediction & Patient Management System</p>
            </div>
          </div>

          {/* Info Banner */}
          <motion.div
            className="bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-70">
                  <span className="font-semibold">Welcome to the dashboard!</span> Use the ML Model V2 to predict disease outbreaks, browse disease records, and manage patient information all in one place.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Doctor Profile */}
        <DoctorProfile />

        {/* Navigation Tabs */}
        <motion.div
          className="mb-6 bg-white rounded-2xl shadow-lg p-2 inline-flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={() => setActiveSection('prediction')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === 'prediction'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Disease Prediction</span>
          </button>
          <button
            onClick={() => setActiveSection('records')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === 'records'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Database className="w-5 h-5" />
            <span>Disease Records</span>
          </button>
          <button
            onClick={() => setActiveSection('patients')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeSection === 'patients'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Patient Records</span>
          </button>
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeSection === 'prediction' ? (
            <div className="grid grid-cols-1 gap-8">
              <Prediction />
            </div>
          ) : activeSection === 'records' ? (
            <div className="grid grid-cols-1 gap-8">
              <RecordBook />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <PatientRecords />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default DoctorDashboardPage
