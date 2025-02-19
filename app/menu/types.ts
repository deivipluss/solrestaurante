export interface MenuItem {
  id: number
  name: string
  description: string | null
  price: number
  image: string
  popular: boolean
  sectionId: number
}

export interface MenuSection {
  id: number
  title: string
  description: string | null
  items: MenuItem[]
}