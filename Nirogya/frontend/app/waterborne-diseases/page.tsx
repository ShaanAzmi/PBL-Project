'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ExternalLink, Bug, Droplet, Wind, Activity, Shield, MapPin, Phone, Hospital, Pill, Home, ChevronLeft, ChevronRight, Search, Filter, X, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const AllIndiaDiseases = () => {
  const { t } = useLanguage()

  // Featured disease rotation state
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Search and filter state
  const [activeTab, setActiveTab] = useState<'search' | 'filter'>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedDisease, setSelectedDisease] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

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
      source: 'WHO India - Tuberculosis',
      sourceUrl: 'https://www.who.int/india'
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
      sourceUrl: 'https://ncvbdc.mohfw.gov.in/'
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
      sourceUrl: 'https://ncvbdc.mohfw.gov.in/index1.php?lang=1&level=1&sublinkid=5784&lid=3689'
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
      source: 'HMIS Health Data Portal',
      sourceUrl: 'https://hmis.mohfw.gov.in'
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
      source: 'HMIS Health Data Portal',
      sourceUrl: 'https://hmis.mohfw.gov.in'
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
      sourceUrl: 'https://ncdc.mohfw.gov.in/'
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
      sourceUrl: 'https://ncvbdc.mohfw.gov.in/'
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
      sourceUrl: 'https://ncvbdc.mohfw.gov.in/'
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
      source: 'HMIS Health Data Portal',
      sourceUrl: 'https://hmis.mohfw.gov.in'
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
      sourceUrl: 'https://mohfw.gov.in/'
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

  // Auto-rotate featured disease every 5 seconds
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setFeaturedIndex((prev) => (prev + 1) % majorDiseases.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isPaused, majorDiseases.length])

  // Filter diseases based on search and state
  const filteredDiseases = majorDiseases.filter(disease => {
    const matchesSearch = searchQuery === '' ||
      disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesState = selectedState === '' ||
      disease.topStates.includes(selectedState)

    return matchesSearch && matchesState
  })

  // Get all unique states from disease data
  const allStates = Array.from(new Set(majorDiseases.flatMap(d => d.topStates))).sort()

  const handlePrevious = () => {
    setFeaturedIndex((prev) => (prev - 1 + majorDiseases.length) % majorDiseases.length)
    setIsPaused(true)
  }

  const handleNext = () => {
    setFeaturedIndex((prev) => (prev + 1) % majorDiseases.length)
    setIsPaused(true)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vector-borne': return <Bug className="w-6 h-6" />
      case 'waterborne': return <Droplet className="w-6 h-6" />
      case 'respiratory': return <Wind className="w-6 h-6" />
      default: return <Activity className="w-6 h-6" />
    }
  }

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
            <LanguageToggle />
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
              {t('diseases.majorTitle')}
            </h1>
            <p className="regular-18 text-primary-600 font-medium mb-4">
              {t('diseases.comprehensiveGuide')}
            </p>
            <p className="regular-16 text-gray-50 max-w-4xl mx-auto leading-relaxed">
              {t('diseases.exploreInfo')}
            </p>
          </motion.div>

          {/* Disease Categories Information */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-center text-gray-600 mb-4 font-medium">{t('diseases.categoriesCovered')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: t('diseases.vectorBorne'), icon: Bug, desc: t('diseases.vectorBorneDesc'), color: 'from-red-500 to-orange-500', bgColor: 'bg-red-50' },
                { label: t('diseases.waterborne'), icon: Droplet, desc: t('diseases.waterborneDesc'), color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
                { label: t('diseases.respiratory'), icon: Wind, desc: t('diseases.respiratoryDesc'), color: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-50' }
              ].map((category, index) => {
                const IconComponent = category.icon
                return (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl px-6 py-4 shadow-md border border-primary-100 hover:shadow-lg transition-all duration-300"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${category.bgColor} rounded-lg`}>
                        <IconComponent className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <p className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${category.color}`}>
                          {category.label}
                        </p>
                        <p className="text-xs text-gray-500">{category.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
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
              <div className="text-sm text-gray-50">{t('diseases.majorTracked')}</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary-100 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">27M+</div>
              <div className="text-sm text-gray-50">{t('diseases.annualCases')}</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary-100 text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">900K+</div>
              <div className="text-sm text-gray-50">{t('diseases.annualDeaths')}</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary-100 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">28</div>
              <div className="text-sm text-gray-50">{t('diseases.statesCovered')}</div>
            </div>
          </motion.div>

          {/* Featured Disease - Auto-Rotating */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-6">
              <h3 className="bold-32 text-gray-90 mb-2">{t('diseases.featuredSpotlight')}</h3>
              <p className="text-sm text-gray-600">{t('diseases.autoRotating')}</p>
            </div>

            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-primary-200"
                aria-label="Previous disease"
              >
                <ChevronLeft className="w-6 h-6 text-primary-600" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-primary-200"
                aria-label="Next disease"
              >
                <ChevronRight className="w-6 h-6 text-primary-600" />
              </button>

              {/* Featured Disease Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-white to-primary-50 rounded-2xl p-8 shadow-2xl border-2 border-primary-200"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Basic Info */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl">
                              {getCategoryIcon(majorDiseases[featuredIndex].category)}
                              <span className="text-white"></span>
                            </div>
                            <div>
                              <h4 className="bold-28 text-gray-90">{majorDiseases[featuredIndex].name}</h4>
                              <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${majorDiseases[featuredIndex].severityColor} mt-1`}>
                                {majorDiseases[featuredIndex].severity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="regular-16 text-gray-700 mb-6 leading-relaxed border-l-4 border-primary-400 pl-4">
                        {majorDiseases[featuredIndex].description}
                      </p>

                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 border border-primary-200">
                          <p className="text-xs text-gray-500 mb-1">{t('diseases.cases')}</p>
                          <p className="bold-20 text-primary-600">{majorDiseases[featuredIndex].annualCases}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <p className="text-xs text-gray-500 mb-1">{t('diseases.deaths')}</p>
                          <p className="bold-20 text-red-600">{majorDiseases[featuredIndex].deaths}</p>
                        </div>
                      </div>

                      {/* Trend */}
                      <div className={`flex items-center gap-2 px-4 py-3 rounded-lg ${getTrendColor(majorDiseases[featuredIndex].trend)}`}>
                        {getTrendIcon(majorDiseases[featuredIndex].trend)}
                        <span className="font-semibold capitalize">{t('diseases.trend')}: {t(`diseases.${majorDiseases[featuredIndex].trend}`)}</span>
                      </div>
                    </div>

                    {/* Right Column - Detailed Info */}
                    <div className="space-y-6">
                      {/* Transmission */}
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <h5 className="bold-14 text-orange-900 mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          {t('diseases.transmission')}
                        </h5>
                        <p className="regular-14 text-orange-700">{majorDiseases[featuredIndex].transmission}</p>
                      </div>

                      {/* Mortality */}
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <h5 className="bold-14 text-red-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {t('diseases.mortalityRate')}
                        </h5>
                        <p className="regular-14 text-red-700">{majorDiseases[featuredIndex].mortality}</p>
                      </div>

                      {/* Top Affected States */}
                      <div>
                        <h5 className="bold-14 text-gray-90 mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {t('diseases.mostAffectedStates')}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {majorDiseases[featuredIndex].topStates.slice(0, 5).map((state: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium border border-primary-200"
                            >
                              {state}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Learn More Button */}
                      <button
                        onClick={() => {
                          setSelectedDisease(majorDiseases[featuredIndex])
                          setShowModal(true)
                        }}
                        className="w-full py-3 bg-gradient-to-r from-primary-500 to-teal-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
                      >
                        {t('diseases.viewCompleteDetails')}
                      </button>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div className="flex justify-center gap-2 mt-6">
                    {majorDiseases.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setFeaturedIndex(idx)
                          setIsPaused(true)
                        }}
                        className={`h-2 rounded-full transition-all ${
                          idx === featuredIndex ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to disease ${idx + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
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
              {t('diseases.surveillanceData')}
            </h2>
            <p className="regular-16 text-gray-50 max-w-3xl mx-auto">
              {t('diseases.visualAnalysis')}
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
              <h3 className="bold-24 text-gray-90 mb-4">{t('diseases.categoryDistribution')}</h3>
              <p className="text-sm text-gray-50 mb-6">{t('diseases.totalAnnualCases')}</p>
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
              <h3 className="bold-24 text-gray-90 mb-4">{t('diseases.regionalBurden')}</h3>
              <p className="text-sm text-gray-50 mb-6">{t('diseases.totalCasesByRegion')}</p>
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
                href="https://hmis.mohfw.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 mt-4"
              >
                {t('diseases.source')}: {t('diseases.hmisPortal')}
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
            <h3 className="bold-24 text-gray-90 mb-4">{t('diseases.fiveYearTrends')}</h3>
            <p className="text-sm text-gray-50 mb-6">{t('diseases.annualCaseTrends')}</p>
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
              href="https://hmis.mohfw.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 mt-4"
            >
              {t('diseases.source')}: {t('diseases.hmisAndPrograms')}
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
            <h3 className="bold-24 text-gray-90 mb-4">{t('diseases.severityComparison')}</h3>
            <p className="text-sm text-gray-50 mb-6">{t('diseases.comparativeAnalysis')}</p>
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

      {/* Interactive Search and Filter Section */}
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
              {t('diseases.exploreInfo2')}
            </h2>
            <p className="regular-16 text-gray-50 max-w-3xl mx-auto">
              Search by disease name or filter by state to find detailed information
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {
                setActiveTab('search')
                setSelectedState('')
              }}
              className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                {t('diseases.searchByDisease')}
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('filter')
                setSearchQuery('')
              }}
              className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                activeTab === 'filter'
                  ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t('diseases.filterByState')}
              </div>
            </button>
          </div>

          {/* Search/Filter Controls */}
          <div className="max-w-2xl mx-auto mb-12">
            {activeTab === 'search' ? (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('diseases.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:outline-none text-lg bg-white text-gray-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:outline-none text-lg appearance-none bg-white text-gray-900"
                >
                  <option value="">All States</option>
                  {allStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {selectedState && (
                  <button
                    onClick={() => setSelectedState('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              {t('diseases.showing')} <span className="font-bold text-primary-600">{filteredDiseases.length}</span> {t('diseases.of')}{' '}
              <span className="font-bold">{majorDiseases.length}</span> {t('diseases.diseasesText')}
              {selectedState && <span className="text-primary-600"> in {selectedState}</span>}
              {searchQuery && <span className="text-primary-600"> matching "{searchQuery}"</span>}
            </p>
          </div>

          {/* Disease Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredDiseases.map((disease, index) => (
              <motion.div
                key={disease.id}
                className="bg-white rounded-2xl p-8 shadow-xl border border-primary-100 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onClick={() => {
                  setSelectedDisease(disease)
                  setShowModal(true)
                }}
              >
                {/* Disease Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-primary-500 to-teal-500 rounded-lg">
                        {getCategoryIcon(disease.category)}
                        <span className="text-white"></span>
                      </div>
                      <div>
                        <h3 className="bold-24 text-gray-90">{disease.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${disease.severityColor} mt-1`}>
                          {disease.severity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-50">{t('diseases.cases')}:</span>
                        <span className="font-bold text-primary-600">{disease.annualCases}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-50">{t('diseases.deaths')}:</span>
                        <span className="font-bold text-red-600">{disease.deaths}</span>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getTrendColor(disease.trend)}`}>
                        {getTrendIcon(disease.trend)}
                        <span className="text-xs font-semibold capitalize">{t(`diseases.${disease.trend}`)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="regular-16 text-gray-50 mb-6 leading-relaxed border-l-4 border-primary-200 pl-4">
                  {disease.description}
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="bold-14 text-orange-900 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      {t('diseases.transmission')}
                    </h4>
                    <p className="regular-14 text-orange-700 line-clamp-2">{disease.transmission}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="bold-14 text-red-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {t('diseases.mortalityRate')}
                    </h4>
                    <p className="regular-14 text-red-700 line-clamp-2">{disease.mortality}</p>
                  </div>
                </div>

                {/* Top Affected States */}
                <div className="mb-4">
                  <h4 className="bold-14 text-gray-90 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {t('diseases.mostAffectedStates')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {disease.topStates.slice(0, 3).map((state, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium border border-primary-200"
                      >
                        {state}
                      </span>
                    ))}
                    {disease.topStates.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                        +{disease.topStates.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Click to view more */}
                <div className="pt-4 border-t border-gray-200 text-center">
                  <p className="text-sm text-primary-600 font-semibold">
                    {t('diseases.clickToView')} →
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredDiseases.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="bold-24 text-gray-90 mb-2">No diseases found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedState('')
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Disease Detail Modal */}
      <AnimatePresence>
        {showModal && selectedDisease && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-teal-500 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      {getCategoryIcon(selectedDisease.category)}
                    </div>
                    <div>
                      <h2 className="bold-32">{selectedDisease.name}</h2>
                      <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${selectedDisease.severityColor} mt-2`}>
                        {selectedDisease.severity} Severity
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {/* Key Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-primary-50 rounded-xl p-5 border border-primary-200">
                    <p className="text-sm text-gray-600 mb-1">Annual Cases</p>
                    <p className="bold-24 text-primary-600">{selectedDisease.annualCases}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                    <p className="text-sm text-gray-600 mb-1">Annual Deaths</p>
                    <p className="bold-24 text-red-600">{selectedDisease.deaths}</p>
                  </div>
                  <div className={`rounded-xl p-5 border ${getTrendColor(selectedDisease.trend)}`}>
                    <p className="text-sm mb-1">Trend</p>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(selectedDisease.trend)}
                      <p className="bold-20 capitalize">{selectedDisease.trend}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="bold-20 text-gray-90 mb-3">About this Disease</h3>
                  <p className="regular-16 text-gray-700 leading-relaxed border-l-4 border-primary-400 pl-4">
                    {selectedDisease.description}
                  </p>
                </div>

                {/* Symptoms */}
                <div className="mb-8">
                  <h3 className="bold-20 text-gray-90 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-600" />
                    Common Symptoms
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedDisease.symptoms.map((symptom: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
                      >
                        <Check className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transmission & Mortality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <h3 className="bold-18 text-orange-900 mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      How it Spreads
                    </h3>
                    <p className="regular-16 text-orange-700 leading-relaxed">{selectedDisease.transmission}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="bold-18 text-red-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Mortality Rate
                    </h3>
                    <p className="regular-16 text-red-700 leading-relaxed">{selectedDisease.mortality}</p>
                  </div>
                </div>

                {/* Prevention Methods */}
                <div className="mb-8">
                  <h3 className="bold-20 text-gray-90 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Prevention Methods
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedDisease.prevention.map((method: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 px-4 py-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-green-800">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Affected States */}
                <div className="mb-8">
                  <h3 className="bold-20 text-gray-90 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    Most Affected States
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedDisease.topStates.map((state: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold border border-primary-200"
                      >
                        {state}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Data Source */}
                <div className="pt-6 border-t border-gray-200">
                  <a
                    href={selectedDisease.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2 hover:underline"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Data Source: {selectedDisease.source}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {t('diseases.needHelpSymptoms')}
            </h2>
            <p className="regular-18 text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('diseases.symptomAnalyzer')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/get-started">
                <motion.button
                  className="px-10 py-5 bg-white text-primary-600 rounded-xl bold-18 hover:bg-gray-50 transition-all shadow-2xl flex items-center gap-3 justify-center"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Activity className="w-6 h-6" />
                  {t('diseases.analyzeSymptomsNow')}
                </motion.button>
              </Link>
              <Link href="/">
                <motion.button
                  className="px-10 py-5 bg-transparent border-3 border-white text-white rounded-xl bold-18 hover:bg-white hover:text-primary-600 transition-all flex items-center gap-3 justify-center"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-6 h-6" />
                  {t('diseases.backToHome')}
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
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3 mx-auto">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h4 className="bold-18 text-white mb-2">Emergency Helpline</h4>
                <p className="text-sm text-white/80">Call 104 for health emergencies</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3 mx-auto">
                  <Hospital className="w-8 h-8 text-white" />
                </div>
                <h4 className="bold-18 text-white mb-2">Find Hospitals</h4>
                <p className="text-sm text-white/80">Locate nearest healthcare facility</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3 mx-auto">
                  <Pill className="w-8 h-8 text-white" />
                </div>
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
