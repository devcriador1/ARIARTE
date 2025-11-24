import { Product, Category, Material, Scale, DetailLevel } from './types';

export const CONTACT_INFO = {
  phone: '(19) 997092854',
  instagram: 'https://www.instagram.com/ariarte_3d/',
  instagramHandle: '@ariarte_3d',
  logoUrl: 'https://i.postimg.cc/W4zBZX6R/572747477-17860524225533972-8300661268584334496-n.jpg'
};

// Using a generic public 3D model for demo purposes since we don't have hosted files for specific products
const DEMO_MODEL_URL = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Máscara Cyber Oni',
    category: Category.COSPLAY,
    imageUrl: 'https://picsum.photos/id/64/600/600',
    modelUrl: DEMO_MODEL_URL,
    description: 'Uma máscara estilo cyberpunk inspirada em demônios japoneses, com canais para LEDs.',
    difficulty: 'Difícil',
    printTime: '24h',
    material: Material.PLA,
    scale: Scale.GRANDE,
    detailLevel: DetailLevel.ALTO,
    colors: ['Preto', 'Neon', 'Vermelho'],
    isNew: true,
    price: 289.90,
    promotionalPrice: 249.90
  },
  {
    id: '2',
    name: 'Vaso Voronoi Twisted',
    category: Category.DECOR,
    imageUrl: 'https://picsum.photos/id/106/600/600',
    description: 'Vaso decorativo com estrutura matemática Voronoi, ideal para plantas secas.',
    difficulty: 'Fácil',
    printTime: '6h',
    material: Material.PLA,
    scale: Scale.MEDIA,
    detailLevel: DetailLevel.MEDIO,
    colors: ['Branco', 'Seda', 'Azul', 'Amarelo'],
    isNew: false,
    price: 89.90,
    promotionalPrice: 69.90
  },
  {
    id: '3',
    name: 'Braço Robótico',
    category: Category.PECAS,
    imageUrl: 'https://picsum.photos/id/250/600/600',
    modelUrl: DEMO_MODEL_URL,
    description: 'Modelo funcional de braço robótico com 6 graus de liberdade. Requer montagem.',
    difficulty: 'Extremo',
    printTime: '48h',
    material: Material.ABS,
    scale: Scale.GRANDE,
    detailLevel: DetailLevel.ALTO,
    colors: ['Cinza', 'Laranja', 'Amarelo'],
    isNew: true,
    price: 450.00,
    promotionalPrice: 389.90
  },
  {
    id: '4',
    name: 'Dragão Articulado',
    category: Category.ARTE,
    imageUrl: 'https://picsum.photos/id/58/600/600',
    description: 'Dragão flexível impresso no local (print-in-place), sem necessidade de suportes.',
    difficulty: 'Médio',
    printTime: '12h',
    material: Material.PLA,
    scale: Scale.MEDIA,
    detailLevel: DetailLevel.ALTO,
    colors: ['Gradiente', 'Dourado', 'Roxo'],
    isNew: true,
    price: 129.90,
    promotionalPrice: 99.90
  },
  {
    id: '5',
    name: 'Suporte Headset',
    category: Category.UTILIDADES,
    imageUrl: 'https://picsum.photos/id/30/600/600',
    description: 'Suporte de mesa para fones de ouvido com estética futurista geométrica.',
    difficulty: 'Médio',
    printTime: '9h',
    material: Material.PLA,
    scale: Scale.MEDIA,
    detailLevel: DetailLevel.BAIXO,
    colors: ['Preto', 'Branco', 'Amarelo'],
    isNew: false,
    price: 79.90
  },
  {
    id: '6',
    name: 'Engrenagem Planetária',
    category: Category.PECAS,
    imageUrl: 'https://picsum.photos/id/133/600/600',
    description: 'Sistema de engrenagens funcional para projetos de engenharia mecânica.',
    difficulty: 'Difícil',
    printTime: '5h',
    material: Material.RESINA,
    scale: Scale.PEQUENA,
    detailLevel: DetailLevel.ALTO,
    colors: ['Cinza Transparente'],
    isNew: false,
    price: 45.00
  },
  {
    id: '7',
    name: 'Busto Cyberpunk',
    category: Category.ARTE,
    imageUrl: 'https://picsum.photos/id/338/600/600',
    modelUrl: DEMO_MODEL_URL,
    description: 'Escultura detalhada de personagem futurista para pintura e coleção.',
    difficulty: 'Difícil',
    printTime: '18h',
    material: Material.RESINA,
    scale: Scale.PEQUENA,
    detailLevel: DetailLevel.ALTO,
    colors: ['Cinza Primer', 'Gradiente'],
    isNew: true,
    price: 159.90,
    promotionalPrice: 139.90
  },
  {
    id: '8',
    name: 'Organizador Modular',
    category: Category.UTILIDADES,
    imageUrl: 'https://picsum.photos/id/20/600/600',
    description: 'Sistema hexagonal para organização de ferramentas e pequenos objetos.',
    difficulty: 'Fácil',
    printTime: '4h',
    material: Material.PETG,
    scale: Scale.MEDIA,
    detailLevel: DetailLevel.BAIXO,
    colors: ['Azul', 'Preto', 'Amarelo'],
    isNew: false,
    price: 39.90
  }
];

export const CATEGORIES = Object.values(Category);
export const MATERIALS = Object.values(Material);
export const SCALES = Object.values(Scale);
export const DETAIL_LEVELS = Object.values(DetailLevel);
export const ALL_COLORS = Array.from(new Set(PRODUCTS.flatMap(p => p.colors)));