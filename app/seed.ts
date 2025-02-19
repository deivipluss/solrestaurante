import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate consistent placeholder URLs with dimensions
const getPlaceholderImage = (width: number = 400, height: number = 300): string => {
  return `/placeholder.svg?height=${height}&width=${width}`;
};

const menuData = [
  {
    title: "Pollos a la Brasa",
    description: "Nuestro delicioso pollo a la brasa en diferentes presentaciones",
    items: [
      {
        name: "Un Pollo a la brasa",
        description: "Con papas crocantes, cremas y ensalada",
        price: 72.00,
        image: getPlaceholderImage(),
        popular: true
      },
      {
        name: "Un Pollo a la brasa para llevar",
        description: "Con papas crocantes, cremas, gaseosa de 1.5 litros y ensalada",
        price: 74.00,
        image: getPlaceholderImage()
      },
      {
        name: "Un Pollo a la brasa chaufero",
        description: "Con papas crocantes, cremas, ensalada y arroz chaufa",
        price: 90.00,
        image: getPlaceholderImage()
      },
      {
        name: "Un Pollo a la brasa chaufero para llevar",
        description: "Con papas crocantes, cremas, ensalada, gaseosa de 1.5 litros y arroz chaufa",
        price: 90.00,
        image: getPlaceholderImage()
      },
      {
        name: "Medio pollo a la brasa",
        description: "Con papas crocantes, cremas y ensalada",
        price: 37.00,
        image: getPlaceholderImage()
      },
      {
        name: "Medio pollo a la brasa para llevar",
        description: "Con papas crocantes, cremas, gaseosa de un litro y ensalada",
        price: 37.00,
        image: getPlaceholderImage()
      },
      {
        name: "Un cuarto de pollo a la brasa",
        description: "Con papas crocantes, cremas y ensalada",
        price: 20.00,
        image: getPlaceholderImage()
      },
      {
        name: "Un octavo de pollo a la brasa",
        description: "Con papas crocantes, cremas y ensalada",
        price: 18.00,
        image: getPlaceholderImage()
      },
      {
        name: "Pollo a la brasa anticuchero",
        description: "1/4 de pollo más un palito de anticucho",
        price: 23.00,
        image: getPlaceholderImage()
      },
      {
        name: "Pollo a la brasa criollo",
        description: "1/4 de pollo y un chorizo",
        price: 22.00,
        image: getPlaceholderImage()
      },
      {
        name: "Pollo a la brasa a la campesina",
        description: "1/4 de pollo, papas sancochadas, choclo, queso y jamón",
        price: 24.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Carnes a la Parrilla",
    description: "Las mejores carnes seleccionadas, preparadas a la parrilla con maestría",
    items: [
      {
        name: "Lomo Fino",
        description: "Jugoso medallón de lomo fino",
        price: 29.00,
        image: getPlaceholderImage(),
        popular: true
      },
      {
        name: "Parrilla gaucha",
        description: "Pechuga, bistec y chuleta",
        price: 29.00,
        image: getPlaceholderImage()
      },
      {
        name: "Costillas a la barbacoa",
        description: "Dos riquísimas costillas bañadas en salsa barbacoa",
        price: 26.00,
        image: getPlaceholderImage()
      },
      {
        name: "Costillas 'Sol'",
        description: "El especial de casa: Riquísimas costillas bañadas en salsa barbacoa + 1/4 de pollo a la brasa",
        price: 29.00,
        image: getPlaceholderImage(),
        popular: true
      },
      {
        name: "Bife",
        description: "Corte único de res a la parrilla (250g)",
        price: 26.00,
        image: getPlaceholderImage()
      },
      {
        name: "Bife Sol",
        description: "Corte único de res a la parrilla (250g) + 1/4 de pollo a la brasa",
        price: 32.00,
        image: getPlaceholderImage()
      },
      {
        name: "Chuleta",
        price: 22.00,
        image: getPlaceholderImage()
      },
      {
        name: "Chuletas Sol",
        description: "1/2 chuleta bañada en salsa barbacoa + 1/4 de pollo a la brasa",
        price: 26.00,
        image: getPlaceholderImage()
      },
      {
        name: "Bistec a la plancha",
        price: 22.00,
        image: getPlaceholderImage()
      },
      {
        name: "Bistec a la parrilla",
        price: 22.00,
        image: getPlaceholderImage()
      },
      {
        name: "Trucha a la Parrilla",
        price: 24.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Broaster y Salchi's",
    description: "Deliciosas opciones de pollo broaster y salchipapas",
    items: [
      {
        name: "Un cuarto Pollo broaster",
        description: "Pechuga de pollo sin hueso, viene con papas crocantes, cremas y ensalada",
        price: 21.00,
        image: getPlaceholderImage()
      },
      {
        name: "Un octavo de pollo broaster",
        description: "Pechuga de pollo sin hueso, viene con papas crocantes, cremas y ensaladas",
        price: 19.00,
        image: getPlaceholderImage()
      },
      {
        name: "Salchipapas",
        description: "Con hot dog Frankfurt y chorizo",
        price: 18.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Platos Criollos",
    description: "Sabores auténticos de nuestra tierra",
    items: [
      {
        name: "Milanesa de pollo",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Chicharrón de pollo",
        description: "Con ensalada",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Bistec de carne de res",
        description: "Con salsa criolla",
        price: 23.00,
        image: getPlaceholderImage()
      },
      {
        name: "Bistec apanado",
        description: "Con salsa criolla",
        price: 23.00,
        image: getPlaceholderImage()
      },
      {
        name: "Bistec al jugo",
        description: "Con arroz blanco y papas fritas",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Saltado de pollo",
        price: 22.00,
        image: getPlaceholderImage()
      },
      {
        name: "Lomo saltado",
        price: 22.00,
        image: getPlaceholderImage(),
        popular: true
      },
      {
        name: "Lomo saltado mixto",
        description: "Res y pollo",
        price: 23.00,
        image: getPlaceholderImage()
      },
      {
        name: "Lomo saltado al jugo",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Arroz chaufa de carne",
        price: 22.00,
        image: getPlaceholderImage()
      },
      {
        name: "Arroz chaufa 'Sol'",
        description: "El especial de casa: chaufa, 1/4 de pollo a la brasa",
        price: 28.00,
        image: getPlaceholderImage(),
        popular: true
      },
      {
        name: "Arroz chaufa de pollo",
        price: 22.00,
        image: getPlaceholderImage()
      },
      {
        name: "Arroz chaufa con chancho y champiñones",
        price: 23.00,
        image: getPlaceholderImage()
      },
      {
        name: "Arroz chaufa de dos sabores",
        description: "Pollo y carne",
        price: 23.00,
        image: getPlaceholderImage()
      },
      {
        name: "Arroz chaufa tres sabores",
        description: "Pollo, carne, chancho",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Arroz chaufa tapado",
        description: "Cubierto con tortilla de piña",
        price: 26.00,
        image: getPlaceholderImage()
      },
      {
        name: "Aeropuerto",
        description: "Chaufa, fideos y frijol chino",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Tallarín saltado de carne",
        price: 20.00,
        image: getPlaceholderImage()
      },
      {
        name: "Tallarín saltado de pollo",
        price: 20.00,
        image: getPlaceholderImage()
      },
      {
        name: "Tallarín saltado criollo",
        description: "Picante, viene con papas sancochadas",
        price: 21.00,
        image: getPlaceholderImage()
      },
      {
        name: "Tallarín al pesto con bisteck de res",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Tallarín a lo Alfredo",
        description: "En salsa blanca con queso, crema de leche, jamón y champiñones",
        price: 23.00,
        image: getPlaceholderImage()
      },
      {
        name: "Tallarín en salsa de huancaína",
        description: "Con lomo saltado y papas sancochadas",
        price: 25.00,
        image: getPlaceholderImage()
      },
      {
        name: "Arroz a la cubana",
        price: 14.00,
        image: getPlaceholderImage()
      },
      {
        name: "Tortilla de verduras",
        price: 17.00,
        image: getPlaceholderImage()
      },
      {
        name: "Tortilla de pollo",
        price: 19.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Sopas",
    description: "Reconfortantes sopas y caldos para calentar el alma",
    items: [
      {
        name: "Caldo de gallina con presa",
        price: 20.00,
        image: getPlaceholderImage(),
        popular: true
      },
      {
        name: "Caldo de gallina sin presa",
        price: 17.00,
        image: getPlaceholderImage()
      },
      {
        name: "Sopa a la minuta",
        price: 18.00,
        image: getPlaceholderImage()
      },
      {
        name: "Sopa a la criolla",
        price: 20.00,
        image: getPlaceholderImage()
      },
      {
        name: "Sudado de trucha",
        price: 23.00,
        image: getPlaceholderImage()
      },
      {
        name: "Sustancia de pollo",
        price: 17.00,
        image: getPlaceholderImage()
      },
      {
        name: "Sustancia de carne",
        price: 17.00,
        image: getPlaceholderImage()
      },
      {
        name: "Dieta de pollo",
        price: 17.00,
        image: getPlaceholderImage()
      },
      {
        name: "Sopa de Kion",
        price: 17.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Ensaladas",
    description: "Frescas y saludables ensaladas",
    items: [
      {
        name: "Ensalada Mixta",
        description: "Palta, zanahoria, betarraga, tomate, pepino y vainita",
        price: 13.00,
        image: getPlaceholderImage()
      },
      {
        name: "Ensalada de palta",
        description: "Pura palta con limón",
        price: 15.00,
        image: getPlaceholderImage()
      },
      {
        name: "Delicia de palta",
        description: "Palta, zanahoria, queso, choclo y tomate",
        price: 15.00,
        image: getPlaceholderImage()
      },
      {
        name: "Ensalada 'Sol'",
        description: "El especial de casa: Palmito, espárragos, champiñones y palta",
        price: 15.00,
        image: getPlaceholderImage(),
        popular: true
      }
    ]
  },
  {
    title: "Domingos",
    description: "Especialidades disponibles los domingos",
    items: [
      {
        name: "Patasca",
        price: 20.00,
        image: getPlaceholderImage()
      },
      {
        name: "Picante de cuy",
        description: "1/2 cuy",
        price: 30.00,
        image: getPlaceholderImage()
      },
      {
        name: "Arroz con pato",
        price: 28.00,
        image: getPlaceholderImage()
      },
      {
        name: "Costillar",
        price: 26.00,
        image: getPlaceholderImage()
      },
      {
        name: "Papa a la huancaína",
        price: 14.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Para Compartir",
    description: "Deliciosas opciones para disfrutar en grupo",
    items: [
      {
        name: "Reloj de Campana",
        description: "Dos octavos de pollo, dos anticuchos, chicharrón de pollo, salsa tártara, alitas y muslitos crocantes, salsa de guacamole, arroz chaufa, lomo saltado, papa frita familiar, gaseosa 1.5lt solo para llevar recomendado para seis personas",
        price: 105.00,
        image: getPlaceholderImage(),
        popular: true
      },
      {
        name: "Parrilla Familiar 'Sol'",
        description: "El especial de casa: Bife, chuleta, 1 porción de pancita, 1 porción de mollejas, dos anticuchos, 1/4 de pollo a la brasa, dos filetes de pierna, dos chorizos, dos hotdog's , papas fritas tamaño familiar, , gaseosa 1.5 litros solo para llevar, recomendado para seis personas",
        price: 95.00,
        image: getPlaceholderImage()
      },
      {
        name: "1/2 Parrilla Sol",
        description: "Bife, chuleta, 1/2 porción de pancita, 1/2 porción de mollejas, un anticucho, 1/4 de pollo a la brasa, un filete de pierna, un chorizo, un hot dog, una papas fritas de tamaño familiar, gaseosa 1 litro solo para llevar, recomendado para cuatro personas",
        price: 85.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Jugos y Frutas",
    description: "Refrescantes jugos y frutas",
    items: [
      {
        name: "Ensalada de frutas",
        price: 11.00,
        image: getPlaceholderImage()
      },
      {
        name: "Jugo especial 1/2 litro",
        price: 9.00,
        image: getPlaceholderImage()
      },
      {
        name: "Jugo surtido 1/2 litro",
        price: 8.00,
        image: getPlaceholderImage()
      },
      {
        name: "Jugo de papaya 1/2 litro",
        price: 8.00,
        image: getPlaceholderImage()
      },
      {
        name: "Jugo de piña 1/2 litro",
        price: 8.00,
        image: getPlaceholderImage()
      },
      {
        name: "Batido de lúcuma",
        price: 10.00,
        image: getPlaceholderImage()
      },
      {
        name: "Batido de plátano",
        price: 10.00,
        image: getPlaceholderImage()
      },
      {
        name: "Batido de fresa",
        price: 10.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Gustitos",
    description: "Deliciosas especialidades para darse un gusto",
    items: [
      {
        name: "Saltado de lomo fino",
        price: 28.00,
        image: getPlaceholderImage()
      },
      {
        name: "Mistura criolla",
        description: "Chaufa + lomo saltado o tallarín saltado",
        price: 28.00,
        image: getPlaceholderImage()
      },
      {
        name: "Ferrocarril",
        description: "Bisteck a lo pobre encebollado",
        price: 28.00,
        image: getPlaceholderImage()
      },
      {
        name: "Tallarín al pesto 'Sol'",
        description: "El especial de casa: con 1/4 de pollo a la brasa",
        price: 27.00,
        image: getPlaceholderImage(),
        popular: true
      },
      {
        name: "Tallarín en salsa huancaína 'Sol'",
        description: "El especial de casa: con 1/4 de pollo a la brasa",
        price: 27.00,
        image: getPlaceholderImage()
      },
      {
        name: "Chicharrón de pollo sol",
        description: "Con salsa tártara y ensalada",
        price: 27.00,
        image: getPlaceholderImage()
      },
      {
        name: "Bisteck a lo pobre",
        description: "Con huevo frito, plátano, salchicha, pan tostado",
        price: 27.00,
        image: getPlaceholderImage()
      },
      {
        name: "Lomo a lo pobre",
        description: "Con huevo frito, plátano, salchicha y pan tostado",
        price: 26.00,
        image: getPlaceholderImage()
      },
      {
        name: "Pollo a la brasa a lo pobre",
        description: "Con arroz blanco, papas fritas, huevo frito, plátano, salchicha, pan tostado",
        price: 26.00,
        image: getPlaceholderImage()
      },
      {
        name: "Alitas y muslitos picantes",
        description: "Con arroz blanco, papas sancochadas y ensalada",
        price: 26.00,
        image: getPlaceholderImage()
      },
      {
        name: "Alitas y muslitos crocantes",
        description: "Con arroz blanco, papa frita, salsa guacamole y ensalada",
        price: 26.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Anticuchos",
    description: "Tradicionales anticuchos y brochetas a la parrilla",
    items: [
      {
        name: "Anticucho 'Sol'",
        description: "El especial de casa: 2 palitos de anticucho, choclo, un chorizo, porción de mondongo",
        price: 24.00,
        image: getPlaceholderImage(),
        popular: true
      },
      {
        name: "Anticucho de corazón",
        description: "Dos palitos de anticucho y choclo",
        price: 21.00,
        image: getPlaceholderImage()
      },
      {
        name: "Brocheta de pollo",
        description: "Dos palitos de brochetas con pimentón y cebolla",
        price: 20.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Pechugas a la Parrilla",
    description: "Jugosas pechugas de pollo preparadas a la parrilla",
    items: [
      {
        name: "Pechuga a la parrilla",
        description: "Filete de pechuga de pollo con papas fritas",
        price: 23.00,
        image: getPlaceholderImage()
      },
      {
        name: "Pechuga Light",
        description: "Filete de pechuga de pollo, cero aceite, con papa sancochada",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Pechuga hawaiana",
        description: "Filete de pechuga de pollo relleno de jamón, queso, tocino, champiñones, piña en salsa de barbacoa y papa frita",
        price: 27.00,
        image: getPlaceholderImage()
      },
      {
        name: "Pechuga 'Sol'",
        description: "El especial de casa: Filete de pechuga de pollo relleno de jamón, queso, tocino, champiñones en salsa barbacoa y papa frita",
        price: 26.00,
        image: getPlaceholderImage(),
        popular: true
      },
      {
        name: "Pechuga a la campesina",
        description: "Filete de pechuga de pollo relleno de jamón, queso, tocino, champiñones, con papas sancochadas y choclo",
        price: 27.00,
        image: getPlaceholderImage()
      },
      {
        name: "Piqueo 'Sol'",
        description: "El especial de casa: 2 anticuchos, 2 brochetas, porción de molleja, porción de pancita, un chorizo, un choclo",
        price: 42.00,
        image: getPlaceholderImage()
      },
      {
        name: "1/2 pollo deshuesado",
        description: "Dos jugosos filetes de pierna",
        price: 28.00,
        image: getPlaceholderImage()
      },
      {
        name: "Pechuga al ajo",
        description: "Filete de pechuga de pollo en salsa de ajo",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Pechuga al limón",
        description: "En aliño de limón",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Pechuga a la pizzarola",
        description: "Filete de pechuga de pollo, queso mozarela, champiñones, salchicha y pimentón",
        price: 27.00,
        image: getPlaceholderImage()
      },
      {
        name: "Mollejas a la parrilla",
        price: 22.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Truchas",
    description: "Deliciosas preparaciones con trucha fresca",
    items: [
      {
        name: "Chicharrón de trucha",
        description: "Con salsa criolla",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Trucha broaster",
        price: 22.00,
        image: getPlaceholderImage()
      },
      {
        name: "Trucha frita",
        description: "Con salsa criolla",
        price: 22.00,
        image: getPlaceholderImage()
      },
      {
        name: "Trucha en salsa de champiñones",
        price: 24.00,
        image: getPlaceholderImage()
      },
      {
        name: "Milanesa de trucha",
        price: 23.00,
        image: getPlaceholderImage()
      },
      {
        name: "Trucha a la parrilla",
        price: 24.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Bebidas",
    description: "Refrescantes bebidas",
    items: [
      {
        name: "Chicha morada un litro",
        price: 13.00,
        image: getPlaceholderImage()
      },
      {
        name: "Chicha morada medio litro",
        price: 7.00,
        image: getPlaceholderImage()
      },
      {
        name: "Maracuyá un litro",
        price: 13.00,
        image: getPlaceholderImage()
      },
      {
        name: "Maracuyá medio litro",
        price: 7.00,
        image: getPlaceholderImage()
      },
      {
        name: "Limonada un litro",
        price: 13.00,
        image: getPlaceholderImage()
      },
      {
        name: "Limonada medio litro",
        price: 7.00,
        image: getPlaceholderImage()
      }
    ]
  },
  {
    title: "Infusiones",
    description: "Reconfortantes infusiones y bebidas calientes",
    items: [
      {
        name: "Flor de jamaica",
        price: 11.00,
        image: getPlaceholderImage()
      },
      {
        name: "Hoja de coca",
        price: 11.00,
        image: getPlaceholderImage()
      },
      {
        name: "Emoliente",
        price: 11.00,
        image: getPlaceholderImage()
      },
      {
        name: "Boldo",
        price: 11.00,
        image: getPlaceholderImage()
      },
      {
        name: "Muña",
        price: 11.00,
        image: getPlaceholderImage()
      },
      {
        name: "Menta",
        price: 11.00,
        image: getPlaceholderImage()
      },
      {
        name: "Anís",
        price: 4.00,
        image: getPlaceholderImage()
      },
      {
        name: "Manzanilla",
        price: 4.00,
        image: getPlaceholderImage()
      },
      {
        name: "Café",
        price: 4.00,
        image: getPlaceholderImage()
      },
      {
        name: "Té",
        price: 4.00,
        image: getPlaceholderImage()
      }
    ]
  }
];

async function main() {
    for (const section of menuData) {
      try {
        const createdSection = await prisma.menuSection.create({
          data: {
            title: section.title,
            description: section.description,
            items: {
              create: section.items.map(item => ({
                name: item.name,
                description: item.description,
                price: item.price,
                image: item.image,
                popular: item.popular || false,
              })),
            },
          },
        });
        console.log(`Created section: ${createdSection.title}`);
      } catch (error) {
        console.error(`Error creating section ${section.title}:`, error);
      }
    }
  }
  
  main()
    .catch(e => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

console.log("Database seeding script completed.");