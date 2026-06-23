export interface Product {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  cookTime: string;
  tags: string[];
  description: string;
  image: string;
  gallery: string[];
  category: string;
  servings: number;
  ingredients: string[];
  highlights: string[];
  isOnePort?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot';
  dietType?: 'Vegetarian' | 'Vegan';
}

export const products: Product[] = [
  {
    id: 'sambar-pack',
    name: 'Sambar Pack',
    emoji: '🍲',
    subtitle: 'The heart of every South Indian meal',
    cookTime: '10-15 mins',
    tags: ['One-Pot', 'Farm Fresh', 'Pre-Cut', 'Zero Waste'],
    description:
      'A traditional South Indian staple made effortless. Our Sambar Pack includes farm-fresh pre-cut vegetables, semi-cooked dal, and tamarind extract — everything you need to cook authentic sambar in 10–15 minutes, no prep required.',
    image: '/assets/Sambar.png',
    gallery: [
      '/assets/Sambar.png',
      '/assets/sambar-label.png',
      '/assets/sambar-pack-2.png',
      '/assets/product-photo.jpg',
    ],
    category: 'sambar',
    servings: 4,
    ingredients: [
      'Carrot', 'Beans', 'Tomato', 'Onion', 'Semi-Cooked Sambar Dal',
      'Tamarind Extract', 'Sambar Powder', 'Curry Leaves', 'Coriander Leaves',
      'Mustard Seeds, Jeera, Fenugreek & Asafoetida', 'Dried Red Chilli',
    ],
    highlights: [
      'Semi-cooked dal included — saves 20 mins',
      'Farm-fresh pre-cut vegetables',
      'One-pot recipe',
      'No preservatives',
      'FSSAI Certified',
    ],
    isOnePort: true,
    spiceLevel: 'Medium',
    dietType: 'Vegetarian',
  },
  {
    id: 'kara-kuzhambu-pack',
    name: 'Kara Kuzhambu Pack',
    emoji: '🌶',
    subtitle: 'Bold, tangy and fiery South Indian gravy',
    cookTime: '10-15 mins',
    tags: ['One-Pot', 'Farm Fresh', 'Spicy'],
    description:
      'Kara Kuzhambu is a robust, tamarind-based spicy gravy that pairs perfectly with rice. Our pack includes pre-measured shallots, tomatoes, fresh curry leaves, and authentic kuzhambu powder — ready to simmer and serve.',
    image: '/assets/Kara%20Kulambu.png',
    gallery: [
      '/assets/Kara%20Kulambu.png',
      '/assets/Sambar.png',
    ],
    category: 'kuzhambu',
    servings: 4,
    ingredients: [
      'Shallots (Small Onions)', 'Tomato', 'Brinjal', 'Garlic', 'Drumstick (optional)',
      'Tamarind Extract', 'Kara Kuzhambu Masala', 'Curry Leaves',
      'Mustard, Fenugreek Seeds & Asafoetida', 'Dried Red Chilli',
    ],
    highlights: [
      'Authentic tamarind-based gravy',
      'Farm-fresh shallots and tomatoes',
      'One-pot recipe',
      'No preservatives',
      'FSSAI Certified',
    ],
    isOnePort: true,
    spiceLevel: 'Hot',
    dietType: 'Vegan',
  },
  {
    id: 'coconut-chutney-pack',
    name: 'Coconut Chutney Pack',
    emoji: '🥥',
    subtitle: 'Fresh coconut chutney — the perfect side',
    cookTime: '10-15 mins',
    tags: ['Quick', 'Side Dish', 'Farm Fresh'],
    description:
      'Nothing complements South Indian breakfasts like fresh coconut chutney. Our pack contains freshly grated coconut, green chillies, ginger, and tempering ingredients — blended and ready in 10 minutes.',
    image: '/assets/Coconut%20Chutney.png',
    gallery: [
      '/assets/Coconut%20Chutney.png',
      '/assets/sambar-pack-2.png',
    ],
    category: 'chutney',
    servings: 4,
    ingredients: [
      'Fresh Coconut Pieces', 'Green Chilli', 'Roasted Gram Dal (Pottukadalai)',
      'Curry Leaves', 'Mustard Seeds, Urad Dal & Jeera',
    ],
    highlights: [
      'Freshly grated coconut included',
      'Perfect with idli, dosa, vada',
      'Quick 10-minute recipe',
      'No preservatives',
      'FSSAI Certified',
    ],
    spiceLevel: 'Mild',
    dietType: 'Vegan',
  },
  {
    id: 'tomato-chutney-pack',
    name: 'Tomato Chutney Pack',
    emoji: '🍅',
    subtitle: 'Tangy roasted tomato chutney',
    cookTime: '10-15 mins',
    tags: ['Quick', 'Side Dish', 'Farm Fresh'],
    description:
      'A tangy, slightly smoky tomato chutney made from farm-fresh tomatoes and onions. This pack includes everything pre-measured for a rich, authentic chutney that pairs beautifully with any South Indian dish.',
    image: '/assets/Tomato%20Chutney.png',
    gallery: [
      '/assets/Tomato%20Chutney.png',
      '/assets/product-photo.jpg',
    ],
    category: 'chutney',
    servings: 4,
    ingredients: [
      'Tomato', 'Onion', 'Garlic', 'Dried Red Chilli', 'Tamarind',
      'Curry Leaves', 'Mustard Seeds, Urad Dal & Jeera',
    ],
    highlights: [
      'Farm-fresh ripe tomatoes',
      'Perfect with rice, idli, dosa',
      'Quick 15-minute recipe',
      'No preservatives',
      'FSSAI Certified',
    ],
    spiceLevel: 'Medium',
    dietType: 'Vegan',
  },
];

