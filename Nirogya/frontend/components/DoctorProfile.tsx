'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User, Award, GraduationCap, Briefcase, Phone, Mail, MapPin, Stethoscope, Calendar, Shield } from 'lucide-react'

const DoctorProfile = () => {
  // Hardcoded Indian doctor profile
  const doctorInfo = {
    name: 'Dr. Rajesh Kumar Sharma',
    specialization: 'Infectious Diseases & Epidemiology',
    qualification: 'MBBS, MD (Internal Medicine), DM (Infectious Diseases)',
    experience: '15 years',
    registrationNumber: 'MCI-12345-2008',
    hospital: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    phone: '+91 98765 43210',
    email: 'dr.rajesh.sharma@aiims.edu',
    location: 'New Delhi, India',
    expertise: [
      'Waterborne Disease Management',
      'Vector-Borne Disease Control',
      'Epidemic Outbreak Response',
      'Public Health Policy',
      'Disease Surveillance'
    ],
    certifications: [
      'Fellow of Indian College of Physicians (FICP)',
      'Certified in Tropical Medicine',
      'WHO Certified Epidemiologist'
    ]
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-cyan-200"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="flex items-start gap-6 mb-6 pb-6 border-b-2 border-gray-100">
        {/* Profile Picture Placeholder */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="bold-32 text-gray-90">{doctorInfo.name}</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Verified
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-5 h-5 text-cyan-600" />
            <p className="bold-18 text-cyan-600">{doctorInfo.specialization}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <GraduationCap className="w-5 h-5" />
            <p className="regular-16">{doctorInfo.qualification}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="text-center px-4 py-3 bg-cyan-50 rounded-xl">
            <div className="bold-24 text-cyan-600">{doctorInfo.experience}</div>
            <div className="text-xs text-gray-600">Experience</div>
          </div>
          <div className="text-center px-4 py-3 bg-blue-50 rounded-xl">
            <div className="bold-24 text-blue-600">500+</div>
            <div className="text-xs text-gray-600">Patients</div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Registration */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Award className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Registration Number</p>
              <p className="font-semibold text-gray-90">{doctorInfo.registrationNumber}</p>
            </div>
          </div>

          {/* Hospital */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hospital/Institution</p>
              <p className="font-semibold text-gray-90">{doctorInfo.hospital}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <MapPin className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-90">{doctorInfo.location}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-gray-90">{doctorInfo.phone}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-90 break-all">{doctorInfo.email}</p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Profile Updated</p>
              <p className="font-semibold text-gray-90">November 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Areas of Expertise */}
      <div className="mb-6">
        <h3 className="bold-18 text-gray-90 mb-3 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-cyan-600" />
          Areas of Expertise
        </h3>
        <div className="flex flex-wrap gap-2">
          {doctorInfo.expertise.map((area, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 rounded-lg text-sm font-medium border border-cyan-200"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h3 className="bold-18 text-gray-90 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-600" />
          Certifications & Memberships
        </h3>
        <div className="space-y-2">
          {doctorInfo.certifications.map((cert, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-700"
            >
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span className="regular-16">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default DoctorProfile

