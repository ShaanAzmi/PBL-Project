'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Phone, Mail, MapPin, FileText, Calendar, Clock, Edit, Plus, X, Save } from 'lucide-react'

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

const PatientRecords = () => {
  const [patients, setPatients] = useState<PatientData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPatient, setNewPatient] = useState<Partial<PatientData>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    symptoms: '',
    status: 'incoming'
  })

  // Load patients from localStorage
  useEffect(() => {
    const storedPatients = localStorage.getItem('patientRecords')
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients))
    }
  }, [])

  // Save patients to localStorage
  const savePatients = (updatedPatients: PatientData[]) => {
    localStorage.setItem('patientRecords', JSON.stringify(updatedPatients))
    setPatients(updatedPatients)
  }

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Update patient status
  const updatePatientStatus = (patientId: string, newStatus: PatientData['status']) => {
    const updatedPatients = patients.map(p =>
      p.id === patientId ? { ...p, status: newStatus } : p
    )
    savePatients(updatedPatients)
  }

  // Save edited patient
  const saveEditedPatient = () => {
    if (editingPatient) {
      const updatedPatients = patients.map(p =>
        p.id === editingPatient.id ? editingPatient : p
      )
      savePatients(updatedPatients)
      setEditingPatient(null)
    }
  }

  // Add new patient
  const addNewPatient = () => {
    if (newPatient.name && newPatient.phone && newPatient.symptoms) {
      const patient: PatientData = {
        name: newPatient.name,
        phone: newPatient.phone,
        email: newPatient.email || '',
        address: newPatient.address || '',
        symptoms: newPatient.symptoms,
        status: newPatient.status as PatientData['status'] || 'incoming',
        submittedAt: new Date().toISOString(),
        id: `PAT-${Date.now()}`
      }
      savePatients([...patients, patient])
      setNewPatient({
        name: '',
        phone: '',
        email: '',
        address: '',
        symptoms: '',
        status: 'incoming'
      })
      setShowAddModal(false)
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'incoming':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="bold-24 text-gray-90">Patient Records</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, phone, email, or symptoms..."
          className="flex-1 px-4 py-3 bg-gray-10 rounded-lg border-2 border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white rounded-lg border-2 border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
        >
          <option value="all">All Status</option>
          <option value="incoming">Incoming</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center border-2 border-blue-200">
          <div className="bold-20 text-blue-600">{patients.filter(p => p.status === 'incoming').length}</div>
          <div className="text-sm text-gray-700 font-medium">Incoming</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center border-2 border-yellow-200">
          <div className="bold-20 text-yellow-600">{patients.filter(p => p.status === 'in-progress').length}</div>
          <div className="text-sm text-gray-700 font-medium">In Progress</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
          <div className="bold-20 text-green-600">{patients.filter(p => p.status === 'completed').length}</div>
          <div className="text-sm text-gray-700 font-medium">Completed</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center border-2 border-purple-200">
          <div className="bold-20 text-purple-600">{patients.length}</div>
          <div className="text-sm text-gray-700 font-medium">Total</div>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No patients found</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <motion.div
              key={patient.id}
              className="border-2 border-gray-200 rounded-xl p-6 hover:border-cyan-300 hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              {/* Status Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <User className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="bold-18 text-gray-90">{patient.name}</h3>
                    <p className="text-sm text-gray-500">ID: {patient.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={patient.status}
                    onChange={(e) => updatePatientStatus(patient.id, e.target.value as PatientData['status'])}
                    className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(patient.status)} cursor-pointer`}
                  >
                    <option value="incoming">Incoming</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => setEditingPatient(patient)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Patient Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{patient.phone}</span>
                </div>
                {patient.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{patient.email}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{patient.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{formatDate(patient.submittedAt)}</span>
                </div>
              </div>

              {/* Symptoms */}
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="w-4 h-4 text-cyan-600 mt-1" />
                  <span className="font-semibold text-gray-900 text-sm">Symptoms:</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed pl-6">{patient.symptoms}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingPatient && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingPatient(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="bold-24 text-gray-90">Edit Patient</h3>
                <button
                  onClick={() => setEditingPatient(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editingPatient.name}
                    onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editingPatient.phone}
                    onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingPatient.email}
                    onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={editingPatient.address}
                    onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Symptoms</label>
                  <textarea
                    value={editingPatient.symptoms}
                    onChange={(e) => setEditingPatient({ ...editingPatient, symptoms: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={saveEditedPatient}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingPatient(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="bold-24 text-gray-90">Add New Patient</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Symptoms *</label>
                  <textarea
                    value={newPatient.symptoms}
                    onChange={(e) => setNewPatient({ ...newPatient, symptoms: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none resize-none"
                    placeholder="Describe symptoms..."
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Initial Status</label>
                  <select
                    value={newPatient.status}
                    onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value as PatientData['status'] })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="incoming">Incoming</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={addNewPatient}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Patient
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PatientRecords

