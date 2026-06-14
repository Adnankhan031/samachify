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
    cookTime: '30 mins',
    tags: ['One-Pot', 'Farm Fresh', 'Pre-Cut', 'Zero Waste'],
    description:
      'A traditional South Indian staple made effortless. Our Sambar Pack includes farm-fresh pre-cut vegetables, semi-cooked dal, and tamarind extract — everything you need to cook authentic sambar in 30 minutes, no prep required.',
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
      'Carrot', 'Brinjal', 'Tomato', 'Onion', 'Curry Leaves',
      'Semi-Cooked Sambar Dal', 'Tamarind Extract',
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
    cookTime: '25 mins',
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
      'Shallots', 'Tomato', 'Curry Leaves', 'Tamarind',
      'Kuzhambu Powder', 'Sesame Oil', 'Mustard Seeds',
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
    cookTime: '10 mins',
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
      'Fresh Coconut', 'Green Chilli', 'Ginger',
      'Curry Leaves', 'Urad Dal', 'Mustard Seeds',
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
    cookTime: '15 mins',
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
      'Tomato', 'Onion', 'Red Chilli', 'Tamarind',
      'Curry Leaves', 'Mustard Seeds', 'Urad Dal',
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
  {
    id: 'mint-chutney-pack',
    name: 'Mint Chutney Pack',
    emoji: '🌿',
    subtitle: 'Cool, fresh and vibrant mint chutney',
    cookTime: '5 mins',
    tags: ['Quick', 'Side Dish', 'Fresh'],
    description:
      'A refreshing mint and coriander chutney ready in under 5 minutes. The pack includes freshly washed mint leaves, coriander, green chilli, and a squeeze of lemon — no chopping, no measuring, just blend and serve.',
    image: '/assets/Pudina%20Chutney.png',
    gallery: [
      '/assets/Pudina%20Chutney.png',
      '/assets/sambar-pack-2.png',
    ],
    category: 'chutney',
    servings: 4,
    ingredients: [
      'Mint Leaves', 'Coriander', 'Green Chilli',
      'Lemon', 'Ginger', 'Garlic',
    ],
    highlights: [
      'Freshly washed mint and coriander',
      'Ready in 5 minutes',
      'No cooking needed',
      'No preservatives',
      'FSSAI Certified',
    ],
    spiceLevel: 'Mild',
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
    cookTime: '30 mins',
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
      { amount: '1 cup', name: 'Brinjal', icon: '🍆', note: 'Pre-cut cubes', image: '/assets/Ingredients/Brinjal.jpg' },
      { amount: '2 pieces', name: 'Tomato', icon: '🍅', note: 'Roughly chopped', image: '/assets/Ingredients/Tomato.jpg' },
      { amount: '1 medium', name: 'Onion', icon: '🧅', note: 'Pre-sliced', image: '/assets/Ingredients/red-onion-whole-isolated-white.jpg' },
      { amount: '1 pouch', name: 'Semi-Cooked Sambar Dal', icon: '🫘', note: 'Saves 20 min of cooking', image: '/assets/Ingredients/sambar%20dal.jpg' },
      { amount: '1 pouch', name: 'Tamarind Extract', icon: '🍯', image: '/assets/Ingredients/Tamarind%20Extract.jpg' },
      { amount: '1 pouch', name: 'Sambar Powder', icon: '🌶️', image: '/assets/Ingredients/Sambar%20Podi.jpg' },
      { amount: '1 sprig', name: 'Curry Leaves', icon: '🌿', image: '/assets/Ingredients/Curry%20Leave.jpg' },
      { amount: '½ tsp', name: 'Mustard Seeds', icon: '🥄', image: '/assets/Ingredients/Mustard.jpg' },
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
      'Add the pre-cut vegetable pack, tamarind extract, and sambar powder. Mix well.',
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
    cookTime: '25 mins',
    prepTime: '2 mins',
    difficulty: 'Beginner',
    spiceLevel: 'Hot',
    servings: 4,
    image: '/assets/Kara%20Kulambu.png',
    description:
      'Kara Kuzhambu is a bold, spicy, tangy gravy that is beloved across Tamil Nadu. Made with shallots, tomatoes, and generous tamarind, it pairs perfectly with steamed rice and a side of papad.',
    tags: ['One Pot', 'Spicy', 'Lunch', 'Dinner'],
    includedIngredients: [
      { amount: '200 g', name: 'Shallots', icon: '🧅', note: 'Pre-cleaned and halved', image: '/assets/Ingredients/Shallots.jpg' },
      { amount: '2 pieces', name: 'Tomato', icon: '🍅', note: 'Roughly chopped', image: '/assets/Ingredients/Tomato.jpg' },
      { amount: '1 pouch', name: 'Tamarind Extract', icon: '🍯', image: '/assets/Ingredients/Tamarind%20Extract.jpg' },
      { amount: '1 pouch', name: 'Kuzhambu Powder', icon: '🌶️', image: '/assets/Ingredients/Kuzhambu%20podi.jpg' },
      { amount: '1 sprig', name: 'Curry Leaves', icon: '🌿', image: '/assets/Ingredients/Curry%20Leave.jpg' },
      { amount: '½ tsp', name: 'Mustard Seeds', icon: '🥄', image: '/assets/Ingredients/Mustard.jpg' },
      { amount: '½ tsp', name: 'Urad Dal', icon: '🫘', image: '/assets/Ingredients/Urad%20dal.jpg' },
    ],
    nutrition: {
      calories: '320 kcal',
      carbs: '42 g',
      protein: '8 g',
      fat: '14 g',
      fiber: '6 g',
    },
    steps: [
      'Heat sesame oil in a pan and add the mustard and urad dal tempering.',
      'Add the shallots and tomatoes from the pack. Sauté for 3–4 minutes.',
      'Add the kuzhambu powder and stir for 1 minute until fragrant.',
      'Pour in the tamarind extract and add 1 cup of water. Mix well.',
      'Add curry leaves and simmer for 15 minutes until the gravy thickens and the oil separates.',
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
    cookTime: '10 mins',
    prepTime: '1 min',
    difficulty: 'Beginner',
    spiceLevel: 'Mild',
    servings: 4,
    image: '/assets/Coconut%20Chutney.png',
    description:
      'No South Indian breakfast is complete without fresh coconut chutney. Smooth, creamy, and mildly spiced — our pack makes it effortless to prepare the perfect chutney for idli, dosa, vada, or upma.',
    tags: ['Quick', 'Side Dish', 'Breakfast', 'Vegetarian'],
    includedIngredients: [
      { amount: '1 cup', name: 'Fresh Grated Coconut', icon: '🥥', image: '/assets/Ingredients/coconut-chips.jpg' },
      { amount: '2 pieces', name: 'Green Chilli', icon: '🌶️', image: '/assets/Ingredients/Green%20chilli.jpg' },
      { amount: '1 small piece', name: 'Ginger', icon: '🫚', image: '/assets/Ingredients/Ginger.jpg' },
      { amount: '1 sprig', name: 'Curry Leaves', icon: '🌿', image: '/assets/Ingredients/Curry%20Leave.jpg' },
      { amount: '½ tsp', name: 'Mustard Seeds', icon: '🥄', image: '/assets/Ingredients/Mustard.jpg' },
      { amount: '½ tsp', name: 'Urad Dal', icon: '🫘', image: '/assets/Ingredients/Urad%20dal.jpg' },
    ],
    nutrition: {
      calories: '185 kcal',
      carbs: '8 g',
      protein: '4 g',
      fat: '16 g',
      fiber: '4 g',
    },
    steps: [
      'Add the grated coconut, green chilli, and ginger to a blender.',
      'Add a pinch of salt and a small splash of water. Blend to a smooth paste.',
      'Transfer to a bowl.',
      'Heat oil in a small pan, add the tempering mix and curry leaves from the pack.',
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
    cookTime: '15 mins',
    prepTime: '1 min',
    difficulty: 'Beginner',
    spiceLevel: 'Medium',
    servings: 4,
    image: '/assets/Tomato%20Chutney.png',
    description:
      'A rich, smoky-tangy tomato chutney made from ripe farm-fresh tomatoes. The perfect complement to idli, dosa, and rice — our pack includes pre-measured tomatoes, onions, red chilli, and tempering ingredients.',
    tags: ['Quick', 'Side Dish', 'Breakfast', 'Lunch'],
    includedIngredients: [
      { amount: '3 pieces', name: 'Ripe Tomatoes', icon: '🍅', note: 'Roughly chopped', image: '/assets/Ingredients/Tomato.jpg' },
      { amount: '1 medium', name: 'Onion', icon: '🧅', note: 'Sliced', image: '/assets/Ingredients/red-onion-whole-isolated-white.jpg' },
      { amount: '2 pieces', name: 'Dried Red Chilli', icon: '🌶️', image: '/assets/Ingredients/Red%20chilli.jpg' },
      { amount: '1 small piece', name: 'Tamarind', icon: '🍯', image: '/assets/Ingredients/Tamarind.jpg' },
      { amount: '½ tsp', name: 'Mustard Seeds', icon: '🥄', image: '/assets/Ingredients/Mustard.jpg' },
      { amount: '½ tsp', name: 'Urad Dal', icon: '🫘', image: '/assets/Ingredients/Urad%20dal.jpg' },
      { amount: '1 sprig', name: 'Curry Leaves', icon: '🌿', image: '/assets/Ingredients/Curry%20Leave.jpg' },
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
      'Add the tomatoes and onions and cook on medium heat for 5–6 minutes until softened.',
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
  {
    id: 'mint-chutney',
    productId: 'mint-chutney-pack',
    name: 'Mint Chutney',
    subtitle: 'Vibrant, cooling mint and coriander chutney',
    cookTime: '5 mins',
    prepTime: '1 min',
    difficulty: 'Beginner',
    spiceLevel: 'Mild',
    servings: 4,
    image: '/assets/Pudina%20Chutney.png',
    description:
      'A bright, cooling mint chutney that pairs with everything — from idli and dosa to chaats and kebabs. Our pack includes freshly washed mint leaves, coriander, green chilli, and lemon. Just blend and serve.',
    tags: ['Quick', 'Side Dish', 'No Cooking'],
    includedIngredients: [
      { amount: '1 bunch', name: 'Fresh Mint Leaves', icon: '🌿', note: 'Pre-washed, ready to blend', image: '/assets/Ingredients/Mind%20leaves.jpg' },
      { amount: '1 bunch', name: 'Fresh Coriander', icon: '🌱', note: 'Pre-washed, ready to blend', image: '/assets/Ingredients/Coriander.jpg' },
      { amount: '2 pieces', name: 'Green Chilli', icon: '🌶️', image: '/assets/Ingredients/Green%20chilli.jpg' },
      { amount: '1 small piece', name: 'Ginger', icon: '🫚', image: '/assets/Ingredients/Ginger.jpg' },
      { amount: '1 piece', name: 'Lemon', icon: '🍋', image: '/assets/Ingredients/Lemon.jpg' },
    ],
    nutrition: {
      calories: '65 kcal',
      carbs: '8 g',
      protein: '2 g',
      fat: '2 g',
      fiber: '2 g',
    },
    steps: [
      'Add the mint, coriander, green chilli, and ginger from the pack into a blender.',
      'Squeeze the lemon juice in.',
      'Add a pinch of salt and 2–3 tablespoons of water.',
      'Blend to a smooth paste.',
      'Taste, adjust salt or lemon, and serve immediately or refrigerate for up to 2 days.',
    ],
    benefits: [
      'Cooling and digestive properties',
      'Rich in Vitamin A and C',
      'No cooking needed',
      'Zero oil or fat added',
      'Freshly washed ingredients',
    ],
    traditionNote: 'Mint chutney is the universal South and North Indian condiment — a burst of freshness that balances spice, adds colour, and elevates any dish it accompanies.',
  },
];

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Priya Sundaram',
    location: 'Velachery, Chennai',
    rating: 5,
    text: 'I used to spend 45 minutes just washing and cutting vegetables before even starting to cook. With Samachify, I had authentic sambar on the table in under 30 minutes. My mother-in-law was shocked it tasted this good!',
    initials: 'PS',
  },
  {
    id: 't2',
    name: 'Karthik Rajan',
    location: 'Tambaram, Chennai',
    rating: 5,
    text: 'As a working professional who gets home at 8 PM, Samachify has been a game changer. The packs are perfectly portioned and the recipe guide made it totally foolproof. Zero waste, fresh vegetables.',
    initials: 'KR',
  },
  {
    id: 't3',
    name: 'Meenakshi Anand',
    location: 'Anna Nagar, Chennai',
    rating: 5,
    text: 'We tried the Sambar Pack and the Kara Kuzhambu Pack for a Sunday lunch. The whole family loved it. The vegetables were clearly fresh — you could tell from the texture and colour.',
    initials: 'MA',
  },
  {
    id: 't4',
    name: 'Arun Balaji',
    location: 'Kanchipuram',
    rating: 5,
    text: 'The coconut chutney pack was amazing. Everything perfectly measured, the coconut was fresh, and it came together in under 10 minutes. Perfect with my morning dosa.',
    initials: 'AB',
  },
  {
    id: 't5',
    name: 'Divya Krishnan',
    location: 'Perambur, Chennai',
    rating: 5,
    text: 'I am a college student living in a flat. Cooking was always stressful. Samachify packs made it easy and affordable. The step-by-step guide is perfect for beginners like me.',
    initials: 'DK',
  },
  {
    id: 't6',
    name: 'Rajesh Murugan',
    location: 'Chromepet, Chennai',
    rating: 5,
    text: 'The quality is consistently good. Fresh packs, no waste, and the savings over buying loose vegetables are real. Highly recommend the Kara Kuzhambu Pack if you love spicy food.',
    initials: 'RM',
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
    question: 'How fresh are the vegetables in each pack?',
    answer: 'All vegetables are sourced directly from local farms in Kanchipuram and processed the same day using cold-chain technology. Each pack has a use-by date printed on the label. We recommend cooking within 2–3 days of delivery for the best taste.',
  },
  {
    id: 'f2',
    question: 'Are there any preservatives or additives?',
    answer: 'Absolutely not. Samachify packs contain only fresh vegetables and natural spice ingredients — zero preservatives, no artificial colours, no flavour enhancers. We are FSSAI certified (License: 22426421000333) and our processing facility follows strict hygiene protocols.',
  },
  {
    id: 'f3',
    question: 'What is included in the pack and what do I need from my kitchen?',
    answer: 'Each pack includes the pre-cut vegetables, measured spices, and any special ingredients specific to the dish. You typically only need basic pantry items like cooking oil, salt, and water. The recipe guide tells you exactly what else to keep ready.',
  },
  {
    id: 'f4',
    question: 'How do I cook the dish?',
    answer: 'Each pack comes with a step-by-step recipe guide. You can also view the full recipe on our website by visiting the product page. Most dishes are designed for beginners — no cooking experience is needed.',
  },
  {
    id: 'f5',
    question: 'What areas do you currently deliver to?',
    answer: 'We currently deliver across Chennai and Kanchipuram district. We are actively expanding to more Tamil Nadu cities. Contact us on WhatsApp to check availability in your area.',
  },
  {
    id: 'f6',
    question: 'How long does cooking actually take?',
    answer: 'Most packs go from pack-to-plate in 10–30 minutes. Sambar takes about 30 minutes, Kara Kuzhambu around 25 minutes, chutneys are ready in 5–15 minutes. No chopping, no measuring, no prep needed.',
  },
  {
    id: 'f7',
    question: 'Do I need cooking experience to use these packs?',
    answer: 'Not at all! Samachify packs are designed to be beginner-friendly. The recipe guide walks you through every step clearly. Students, working professionals, and first-time cooks love Samachify for exactly this reason.',
  },
  {
    id: 'f8',
    question: 'What is Modified Atmosphere Packaging (MAP)?',
    answer: 'MAP is a technology that replaces the air inside the pack with a safe gas mixture that slows oxidation and preserves freshness without any chemicals or preservatives. This is how we keep our vegetables fresh longer, naturally.',
  },
];
