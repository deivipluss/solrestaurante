"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { 
  Menu, 
  X, 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  Instagram, 
  Facebook, 
  Quote 
} from "lucide-react"
import { useCart } from "@/app/context/CartContext"
import Cart from "@/app/components/Cart"
import MenuCard from "@/app/components/MenuCard"
import AdminTerminal from "@/app/terminal/page"
import type { MenuSection, MenuItem } from './types'

const FeaturedCategory: React.FC<{ 
  title: string
  image: string
  onClick: () => void
  isActive?: boolean 
}> = ({
  title,
  image,
  onClick,
  isActive
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`relative h-48 md:h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer 
      ${isActive ? 'ring-2 ring-amber-500' : ''}`}
    onClick={onClick}
  >
    <Image 
      src={image || "/placeholder.svg"} 
      alt={title} 
      fill 
      className="object-cover"
      priority={true}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
      <h3 className="text-white text-2xl font-bold">{title}</h3>
    </div>
  </motion.div>
)

const Testimonial: React.FC<{ 
  text: string
  author: string
  delay?: number
}> = ({ 
  text, 
  author,
  delay = 0 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
  >
    <Quote className="text-amber-500 mb-4" size={32} />
    <p className="text-gray-700 mb-4 italic">{text}</p>
    <p className="text-amber-700 font-semibold">{author}</p>
  </motion.div>
)

const MenuPage: React.FC = () => {
  const { setIsOpen: setIsCartOpen } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [menuSections, setMenuSections] = useState<MenuSection[]>([])
  const [activeSection, setActiveSection] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredSections, setFilteredSections] = useState<MenuSection[]>([])
  const [showAdminTerminal, setShowAdminTerminal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const menuSectionRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const chefRecommendationsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu')
        if (!response.ok) {
          throw new Error('Error al cargar el menú')
        }
        const data = await response.json()
        setMenuSections(data)
        setActiveSection(data[0]?.title || "")
        setFilteredSections(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setIsLoading(false)
      }
    }

    fetchMenuData()
  }, [])

  useEffect(() => {
    if (!menuSections.length) return

    const filtered = menuSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((section) => section.items.length > 0)

    setFilteredSections(filtered)

    if (filtered.length > 0 && !filtered.some((section) => section.title === activeSection)) {
      setActiveSection(filtered[0].title)
    }
  }, [searchTerm, menuSections, activeSection])

  const scrollToSection = (sectionTitle: string) => {
    setActiveSection(sectionTitle)
    const sectionElement = document.getElementById(sectionTitle)
    if (sectionElement && menuSectionRef.current) {
      const categoryHeight = categoryRef.current?.offsetHeight || 0
      const headerHeight = 80
      const offset = headerHeight + categoryHeight

      menuSectionRef.current.scrollIntoView({ behavior: "smooth" })

      setTimeout(() => {
        const y = sectionElement.getBoundingClientRect().top + window.pageYOffset - offset
        window.scrollTo({ top: y, behavior: "smooth" })
      }, 100)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={40} 
              height={40} 
              className="w-10 h-10" 
              priority
            />
            <span className="text-xl font-bold text-amber-600">Sol Restaurant</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Ver Pedido
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-amber-600"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            className="fixed inset-0 z-40 bg-white lg:hidden"
          >
            <div className="container mx-auto px-4 py-20">
              <div className="space-y-8">
                {menuSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      scrollToSection(section.title)
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left text-lg font-medium text-gray-700 hover:text-amber-600"
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              La mejor comida para{" "}
              <span className="text-amber-600">momentos especiales</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 mb-8"
            >
              Descubre nuestra selección de platillos preparados con los mejores
              ingredientes y el sabor de la cocina casera.
            </motion.p>

            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar platillos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <div ref={menuSectionRef} className="relative bg-white">
        <div ref={categoryRef} className="bg-white py-4 top-20 z-30 w-full">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {menuSections.map((section) => (
                <FeaturedCategory
                  key={section.id}
                  title={section.title}
                  image={section.items[0]?.image || "/placeholder.svg"}
                  onClick={() => scrollToSection(section.title)}
                  isActive={activeSection === section.title}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {filteredSections.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600">No se encontraron platillos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredSections.map((section) => (
                <div key={section.id} id={section.title}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">{section.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.items.map((item) => (
                      <MenuCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chef Recommendations Section */}
      <section ref={chefRecommendationsRef} className="py-16 md:py-24 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Recomendaciones del Chef
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuSections
              .flatMap((section) => section.items)
              .filter((item) => item.popular)
              .map((item) => (
                <MenuCard key={item.id} item={item} featured />
              ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial
              text="La mejor pollería de la zona. El sabor es increíble y el servicio excelente."
              author="María González"
              delay={0.2}
            />
            <Testimonial
              text="Las porciones son generosas y la calidad es constante. ¡Volveré!"
              author="Juan Pérez"
              delay={0.4}
            />
            <Testimonial
              text="El delivery es rápido y la comida llega caliente. Muy recomendado."
              author="Ana Silva"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Sol Restaurant</h3>
              <p className="text-gray-400">
                Ofreciendo la mejor experiencia culinaria desde 2010.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Ubicación</h4>
              <p className="flex items-center text-gray-400 mb-2">
                <MapPin size={18} className="mr-2" />
                Av. Principal 123, Lima
              </p>
              <p className="flex items-center text-gray-400">
                <Clock size={18} className="mr-2" />
                Lun - Dom: 11:00 - 22:00
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
              <p className="flex items-center text-gray-400 mb-2">
                <Phone size={18} className="mr-2" />
                +51 987 654 321
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Síguenos en Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Síguenos en Facebook"
                >
                  <Facebook size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Component */}
      <Cart />

      {/* Admin Terminal */}
      {showAdminTerminal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <AdminTerminal />
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuPage