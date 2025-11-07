'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const AllIndiaDiseases = () => {
  const { t } = useLanguage()

  // Comprehensive disease data for all India
  const majorDiseases = [
    {
      id: 'tuberculosis',
      name: 'Tuberculosis (TB)',
      category: 'respiratory',
      severity: 'Critical',
      severityColor: 'bg-red-600',
      annualCases: '2.8 million',
      deaths: '450,000',
      description: 'A bacterial infection that primarily affects the lungs but can spread to other organs',
      symptoms: ['Persistent cough (>3 weeks)', 'Chest pain', 'Coughing up blood', 'Fever', 'Night sweats', 'Weight loss'],
      transmission: 'Airborne - spreads through coughing, sneezing, or speaking',
      mortality: '15-20% if untreated, <5% with proper treatment',
      prevention: ['BCG vaccination', 'Early detection', 'Complete treatment course', 'Proper ventilation', 'Mask wearing'],
      topStates: ['Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh', 'West Bengal', 'Bihar'],
      trend: 'decreasing',
      source: 'National TB Elimination Programme',
      sourceUrl: 'https://tbcindia.gov.in/'
    },
    {
      id: 'dengue',
      name: 'Dengue Fever',
      category: 'vector-borne',
      severity: 'High',
      severityColor: 'bg-red-500',
      annualCases: '188,000+',
      deaths: '325',
      description: 'A mosquito-borne viral infection causing severe flu-like illness',
      symptoms: ['High fever', 'Severe headache', 'Pain behind eyes', 'Joint/muscle pain', 'Rash', 'Bleeding (severe cases)'],
      transmission: 'Aedes mosquito bites (day-biting mosquitoes)',
      mortality: '1-2% with treatment, up to 20% if untreated (severe dengue)',
      prevention: ['Mosquito control', 'Use mosquito repellent', 'Wear protective clothing', 'Eliminate standing water', 'Use bed nets'],
      topStates: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra', 'Delhi'],
      trend: 'stable',
      source: 'NVBDCP Annual Report 2023',
      sourceUrl: 'https://nvbdcp.gov.in/'
    },
    {
      id: 'malaria',
      name: 'Malaria',
      category: 'vector-borne',
      severity: 'High',
      severityColor: 'bg-orange-600',
      annualCases: '3.5 million',
      deaths: '7,500',
      description: 'A parasitic disease transmitted by Anopheles mosquitoes',
      symptoms: ['Fever and chills', 'Headache', 'Nausea and vomiting', 'Muscle pain', 'Fatigue', 'Sweating'],
      transmission: 'Anopheles mosquito bites (night-biting mosquitoes)',
      mortality: '10-20% if untreated (P. falciparum), <1% with treatment',
      prevention: ['Insecticide-treated bed nets', 'Indoor residual spraying', 'Antimalarial drugs', 'Mosquito repellent', 'Protective clothing'],
      topStates: ['Odisha', 'Chhattisgarh', 'Jharkhand', 'Madhya Pradesh', 'Maharashtra'],
      trend: 'decreasing',
      source: 'NVBDCP Malaria Report',
      sourceUrl: 'https://nvbdcp.gov.in/index4.php?lang=1&level=0&linkid=431&lid=3699'
    },
    {
      id: 'typhoid',
      name: 'Typhoid Fever',
      category: 'waterborne',
      severity: 'High',
      severityColor: 'bg-red-500',
      annualCases: '9 million',
      deaths: '110,000',
      description: 'A bacterial infection caused by Salmonella typhi spread through contaminated food and water',
      symptoms: ['Prolonged high fever', 'Headache', 'Abdominal pain', 'Constipation or diarrhea', 'Rose-colored spots', 'Weakness'],
      transmission: 'Contaminated water and food, poor sanitation',
      mortality: '10-20% if untreated, 1-4% with treatment',
      prevention: ['Typhoid vaccination', 'Safe drinking water', 'Food hygiene', 'Hand washing', 'Proper sanitation'],
      topStates: ['Uttar Pradesh', 'Bihar', 'Delhi', 'West Bengal', 'Rajasthan'],
      trend: 'stable',
      source: 'IDSP Weekly Reports',
      sourceUrl: 'https://idsp.nic.in/'
    },
    {
      id: 'cholera',
      name: 'Cholera',
      category: 'waterborne',
      severity: 'Critical',
      severityColor: 'bg-red-600',
      annualCases: '4,000+',
      deaths: '120',
      description: 'An acute diarrheal disease caused by Vibrio cholerae bacteria',
      symptoms: ['Severe watery diarrhea', 'Vomiting', 'Rapid dehydration', 'Muscle cramps', 'Low blood pressure', 'Shock'],
      transmission: 'Contaminated water and food, poor sanitation',
      mortality: '50-70% if untreated, <1% with proper treatment',
      prevention: ['Safe drinking water', 'Proper sanitation', 'Oral cholera vaccine', 'Food safety', 'Hand hygiene'],
      topStates: ['West Bengal', 'Odisha', 'Maharashtra', 'Tamil Nadu', 'Kerala'],
      trend: 'decreasing',
      source: 'IDSP Cholera Surveillance',
      sourceUrl: 'https://idsp.nic.in/'
    },
    {
      id: 'hepatitis',
      name: 'Viral Hepatitis (A & E)',
      category: 'waterborne',
      severity: 'Moderate',
      severityColor: 'bg-orange-500',
      annualCases: '1.5 million',
      deaths: '35,000',
      description: 'Viral infections affecting the liver, transmitted through contaminated water and food',
      symptoms: ['Jaundice (yellow skin/eyes)', 'Fatigue', 'Abdominal pain', 'Dark urine', 'Nausea', 'Loss of appetite'],
      transmission: 'Contaminated water and food (fecal-oral route)',
      mortality: '0.5-1% (Hepatitis A), 1-4% (Hepatitis E, higher in pregnant women)',
      prevention: ['Hepatitis A vaccination', 'Safe drinking water', 'Food hygiene', 'Proper sanitation', 'Hand washing'],
      topStates: ['Uttar Pradesh', 'Bihar', 'West Bengal', 'Jharkhand', 'Odisha'],
      trend: 'stable',
      source: 'NCDC Hepatitis Surveillance',
      sourceUrl: 'https://ncdc.gov.in/'
    },
    {
      id: 'chikungunya',
      name: 'Chikungunya',
      category: 'vector-borne',
      severity: 'Moderate',
      severityColor: 'bg-yellow-500',
      annualCases: '62,000+',
      deaths: '15',
      description: 'A viral disease transmitted by Aedes mosquitoes causing fever and severe joint pain',
      symptoms: ['High fever', 'Severe joint pain', 'Muscle pain', 'Headache', 'Rash', 'Fatigue'],
      transmission: 'Aedes mosquito bites (same mosquito as dengue)',
      mortality: 'Very low (<0.1%), but can cause chronic joint pain',
      prevention: ['Mosquito control', 'Use repellent', 'Protective clothing', 'Eliminate breeding sites', 'Window screens'],
      topStates: ['Karnataka', 'Maharashtra', 'Gujarat', 'Delhi', 'Telangana'],
      trend: 'stable',
      source: 'NVBDCP Chikungunya Data',
      sourceUrl: 'https://nvbdcp.gov.in/'
    },
    {
      id: 'japanese-encephalitis',
      name: 'Japanese Encephalitis',
      category: 'vector-borne',
      severity: 'Critical',
      severityColor: 'bg-red-600',
      annualCases: '5,000+',
      deaths: '600',
      description: 'A viral brain infection transmitted by Culex mosquitoes',
      symptoms: ['High fever', 'Headache', 'Neck stiffness', 'Confusion', 'Seizures', 'Coma'],
      transmission: 'Culex mosquito bites (breeds in rice fields)',
      mortality: '20-30% fatality rate, 30-50% survivors have neurological damage',
      prevention: ['JE vaccination', 'Mosquito control', 'Avoid outdoor activities at dusk/dawn', 'Use repellent', 'Protective clothing'],
      topStates: ['Assam', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Tamil Nadu'],
      trend: 'decreasing',
      source: 'NVBDCP JE Programme',
      sourceUrl: 'https://nvbdcp.gov.in/'
    },
    {
      id: 'diarrheal-diseases',
      name: 'Acute Diarrheal Diseases',
      category: 'waterborne',
      severity: 'Moderate',
      severityColor: 'bg-yellow-500',
      annualCases: '10 million+',
      deaths: '300,000',
      description: 'Various bacterial, viral, and parasitic infections causing diarrhea',
      symptoms: ['Frequent loose stools', 'Abdominal cramps', 'Nausea', 'Vomiting', 'Dehydration', 'Fever'],
      transmission: 'Contaminated water and food, poor hygiene',
      mortality: '3-5% in children under 5 if untreated',
      prevention: ['Safe drinking water', 'Hand washing', 'Food safety', 'Breastfeeding', 'ORS availability'],
      topStates: ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Rajasthan', 'Jharkhand'],
      trend: 'stable',
      source: 'IDSP Diarrheal Disease Surveillance',
      sourceUrl: 'https://idsp.nic.in/'
    },
    {
      id: 'leptospirosis',
      name: 'Leptospirosis',
      category: 'waterborne',
      severity: 'High',
      severityColor: 'bg-orange-600',
      annualCases: '12,000+',
      deaths: '800',
      description: 'A bacterial disease spread through water contaminated with animal urine',
      symptoms: ['High fever', 'Severe headache', 'Muscle pain', 'Jaundice', 'Red eyes', 'Abdominal pain'],
      transmission: 'Contact with water/soil contaminated with infected animal urine',
      mortality: '5-15% without treatment, higher in severe cases',
      prevention: ['Avoid wading in flood water', 'Protective footwear', 'Rodent control', 'Doxycycline prophylaxis', 'Clean water'],
      topStates: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Andaman & Nicobar'],
      trend: 'increasing',
      source: 'State Health Departments',
      sourceUrl: 'https://www.nhp.gov.in/'
    }
  ]

  // Category-wise distribution for pie chart
  const categoryData = [
    { name: 'Vector-Borne', value: 3762000, color: '#EF4444', diseases: 5 },
    { name: 'Waterborne', value: 20504000, color: '#3B82F6', diseases: 5 },
    { name: 'Respiratory', value: 2800000, color: '#8B5CF6', diseases: 1 }
  ]

  // Regional disease burden
  const regionalData = [
    { region: 'North', cases: 4500000, population: 350000000 },
    { region: 'South', cases: 3200000, population: 260000000 },
    { region: 'East', cases: 5800000, population: 310000000 },
    { region: 'West', cases: 3800000, population: 280000000 },
    { region: 'Central', cases: 4200000, population: 220000000 },
    { region: 'Northeast', cases: 1500000, population: 50000000 }
  ]

  // Trend data over years
  const trendData = [
    { year: '2019', tb: 2900000, dengue: 157000, malaria: 5600000, typhoid: 9500000 },
    { year: '2020', tb: 2850000, dengue: 136000, malaria: 4800000, typhoid: 9200000 },
    { year: '2021', tb: 2820000, dengue: 193000, malaria: 4200000, typhoid: 9100000 },
    { year: '2022', tb: 2810000, dengue: 233000, malaria: 3800000, typhoid: 9050000 },
    { year: '2023', tb: 2800000, dengue: 188000, malaria: 3500000, typhoid: 9000000 }
  ]

  // Disease severity comparison (radar chart)
  const severityComparison = [
    { disease: 'TB', mortality: 85, cases: 95, spread: 70, treatment: 80 },
    { disease: 'Dengue', mortality: 40, cases: 60, spread: 85, treatment: 70 },
    { disease: 'Malaria', mortality: 50, cases: 90, spread: 75, treatment: 85 },
    { disease: 'Typhoid', mortality: 45, cases: 95, spread: 65, treatment: 90 },
    { disease: 'Cholera', mortality: 60, cases: 30, spread: 80, treatment: 95 }
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === 'decreasing') return <TrendingDown className="w-5 h-5 text-green-600" />
    if (trend === 'increasing') return <TrendingUp className="w-5 h-5 text-red-600" />
    return <Minus className="w-5 h-5 text-yellow-600" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'decreasing') return 'text-green-600 bg-green-50'
    if (trend === 'increasing') return 'text-red-600 bg-red-50'
    return 'text-yellow-600 bg-yellow-50'
  }

  // Show all diseases
  const filteredDiseases = majorDiseases

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary-200 sticky top-0 z-50">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between max-container padding-container">
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 group">
              <span className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-300">{t('nav.backToHome')}</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <span className="bold-20 text-primary-600">Nirogya</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-container padding-container relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-400 to-teal-500 rounded-full mb-6 shadow-lg">
              <AlertTriangle className="text-white" size={36} />
            </div>
            <h1 className="bold-52 lg:bold-64 text-gray-90 mb-6">
              Major Diseases Across India
            </h1>
            <p className="regular-18 text-primary-600 font-medium mb-4">
              Comprehensive Disease Surveillance & Prevention Guide
            </p>
            <p className="regular-16 text-gray-50 max-w-4xl mx-auto leading-relaxed">
              Explore detailed information about major diseases affecting India, including vector-borne, waterborne, and respiratory diseases.
              All data is sourced from official government health departments and national disease control programmes.
            </p>
          </motion.div>

          {/* Disease Categories Information */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-center text-gray-600 mb-4 font-medium">Disease Categories Covered:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'Vector-Borne Diseases', icon: '🦟', desc: 'Mosquito & insect transmitted', color: 'from-red-500 to-orange-500' },
                { label: 'Waterborne Diseases', icon: '💧', desc: 'Water & food contamination', color: 'from-blue-500 to-cyan-500' },
                { label: 'Respiratory Diseases', icon: '🫁', desc: 'Airborne transmission', color: 'from-purple-500 to-violet-500' }
              ].map((category, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl px-6 py-4 shadow-md border border-primary-100 hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <p className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${category.color}`}>
                        {category.label}
                      </p>
                      <p className="text-xs text-gray-500">{category.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary-100 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">11</div>
              <div className="text-sm text-gray-50">Major Diseases Tracked</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary-100 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">27M+</div>
              <div className="text-sm text-gray-50">Annual Cases (2023)</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary-100 text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">900K+</div>
              <div className="text-sm text-gray-50">Annual Deaths</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary-100 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">28</div>
              <div className="text-sm text-gray-50">States Covered</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-16 bg-white">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="bold-40 lg:bold-48 text-gray-90 mb-4">
              Disease Surveillance Data
            </h2>
            <p className="regular-16 text-gray-50 max-w-3xl mx-auto">
              Visual analysis of disease patterns, trends, and regional distribution across India
            </p>
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Category Distribution Pie Chart */}
            <motion.div
              className="bg-gradient-to-br from-white to-primary-50/30 rounded-2xl p-8 shadow-xl border border-primary-100"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="bold-24 text-gray-90 mb-4">Disease Category Distribution</h3>
              <p className="text-sm text-gray-50 mb-6">Total annual cases by disease category (2023)</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => value.toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-gray-70">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-gray-90">{cat.value.toLocaleString()} cases</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Regional Distribution Bar Chart */}
            <motion.div
              className="bg-gradient-to-br from-white to-teal-50/30 rounded-2xl p-8 shadow-xl border border-primary-100"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="bold-24 text-gray-90 mb-4">Regional Disease Burden</h3>
              <p className="text-sm text-gray-50 mb-6">Total cases by region (2023)</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="region" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => value.toLocaleString()}
                  />
                  <Bar dataKey="cases" fill="#0EA5E9" radius={[8, 8, 0, 0]} name="Total Cases" />
                </BarChart>
              </ResponsiveContainer>
              <a
                href="https://idsp.nic.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 mt-4"
              >
                Source: IDSP Regional Reports
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          </div>

          {/* Trend Line Chart - Full Width */}
          <motion.div
            className="bg-gradient-to-br from-white to-cyan-50/30 rounded-2xl p-8 shadow-xl border border-primary-100 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="bold-24 text-gray-90 mb-4">5-Year Disease Trends</h3>
            <p className="text-sm text-gray-50 mb-6">Annual case trends for major diseases (2019-2023)</p>
            <ResponsiveContainer width="100%" height={350}>
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
                  formatter={(value: any) => value.toLocaleString()}
                />
                <Legend />
                <Line type="monotone" dataKey="tb" stroke="#8B5CF6" strokeWidth={3} name="Tuberculosis" />
                <Line type="monotone" dataKey="dengue" stroke="#EF4444" strokeWidth={3} name="Dengue" />
                <Line type="monotone" dataKey="malaria" stroke="#F59E0B" strokeWidth={3} name="Malaria" />
                <Line type="monotone" dataKey="typhoid" stroke="#3B82F6" strokeWidth={3} name="Typhoid" />
              </LineChart>
            </ResponsiveContainer>
            <a
              href="https://www.nhp.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 mt-4"
            >
              Source: National Health Portal & Disease Control Programmes
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>

          {/* Severity Radar Chart */}
          <motion.div
            className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-8 shadow-xl border border-primary-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="bold-24 text-gray-90 mb-4">Disease Severity Comparison</h3>
            <p className="text-sm text-gray-50 mb-6">Comparative analysis of mortality, case load, spread rate, and treatment availability</p>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={severityComparison}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="disease" stroke="#6B7280" />
                <PolarRadiusAxis stroke="#6B7280" />
                <Radar name="Mortality Risk" dataKey="mortality" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                <Radar name="Case Volume" dataKey="cases" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Radar name="Spread Rate" dataKey="spread" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                <Radar name="Treatment Access" dataKey="treatment" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      {/* Detailed Disease Information */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 via-white to-teal-50">
        <div className="max-container padding-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="bold-40 lg:bold-48 text-gray-90 mb-4">
              Detailed Disease Information
            </h2>
            <p className="regular-16 text-gray-50 max-w-3xl mx-auto">
              Comprehensive information about each disease including symptoms, transmission, prevention, and affected regions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredDiseases.map((disease, index) => (
              <motion.div
                key={disease.id}
                className="bg-white rounded-2xl p-8 shadow-xl border border-primary-100 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {/* Disease Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="bold-24 text-gray-90">{disease.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${disease.severityColor}`}>
                        {disease.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-50">Cases:</span>
                        <span className="font-bold text-primary-600">{disease.annualCases}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-50">Deaths:</span>
                        <span className="font-bold text-red-600">{disease.deaths}</span>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getTrendColor(disease.trend)}`}>
                        {getTrendIcon(disease.trend)}
                        <span className="text-xs font-semibold capitalize">{disease.trend}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="regular-16 text-gray-50 mb-6 leading-relaxed border-l-4 border-primary-200 pl-4">
                  {disease.description}
                </p>

                {/* Symptoms */}
                <div className="mb-6">
                  <h4 className="bold-16 text-gray-90 mb-3 flex items-center gap-2">
                    <span className="text-xl">🩺</span> Common Symptoms
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {disease.symptoms.map((symptom, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-200"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Transmission & Mortality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="bold-14 text-orange-900 mb-2 flex items-center gap-2">
                      <span>🦠</span> Transmission
                    </h4>
                    <p className="regular-14 text-orange-700">{disease.transmission}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="bold-14 text-red-900 mb-2 flex items-center gap-2">
                      <span>⚠️</span> Mortality Rate
                    </h4>
                    <p className="regular-14 text-red-700">{disease.mortality}</p>
                  </div>
                </div>

                {/* Prevention */}
                <div className="mb-6">
                  <h4 className="bold-16 text-gray-90 mb-3 flex items-center gap-2">
                    <span className="text-xl">🛡️</span> Prevention Methods
                  </h4>
                  <ul className="space-y-2">
                    {disease.prevention.map((method, idx) => (
                      <li key={idx} className="regular-14 text-gray-50 flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top Affected States */}
                <div className="mb-6">
                  <h4 className="bold-16 text-gray-90 mb-3 flex items-center gap-2">
                    <span className="text-xl">📍</span> Most Affected States
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {disease.topStates.map((state, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium border border-primary-200"
                      >
                        {state}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Source */}
                <div className="pt-4 border-t border-gray-200">
                  <a
                    href={disease.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2 hover:underline"
                  >
                    <span>📊 Data Source: {disease.source}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-teal-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-container padding-container text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="bold-40 lg:bold-52 text-white mb-6">
              Need Help Identifying Symptoms?
            </h2>
            <p className="regular-18 text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Use our AI-powered symptom analyzer to get instant insights about potential diseases and recommended actions.
              Early detection can save lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/get-started">
                <motion.button
                  className="px-10 py-5 bg-white text-primary-600 rounded-xl bold-18 hover:bg-gray-50 transition-all shadow-2xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🩺 Analyze Symptoms Now
                </motion.button>
              </Link>
              <Link href="/">
                <motion.button
                  className="px-10 py-5 bg-transparent border-3 border-white text-white rounded-xl bold-18 hover:bg-white hover:text-primary-600 transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🏠 Back to Home
                </motion.button>
              </Link>
            </div>

            {/* Additional Resources */}
            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">📞</div>
                <h4 className="bold-18 text-white mb-2">Emergency Helpline</h4>
                <p className="text-sm text-white/80">Call 104 for health emergencies</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🏥</div>
                <h4 className="bold-18 text-white mb-2">Find Hospitals</h4>
                <p className="text-sm text-white/80">Locate nearest healthcare facility</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">💊</div>
                <h4 className="bold-18 text-white mb-2">Prevention Tips</h4>
                <p className="text-sm text-white/80">Learn how to stay healthy</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AllIndiaDiseases