export interface RecipeIngredient {
  name: string;
  amount: string;
  note?: string;
  icon: string;
  image?: string;
}

export interface RecipeNutrition {
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  fiber: string;
}

export interface Recipe {
  id: string;
  productId: string;
  name: string;
  subtitle: string;
  cookTime: string;
  prepTime: string;
  difficulty: string;
  spiceLevel: string;
  servings: number;
  image: string;
  description: string;
  tags: string[];
  includedIngredients: RecipeIngredient[];
  nutrition: RecipeNutrition;
  steps: string[];
  benefits: string[];
  traditionNote: string;
}

export const recipes: Recipe[] = [
  {
    id: 'sambar',
    productId: 'sambar-pack',
    name: 'Sambar',
    subtitle: 'Classic South Indian lentil and vegetable stew',
    cookTime: '10-15 mins',
    prepTime: '2 mins',
    difficulty: 'Beginner',
    spiceLevel: 'Medium',
    servings: 4,
    image: '/assets/Sambar.png',
    description:
      'Sambar is the soul of South Indian cooking — a rich lentil and vegetable stew simmered with tamarind and aromatic spices. Our pack eliminates all prep work, letting you focus only on the joy of cooking and eating.',
    tags: ['One Pot', 'Lunch', 'Dinner', 'Comfort Food'],
    includedIngredients: [
      { amount: '2 pieces', name: 'Carrot', icon: '🥕', note: 'Pre-cut rounds', image: '/assets/Ingredients/Carrot.jpg' },
      { amount: '1 cup', name: 'Beans', icon: '🫛', note: 'Pre-cut' },
      { amount: '2 pieces', name: 'Tomato', icon: '🍅', note: 'Roughly chopped', image: '/assets/Ingredients/Tomato.jpg' },
      { amount: '1 medium', name: 'Onion', icon: '🧅', note: 'Pre-sliced', image: '/assets/Ingredients/red-onion-whole-isolated-white.jpg' },
      { amount: '1 pouch', name: 'Semi-Cooked Sambar Dal', icon: '🫘', note: 'Saves 20 min of cooking', image: '/assets/Ingredients/sambar%20dal.jpg' },
      { amount: '1 pouch', name: 'Tamarind Extract', icon: '🍯', image: '/assets/Ingredients/Tamarind%20Extract.jpg' },
      { amount: '1 pouch', name: 'Sambar Powder', icon: '🌶️', image: '/assets/Ingredients/Sambar%20Podi.jpg' },
      { amount: '1 sprig', name: 'Curry Leaves', icon: '🌿', image: '/assets/Ingredients/Curry%20Leave.jpg' },
      { amount: '1 small bunch', name: 'Coriander Leaves', icon: '🌱', image: '/assets/Ingredients/Coriander.jpg' },
      { amount: '½ tsp each', name: 'Mustard Seeds, Jeera, Fenugreek & Asafoetida', icon: '🥄', note: 'Tempering mix', image: '/assets/Ingredients/Mustard.jpg' },
      { amount: '2 pieces', name: 'Dried Red Chilli', icon: '🌶️', note: 'For tempering', image: '/assets/Ingredients/Red%20chilli.jpg' },
    ],
    nutrition: {
      calories: '1007 kcal',
      carbs: '145 g',
      protein: '37 g',
      fat: '12 g',
      fiber: '22 g',
    },
    steps: [
      'Add the semi-cooked dal pouch to a pot with 2 cups of water. Bring to a simmer and stir until creamy.',
      'Add the pre-cut vegetables (carrot, beans, tomato, onion), tamarind extract, and sambar powder. Mix well.',
      'Simmer on medium heat for 15–18 minutes until vegetables are tender.',
      'Heat oil in a small pan, add tempering mix and curry leaves, then pour into the sambar.',
      'Add salt to taste, stir, and serve hot with rice, idli, or dosa.',
    ],
    benefits: [
      'High in protein from lentils',
      'Rich in dietary fiber',
      'Farm-fresh vegetables',
      'No preservatives or additives',
      'Authentic South Indian taste',
    ],
    traditionNote: 'Sambar has been a staple dish in South Indian households for generations. Each family has its own version — but the heart of it is always the same: tamarind, lentils, and the warmth of home.',
  },
  {
    id: 'kara-kuzhambu',
    productId: 'kara-kuzhambu-pack',
    name: 'Kara Kuzhambu',
    subtitle: 'Fiery tamarind-based gravy from Tamil kitchens',
    cookTime: '10-15 mins',
    prepTime: '2 mins',
    difficulty: 'Beginner',
    spiceLevel: 'Hot',
    servings: 4,
    image: '/assets/Kara%20Kulambu.png',
    description:
      'Kara Kuzhambu is a bold, spicy, tangy gravy that is beloved across Tamil Nadu. Made with shallots, tomatoes, and generous tamarind, it pairs perfectly with steamed rice and a side of papad.',
    tags: ['One Pot', 'Spicy', 'Lunch', 'Dinner'],
    includedIngredients: [
      { amount: '200 g', name: 'Shallots (Small Onions)', icon: '🧅', note: 'Pre-cleaned and halved', image: '/assets/Ingredients/Shallots.jpg' },
      { amount: '2 pieces', name: 'Tomato', icon: '🍅', note: 'Roughly chopped', image: '/assets/Ingredients/Tomato.jpg' },
      { amount: '1 cup', name: 'Brinjal', icon: '🍆', note: 'Pre-cut cubes', image: '/assets/Ingredients/Brinjal.jpg' },
      { amount: '4-5 cloves', name: 'Garlic', icon: '🧄', note: 'Peeled' },
      { amount: '1 piece', name: 'Drumstick', icon: '🥒', note: 'Optional, pre-cut' },
      { amount: '1 pouch', name: 'Tamarind Extract', icon: '🍯', image: '/assets/Ingredients/Tamarind%20Extract.jpg' },
      { amount: '1 pouch', name: 'Kara Kuzhambu Masala', icon: '🌶️', image: '/assets/Ingredients/Kuzhambu%20podi.jpg' },
      { amount: '1 sprig', name: 'Curry Leaves', icon: '🌿', image: '/assets/Ingredients/Curry%20Leave.jpg' },
      { amount: '½ tsp each', name: 'Mustard, Fenugreek Seeds & Asafoetida', icon: '🥄', note: 'Tempering mix', image: '/assets/Ingredients/Mustard.jpg' },
      { amount: '2 pieces', name: 'Dried Red Chilli', icon: '🌶️', image: '/assets/Ingredients/Red%20chilli.jpg' },
    ],
    nutrition: {
      calories: '320 kcal',
      carbs: '42 g',
      protein: '8 g',
      fat: '14 g',
      fiber: '6 g',
    },
    steps: [
      'Heat sesame oil in a pan and add the mustard, fenugreek, and asafoetida tempering.',
      'Add the shallots, garlic, brinjal, and drumstick from the pack. Sauté for 3–4 minutes.',
      'Add the kara kuzhambu masala and stir for 1 minute until fragrant.',
      'Add the tomatoes, pour in the tamarind extract, and add 1 cup of water. Mix well.',
      'Add curry leaves and dried red chilli, then simmer for 15 minutes until the gravy thickens and the oil separates.',
      'Adjust salt and serve hot with steamed rice.',
    ],
    benefits: [
      'Rich in antioxidants from tamarind',
      'Supports digestion',
      'No artificial colours or flavours',
      'Authentic Tamil Nadu taste',
      'Farm-fresh shallots',
    ],
    traditionNote: 'Kara Kuzhambu is the bold, fiery cousin of sambar — a dish that represents the unapologetic love for spice in Tamil Nadu kitchens. Sesame oil is the secret that gives it its characteristic depth.',
  },
  {
    id: 'coconut-chutney',
    productId: 'coconut-chutney-pack',
    name: 'Coconut Chutney',
    subtitle: 'Creamy, fresh coconut chutney in 10 minutes',
    cookTime: '10-15 mins',
    prepTime: '1 min',
    difficulty: 'Beginner',
    spiceLevel: 'Mild',
    servings: 4,
    image: '/assets/Coconut%20Chutney.png',
    description:
      'No South Indian breakfast is complete without fresh coconut chutney. Smooth, creamy, and mildly spiced — our pack makes it effortless to prepare the perfect chutney for idli, dosa, vada, or upma.',
    tags: ['Quick', 'Side Dish', 'Breakfast', 'Vegetarian'],
    includedIngredients: [
      { amount: '1 cup', name: 'Fresh Coconut Pieces', icon: '🥥', image: '/assets/Ingredients/coconut-chips.jpg' },
      { amount: '2 pieces', name: 'Green Chilli', icon: '🌶️', image: '/assets/Ingredients/Green%20chilli.jpg' },
      { amount: '2 tbsp', name: 'Roasted Gram Dal (Pottukadalai)', icon: '🫘' },
      { amount: '1 sprig', name: 'Curry Leaves', icon: '🌿', image: '/assets/Ingredients/Curry%20Leave.jpg' },
      { amount: '½ tsp each', name: 'Mustard Seeds, Urad Dal & Jeera', icon: '🥄', note: 'Tempering mix', image: '/assets/Ingredients/Mustard.jpg' },
    ],
    nutrition: {
      calories: '185 kcal',
      carbs: '8 g',
      protein: '4 g',
      fat: '16 g',
      fiber: '4 g',
    },
    steps: [
      'Add the coconut pieces, green chilli, and roasted gram dal to a blender.',
      'Add a pinch of salt and a small splash of water. Blend to a smooth paste.',
      'Transfer to a bowl.',
      'Heat oil in a small pan, add the mustard seeds, urad dal, jeera, and curry leaves from the pack.',
      'Pour the tempering over the chutney, stir, and serve immediately.',
    ],
    benefits: [
      'Rich in healthy fats from fresh coconut',
      'Natural energy source',
      'No artificial additives',
      'Perfect breakfast accompaniment',
      'High in dietary fiber',
    ],
    traditionNote: 'Coconut chutney is the cornerstone of South Indian breakfast culture. Every state and every family has its own recipe — but freshness of the coconut is always the non-negotiable ingredient.',
  },
  {
    id: 'tomato-chutney',
    productId: 'tomato-chutney-pack',
    name: 'Tomato Chutney',
    subtitle: 'Roasted tangy tomato chutney — a South Indian classic',
    cookTime: '10-15 mins',
    prepTime: '1 min',
    difficulty: 'Beginner',
    spiceLevel: 'Medium',
    servings: 4,
    image: '/assets/Tomato%20Chutney.png',
    description:
      'A rich, smoky-tangy tomato chutney made from ripe farm-fresh tomatoes. The perfect complement to idli, dosa, and rice — our pack includes pre-measured tomatoes, onions, red chilli, and tempering ingredients.',
    tags: ['Quick', 'Side Dish', 'Breakfast', 'Lunch'],
    includedIngredients: [
      { amount: '3 pieces', name: 'Tomato', icon: '🍅', note: 'Roughly chopped', image: '/assets/Ingredients/Tomato.jpg' },
      { amount: '1 medium', name: 'Onion', icon: '🧅', note: 'Sliced', image: '/assets/Ingredients/red-onion-whole-isolated-white.jpg' },
      { amount: '4-5 cloves', name: 'Garlic', icon: '🧄', note: 'Peeled' },
      { amount: '2 pieces', name: 'Dried Red Chilli', icon: '🌶️', image: '/assets/Ingredients/Red%20chilli.jpg' },
      { amount: '1 small piece', name: 'Tamarind', icon: '🍯', image: '/assets/Ingredients/Tamarind.jpg' },
      { amount: '1 sprig', name: 'Curry Leaves', icon: '🌿', image: '/assets/Ingredients/Curry%20Leave.jpg' },
      { amount: '½ tsp each', name: 'Mustard Seeds, Urad Dal & Jeera', icon: '🥄', note: 'Tempering mix', image: '/assets/Ingredients/Mustard.jpg' },
    ],
    nutrition: {
      calories: '120 kcal',
      carbs: '18 g',
      protein: '3 g',
      fat: '5 g',
      fiber: '3 g',
    },
    steps: [
      'Heat oil in a pan and add the tempering mix from the pack.',
      'Add the tomatoes, onions, and garlic and cook on medium heat for 5–6 minutes until softened.',
      'Add the red chilli and tamarind. Stir well.',
      'Cook for another 5 minutes until the tomatoes are mushy and the mixture thickens.',
      'Blend to a coarse or smooth paste as preferred. Serve warm or at room temperature.',
    ],
    benefits: [
      'Rich in Vitamin C from tomatoes',
      'Antioxidant-rich',
      'Low calorie side dish',
      'No artificial preservatives',
      'Farm-fresh ripe tomatoes',
    ],
    traditionNote: 'Tomato chutney became a staple South Indian condiment when tomatoes were introduced to Indian cuisine — and it quickly found its permanent place on every breakfast and lunch table.',
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Visalakshi',
    role: 'Software Engineer, 39',
    location: 'Chennai',
    rating: 5,
    text: 'After a long workday, cooking felt exhausting because of all the preparation involved. Samachify saves me nearly 40 minutes every evening and helps me enjoy fresh homemade meals without the hassle.',
    initials: 'V',
  },
  {
    id: 't2',
    name: 'Arun Kumar',
    role: 'Engineering Student, 22',
    location: 'Chennai',
    rating: 5,
    text: 'As someone who recently started cooking, Samachify made it surprisingly simple. The ready-to-cook packs helped me prepare healthy meals confidently without worrying about ingredient preparation.',
    initials: 'AK',
  },
  {
    id: 't3',
    name: 'Ramesh Krishnan',
    role: 'Private Employee, 32',
    location: 'Velachery, Chennai',
    rating: 5,
    text: "The portion sizes are accurate, which means less food waste and fewer grocery trips. It's a practical solution for busy families.",
    initials: 'RK',
  },
  {
    id: 't4',
    name: 'Divya Suresh',
    role: 'HR Professional, 29',
    location: 'Taramani, Chennai',
    rating: 5,
    text: 'I used to order food frequently because cooking after work took too much time. Samachify gives me the convenience of quick cooking while still enjoying homemade food.',
    initials: 'DS',
  },
];

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: 'f1',
    question: 'What is Samachify?',
    answer: 'Samachify provides ready-to-cook ingredient packs with fresh, pre-cut vegetables and essential ingredients for popular dishes.',
  },
  {
    id: 'f2',
    question: 'Are the ingredients fresh?',
    answer: 'Yes. Ingredients are sourced directly from farmers and prepared hygienically.',
  },
  {
    id: 'f3',
    question: 'How long does cooking take?',
    answer: 'Most dishes can be prepared in 10–15 minutes.',
  },
  {
    id: 'f4',
    question: 'Do you use preservatives?',
    answer: 'No. We focus on fresh ingredients with minimal processing.',
  },
  {
    id: 'f5',
    question: 'How are the packs stored?',
    answer: 'Keep refrigerated and consume before the recommended date.',
  },
  {
    id: 'f6',
    question: 'Is delivery available?',
    answer: 'Yes, delivery is available in selected service areas.',
  },
];
