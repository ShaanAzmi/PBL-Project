'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, MapPin, TrendingUp, AlertCircle, Info, ChevronLeft, ChevronRight } from 'lucide-react'

const DiseaseStatistics = () => {
  const { t } = useLanguage()
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'search' | 'state'>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedDisease, setSelectedDisease] = useState<any>(null)

  // Auto-rotate featured disease every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % diseaseData.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Disease data across different Indian states with sources
  const diseaseData = [
    {
      disease: "Dengue",
      state: "Maharashtra",
      cases: "15,000+ cases",
      impact: "High urban transmission during monsoon",
      year: "2023",
      source: "National Vector Borne Disease Control Programme",
      sourceUrl: "https://ncvbdc.mohfw.gov.in/",
      color: "from-red-50 to-red-100",
      borderColor: "border-red-300",
      description: "Dengue is a mosquito-borne viral infection causing flu-like illness. Maharashtra sees peak transmission during monsoon season (June-September) due to increased mosquito breeding in urban areas.",
      symptoms: ["High fever", "Severe headache", "Pain behind eyes", "Joint and muscle pain", "Rash"],
      prevention: ["Eliminate standing water", "Use mosquito repellents", "Wear protective clothing", "Install window screens"]
    },
    {
      disease: "Malaria",
      state: "Odisha",
      cases: "45,000+ cases",
      impact: "Endemic in tribal and forest areas",
      year: "2023",
      source: "NVBDCP Annual Report",
      sourceUrl: "https://ncvbdc.mohfw.gov.in/",
      color: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-300",
      description: "Malaria is a life-threatening disease caused by parasites transmitted through infected mosquitoes. Odisha accounts for a significant portion of India's malaria burden, particularly in tribal and forested regions.",
      symptoms: ["Fever and chills", "Headache", "Nausea and vomiting", "Muscle pain", "Fatigue"],
      prevention: ["Use insecticide-treated bed nets", "Indoor residual spraying", "Antimalarial medication", "Eliminate mosquito breeding sites"]
    },
    {
      disease: "Typhoid",
      state: "Delhi",
      cases: "8,500+ cases",
      impact: "Water contamination in urban slums",
      year: "2023",
      source: "Delhi Health Department",
      sourceUrl: "https://health.delhi.gov.in/",
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-300",
      description: "Typhoid fever is a bacterial infection caused by Salmonella typhi, spread through contaminated food and water. Delhi's dense urban population and water quality issues contribute to regular outbreaks.",
      symptoms: ["Prolonged fever", "Weakness", "Stomach pain", "Headache", "Loss of appetite"],
      prevention: ["Drink safe water", "Practice good hygiene", "Get vaccinated", "Eat properly cooked food"]
    },
    {
      disease: "Cholera",
      state: "West Bengal",
      cases: "3,200+ cases",
      impact: "Seasonal outbreaks in coastal regions",
      year: "2023",
      source: "HMIS Health Data Portal",
      sourceUrl: "https://hmis.mohfw.gov.in",
      color: "from-teal-50 to-teal-100",
      borderColor: "border-teal-300"
    },
    {
      disease: "Tuberculosis",
      state: "Uttar Pradesh",
      cases: "280,000+ cases",
      impact: "Highest TB burden state in India",
      year: "2023",
      source: "WHO India - Tuberculosis",
      sourceUrl: "https://www.who.int/india",
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-300"
    },
    {
      disease: "Hepatitis A",
      state: "Gujarat",
      cases: "5,600+ cases",
      impact: "Waterborne transmission in urban areas",
      year: "2023",
      source: "HMIS Health Data Portal",
      sourceUrl: "https://hmis.mohfw.gov.in",
      color: "from-pink-50 to-pink-100",
      borderColor: "border-pink-300"
    },
    {
      disease: "Chikungunya",
      state: "Karnataka",
      cases: "12,000+ cases",
      impact: "Vector-borne epidemic in Bangalore",
      year: "2023",
      source: "NVBDCP Karnataka",
      sourceUrl: "https://ncvbdc.mohfw.gov.in/",
      color: "from-orange-50 to-orange-100",
      borderColor: "border-orange-300"
    },
    {
      disease: "Japanese Encephalitis",
      state: "Assam",
      cases: "1,800+ cases",
      impact: "Endemic in rural and agricultural areas",
      year: "2023",
      source: "NVBDCP Northeast",
      sourceUrl: "https://ncvbdc.mohfw.gov.in/",
      color: "from-green-50 to-green-100",
      borderColor: "border-green-300"
    },
    {
      disease: "Leptospirosis",
      state: "Kerala",
      cases: "4,200+ cases",
      impact: "Monsoon-related flooding outbreaks",
      year: "2023",
      source: "Kerala Health Services",
      sourceUrl: "https://dhs.kerala.gov.in/",
      color: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-300"
    },
    {
      disease: "Scrub Typhus",
      state: "Himachal Pradesh",
      cases: "2,100+ cases",
      impact: "Emerging disease in hilly regions",
      year: "2023",
      source: "ICMR Studies",
      sourceUrl: "https://www.icmr.gov.in/",
      color: "from-cyan-50 to-cyan-100",
      borderColor: "border-cyan-300"
    }
  ]

  // Filter diseases based on search or state
  const filteredDiseases = diseaseData.filter(disease => {
    if (activeTab === 'search' && searchQuery) {
      return disease.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
             disease.state.toLowerCase().includes(searchQuery.toLowerCase())
    }
    if (activeTab === 'state' && selectedState) {
      return disease.state === selectedState
    }
    return true
  })

  const states = [...new Set(diseaseData.map(d => d.state))].sort()

  return (
    <section id="statistics" className="relative bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 py-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-container padding-container relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
                    <h2 className="bold-40 lg:bold-52 text-gray-90 mb-6">
            {t('india.surveillance')}
          </h2>
          <p className="regular-16 text-gray-50 max-w-3xl mx-auto">
            {t('india.surveillanceDesc')}
          </p>
        </div>

        {/* Featured Disease - Auto Rotating */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <h3 className="bold-20 text-gray-90">{t('india.featuredOutbreak')}</h3>
        </div>          <AnimatePresence mode="wait">
            <motion.div
              key={featuredIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-br ${diseaseData[featuredIndex].color} rounded-3xl p-8 border-2 ${diseaseData[featuredIndex].borderColor} shadow-2xl`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Main Info */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="bold-32 text-gray-90 mb-2">{diseaseData[featuredIndex].disease}</h4>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-5 h-5" />
                        <span className="font-semibold text-lg">{diseaseData[featuredIndex].state}</span>
                      </div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-600 mb-1">Reported Cases</p>
                      <p className="bold-24 text-red-600">{diseaseData[featuredIndex].cases}</p>
                      <p className="text-xs text-gray-500">{diseaseData[featuredIndex].year}</p>
                    </div>
                  </div>

                  <div className="bg-white/70 rounded-xl p-5 mb-4">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-gray-90 mb-1">Impact</h5>
                        <p className="text-sm text-gray-700">{diseaseData[featuredIndex].impact}</p>
                      </div>
                    </div>
                  </div>

                  {diseaseData[featuredIndex].description && (
                    <div className="bg-white/70 rounded-xl p-5">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-gray-90 mb-1">About</h5>
                          <p className="text-sm text-gray-700 leading-relaxed">{diseaseData[featuredIndex].description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side - Symptoms & Prevention */}
                <div className="space-y-4">
                  {diseaseData[featuredIndex].symptoms && (
                    <div className="bg-white/80 rounded-xl p-5">
                      <h5 className="font-semibold text-gray-90 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Common Symptoms
                      </h5>
                      <ul className="space-y-2">
                        {diseaseData[featuredIndex].symptoms.map((symptom: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {diseaseData[featuredIndex].prevention && (
                    <div className="bg-white/80 rounded-xl p-5">
                      <h5 className="font-semibold text-gray-90 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Prevention Measures
                      </h5>
                      <ul className="space-y-2">
                        {diseaseData[featuredIndex].prevention.map((measure: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-2">Data Source:</p>
                    <a
                      href={diseaseData[featuredIndex].sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:underline"
                    >
                      {diseaseData[featuredIndex].source}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Interactive Tabs Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
        <h3 className="bold-24 text-gray-90 mb-6 text-center">{t('india.exploreInfo')}</h3>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {
                setActiveTab('search')
                setSelectedState('')
                setSelectedDisease(null)
              }}
              className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <Search className="w-4 h-4" />
              {t('india.searchByDisease')}
            </button>
            <button
              onClick={() => {
                setActiveTab('state')
                setSearchQuery('')
                setSelectedDisease(null)
              }}
              className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'state'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {t('india.filterByState')}
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {activeTab === 'search' && (
              <div>
                <div className="mb-6">
                  <label className="block font-semibold text-gray-90 mb-3">{t('india.searchForDisease')}</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('india.searchPlaceholder')}
                      className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-medium text-gray-900"
                    />
                  </div>
                </div>

                {searchQuery && filteredDiseases.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDiseases.map((disease, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className={`bg-gradient-to-br ${disease.color} rounded-xl p-6 border-2 ${disease.borderColor} shadow-md hover:shadow-lg transition-all cursor-pointer`}
                        onClick={() => setSelectedDisease(disease)}
                      >
                        <h4 className="bold-20 text-gray-90 mb-2">{disease.disease}</h4>
                        <div className="flex items-center gap-2 text-gray-700 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-semibold">{disease.state}</span>
                        </div>
                        <div className="bg-white/70 rounded-lg p-3 mb-3">
                          <p className="text-xs text-gray-600">Reported Cases ({disease.year})</p>
                          <p className="bold-18 text-red-600">{disease.cases}</p>
                        </div>
                        <p className="text-sm text-gray-700">{disease.impact}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {searchQuery && filteredDiseases.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No diseases found matching "{searchQuery}"</p>
                  </div>
                )}

                {!searchQuery && (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">{t('india.startTyping')}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'state' && (
              <div>
                <div className="mb-6">
                  <label className="block font-semibold text-gray-90 mb-3">{t('india.filterByState')}</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-4 bg-white rounded-xl border-2 border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-medium text-gray-900"
                  >
                    <option value="">Choose a state...</option>
                    {states.map((state, idx) => (
                      <option key={idx} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {selectedState && filteredDiseases.length > 0 && (
                  <div>
                    <h4 className="bold-20 text-gray-90 mb-4">Disease Prevalence in {selectedState}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredDiseases.map((disease, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className={`bg-gradient-to-br ${disease.color} rounded-xl p-6 border-2 ${disease.borderColor} shadow-md hover:shadow-lg transition-all cursor-pointer`}
                          onClick={() => setSelectedDisease(disease)}
                        >
                          <h5 className="bold-20 text-gray-90 mb-3">{disease.disease}</h5>
                          <div className="bg-white/80 rounded-lg p-4 mb-4">
                            <p className="text-xs text-gray-600 mb-1">Reported Cases ({disease.year})</p>
                            <p className="bold-24 text-red-600">{disease.cases}</p>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-90 mb-1">Impact:</p>
                            <p className="text-sm text-gray-700">{disease.impact}</p>
                          </div>
                          {disease.description && (
                            <div className="bg-white/70 rounded-lg p-3">
                              <p className="text-xs text-gray-700 line-clamp-3">{disease.description}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {!selectedState && (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a state to view disease prevalence data</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Selected Disease Detail Modal */}
        {selectedDisease && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedDisease(null)}
          >
            <motion.div
              className={`bg-gradient-to-br ${selectedDisease.color} rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 ${selectedDisease.borderColor} shadow-2xl`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="bold-32 text-gray-90 mb-2">{selectedDisease.disease}</h3>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold text-lg">{selectedDisease.state}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDisease(null)}
                  className="p-2 bg-white/80 hover:bg-white rounded-full transition-all"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/80 rounded-xl p-5">
                    <p className="text-xs text-gray-600 mb-1">Reported Cases ({selectedDisease.year})</p>
                    <p className="bold-28 text-red-600">{selectedDisease.cases}</p>
                  </div>

                  <div className="bg-white/80 rounded-xl p-5">
                    <h5 className="font-semibold text-gray-90 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      Impact
                    </h5>
                    <p className="text-sm text-gray-700">{selectedDisease.impact}</p>
                  </div>

                  {selectedDisease.description && (
                    <div className="bg-white/80 rounded-xl p-5">
                      <h5 className="font-semibold text-gray-90 mb-2 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        About
                      </h5>
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedDisease.description}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedDisease.symptoms && (
                    <div className="bg-white/80 rounded-xl p-5">
                      <h5 className="font-semibold text-gray-90 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Common Symptoms
                      </h5>
                      <ul className="space-y-2">
                        {selectedDisease.symptoms.map((symptom: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedDisease.prevention && (
                    <div className="bg-white/80 rounded-xl p-5">
                      <h5 className="font-semibold text-gray-90 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Prevention Measures
                      </h5>
                      <ul className="space-y-2">
                        {selectedDisease.prevention.map((measure: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-white/80 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-2">Data Source:</p>
                    <a
                      href={selectedDisease.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:underline"
                    >
                      {selectedDisease.source}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Info Note */}
        <motion.div
          className="mt-12 bg-white/80 backdrop-blur-sm border-l-4 border-primary-500 p-6 rounded-r-xl max-w-4xl mx-auto shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-90 mb-2">About This Data</h4>
              <p className="text-sm text-gray-70 leading-relaxed">
                All statistics are compiled from official government sources including NVBDCP, IDSP, State Health Departments, and ICMR.
                Data is updated regularly to reflect the latest disease surveillance reports. For the most current information,
                please visit the respective source websites.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DiseaseStatistics

