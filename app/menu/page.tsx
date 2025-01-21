"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Menu, X, Star, Search, MapPin, Clock, Phone, Instagram, Facebook, Quote } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { menuSections } from "./data"
import type { MenuCardProps, MenuSection, TestimonialProps } from "./types"

const MenuCard: React.FC<MenuCardProps> = ({ item }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
  >
    <div className="relative h-48 w-full">
      <Image
        src={item.image || "/api/placeholder/400/300"}
        alt={item.name}
        className="object-cover"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={item.popular}
      />
      {item.popular && (
        <motion.div
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"
        >
          <Star size={12} className="text-amber-900" />
          Popular
        </motion.div>
      )}
    </div>
    <div className="p-6">
      <h3 className="text-xl font-heading font-bold mb-2 text-gray-900 line-clamp-1">{item.name}</h3>
      {item.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <span className="text-amber-700 font-bold text-lg">{item.price}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-yellow-600 transition-all shadow-md"
          onClick={() => console.log(`Ordenar ${item.name}`)}
        >
          Ordenar
        </motion.button>
      </div>
    </div>
  </motion.div>
)

const FeaturedCategory: React.FC<{ title: string; image: string; onClick: () => void }> = ({
  title,
  image,
  onClick,
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative h-48 md:h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer"
    onClick={onClick}
  >
    <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
      <h3 className="text-white text-2xl font-bold">{title}</h3>
    </div>
  </motion.div>
)

const Testimonial: React.FC<TestimonialProps> = ({ text, author }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
  >
    <Quote className="text-amber-500 mb-4" size={32} />
    <p className="text-gray-700 mb-4 italic">{text}</p>
    <p className="text-amber-700 font-semibold">{author}</p>
  </motion.div>
)

const MenuPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [activeSection, setActiveSection] = useState<string>(menuSections[0].title)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredSections, setFilteredSections] = useState<MenuSection[]>(menuSections)
  const menuSectionRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const chefRecommendationsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const filtered = menuSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      }))
      .filter((section) => section.items.length > 0)
    setFilteredSections(filtered)

    if (filtered.length > 0 && !filtered.some((section) => section.title === activeSection)) {
      setActiveSection(filtered[0].title)
    }
  }, [searchTerm, activeSection])

  useEffect(() => {
    const handleScroll = () => {
      if (menuSectionRef.current && categoryRef.current) {
        const menuBottom = menuSectionRef.current.getBoundingClientRect().bottom
        const headerHeight = 80 // altura del header
        categoryRef.current.style.position = menuBottom > headerHeight ? "sticky" : "relative"
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionTitle: string) => {
    setActiveSection(sectionTitle)
    const sectionElement = document.getElementById(sectionTitle)
    if (sectionElement && menuSectionRef.current) {
      const categoryHeight = categoryRef.current?.offsetHeight || 0
      const headerHeight = 80 // altura del header
      const offset = headerHeight + categoryHeight

      const y = sectionElement.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src="/api/placeholder/40/40"
                  alt="Sol de Oro Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                  priority
                />
              </motion.div>
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-amber-700 to-yellow-600 bg-clip-text text-transparent">
                Sol de Oro
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {["Inicio", "Menú", "Nosotros", "Reservas"].map((item) => (
                <Link
                  key={item}
                  href={item === "Menú" ? "#menu" : `/${item.toLowerCase()}`}
                  className={`${
                    item === "Menú" ? "text-amber-700 font-medium" : "text-gray-600 hover:text-amber-600"
                  } transition-colors`}
                >
                  {item}
                </Link>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-yellow-600 transition-all shadow-md"
              >
                Ordenar Ahora
              </motion.button>
            </nav>

            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-2 space-y-1">
              {["Inicio", "Menú", "Nosotros", "Reservas"].map((item) => (
                <Link
                  key={item}
                  href={item === "Menú" ? "#menu" : `/${item.toLowerCase()}`}
                  className={`block py-2 ${
                    item === "Menú" ? "text-amber-700 font-medium" : "text-gray-600 hover:text-amber-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6 md:mb-8">Nuestro Menú</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 md:mb-16">
              Descubre nuestra selección de platos tradicionales y especialidades de la casa
            </p>

            {/* Featured Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 md:mb-16">
              <FeaturedCategory
                title="Pollos a la Brasa"
                image="/images/pollo-a-la-brasa.jpg"
                onClick={() => scrollToSection("Pollos")}
              />
              <FeaturedCategory
                title="Domingos"
                image="/images/domingos.jpg"
                onClick={() => scrollToSection("Especiales de Domingo")}
              />
              <FeaturedCategory
                title="Para Compartir"
                image="/images/para-compartir.jpg"
                onClick={() => scrollToSection("Platos para Compartir")}
              />
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600/90" size={24} />
                <input
                  type="text"
                  placeholder="Buscar platos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 text-lg shadow-md"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Menu Section with Categories and Products */}
      <div ref={menuSectionRef} className="relative bg-white">
        {/* Category Navigation */}
        <nav ref={categoryRef} className="top-20 bg-white/95 backdrop-blur-sm z-40 border-y border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex overflow-x-auto space-x-4 py-6 category-scroll">
              {filteredSections.map((section) => (
                <motion.button
                  key={section.title}
                  onClick={() => scrollToSection(section.title)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-full whitespace-nowrap transition-colors text-lg font-medium ${
                    activeSection === section.title
                      ? "bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {section.title}
                </motion.button>
              ))}
            </div>
          </div>
        </nav>

        {/* Products Grid */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {filteredSections.map(
                (section) =>
                  activeSection === section.title && (
                    <motion.div
                      key={section.title}
                      id={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {section.items.map((item) => (
                          <MenuCard key={item.name} item={item} />
                        ))}
                      </div>
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Chef Recommendations Section */}
      <section ref={chefRecommendationsRef} className="py-16 md:py-24 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-amber-800 mb-4">
              Recomendaciones del Chef
            </h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              Descubre nuestros platos más populares, cuidadosamente seleccionados por nuestro chef
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuSections
              .flatMap((section) => section.items.filter((item) => item.popular))
              .slice(0, 3)
              .map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-amber-200"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={item.image || "/api/placeholder/400/300"}
                      alt={item.name}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md">
                      <Star size={16} className="text-amber-900" />
                      Recomendado
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-heading font-bold mb-3 text-amber-800">{item.name}</h3>
                    {item.description && <p className="text-amber-700 mb-4">{item.description}</p>}
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-amber-600">{item.price}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-yellow-600 transition-all shadow-md text-lg font-semibold"
                        onClick={() => console.log(`Ordenar ${item.name}`)}
                      >
                        Ordenar Ahora
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Testimonios de Nuestros Comensales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre lo que nuestros clientes dicen sobre su experiencia en Sol de Oro
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial
              text="La mejor comida peruana que he probado. El pollo a la brasa es simplemente increíble."
              author="María G."
            />
            <Testimonial
              text="El ambiente es acogedor y el servicio es excelente. Definitivamente volveré."
              author="Juan P."
            />
            <Testimonial
              text="Los platos para compartir son perfectos para una cena familiar. ¡Altamente recomendado!"
              author="Ana L."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">Sol de Oro</h3>
              <p className="text-gray-400">
                Tradición gastronómica desde 1975, ofreciendo la mejor experiencia culinaria en Cerro de Pasco.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-heading font-semibold mb-4 text-white">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                {["Inicio", "Menú", "Nosotros", "Reservas"].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-heading font-semibold mb-4 text-white">Contacto</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="text-gray-400" size={20} />
                  <p className="text-gray-400">Jr. Hilario Cabrera 120, Yanacancha, Cerro de Pasco</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="text-gray-400" size={20} />
                  <p className="text-gray-400">Lunes a Domingo: 11:30 AM - 10:00 PM</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-gray-400" size={20} />
                  <p className="text-gray-400">Reservas vía Messenger</p>
                </div>
                <div className="flex space-x-4 mt-6">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Instagram size={24} />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Facebook size={24} />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500"
          >
            <p>&copy; {new Date().getFullYear()} Sol de Oro - Todos los derechos reservados.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

export default MenuPage

