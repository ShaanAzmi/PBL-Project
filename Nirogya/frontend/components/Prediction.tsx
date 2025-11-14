'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FlaskConical, AlertTriangle, Bug, Target, Sparkles, Lightbulb, Calendar } from 'lucide-react'

interface MLPredictionResponse {
  predicted_cases: number
  confidence_interval_lower: number
  confidence_interval_upper: number
  region: string
  disease: string
  prediction_date: string
  model_version: string
}

const Prediction = () => {
  // ML Model V2 state
  const [mlFormData, setMlFormData] = useState({
    region: '',
    disease: '',
    last_14_days_cases: Array(7).fill(0)
  })
  const [availableRegions, setAvailableRegions] = useState<string[]>([])
  const [availableDiseases, setAvailableDiseases] = useState<string[]>([])
  const [mlPrediction, setMlPrediction] = useState<MLPredictionResponse | null>(null)

  const [isMlLoading, setIsMlLoading] = useState(false)
  const [mlError, setMlError] = useState<string | null>(null)

  // Fetch available regions and diseases on component mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [regionsRes, diseasesRes] = await Promise.all([
          axios.get('http://localhost:8000/regions'),
          axios.get('http://localhost:8000/diseases')
        ])
        setAvailableRegions(regionsRes.data.regions || [])
        setAvailableDiseases(diseasesRes.data.diseases || [])

        // Set default values
        if (regionsRes.data.regions?.length > 0) {
          setMlFormData(prev => ({ ...prev, region: regionsRes.data.regions[0] }))
        }
        if (diseasesRes.data.diseases?.length > 0) {
          setMlFormData(prev => ({ ...prev, disease: diseasesRes.data.diseases[0] }))
        }
      } catch (err) {
        console.error('Error fetching metadata:', err)
      }
    }
    fetchMetadata()
  }, [])

  const handleMlChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMlFormData({ ...mlFormData, [name]: value })
  }

  const handleDayChange = (index: number, value: string) => {
    const newCases = [...mlFormData.last_14_days_cases]
    newCases[index] = parseFloat(value) || 0
    setMlFormData({ ...mlFormData, last_14_days_cases: newCases })
  }

  const handleMlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsMlLoading(true)
    setMlError(null)
    setMlPrediction(null)

    try {
      const response = await axios.post('http://localhost:8000/predict', {
        region: mlFormData.region,
        disease: mlFormData.disease,
        last_14_days_cases: mlFormData.last_14_days_cases
      })
      setMlPrediction(response.data)
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setMlError(err.response.data.detail)
      } else if (err.code === 'ECONNREFUSED') {
        setMlError('ML Model API server is not running. Please start the server on port 8000.')
      } else {
        setMlError('Error occurred while making ML prediction')
      }
      console.error('ML Prediction error:', err)
    } finally {
      setIsMlLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="bold-28 text-gray-90">Disease Outbreak Prediction</h2>
        </div>
        <p className="text-gray-60 regular-14 ml-14">
          Predict future disease outbreaks using advanced AI models and historical data
        </p>
      </div>

      {/* ML Model V2 Form */}
      <form onSubmit={handleMlSubmit} className="space-y-6">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-500 p-5 rounded-r-xl">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-90 mb-1">How it works</h4>
                <p className="text-sm text-gray-70">
                  Our advanced LSTM AI model analyzes 7 days of historical case data to predict the next day's outbreak cases with 95% confidence intervals. Simply select a region and disease, enter the case data, and get instant predictions!
                </p>
              </div>
            </div>
          </div>

          {/* Step 1: Select Location and Disease */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border-2 border-cyan-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="bold-20 text-gray-90">Select Location & Disease</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-80 mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Region (State & District)
                </label>
                <select
                  name="region"
                  value={mlFormData.region}
                  onChange={handleMlChange}
                  required
                  className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-medium"
                >
                  <option value="">Choose a region...</option>
                  {availableRegions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {availableRegions.length} regions across India available
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-80 mb-2">
                  <Bug className="w-4 h-4" />
                  Disease Type
                </label>
                <select
                  name="disease"
                  value={mlFormData.disease}
                  onChange={handleMlChange}
                  required
                  className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-medium"
                >
                  <option value="">Choose a disease...</option>
                  {availableDiseases.map((disease) => (
                    <option key={disease} value={disease}>{disease}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {availableDiseases.length} diseases tracked
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Enter Historical Data */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="bold-20 text-gray-90">Enter 7-Day Historical Data</h3>
            </div>
            <p className="text-sm text-gray-700 mb-5 ml-10">
              Enter the number of reported cases for each of the past 7 days. <span className="font-semibold">Day 1 = oldest</span>, <span className="font-semibold">Day 7 = most recent</span>.
            </p>

            {/* Past Week */}
            <div className="mb-4 ml-10">
              <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Past Week</div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {mlFormData.last_14_days_cases.map((cases, index) => (
                  <div key={index} className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Day {index + 1}</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={cases}
                      onChange={(e) => handleDayChange(index, e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 text-center font-semibold bg-white rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Fill Helper */}
            <div className="mt-5 ml-10 p-3 bg-white/60 rounded-lg border border-blue-300">
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <Lightbulb className="w-3 h-3" />
                <span><span className="font-semibold">Tip:</span> You can use Tab key to quickly move between fields. Enter 0 if no cases were reported on that day.</span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isMlLoading}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                isMlLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
              } text-white`}
            >
              {isMlLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Data...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Get AI Prediction
                </span>
              )}
            </button>
          </div>
        </form>

      {/* ML Model Error Display */}
      {mlError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            ML Prediction Error
          </p>
          <p className="text-red-500 text-sm mt-1">{mlError}</p>
        </div>
      )}

      {/* ML Model V2 Prediction Results */}
      {mlPrediction && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="bold-24">Prediction Complete!</h2>
                  <p className="text-sm text-green-100">AI analysis successfully generated</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-100">Prediction Date</p>
                <p className="font-semibold flex items-center gap-1 justify-end">
                  <Calendar className="w-4 h-4" />
                  {mlPrediction.prediction_date}
                </p>
              </div>
            </div>
          </div>

          {/* Main Results Card */}
          <div className="bg-white border-2 border-green-300 rounded-b-2xl shadow-xl p-8">
            {/* Location & Disease Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-5 rounded-xl border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <h4 className="font-semibold text-gray-700">Region</h4>
                </div>
                <p className="bold-18 text-cyan-700">{mlPrediction.region}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-700">Disease</h4>
                </div>
                <p className="bold-18 text-purple-700">{mlPrediction.disease}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-700">AI Model</h4>
                </div>
                <p className="bold-16 text-blue-700">{mlPrediction.model_version}</p>
              </div>
            </div>

            {/* Main Prediction Display */}
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8 rounded-2xl border-2 border-cyan-300 mb-6">
              <div className="text-center mb-6">
                <h3 className="bold-24 text-gray-90 mb-2 flex items-center justify-center gap-2">
                  <Target className="w-6 h-6 text-cyan-600" />
                  Next Day Outbreak Prediction
                </h3>
                <p className="text-sm text-gray-600">Based on 14-day historical trend analysis</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Lower Bound */}
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-200">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Minimum Expected</p>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <p className="bold-32 text-blue-600">
                        {Math.round(mlPrediction.confidence_interval_lower)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">cases (95% CI)</p>
                  </div>
                </div>

                {/* Predicted Cases */}
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-xl shadow-lg border-2 border-cyan-400 transform scale-105">
                  <div className="text-center text-white">
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-cyan-100">Most Likely</p>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Target className="w-6 h-6" />
                      <p className="bold-40">
                        {Math.round(mlPrediction.predicted_cases)}
                      </p>
                    </div>
                    <p className="text-sm">PREDICTED CASES</p>
                  </div>
                </div>

                {/* Upper Bound */}
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-red-200">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Maximum Expected</p>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <p className="bold-32 text-red-600">
                        {Math.round(mlPrediction.confidence_interval_upper)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">cases (95% CI)</p>
                  </div>
                </div>
              </div>

              {/* Confidence Interval Explanation */}
              <div className="mt-6 p-5 bg-white/80 rounded-xl border border-cyan-200">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-90 mb-1">Understanding the Prediction</h4>
                    <p className="text-sm text-gray-700">
                      The AI model predicts <span className="font-bold text-cyan-700">{Math.round(mlPrediction.predicted_cases)} cases</span> for tomorrow.
                      With 95% confidence, the actual number will be between{' '}
                      <span className="font-bold text-blue-600">{Math.round(mlPrediction.confidence_interval_lower)}</span> and{' '}
                      <span className="font-bold text-red-600">{Math.round(mlPrediction.confidence_interval_upper)}</span> cases.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Information */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <FlaskConical className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-90 mb-2">About the AI Model</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This prediction uses the <span className="font-semibold">ImprovedDiseaseLSTM V2</span> model with 4.2M parameters,
                    featuring a 5-layer bidirectional LSTM architecture with multi-head attention. The model was trained on 16+ years
                    of IDSP outbreak data covering <span className="font-semibold">985 regions</span> and{' '}
                    <span className="font-semibold">129 diseases</span> across India, achieving 81% error reduction compared to previous models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Prediction

