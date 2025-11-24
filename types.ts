export enum Category {
  ALL = 'Todas',
  ARTE = 'Arte',
  DECOR = 'Decoração',
  COSPLAY = 'Cosplay',
  PECAS = 'Peças',
  UTILIDADES = 'Utilidades',
  MINIATURES = 'Miniaturas'
}

export enum Material {
  PLA = 'PLA',
  ABS = 'ABS',
  RESINA = 'Resina',
  PETG = 'PETG'
}

export enum Scale {
  PEQUENA = 'Pequena',
  MEDIA = 'Média',
  GRANDE = 'Grande'
}

export enum DetailLevel {
  BAIXO = 'Baixo',
  MEDIO = 'Médio',
  ALTO = 'Alto'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  imageUrl: string;
  modelUrl?: string; // For 3D Viewer
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Extremo';
  printTime: string;
  material: Material;
  scale: Scale;
  detailLevel: DetailLevel;
  colors: string[];
  isNew?: boolean;
  price: number;
  promotionalPrice?: number;
}

export interface PrintSettings {
  nozzleTemp: string;
  bedTemp: string;
  layerHeight: string;
  infill: string;
  supports: boolean;
  notes: string;
}

export interface GeminiAnalysisResponse {
  settings: PrintSettings;
  proTips: string[];
}

export interface FilterState {
  category: Category | 'Todas';
  materials: Material[];
  scales: Scale[];
  detailLevel: DetailLevel[];
  colors: string[];
  searchTerm: string;
}