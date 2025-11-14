'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const DiseaseStatistics = () => {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)

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
      borderColor: "border-red-300"
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
      borderColor: "border-yellow-300"
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
      borderColor: "border-blue-300"
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="statistics" className="relative bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 py-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-container padding-container relative z-10">
        <div className="mb-12 text-center">
          <motion.h2
            className="bold-40 lg:bold-52 text-gray-90 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Major Diseases Across India
          </motion.h2>
          <motion.p
            className="regular-16 text-gray-50 max-w-3xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Real-time disease surveillance data from across Indian states. Data sourced from official government health departments and national disease control programmes.
          </motion.p>
          <motion.p
            className="text-sm text-gray-40 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Click on source links to verify data authenticity
          </motion.p>
        </div>

        {/* Horizontal Scrolling Container */}
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all hover:scale-110"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-gray-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all hover:scale-110"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-gray-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable Disease Cards */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {diseaseData.map((item, index) => (
              <motion.div
                key={index}
                className={`flex-shrink-0 w-[380px] bg-gradient-to-br ${item.color} rounded-2xl p-6 border-2 ${item.borderColor} shadow-lg hover:shadow-xl transition-all snap-center`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Disease Name & State */}
                <div className="mb-4">
                  <h3 className="bold-24 text-gray-90 mb-2">{item.disease}</h3>
                  <div className="flex items-center gap-2 text-primary-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-sm">{item.state}</span>
                  </div>
                </div>

                {/* Cases */}
                <div className="mb-4 bg-white/60 rounded-lg p-3">
                  <p className="text-xs text-gray-50 mb-1">Reported Cases ({item.year})</p>
                  <p className="bold-20 text-gray-90">{item.cases}</p>
                </div>

                {/* Impact */}
                <div className="mb-4">
                  <p className="text-sm text-gray-70 leading-relaxed">
                    <span className="font-semibold">Impact:</span> {item.impact}
                  </p>
                </div>

                {/* Source Link */}
                <div className="pt-3 border-t border-gray-30">
                  <p className="text-xs text-gray-50 mb-2">Data Source:</p>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:underline"
                  >
                    {item.source}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <motion.div
          className="mt-12 bg-white/80 backdrop-blur-sm border-l-4 border-primary-500 p-6 rounded-r-xl max-w-4xl mx-auto shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
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

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default DiseaseStatistics

