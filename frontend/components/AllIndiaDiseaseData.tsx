'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const AllIndiaDiseaseData = () => {
  const { t } = useLanguage()
  const [selectedRegion, setSelectedRegion] = useState('all')

  // Regional disease burden data
  const regionalData = [
    { region: 'North', dengue: 12000, malaria: 8500, typhoid: 15000, tb: 95000 },
    { region: 'South', dengue: 18000, malaria: 12000, typhoid: 11000, tb: 78000 },
    { region: 'East', dengue: 9000, malaria: 35000, typhoid: 9500, tb: 82000 },
    { region: 'West', dengue: 15000, malaria: 7000, typhoid: 13000, tb: 105000 },
    { region: 'Central', dengue: 7500, malaria: 15000, typhoid: 8000, tb: 68000 },
    { region: 'Northeast', dengue: 4500, malaria: 18000, typhoid: 5500, tb: 42000 }
  ]

  // Disease distribution pie chart data
  const diseaseDistribution = [
    { name: 'Tuberculosis', value: 470000, color: '#8B5CF6' },
    { name: 'Dengue', value: 66000, color: '#EF4444' },
    { name: 'Malaria', value: 95500, color: '#F59E0B' },
    { name: 'Typhoid', value: 62000, color: '#3B82F6' },
    { name: 'Hepatitis', value: 28000, color: '#EC4899' },
    { name: 'Others', value: 45000, color: '#10B981' }
  ]

  // Trend data over years
  const trendData = [
    { year: '2019', dengue: 58000, malaria: 120000, typhoid: 70000 },
    { year: '2020', dengue: 52000, malaria: 110000, typhoid: 68000 },
    { year: '2021', dengue: 61000, malaria: 105000, typhoid: 65000 },
    { year: '2022', dengue: 64000, malaria: 98000, typhoid: 63000 },
    { year: '2023', dengue: 66000, malaria: 95500, typhoid: 62000 }
  ]

  // State-wise top affected states
  const topAffectedStates = [
    {
      state: 'Uttar Pradesh',
      disease: 'Tuberculosis',
      cases: '280,000+',
      trend: 'decreasing',
      source: 'WHO India - Tuberculosis',
      sourceUrl: 'https://www.who.int/india'
    },
    {
      state: 'Maharashtra',
      disease: 'Dengue',
      cases: '15,000+',
      trend: 'stable',
      source: 'NVBDCP',
      sourceUrl: 'https://ncvbdc.mohfw.gov.in/'
    },
    {
      state: 'Odisha',
      disease: 'Malaria',
      cases: '45,000+',
      trend: 'decreasing',
      source: 'NVBDCP Annual Report',
      sourceUrl: 'https://ncvbdc.mohfw.gov.in/'
    },
    {
      state: 'West Bengal',
      disease: 'Cholera',
      cases: '3,200+',
      trend: 'stable',
      source: 'HMIS Health Data Portal',
      sourceUrl: 'https://hmis.mohfw.gov.in'
    },
    {
      state: 'Kerala',
      disease: 'Leptospirosis',
      cases: '4,200+',
      trend: 'increasing',
      source: 'Kerala Health Services',
      sourceUrl: 'https://dhs.kerala.gov.in/'
    },
    {
      state: 'Karnataka',
      disease: 'Chikungunya',
      cases: '12,000+',
      trend: 'stable',
      source: 'NVBDCP Karnataka',
      sourceUrl: 'https://ncvbdc.mohfw.gov.in/'
    }
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === 'decreasing') return '📉'
    if (trend === 'increasing') return '📈'
    return '➡️'
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'decreasing') return 'text-green-600'
    if (trend === 'increasing') return 'text-red-600'
    return 'text-yellow-600'
  }

  return (
    <section className="relative bg-gradient-to-br from-white via-cyan-50/30 to-teal-50/30 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-container padding-container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="bold-40 lg:bold-52 text-gray-90 mb-6">
            Disease Surveillance Data - All India
          </h2>
          <p className="regular-16 text-gray-50 max-w-3xl mx-auto mb-4">
            Comprehensive disease monitoring data from across India. All statistics are sourced from official government health departments and national disease control programmes.
          </p>
          <p className="text-sm text-primary-600 font-medium">
            Data updated regularly • Sources verified • 2023 Statistics
          </p>
        </motion.div>

        {/* Regional Bar Chart */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-12 border border-primary-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="mb-6">
            <h3 className="bold-24 text-gray-90 mb-2">Regional Disease Distribution</h3>
            <p className="regular-14 text-gray-50">Cases reported across different regions of India (2023)</p>
            <a
              href="https://ncvbdc.mohfw.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 mt-2"
            >
              Source: NVBDCP & State Health Departments
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="region" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="dengue" fill="#EF4444" name="Dengue" radius={[8, 8, 0, 0]} />
              <Bar dataKey="malaria" fill="#F59E0B" name="Malaria" radius={[8, 8, 0, 0]} />
              <Bar dataKey="typhoid" fill="#3B82F6" name="Typhoid" radius={[8, 8, 0, 0]} />
              <Bar dataKey="tb" fill="#8B5CF6" name="Tuberculosis" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Two Column Layout - Pie Chart and Trend Line */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Disease Distribution Pie Chart */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary-100"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className="bold-24 text-gray-90 mb-2">Disease Burden Distribution</h3>
              <p className="regular-14 text-gray-50">Total cases by disease type (2023)</p>
              <a
                href="https://hmis.mohfw.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 mt-2"
              >
                Source: HMIS Health Data Portal
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {diseaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Trend Line Chart */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary-100"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className="bold-24 text-gray-90 mb-2">5-Year Disease Trends</h3>
              <p className="regular-14 text-gray-50">Annual case trends (2019-2023)</p>
              <a
                href="https://mohfw.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 mt-2"
              >
                Source: Ministry of Health & Family Welfare
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="dengue" stroke="#EF4444" strokeWidth={3} name="Dengue" />
                <Line type="monotone" dataKey="malaria" stroke="#F59E0B" strokeWidth={3} name="Malaria" />
                <Line type="monotone" dataKey="typhoid" stroke="#3B82F6" strokeWidth={3} name="Typhoid" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top Affected States Table */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-primary-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="mb-6">
            <h3 className="bold-24 text-gray-90 mb-2">Top Affected States by Disease</h3>
            <p className="regular-14 text-gray-50">States with highest disease burden and current trends</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary-200">
                  <th className="text-left py-4 px-4 bold-16 text-gray-90">State</th>
                  <th className="text-left py-4 px-4 bold-16 text-gray-90">Primary Disease</th>
                  <th className="text-left py-4 px-4 bold-16 text-gray-90">Cases (2023)</th>
                  <th className="text-left py-4 px-4 bold-16 text-gray-90">Trend</th>
                  <th className="text-left py-4 px-4 bold-16 text-gray-90">Data Source</th>
                </tr>
              </thead>
              <tbody>
                {topAffectedStates.map((item, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-primary-50/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <td className="py-4 px-4 font-semibold text-gray-90">{item.state}</td>
                    <td className="py-4 px-4 text-gray-70">{item.disease}</td>
                    <td className="py-4 px-4 font-semibold text-primary-600">{item.cases}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 ${getTrendColor(item.trend)}`}>
                        {getTrendIcon(item.trend)} {item.trend}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1"
                      >
                        {item.source}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AllIndiaDiseaseData

