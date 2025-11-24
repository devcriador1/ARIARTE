import { Product, Category, Material, Scale, DetailLevel, ProductType } from './types';

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
    promotionalPrice: 249.90,
    type: ProductType.PHYSICAL
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
    promotionalPrice: 69.90,
    type: ProductType.PHYSICAL
  },
  {
    id: '3',
    name: 'Braço Robótico (Arquivos)',
    category: Category.PECAS,
    imageUrl: 'https://picsum.photos/id/250/600/600',
    modelUrl: DEMO_MODEL_URL,
    description: 'Pack completo de STLs para imprimir seu próprio braço robótico. Inclui manual de montagem.',
    difficulty: 'Extremo',
    printTime: '48h (Total)',
    material: Material.ABS,
    scale: Scale.GRANDE,
    detailLevel: DetailLevel.ALTO,
    colors: [],
    isNew: true,
    price: 45.00,
    type: ProductType.DIGITAL,
    fileSize: '450 MB'
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
    promotionalPrice: 99.90,
    type: ProductType.PHYSICAL
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
    price: 79.90,
    type: ProductType.PHYSICAL
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
    price: 45.00,
    type: ProductType.PHYSICAL
  },
  {
    id: '7',
    name: 'Busto Cyberpunk (STL)',
    category: Category.ARTE,
    imageUrl: 'https://picsum.photos/id/338/600/600',
    modelUrl: DEMO_MODEL_URL,
    description: 'Arquivo digital de alta resolução para impressão em resina. Pré-suportado.',
    difficulty: 'Difícil',
    printTime: 'Variável',
    material: Material.RESINA,
    scale: Scale.PEQUENA,
    detailLevel: DetailLevel.ALTO,
    colors: [],
    isNew: true,
    price: 29.90,
    type: ProductType.DIGITAL,
    fileSize: '1.2 GB'
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
    price: 39.90,
    type: ProductType.PHYSICAL
  },
  {
    id: '9',
    name: 'Pack Miniaturas RPG (STL)',
    category: Category.MINIATURES,
    imageUrl: 'https://picsum.photos/id/237/600/600',
    description: 'Coleção com 10 guerreiros futuristas para jogos de tabuleiro. Arquivos Otimizados.',
    difficulty: 'Difícil',
    printTime: 'Variável',
    material: Material.RESINA,
    scale: Scale.PEQUENA,
    detailLevel: DetailLevel.ALTO,
    colors: [],
    isNew: true,
    price: 59.90,
    promotionalPrice: 39.90,
    type: ProductType.DIGITAL,
    fileSize: '850 MB'
  }
];

export const CATEGORIES = Object.values(Category);
export const MATERIALS = Object.values(Material);
export const SCALES = Object.values(Scale);
export const DETAIL_LEVELS = Object.values(DetailLevel);
export const PRODUCT_TYPES = Object.values(ProductType);
export const ALL_COLORS = Array.from(new Set(PRODUCTS.flatMap(p => p.colors)));