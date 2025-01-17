"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Star, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { menuSections } from './data';
import { MenuItem } from './types';

const MenuPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(menuSections[0].title);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSections, setFilteredSections] = useState(menuSections);

  // Manejar búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = menuSections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(section => section.items.length > 0);
      setFilteredSections(filtered);
    } else {
      setFilteredSections(menuSections);
    }
  }, [searchTerm]);

  const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="relative h-48 w-full">
        <Image
          src={item.image || "/api/placeholder/400/300"}
          alt={item.name}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {item.popular && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star size={12} />
            Popular
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.name}</h3>
        {item.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold text-lg">{item.price}</span>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Ordenar
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/api/placeholder/40/40" 
                alt="Sol de Oro Logo" 
                width={40} 
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-primary">Sol de Oro</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link href="#menu" className="text-primary font-medium">
                Menú
              </Link>
              <Link href="/nosotros" className="text-gray-600 hover:text-primary transition-colors">
                Nosotros
              </Link>
              <Link href="/reservas" className="text-gray-600 hover:text-primary transition-colors">
                Reservas
              </Link>
              
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Ordenar Ahora
              </button>
            </nav>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-2 space-y-1">
                <Link href="/" className="block py-2 text-gray-600 hover:text-primary">
                  Inicio
                </Link>
                <Link href="#menu" className="block py-2 text-primary font-medium">
                  Menú
                </Link>
                <Link href="/nosotros" className="block py-2 text-gray-600 hover:text-primary">
                  Nosotros
                </Link>
                <Link href="/reservas" className="block py-2 text-gray-600 hover:text-primary">
                  Reservas
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Nuestro Menú
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra selección de platos tradicionales y especialidades de la casa
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar platos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-16 bg-white z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
            {filteredSections.map((section) => (
              <button
                key={section.title}
                onClick={() => setActiveSection(section.title)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeSection === section.title
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Menu Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {filteredSections.map((section) => (
              <div
                key={section.title}
                className={activeSection === section.title ? "" : "hidden"}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{section.title}</h2>
                  {section.description && (
                    <p className="text-gray-600">{section.description}</p>
                  )}
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item) => (
                    <MenuCard key={item.name} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Sol de Oro</h3>
              <p className="text-gray-600">
                Tradición gastronómica desde 1975, ofreciendo la mejor experiencia culinaria en Cerro de Pasco.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Horario</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Lunes a Domingo</li>
                <li>11:30 AM - 10:00 PM</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Jr. Hilario Cabrera 120</li>
                <li>Yanacancha, Cerro de Pasco</li>
                <li>Reservas vía Messenger</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Sol de Oro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MenuPage;