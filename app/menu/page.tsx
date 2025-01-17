"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

// Menu data interface definitions
interface MenuItem {
  name: string;
  description?: string;
  price: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

// Menu data
const menuSections: MenuSection[] = [
  {
    title: "Carnes a la Parrilla",
    items: [
      { name: "Lomo Fino", description: "Jugoso medallón de lomo fino", price: "S/29.00" },
      { name: "Costillas a la barbacoa", description: "Dos riquísimas costillas bañadas en salsa barbacoa", price: "S/26.00" },
      { name: "Costillas Sol", description: "El especial de casa: Riquísimas costillas bañadas en salsa barbacoa + 1/4 de pollo a la brasa", price: "S/29.00" },
      { name: "Bife", description: "Corte único de res a la parrilla (250g)", price: "S/26.00" },
      { name: "Bife Sol", description: "Corte único de res a la parrilla (250g) + 1/4 de pollo a la brasa", price: "S/32.00" },
      { name: "Chuleta", price: "S/22.00" },
      { name: "Chuletas Sol", description: "1/2 chuleta bañada en salsa barbacoa + 1/4 de pollo a la brasa", price: "S/26.00" },
      { name: "Bistec a la plancha", price: "S/22.00" },
      { name: "Bistec a la parrilla", price: "S/22.00" },
      { name: "Trucha a la Parrilla", price: "S/24.00" },
      { name: "Parrilla gaucha", description: "Pechuga, bistec y chuleta", price: "S/29.00" }
    ]
  },
  {
    title: "Platos Criollos",
    items: [
      { name: "Milanesa de pollo", price: "S/24.00" },
      { name: "Chicharrón de pollo", description: "Con ensalada", price: "S/24.00" },
      { name: "Bistec de carne de res", description: "Con salsa criolla", price: "S/23.00" },
      { name: "Bistec apanado", description: "Con salsa criolla", price: "S/23.00" },
      { name: "Bistec al jugo", description: "Con arroz blanco y papas fritas", price: "S/24.00" },
      { name: "Saltado de pollo", price: "S/22.00" },
      { name: "Lomo saltado", price: "S/22.00" },
      { name: "Lomo saltado mixto", description: "Res y pollo", price: "S/23.00" },
      { name: "Lomo saltado al jugo", price: "S/24.00" },
      { name: "Arroz chaufa de carne", price: "S/22.00" },
      { name: "Arroz chaufa Sol", description: "El especial de casa: chaufa, 1/4 de pollo a la brasa", price: "S/28.00" }
    ]
  },
  {
    title: "Pollos a la Brasa",
    items: [
      { name: "Un Pollo a la brasa", description: "Con papas crocantes, cremas y ensalada", price: "S/72.00" },
      { name: "Un Pollo a la brasa para llevar", description: "Con papas crocantes, cremas, gaseosa de 1.5 litros y ensalada", price: "S/74.00" },
      { name: "Un Pollo a la brasa chaufero", description: "Con papas crocantes, cremas, ensalada y arroz chaufa", price: "S/90.00" },
      { name: "Medio pollo a la brasa", description: "Con papas crocantes, cremas y ensalada", price: "S/37.00" },
      { name: "Un cuarto de pollo a la brasa", description: "Con papas crocantes, cremas y ensalada", price: "S/20.00" },
      { name: "Un octavo de pollo a la brasa", description: "Con papas crocantes, cremas y ensalada", price: "S/18.00" },
      { name: "Pollo a la brasa anticuchero", description: "1/4 de pollo más un palito de anticucho", price: "S/23.00" },
      { name: "Pollo a la brasa criollo", description: "1/4 de pollo y un chorizo", price: "S/22.00" },
      { name: "Pollo a la brasa a la campesina", description: "1/4 de pollo, papas sancochadas, choclo, queso y jamón", price: "S/24.00" }
    ]
  }
];

const MenuPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(menuSections[0].title);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-heading text-primary">
                Sol de Oro
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link href="#menu" className="text-primary transition-colors">
                Menú
              </Link>
              <Link href="/nosotros" className="text-muted-foreground hover:text-primary transition-colors">
                Nosotros
              </Link>
              <Link href="/reservas" className="text-muted-foreground hover:text-primary transition-colors">
                Reservas
              </Link>
              
              <button className="button-primary">
                Ordenar Ahora
              </button>
            </nav>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="text-muted-foreground" size={24} />
              ) : (
                <Menu className="text-muted-foreground" size={24} />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-background border-t border-muted"
          >
            <div className="px-4 py-2 space-y-1">
              <Link href="/" className="block py-2 text-muted-foreground hover:text-primary">
                Inicio
              </Link>
              <Link href="#menu" className="block py-2 text-primary">
                Menú
              </Link>
              <Link href="/nosotros" className="block py-2 text-muted-foreground hover:text-primary">
                Nosotros
              </Link>
              <Link href="/reservas" className="block py-2 text-muted-foreground hover:text-primary">
                Reservas
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Menu Hero Section */}
      <section className="relative pt-20 pb-10 bg-muted/30">
        <div className="absolute inset-0 bg-[url('/texture-overlay.png')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-heading mb-4">
              Nuestro Menú
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestra selección de platos tradicionales y especialidades de la casa
            </p>
          </div>
        </div>
      </section>

      {/* Menu Navigation */}
      <nav className="sticky top-20 bg-background z-40 py-4 border-b border-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {menuSections.map((section) => (
              <button
                key={section.title}
                onClick={() => setActiveSection(section.title)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeSection === section.title
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
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
          {menuSections.map((section) => (
            <div
              key={section.title}
              id={section.title}
              className={activeSection === section.title ? "" : "hidden"}
            >
              <h2 className="text-3xl font-heading mb-8">{section.title}</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-heading mb-2">{item.name}</h3>
                      {item.description && (
                        <p className="text-muted-foreground mb-4">{item.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-bold">{item.price}</span>
                        <button className="button-secondary py-2 px-4">
                          Ordenar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-heading text-primary mb-4">Sol de Oro</h3>
              <p className="text-muted-foreground">
                Tradición gastronómica desde 1975, ofreciendo la mejor experiencia culinaria en Cerro de Pasco.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-heading mb-4">Horario</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Lunes a Domingo</li>
                <li>11:30 AM - 10:00 PM</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-heading mb-4">Contacto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Jr. Hilario Cabrera 120</li>
                <li>Yanacancha, Cerro de Pasco</li>
                <li>Reservas vía Messenger</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Sol de Oro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MenuPage;