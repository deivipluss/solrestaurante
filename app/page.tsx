"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Star } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

const testimonials = [
  {
    name: "Carlos Ramírez",
    text: "El mejor pollo a la brasa de Cerro de Pasco. La atención es excelente.",
    rating: 5,
  },
  {
    name: "María González",
    text: "Ambiente familiar y platillos deliciosos. El arroz chaufa es espectacular.",
    rating: 5,
  },
  {
    name: "Jorge Mendoza",
    text: "Lugar ideal para reuniones de negocios. La calidad es constante.",
    rating: 4,
  },
];

const featuredDishes = [
  {
    name: "Pollo a la Brasa",
    description: "Nuestro plato estrella, marinado con especias secretas",
    image: "/images/pollo-brasa.jpg",
    price: "S/. 65.00",
    portion: "1 Pollo Entero",
  },
  {
    name: "Lomo Saltado Premium",
    description: "Tradicional platillo peruano con cortes selectos",
    image: "/images/lomo-saltado.jpg",
    price: "S/. 38.00",
    portion: "Porción Personal",
  },
  {
    name: "Arroz Chaufa Especial",
    description: "Tres sabores: pollo, carne y chancho",
    image: "/images/chaufa.jpg",
    price: "S/. 42.00",
    portion: "Para Compartir",
  },
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-heading text-primary">
                Sol de Oro
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8 main-menu">
              {['Inicio', 'Menú', 'Nosotros', 'Reservas'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              ))}
              <button className="button-primary">
                Reservar
              </button>
            </nav>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="text-gray-600" size={24} />
              ) : (
                <Menu className="text-gray-600" size={24} />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-2 space-y-1">
              {['Inicio', 'Menú', 'Nosotros', 'Reservas'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block py-2 text-gray-600 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-24 pb-12 bg-gradient-soft-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-6rem)]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Tradición y Sabor
                <span className="text-primary block mt-2">Desde 1975</span>
              </h1>
              <p className="text-xl text-gray-600">
                Maestros del Pollo a la Brasa y Cortes Premium en Cerro de Pasco
              </p>

              <div className="flex items-center space-x-2">
                <div className="flex text-primary">
                  {Array(5).fill(null).map((_, i) => (
                    <Star key={i} fill="currentColor" size={20} />
                  ))}
                </div>
                <span className="text-gray-600">4.8/5 basado en 1000+ reseñas</span>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="button-primary">
                  Reservar Mesa
                </button>
                <button className="button-secondary">
                  Ordenar Ahora
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-[500px] rounded-2xl overflow-hidden hidden md:block"
            >
              <Image
                src="/images/hero-image.jpg"
                alt="Plato Estrella"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Nuestras Especialidades</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre los sabores que nos han hecho famosos por casi 40 años
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredDishes.map((dish, index) => (
              <motion.div
                key={dish.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={dish.image || "/placeholder.svg"}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 dish-title">{dish.name}</h3>
                  <p className="text-gray-600 mb-4">{dish.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-primary font-bold">{dish.price}</p>
                      <p className="text-sm text-gray-500">{dish.portion}</p>
                    </div>
                    <button className="button-secondary">
                      Ordenar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-soft-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">Nuestra Historia</h2>
              <p className="text-xl text-gray-600">
                Desde 1975, Sol de Oro ha sido sinónimo de excelencia culinaria en Cerro de Pasco.
                Nuestro compromiso con la calidad y la tradición nos ha convertido en un ícono
                gastronómico de la región.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-primary">40+</p>
                  <p className="text-gray-600">Años de Experiencia</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">1M+</p>
                  <p className="text-gray-600">Clientes Satisfechos</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-xl overflow-hidden"
            >
              <Image
                src="/images/restaurant-interior.jpg"
                alt="Interior del Restaurante"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Lo Que Dicen Nuestros Clientes</h2>
          </motion.div>

          <div className="relative h-[200px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeTestimonial === index ? 1 : 0,
                  x: activeTestimonial === index ? 0 : 20,
                }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
                style={{ display: activeTestimonial === index ? 'block' : 'none' }}
              >
                <div className="max-w-2xl mx-auto text-center">
                  <p className="text-xl mb-6 text-gray-600">{testimonial.text}</p>
                  <div className="flex justify-center space-x-1 mb-4">
                    {Array(testimonial.rating).fill(null).map((_, i) => (
                      <Star key={i} className="text-primary" fill="currentColor" size={20} />
                    ))}
                  </div>
                  <p className="font-bold text-lg text-gray-900">{testimonial.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section className="py-24 bg-gradient-soft-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Haz tu Reserva</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reserva tu mesa y disfruta de una experiencia gastronómica única
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Personas
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Persona' : 'Personas'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Ocasión
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary">
                    <option value="regular">Regular</option>
                    <option value="cumpleanos">Cumpleaños</option>
                    <option value="aniversario">Aniversario</option>
                    <option value="negocios">Reunión de Negocios</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Solicitudes Especiales
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <button type="submit" className="button-primary w-full">
                Confirmar Reserva
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Sol de Oro</h3>
              <p className="text-gray-600">
                Tradición gastronómica desde 1975, ofreciendo la mejor experiencia culinaria en Cerro de Pasco.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Horario</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Lunes a Domingo</li>
                <li>11:30 AM - 10:00 PM</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Contacto</h4>
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

export default HomePage;

