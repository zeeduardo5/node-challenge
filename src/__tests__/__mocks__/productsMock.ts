import { Product } from "../../types";

export const apiProductsResponseMock: Record<string, string | string[] | number>[] = [
  {
    id: 6,
    title: 'MacBook Pro',
    description:
      'MacBook Pro 2021 with mini-LED display may launch between September, November',
    price: 1749,
    discountPercentage: 11.02,
    rating: 4.57,
    stock: 83,
    brand: 'Apple',
    category: 'laptops',
    thumbnail: 'https://cdn.dummyjson.com/product-images/6/thumbnail.png',
    images: [
      'https://cdn.dummyjson.com/product-images/6/1.png',
      'https://cdn.dummyjson.com/product-images/6/2.jpg',
      'https://cdn.dummyjson.com/product-images/6/3.png',
      'https://cdn.dummyjson.com/product-images/6/4.jpg',
    ],
  },
  {
    id: 8,
    title: 'Microsoft Surface Laptop 4',
    description:
      'Style and speed. Stand out on HD video calls backed by Studio Mics. Capture ideas on the vibrant touchscreen.',
    price: 1499,
    discountPercentage: 10.23,
    rating: 4.43,
    stock: 68,
    brand: 'Microsoft Surface',
    category: 'laptops',
    thumbnail: 'https://cdn.dummyjson.com/product-images/8/thumbnail.jpg',
    images: [
      'https://cdn.dummyjson.com/product-images/8/1.jpg',
      'https://cdn.dummyjson.com/product-images/8/2.jpg',
      'https://cdn.dummyjson.com/product-images/8/3.jpg',
      'https://cdn.dummyjson.com/product-images/8/4.jpg',
      'https://cdn.dummyjson.com/product-images/8/thumbnail.jpg',
    ],
  },
  {
    id: 30,
    title: 'Key Holder',
    description:
      'Attractive DesignMetallic materialFour key hooksReliable & DurablePremium Quality',
    price: 30,
    discountPercentage: 2.92,
    rating: 4.92,
    stock: 54,
    brand: 'Golden',
    category: 'home-decoration',
    thumbnail: 'https://cdn.dummyjson.com/product-images/30/thumbnail.jpg',
    images: [
      'https://cdn.dummyjson.com/product-images/30/1.jpg',
      'https://cdn.dummyjson.com/product-images/30/2.jpg',
      'https://cdn.dummyjson.com/product-images/30/3.jpg',
      'https://cdn.dummyjson.com/product-images/30/thumbnail.jpg',
    ],
  },
];


export const productsMock: Product[] = [
  {
    id: 6,
    title: 'MacBook Pro',
    description:
      'MacBook Pro 2021 with mini-LED display may launch between September, November',
    price: 1749,
    thumbnail: 'https://cdn.dummyjson.com/product-images/6/thumbnail.png',
  },
  {
    id: 8,
    title: 'Microsoft Surface Laptop 4',
    description:
      'Style and speed. Stand out on HD video calls backed by Studio Mics. Capture ideas on the vibrant touchscreen.',
    price: 1499,
    thumbnail: 'https://cdn.dummyjson.com/product-images/8/thumbnail.jpg',
  },
  {
    id: 30,
    title: 'Key Holder',
    description:
      'Attractive DesignMetallic materialFour key hooksReliable & DurablePremium Quality',
    price: 30,
    thumbnail: 'https://cdn.dummyjson.com/product-images/30/thumbnail.jpg',
  },
];
