'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { Shield, BarChart3, Hospital } from 'lucide-react'

const About = () => {
  const { t } = useLanguage()

  return (
    <section className="bg-white py-20">
      <div className="max-container padding-container">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="bold-40 lg:bold-52 mb-6 text-gray-90 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('about.title')}
          </motion.h2>
          <motion.p
            className="regular-16 text-gray-50 mb-6 leading-relaxed text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('about.description1')}
          </motion.p>
          <motion.p
            className="regular-16 text-gray-50 mb-8 leading-relaxed text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {t('about.description2')}
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <motion.div
              className="flex flex-col items-center gap-3 bg-success-50 p-6 rounded-xl border border-success-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-success-700" />
              </div>
              <span className="regular-14 text-gray-90 font-medium text-center">{t('tabs.prevention')}</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-3 bg-primary-50 p-6 rounded-xl border border-primary-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-700" />
              </div>
              <span className="regular-14 text-gray-90 font-medium text-center">{t('about.realTimeMonitoring')}</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-3 bg-accent-50 p-6 rounded-xl border border-accent-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <Hospital className="w-6 h-6 text-accent-700" />
              </div>
              <span className="regular-14 text-gray-90 font-medium text-center">{t('about.aiHealthAssistant')}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
