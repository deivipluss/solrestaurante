export interface MenuItem {
  name: string
  description?: string
  price: string
  image?: string
  popular?: boolean
}

export interface MenuSection {
  title: string
  description?: string
  items: MenuItem[]
}

export interface MenuCardProps {
  item: MenuItem
}

export interface TestimonialProps {
  text: string
  author: string
}

