import { MenuSection } from './types';

export const menuSections: MenuSection[] = [
  {
    title: "Carnes a la Parrilla",
    description: "Las mejores carnes seleccionadas, preparadas a la parrilla con maestría",
    items: [
      {
        name: "Lomo Fino",
        description: "Jugoso medallón de lomo fino",
        price: "S/29.00",
        image: "/api/placeholder/400/300",
        popular: true
      },
      {
        name: "Costillas a la barbacoa",
        description: "Dos riquísimas costillas bañadas en salsa barbacoa",
        price: "S/26.00",
        image: "/api/placeholder/400/300"
      }
    ]
  },
  {
    title: "Platos Criollos",
    description: "Sabores auténticos de nuestra tierra",
    items: [
      {
        name: "Milanesa de pollo",
        description: "Pechuga de pollo empanizada, acompañada de papas fritas y ensalada",
        price: "S/24.00",
        image: "/api/placeholder/400/300"
      }
    ]
  },
  // ... otros sections se mantienen igual
];