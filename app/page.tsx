"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, ShoppingCart, Globe, ChevronDown } from "lucide-react";
import Image from "next/image";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  const headerBg = useTransform(
    scrollYProgress,
    [0, 0.2],
    ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.95)"]
  );

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        style={{ backgroundColor: headerBg }}
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">
                Sol de Oro
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-secondary hover:text-primary transition-colors">
                Inicio
              </a>
              <a href="#menu" className="text-secondary hover:text-primary transition-colors">
                Menú
              </a>
              <a href="#nosotros" className="text-secondary hover:text-primary transition-colors">
                Nosotros
              </a>
              <a href="#reservas" className="text-secondary hover:text-primary transition-colors">
                Reservas
              </a>
              
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-secondary">
                  <Globe size={20} />
                  <span>ES</span>
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Cart */}
              <button className="p-2 rounded-full hover:bg-gray-100">
                <ShoppingCart className="text-secondary" size={24} />
              </button>

              {/* Reservation Button */}
              <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">
                Reservar
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-2 space-y-1">
              <a href="#inicio" className="block py-2 text-secondary hover:text-primary">
                Inicio
              </a>
              <a href="#menu" className="block py-2 text-secondary hover:text-primary">
                Menú
              </a>
              <a href="#nosotros" className="block py-2 text-secondary hover:text-primary">
                Nosotros
              </a>
              <a href="#reservas" className="block py-2 text-secondary hover:text-primary">
                Reservas
              </a>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-80px)]">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-secondary">
                Tradición y Sabor
                <span className="text-primary block">Desde 1975</span>
              </h1>
              <p className="text-xl text-gray-600">
                Maestros del Pollo a la Brasa y Cortes Premium
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex text-primary">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
                <span className="text-gray-600">4.8/5 basado en 1000+ reseñas</span>
              </div>

              {/* CTAs */}
              <div className="flex space-x-4">
                <button className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-all transform hover:scale-105">
                  Reservar Mesa
                </button>
                <button className="border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-105">
                  Ordenar Ahora
                </button>
              </div>
            </motion.div>

            {/* Right Content - Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-[500px] rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
              <Image
                src="/hero-image.jpg"
                alt="Plato Estrella"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;