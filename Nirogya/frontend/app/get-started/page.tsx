'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, User, Phone, Mail, MapPin, FileText, CheckCircle, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface PatientData {
  name: string
  phone: string
  email: string
  address: string
  symptoms: string
  status: 'incoming' | 'in-progress' | 'completed' | 'cancelled'
  submittedAt: string
  id: string
}

const GetStartedPage = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    symptoms: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.phone.trim() || !formData.symptoms.trim()) {
      alert('Please fill in all required fields (Name, Phone, and Symptoms)')
      return
    }

    setIsLoading(true)

    try {
      // Create patient record
      const patientData: PatientData = {
        ...formData,
        status: 'incoming',
        submittedAt: new Date().toISOString(),
        id: `PAT-${Date.now()}`
      }

      // Get existing patients from localStorage
      const existingPatients = JSON.parse(localStorage.getItem('patientRecords') || '[]')
      
      // Add new patient
      existingPatients.push(patientData)
      
      // Save to localStorage
      localStorage.setItem('patientRecords', JSON.stringify(existingPatients))

      // Show success
      setSubmitSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          symptoms: ''
        })
        setSubmitSuccess(false)
      }, 3000)

    } catch (error) {
      console.error('Error submitting patient data:', error)
      alert('Sorry, there was an error submitting your information. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-cyan-200">
        <div className="w-full px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-cyan-600 group">
            <ArrowLeft className="w-5 h-5 text-cyan-600 group-hover:text-white transition-colors duration-300" />
            <span className="text-cyan-600 font-semibold group-hover:text-white transition-colors duration-300">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-container padding-container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-100 rounded-full mb-6">
              <User className="w-10 h-10 text-cyan-600" />
            </div>
            <h1 className="bold-40 lg:bold-52 text-gray-90 mb-4">
              Patient Registration
            </h1>
            <p className="regular-18 text-gray-50 max-w-2xl mx-auto mb-2">
              Your health and well-being matter to us. Please share some basic information so we can provide you with the most relevant guidance and support.
            </p>
            <p className="regular-16 text-cyan-600 italic">
              This tool provides general health information and is not a substitute for professional medical advice.
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="bold-32 text-gray-90 mb-4">Registration Successful!</h2>
                <p className="regular-18 text-gray-60 mb-6">
                  Your information has been submitted successfully. Our medical team will review your case shortly.
                </p>
                <p className="regular-16 text-gray-50">
                  Status: <span className="font-semibold text-cyan-600">Incoming</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="flex items-center gap-2 bold-18 text-gray-90 mb-3">
                    <User className="w-5 h-5 text-cyan-600" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-6 py-4 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors regular-16 bg-gray-10"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="flex items-center gap-2 bold-18 text-gray-90 mb-3">
                    <Phone className="w-5 h-5 text-cyan-600" />
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-6 py-4 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors regular-16 bg-gray-10"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="flex items-center gap-2 bold-18 text-gray-90 mb-3">
                    <Mail className="w-5 h-5 text-cyan-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors regular-16 bg-gray-10"
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label htmlFor="address" className="flex items-center gap-2 bold-18 text-gray-90 mb-3">
                    <MapPin className="w-5 h-5 text-cyan-600" />
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    className="w-full px-6 py-4 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors regular-16 bg-gray-10"
                  />
                </div>

                {/* Symptoms Field */}
                <div>
                  <label htmlFor="symptoms" className="flex items-center gap-2 bold-18 text-gray-90 mb-3">
                    <FileText className="w-5 h-5 text-cyan-600" />
                    Describe Your Symptoms <span className="text-red-500">*</span>
                  </label>
                  <div className="mb-4">
                    <p className="regular-14 text-gray-50 mb-2">You can mention things like:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-cyan-600">
                      <span>• Stomach pain or discomfort</span>
                      <span>• Nausea or vomiting</span>
                      <span>• Diarrhea or digestive issues</span>
                      <span>• Fever or chills</span>
                      <span>• Fatigue or weakness</span>
                      <span>• Headaches</span>
                      <span>• Any other concerns</span>
                      <span>• Recent water/food consumption</span>
                    </div>
                  </div>

                  <textarea
                    id="symptoms"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    placeholder="Please describe what you're experiencing in detail..."
                    rows={8}
                    className="w-full px-6 py-4 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors regular-16 bg-gray-10 resize-none"
                    required
                  />
                  <p className="regular-14 text-gray-50 mt-2 italic">
                    Remember: This information helps us provide better guidance, but it's not a substitute for professional medical advice.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-12 py-4 rounded-xl bold-16 transition-all transform shadow-lg ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-cyan-500 hover:bg-cyan-600 hover:scale-105 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        Submitting...
                      </div>
                    ) : (
                      'Submit Registration'
                    )}
                  </button>
                  <p className="regular-14 text-gray-50 mt-4">
                    Your information will be reviewed by our medical team
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default GetStartedPage

