'use client'

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import indiaMapImage from './Screenshot 2025-11-08 000448.png';

const IndiaDiseasesAnimation: React.FC = () => {
  const { t } = useLanguage()

  // Major diseases across India with their prevalence
  const diseases = [
    {
      name: "Dengue",
      description: "Mosquito-borne viral infection causing high fever and joint pain, prevalent across India.",
      region: "Pan-India",
      color: "from-red-400 to-orange-500"
    },
    {
      name: "Malaria",
      description: "Parasitic disease transmitted by mosquitoes, affecting millions annually.",
      region: "Endemic States",
      color: "from-yellow-400 to-amber-500"
    },
    {
      name: t('diseases.typhoid'),
      description: t('diseases.typhoidDesc'),
      region: "Urban & Rural",
      color: "from-blue-400 to-cyan-500"
    },
    {
      name: t('diseases.cholera'),
      description: t('diseases.choleraDesc'),
      region: "Coastal & Flood-prone",
      color: "from-teal-400 to-emerald-500"
    },
    {
      name: "Tuberculosis",
      description: "Bacterial infection primarily affecting lungs, major public health concern.",
      region: "All States",
      color: "from-purple-400 to-violet-500"
    },
    {
      name: "Hepatitis",
      description: "Viral liver infection spread through contaminated water and food.",
      region: "High-risk Zones",
      color: "from-pink-400 to-rose-500"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowContent(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % diseases.length);
        setShowContent(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [diseases.length]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[450px] overflow-visible">
      {/* Floating Particles for Ambient Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-primary-300 to-cyan-300"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* India Map Silhouette Background - Using PNG Image with Vibrant Colors */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-[65%] h-[85%]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <Image
            src={indiaMapImage}
            alt="India Map"
            fill
            className="object-contain"
            style={{
              filter: 'hue-rotate(180deg) saturate(1.5) brightness(1.2) opacity(0.85)',
              mixBlendMode: 'multiply'
            }}
          />
        </motion.div>
      </div>

      {/* Pulsing Circles representing disease spread - More Vibrant */}
      <div className="absolute inset-0 flex items-center justify-center z-5">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br ${diseases[currentIndex].color}`}
            style={{
              filter: 'blur(30px)',
              mixBlendMode: 'normal',
            }}
            initial={{ width: 0, height: 0, opacity: 0.4 }}
            animate={{
              width: [0, 220 + i * 90, 440 + i * 110],
              height: [0, 220 + i * 90, 440 + i * 110],
              opacity: [0.4, 0.25, 0]
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              delay: i * 0.9,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Additional Ambient Glow */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <motion.div
          className={`absolute rounded-full bg-gradient-to-br ${diseases[currentIndex].color} opacity-20`}
          style={{
            filter: 'blur(60px)',
            width: '350px',
            height: '350px',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Central Disease Information */}
      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            key={currentIndex}
            className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Disease Name with Gradient - Enhanced */}
            <motion.div
              className={`mb-4 px-8 py-3 rounded-full bg-gradient-to-r ${diseases[currentIndex].color} shadow-2xl`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              style={{
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 0 30px rgba(59, 130, 246, 0.3)'
              }}
            >
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                {diseases[currentIndex].name}
              </h2>
            </motion.div>

            {/* Region Badge - More Vibrant */}
            <motion.div
              className="mb-3 px-4 py-1 bg-gradient-to-r from-white/80 to-primary-50/80 backdrop-blur-md rounded-full border-2 border-primary-300/60 shadow-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">
                📍 {diseases[currentIndex].region}
              </span>
            </motion.div>

            {/* Description - Glass Morphism Enhanced */}
            <motion.p
              className="text-gray-800 text-base leading-relaxed bg-gradient-to-br from-white/70 via-white/60 to-primary-50/50 backdrop-blur-lg p-5 rounded-2xl shadow-xl border border-white/60"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
              }}
            >
              {diseases[currentIndex].description}
            </motion.p>

            {/* Progress Indicators */}
            <motion.div
              className="flex gap-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {diseases.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? `w-8 bg-gradient-to-r ${diseases[currentIndex].color}`
                      : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Elements - Disease Icons with Enhanced Visibility */}
      <div className="absolute top-16 left-16 opacity-25 z-5">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.15, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="text-5xl drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' }}
        >
          🦠
        </motion.div>
      </div>
      <div className="absolute bottom-16 right-16 opacity-25 z-5">
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="text-5xl drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(14, 165, 233, 0.3))' }}
        >
          🏥
        </motion.div>
      </div>
      <div className="absolute top-1/4 right-24 opacity-25 z-5">
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-4xl drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(6, 182, 212, 0.3))' }}
        >
          💉
        </motion.div>
      </div>
      <div className="absolute bottom-1/3 left-24 opacity-25 z-5">
        <motion.div
          animate={{
            y: [0, 12, 0],
            x: [0, -8, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-4xl drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(34, 211, 238, 0.3))' }}
        >
          🩺
        </motion.div>
      </div>
    </div>
  );
};

export default IndiaDiseasesAnimation;

