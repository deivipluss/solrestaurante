"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  Globe,
  ChevronDown,
  Clock,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import Image from "next/image";

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
    image: "/pollo-brasa.jpg",
    price: "S/. 65.00",
    portion: "1 Pollo Entero",
  },
  {
    name: "Lomo Saltado Premium",
    description: "Tradicional platillo peruano con cortes selectos",
    image: "/lomo-saltado.jpg",
    price: "S/. 38.00",
    portion: "Porción Personal",
  },
  {
    name: "Arroz Chaufa Especial",
    description: "Tres sabores: pollo, carne y chancho",
    image: "images/chaufa.jpg",
    price: "S/. 42.00",
    portion: "Para Compartir",
  },
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const headerBg = useTransform(
    scrollYProgress,
    [0, 0.2],
    ["rgba(10, 10, 10, 0.8)", "rgba(10, 10, 10, 0.95)"]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        style={{ backgroundColor: headerBg }}
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-heading text-primary">
                Sol de Oro
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-muted-foreground hover:text-primary transition-colors">
                Inicio
              </a>
              <a href="#menu" className="text-muted-foreground hover:text-primary transition-colors">
                Menú
              </a>
              <a href="#nosotros" className="text-muted-foreground hover:text-primary transition-colors">
                Nosotros
              </a>
              <a href="#reservas" className="text-muted-foreground hover:text-primary transition-colors">
                Reservas
              </a>
              
              <div className="relative group">
                <button className="flex items-center space-x-1 text-muted-foreground">
                  <Globe size={20} />
                  <span>ES</span>
                  <ChevronDown size={16} />
                </button>
              </div>

              <button className="p-2 rounded-full hover:bg-muted/10">
                <ShoppingCart className="text-muted-foreground" size={24} />
              </button>

              <button className="button-primary">
                Reservar
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
              <a href="#inicio" className="block py-2 text-muted-foreground hover:text-primary">
                Inicio
              </a>
              <a href="#menu" className="block py-2 text-muted-foreground hover:text-primary">
                Menú
              </a>
              <a href="#nosotros" className="block py-2 text-muted-foreground hover:text-primary">
                Nosotros
              </a>
              <a href="#reservas" className="block py-2 text-muted-foreground hover:text-primary">
                Reservas
              </a>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20">
        <div className="absolute inset-0 bg-[url('/texture-overlay.png')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-80px)]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-heading">
                Tradición y Sabor
                <span className="text-primary block mt-2">Desde 1975</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Maestros del Pollo a la Brasa y Cortes Premium en Cerro de Pasco
              </p>
              
              <div className="flex items-center space-x-2">
                <div className="flex text-primary">
                  {Array(5).fill(null).map((_, i) => (
                    <Star key={i} fill="currentColor" size={20} />
                  ))}
                </div>
                <span className="text-muted-foreground">4.8/5 basado en 1000+ reseñas</span>
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
              className="relative h-[500px] rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent z-10" />
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

      {/* Featured Dishes */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading mb-4">Nuestras Especialidades</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-heading mb-2">{dish.name}</h3>
                  <p className="text-muted-foreground mb-4">{dish.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-primary font-bold">{dish.price}</p>
                      <p className="text-sm text-muted-foreground">{dish.portion}</p>
                    </div>
                    <button className="button-secondary py-2">
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
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-heading">Nuestra Historia</h2>
              <p className="text-muted-foreground">
                Desde 1975, Sol de Oro ha sido sinónimo de excelencia culinaria en Cerro de Pasco.
                Nuestro compromiso con la calidad y la tradición nos ha convertido en un ícono
                gastronómico de la región.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-heading text-primary">40+</p>
                  <p className="text-muted-foreground">Años de Experiencia</p>
                </div>
                <div>
                  <p className="text-3xl font-heading text-primary">1M+</p>
                  <p className="text-muted-foreground">Clientes Satisfechos</p>
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
                src="/restaurant-interior.jpg"
                alt="Interior del Restaurante"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading mb-4">Lo Que Dicen Nuestros Clientes</h2>
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
                  <p className="text-xl mb-6">{testimonial.text}</p>
                  <div className="flex justify-center space-x-1 mb-4">
                    {Array(testimonial.rating).fill(null).map((_, i) => (
                      <Star key={i} className="text-primary" fill="currentColor" size={20} />
                    ))}
                  </div>
                  <p className="font-heading text-lg">{testimonial.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-heading">Contáctanos</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="text-primary" size={24} />
                  <p className="text-muted-foreground">
                    Jr. Hilario Cabrera 120, Yanacancha, Cerro de Pasco
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="text-primary" size={24} />
                  <p className="text-muted-foreground">
                    Lunes a Domingo: 11:30 AM - 10:00 PM
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="text-primary" size={24} />
                  <p className="text-muted-foreground">
                    Reservas vía Messenger
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-card border border-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg bg-card border border-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Mensaje
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-card border border-muted focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <button type="submit" className="button-primary w-full">
                Enviar Mensaje
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading mb-4">Haz tu Reserva</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reserva tu mesa y disfruta de una experiencia gastronómica única
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-card rounded-xl shadow-lg p-8"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg bg-card border border-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 rounded-lg bg-card border border-muted focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Personas
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-card border border-muted focus:border-primary focus:ring-1 focus:ring-primary">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Persona' : 'Personas'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Ocasión
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-card border border-muted focus:border-primary focus:ring-1 focus:ring-primary">
                    <option value="regular">Regular</option>
                    <option value="cumpleanos">Cumpleaños</option>
                    <option value="aniversario">Aniversario</option>
                    <option value="negocios">Reunión de Negocios</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Solicitudes Especiales
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-card border border-muted focus:border-primary focus:ring-1 focus:ring-primary"
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

export default HomePage;