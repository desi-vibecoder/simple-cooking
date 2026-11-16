export type HeatLevel = 'high' | 'lowest' | 'off';

export type LidState =
  | 'open'
  | 'closed-mandatory'
  | 'closed-water-on-lid'
  | 'remove-lid-water';

export type MainIngredientType = 'veg' | 'meat' | 'paneer';

export interface RecipeConfig {
  mainType: MainIngredientType;
  includeTomato: boolean;
  customMainName?: string;
}

export interface IngredientItem {
  id: string;
  name: string;
  quantity: string;
  measurementTip: string;
  role: string;
  imagePath: string;
  cropPosition: string;
  optional?: boolean;
}

export interface TechniqueItem {
  id: string;
  title: string;
  indianTerm: string;
  summary: string;
  whyItWorks: string;
  proTip: string;
  imagePath: string;
}

export interface CookingStep {
  id: string;
  stepNumber: number;
  phase: 'Tempering' | 'Aromatics' | 'Main & Steam' | 'Spices & Simmer' | 'Finish & Rest';
  title: string;
  shortTitle: string;
  originalDirective: string;
  instruction: string;
  chefDetail: string;
  timerSeconds: number;
  immediate?: boolean;
  heat: HeatLevel;
  lidState: LidState;
  lidReminderNote?: string;
  ingredientIds: string[];
  techniqueId: string;
  imagePath: string;
  imageCaption: string;
  optionalTomatoStep?: boolean;
  meatSpecificStep?: boolean;
}

export type VoiceAction =
  | 'NEXT_STEP'
  | 'PREV_STEP'
  | 'START_PAUSE_TIMER'
  | 'RESET_TIMER'
  | 'READ_ALOUD'
  | 'CHECK_LID';

export const IMAGE_ASSETS = {
  tadka: 'src/assets/images/step_tadka_spices_1794859707331.jpg',
  onionsTurmeric: 'src/assets/images/step_onions_ginger_turmeric_1794859708193.jpg',
  lidWater: 'src/assets/images/step_main_lid_water_1794859710559.jpg',
  masalaSimmer: 'src/assets/images/step_masala_tomato_simmer_1794859711174.jpg',
  garnishReady: 'src/assets/images/step_garnish_coriander_ready_1794859714043.jpg',
  masalaDabba: 'src/assets/images/ingredients_masala_dabba_1794859713115.jpg',
} as const;

export const INGREDIENTS: IngredientItem[] = [
  {
    id: 'oil',
    name: 'Cooking Oil',
    quantity: '2 to 3 tbsp',
    measurementTip: 'Coat the base of your pan so the tempering seeds crackle evenly.',
    role: 'Carries fat-soluble spice aromas across the entire dish.',
    imagePath: IMAGE_ASSETS.tadka,
    cropPosition: 'center 65%',
  },
  {
    id: 'jilakara-aavalu',
    name: 'Cumin & Mustard Seeds',
    quantity: '2 pinches (~1/2 tsp)',
    measurementTip: '1 pinch = what fits between thumb and index finger. Drop both seeds together.',
    role: 'Foundational tempering aroma; nutty cumin and popping mustard seeds.',
    imagePath: IMAGE_ASSETS.masalaDabba,
    cropPosition: '22% 18%',
  },
  {
    id: 'green-chilli',
    name: 'Fresh Green Chillies (Slit)',
    quantity: '2 to 3 chillies, slit',
    measurementTip: 'Slit lengthwise so hot oil never causes them to burst.',
    role: 'Infuses sharp, fresh green heat directly into the warm oil.',
    imagePath: IMAGE_ASSETS.masalaDabba,
    cropPosition: '18% 82%',
  },
  {
    id: 'curry-leaves',
    name: 'Fresh Curry Leaves',
    quantity: '2 sprigs (12–16 leaves)',
    measurementTip: 'Pat dry before dropping into oil; save 4–5 fresh leaves for the final garnish.',
    role: 'Citrusy, herbal aroma essential to homestyle cooking.',
    imagePath: IMAGE_ASSETS.tadka,
    cropPosition: '50% 58%',
  },
  {
    id: 'onion',
    name: 'Chopped Red Onion',
    quantity: '1 large cup, finely diced',
    measurementTip: 'Cut small uniform dice so every piece softens within the 2-minute sauté.',
    role: 'Builds body, natural sweetness, and golden sauce texture.',
    imagePath: IMAGE_ASSETS.masalaDabba,
    cropPosition: '72% 24%',
  },
  {
    id: 'salt',
    name: 'Cooking Salt',
    quantity: '1 pinch early + to taste',
    measurementTip: 'Added in 3 stages: 1 pinch for onions, a half-spoon with chilli powder, and final seasoning at the end.',
    role: 'Draws moisture from onions early and balances spice heat at the end.',
    imagePath: IMAGE_ASSETS.onionsTurmeric,
    cropPosition: '35% 60%',
  },
  {
    id: 'ginger-garlic',
    name: 'Fresh Ginger-Garlic Paste',
    quantity: '1 tbsp crushed',
    measurementTip: 'Stir for 30 seconds after adding so it cooks smoothly without sticking.',
    role: 'Deepens savory aroma and bridges onions with powdered spices.',
    imagePath: IMAGE_ASSETS.onionsTurmeric,
    cropPosition: '42% 54%',
  },
  {
    id: 'haldi',
    name: 'Turmeric Powder',
    quantity: '1/4 to 1/2 tsp',
    measurementTip: 'Sprinkle until the onion-oil mixture turns a bright light yellow.',
    role: 'Earthy warmth and golden color.',
    imagePath: IMAGE_ASSETS.onionsTurmeric,
    cropPosition: '66% 48%',
  },
  {
    id: 'main-ingredient',
    name: 'Main Ingredient (Vegetables, Paneer, or Meat)',
    quantity: '350g to 500g bite-size cubes',
    measurementTip: 'Cut into uniform 1-inch pieces so they cook evenly under the closed lid.',
    role: 'The star ingredient absorbing the tempered spices in its own juices.',
    imagePath: IMAGE_ASSETS.masalaSimmer,
    cropPosition: '50% 50%',
  },
  {
    id: 'chilli-powder',
    name: 'Red Chilli Powder',
    quantity: '1 to 2 tsp',
    measurementTip: 'Added after the covered steam so the spice coats the softened pieces without burning.',
    role: 'Provides warmth, rich crimson color, and gentle heat.',
    imagePath: IMAGE_ASSETS.masalaDabba,
    cropPosition: '16% 48%',
  },
  {
    id: 'tomato',
    name: 'Chopped Ripe Tomato',
    quantity: '1 medium tomato, diced',
    measurementTip: 'Optional addition for tangy gravy curries; skip for dry stir-fries.',
    role: 'Adds natural acidity, moisture, and a glossy glaze.',
    imagePath: IMAGE_ASSETS.masalaDabba,
    cropPosition: '88% 48%',
    optional: true,
  },
  {
    id: 'dhaniya-powder',
    name: 'Coriander Powder',
    quantity: '1 to 1.5 tsp',
    measurementTip: 'Sprinkle evenly before the final simmer to thicken the sauce.',
    role: 'Cooling citrusy spice that binds oil and water into a smooth gravy.',
    imagePath: IMAGE_ASSETS.masalaDabba,
    cropPosition: '28% 60%',
  },
  {
    id: 'coriander-leaves',
    name: 'Fresh Cilantro (Coriander) & Curry Leaves',
    quantity: '1/3 cup chopped + 4 curry leaves',
    measurementTip: 'Add right before the final 1-minute covered steam and 5-minute stove-off rest.',
    role: 'Bright herbal freshness locked into the pot by closing the lid.',
    imagePath: IMAGE_ASSETS.garnishReady,
    cropPosition: '50% 55%',
  },
];

export const TECHNIQUES: TechniqueItem[] = [
  {
    id: 'heat-shift-tadka',
    title: 'High-to-Lowest Heat Tempering Shift',
    indianTerm: 'Thermal Tempering Control',
    summary: 'Heat the pan and oil on High until shimmering, then drop to Lowest Heat right before adding seeds.',
    whyItWorks: 'Hot oil pops mustard and cumin seeds instantaneously, while dropping to lowest heat prevents delicate aromatics and powdered spices from burning.',
    proTip: 'Wait until you see faint ripples in the oil, then turn the burner all the way down to Low before sprinkling seeds.',
    imagePath: IMAGE_ASSETS.tadka,
  },
  {
    id: 'chitikedu-pinch',
    title: 'Finger-Pinch Measure & Staged Salting',
    indianTerm: '3-Stage Seasoning Method',
    summary: 'Using thumb-and-index finger pinches for whole seeds and early onion salting.',
    whyItWorks: 'One pinch of salt on raw onions draws out moisture so onions soften in 1 minute without needing excess oil.',
    proTip: '2 pinches equals roughly 1/2 teaspoon. Layering salt in 3 stages seasons both the base and the main ingredient evenly.',
    imagePath: IMAGE_ASSETS.masalaDabba,
  },
  {
    id: 'water-on-lid',
    title: 'Closed Lid & Water-on-Lid Steam Condensation',
    indianTerm: 'Covered Water-Lid Braising',
    summary: 'Covering the pan with a rimmed steel plate and pouring water ON TOP of the lid when sticking.',
    whyItWorks: 'Water on top of the metal lid makes steam inside the pot condense into steady droplets that drip back down, preventing burning without diluting flavor.',
    proTip: 'Use a concave steel plate or rimmed lid so water pools safely on top. Lift carefully at the end so top water does not spill.',
    imagePath: IMAGE_ASSETS.lidWater,
  },
  {
    id: 'dum-rest',
    title: 'Final Herb Trap & 5-Minute Stove-Off Rest',
    indianTerm: 'Covered Carryover Rest',
    summary: 'Adding fresh cilantro and curry leaves, closing the lid for 1 minute on low, then turning off the stove for 5 full minutes before eating.',
    whyItWorks: 'Carryover heat gently infuses essential oils from fresh cilantro and curry leaves throughout the dish.',
    proTip: 'Keep the lid closed for the full 5-minute stove-off rest to lock in all steam and aroma.',
    imagePath: IMAGE_ASSETS.garnishReady,
  },
];

export const RAW_RECIPE_STEPS: Omit<CookingStep, 'stepNumber'>[] = [
  {
    id: 'step-high-heat',
    phase: 'Tempering',
    title: 'High Heat',
    shortTitle: 'High Heat',
    originalDirective: 'High heat',
    instruction: 'Place your frying pan on the stove and turn the burner knob to High Heat.',
    chefDetail: 'Preheating the pan ensures the oil heats rapidly and evenly.',
    timerSeconds: 0,
    heat: 'high',
    lidState: 'open',
    ingredientIds: [],
    techniqueId: 'heat-shift-tadka',
    imagePath: IMAGE_ASSETS.tadka,
    imageCaption: 'Frying pan preheating over high stove flame',
  },
  {
    id: 'step-oil-heated',
    phase: 'Tempering',
    title: 'Heat Cooking Oil',
    shortTitle: 'Heat Oil',
    originalDirective: 'Oil-heated',
    instruction: 'Pour 2–3 tbsp of cooking oil into the pan and let it heat until shimmering.',
    chefDetail: 'Shimmering oil ensures cumin and mustard seeds pop immediately on contact.',
    timerSeconds: 0,
    heat: 'high',
    lidState: 'open',
    ingredientIds: ['oil'],
    techniqueId: 'heat-shift-tadka',
    imagePath: IMAGE_ASSETS.tadka,
    imageCaption: 'Cooking oil shimmering in the hot pan',
  },
  {
    id: 'step-lowest-heat',
    phase: 'Tempering',
    title: 'Lowest Heat',
    shortTitle: 'Lowest Heat',
    originalDirective: 'Lowest heat',
    instruction: 'Turn the burner knob all the way down to Lowest Heat before adding spices.',
    chefDetail: 'Hot oil pops the seeds while low heat prevents delicate spices from burning.',
    timerSeconds: 0,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['oil'],
    techniqueId: 'heat-shift-tadka',
    imagePath: IMAGE_ASSETS.tadka,
    imageCaption: 'Burner reduced to lowest heat',
  },
  {
    id: 'step-jilakara-aavalu',
    phase: 'Tempering',
    title: 'Cumin & Mustard Seeds',
    shortTitle: 'Cumin & Mustard',
    originalDirective: 'Cumin & Mustard Seeds — 2 pinches (Immediate)',
    instruction: 'Immediately sprinkle 2 pinches (~1/2 tsp) of Cumin & Mustard Seeds into the hot oil.',
    chefDetail: 'Let the seeds crackle and pop to release their toasted, nutty aroma.',
    timerSeconds: 0,
    immediate: true,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['jilakara-aavalu'],
    techniqueId: 'chitikedu-pinch',
    imagePath: IMAGE_ASSETS.tadka,
    imageCaption: 'Hand sprinkling cumin and mustard seeds into the frying pan',
  },
  {
    id: 'step-green-chilli',
    phase: 'Tempering',
    title: 'Add Green Chillies',
    shortTitle: 'Green Chillies',
    originalDirective: 'Immediate Green Chilli',
    instruction: 'Immediately drop in 2–3 lengthwise-slit fresh green chillies into the pan.',
    chefDetail: 'Slitting chillies prevents bursting and infuses fresh green heat into the oil.',
    timerSeconds: 0,
    immediate: true,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['green-chilli'],
    techniqueId: 'heat-shift-tadka',
    imagePath: IMAGE_ASSETS.tadka,
    imageCaption: 'Slit green chillies sizzling in the frying pan',
  },
  {
    id: 'step-curry-leaves',
    phase: 'Tempering',
    title: 'Add Curry Leaves',
    shortTitle: 'Curry Leaves',
    originalDirective: 'Add curry leaves -> Wait 1s',
    instruction: 'Drop in a sprig of fresh curry leaves and wait 1 second as they crisp up.',
    chefDetail: '1 second in hot oil blooms their citrusy aroma while keeping them bright green.',
    timerSeconds: 1,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['curry-leaves'],
    techniqueId: 'heat-shift-tadka',
    imagePath: IMAGE_ASSETS.tadka,
    imageCaption: 'Fresh curry leaves crisping for 1 second in oil',
  },
  {
    id: 'step-onion',
    phase: 'Aromatics',
    title: 'Add Chopped Onions',
    shortTitle: 'Chopped Onion',
    originalDirective: 'Onion -> Wait 1min',
    instruction: 'Add 1 cup of finely chopped red onions, toss in the spiced oil, and cook for 1 minute.',
    chefDetail: 'Onions cool the oil slightly and form the savory-sweet body of the dish.',
    timerSeconds: 60,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['onion'],
    techniqueId: 'chitikedu-pinch',
    imagePath: IMAGE_ASSETS.onionsTurmeric,
    imageCaption: 'Chopped red onions sautéing in the pan',
  },
  {
    id: 'step-salt-chitikedu',
    phase: 'Aromatics',
    title: 'Pinch of Salt',
    shortTitle: 'Pinch of Salt',
    originalDirective: 'Salt - 1 pinch -> Wait 1min',
    instruction: 'Sprinkle 1 pinch of salt over the onions, stir well, and sauté for 1 minute.',
    chefDetail: 'A pinch of salt draws moisture out of the onions so they soften rapidly.',
    timerSeconds: 60,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['salt', 'onion'],
    techniqueId: 'chitikedu-pinch',
    imagePath: IMAGE_ASSETS.onionsTurmeric,
    imageCaption: 'Hand sprinkling a pinch of salt over softening onions',
  },
  {
    id: 'step-ginger-garlic',
    phase: 'Aromatics',
    title: 'Ginger-Garlic Paste',
    shortTitle: 'Ginger-Garlic',
    originalDirective: 'Ginger garlic paste -> Wait 30sec',
    instruction: 'Spoon in 1 tbsp of fresh ginger-garlic paste and stir continuously for 30 seconds.',
    chefDetail: 'Stirring for 30 seconds removes the raw garlic edge and unlocks rich aroma.',
    timerSeconds: 30,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['ginger-garlic'],
    techniqueId: 'heat-shift-tadka',
    imagePath: IMAGE_ASSETS.onionsTurmeric,
    imageCaption: 'Spoon adding fresh ginger-garlic paste into the pan',
  },
  {
    id: 'step-haldi',
    phase: 'Aromatics',
    title: 'Turmeric Powder',
    shortTitle: 'Turmeric Powder',
    originalDirective: 'Turmeric (until light yellow) -> Wait 30sec',
    instruction: 'Sprinkle 1/4–1/2 tsp Turmeric Powder until the onions turn light yellow, stirring 30 seconds.',
    chefDetail: 'Blooming turmeric in warm oil unlocks golden color and earthy warmth.',
    timerSeconds: 30,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['haldi'],
    techniqueId: 'heat-shift-tadka',
    imagePath: IMAGE_ASSETS.onionsTurmeric,
    imageCaption: 'Sprinkling golden turmeric powder into the pan',
  },
  {
    id: 'step-main-mix',
    phase: 'Main & Steam',
    title: 'Add Main & Mix',
    shortTitle: 'Main Ingredient',
    originalDirective: 'MAIN INGREDIENT -> Mix well',
    instruction: 'Add your bite-size main ingredient pieces to the pan and toss until coated in the golden base.',
    chefDetail: 'Coating every piece in seasoned oil ensures even steaming under the closed lid.',
    timerSeconds: 0,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['main-ingredient'],
    techniqueId: 'water-on-lid',
    imagePath: IMAGE_ASSETS.masalaSimmer,
    imageCaption: 'Adding main ingredient cubes and mixing in the pan',
  },
  {
    id: 'step-close-lid-1',
    phase: 'Main & Steam',
    title: 'Close the Lid',
    shortTitle: 'Close Lid (1m)',
    originalDirective: 'Close the lid -> Wait 1min',
    instruction: 'CLOSE THE LID NOW! Cover the frying pan tightly with a rimmed steel lid and wait 1 minute.',
    chefDetail: 'Trapping natural steam softens the pieces before powdered chilli spice is added.',
    timerSeconds: 60,
    heat: 'lowest',
    lidState: 'closed-mandatory',
    lidReminderNote: 'Close the lid tightly right now to trap natural steam.',
    ingredientIds: ['main-ingredient'],
    techniqueId: 'water-on-lid',
    imagePath: IMAGE_ASSETS.lidWater,
    imageCaption: 'Hand lowering a tight lid onto the frying pan',
  },
  {
    id: 'step-water-on-lid',
    phase: 'Main & Steam',
    title: 'Water on Top of Lid',
    shortTitle: 'Water on Lid',
    originalDirective: 'If sticking add water on top of lid -> Wait 1min',
    instruction: 'KEEP LID CLOSED! If sticking, pour 1/2 cup of water directly ON TOP of the rimmed lid and wait 1 minute.',
    chefDetail: 'Cool water on top of the lid condenses steam inside the pan so nothing sticks or burns.',
    timerSeconds: 60,
    heat: 'lowest',
    lidState: 'closed-water-on-lid',
    lidReminderNote: 'Keep lid closed with water pooled on top of the steel plate.',
    ingredientIds: ['main-ingredient'],
    techniqueId: 'water-on-lid',
    imagePath: IMAGE_ASSETS.lidWater,
    imageCaption: 'Pouring water onto the top of the recessed steel lid',
  },
  {
    id: 'step-chilli-salt',
    phase: 'Spices & Simmer',
    title: 'Chilli Powder & Salt',
    shortTitle: 'Chilli & Salt',
    originalDirective: 'Chilli powder & Some Salt -> Wait 2min',
    instruction: 'Open the lid, sprinkle Red Chilli Powder (1–2 tsp) and some salt, stir well, and cook 2 minutes.',
    chefDetail: 'Adding chilli powder after steaming lets it coat the softened pieces without scorching.',
    timerSeconds: 120,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['chilli-powder', 'salt'],
    techniqueId: 'chitikedu-pinch',
    imagePath: IMAGE_ASSETS.masalaSimmer,
    imageCaption: 'Sprinkling red chilli powder and salt into the pan',
  },
  {
    id: 'step-optional-tomato',
    phase: 'Spices & Simmer',
    title: 'Add Chopped Tomato',
    shortTitle: 'Add Tomato',
    originalDirective: '(Optional) Add tomato',
    instruction: 'Toss in 1 diced ripe tomato and stir for 45 seconds until juicy and soft.',
    chefDetail: 'Tomatoes deglaze the pan and add bright tanginess.',
    timerSeconds: 45,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['tomato'],
    techniqueId: 'water-on-lid',
    imagePath: IMAGE_ASSETS.masalaSimmer,
    imageCaption: 'Adding diced ripe tomatoes into the pan',
    optionalTomatoStep: true,
  },
  {
    id: 'step-meat-water-lid',
    phase: 'Spices & Simmer',
    title: 'Add Water & Close Lid',
    shortTitle: 'Water & Close Lid',
    originalDirective: '(If meat) Wait 2min and add water until pieces -> Close the lid',
    instruction: 'Cook 2 minutes, pour water up to the level of the meat pieces, and CLOSE THE LID tightly!',
    chefDetail: 'Simmering meat under a closed lid tenderizes the pieces into a rich gravy.',
    timerSeconds: 120,
    heat: 'lowest',
    lidState: 'closed-mandatory',
    lidReminderNote: 'Close the lid tightly after adding water up to the pieces.',
    ingredientIds: ['main-ingredient'],
    techniqueId: 'water-on-lid',
    imagePath: IMAGE_ASSETS.lidWater,
    imageCaption: 'Pouring water to the piece level and closing the lid',
    meatSpecificStep: true,
  },
  {
    id: 'step-dhaniya-powder',
    phase: 'Spices & Simmer',
    title: 'Coriander Powder',
    shortTitle: 'Coriander Powder',
    originalDirective: 'Coriander powder -> Wait 1min',
    instruction: 'Sprinkle 1–1.5 tsp of Coriander Powder, stir gently, and simmer for 1 minute.',
    chefDetail: 'Coriander powder naturally thickens and unifies the oil and juices into a glossy sauce.',
    timerSeconds: 60,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['dhaniya-powder'],
    techniqueId: 'heat-shift-tadka',
    imagePath: IMAGE_ASSETS.masalaSimmer,
    imageCaption: 'Sprinkling roasted coriander powder into the simmering curry',
  },
  {
    id: 'step-final-salt-taste',
    phase: 'Finish & Rest',
    title: 'Final Salt & Taste',
    shortTitle: 'Salt & Taste',
    originalDirective: 'Final Salt -> Taste it (lightly salty and spicy)',
    instruction: 'Sprinkle final salt to taste and sample a spoonful—it should be lightly salty and warmly spicy.',
    chefDetail: 'Slightly punchy seasoning ensures the curry tastes balanced when eaten with rice or flatbread.',
    timerSeconds: 0,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['salt'],
    techniqueId: 'chitikedu-pinch',
    imagePath: IMAGE_ASSETS.masalaSimmer,
    imageCaption: 'Tasting a spoonful and adjusting final salt',
  },
  {
    id: 'step-remove-lid-water',
    phase: 'Finish & Rest',
    title: 'Remove Lid Water',
    shortTitle: 'Remove Lid Water',
    originalDirective: 'Remove water on lid if added',
    instruction: 'Hold the hot lid level with a cloth, lift it off, and discard any water remaining on top.',
    chefDetail: 'Drying the lid prepares it for the final herb steam.',
    timerSeconds: 0,
    heat: 'lowest',
    lidState: 'remove-lid-water',
    lidReminderNote: 'Hold the hot lid level with a cloth and pour off top water.',
    ingredientIds: [],
    techniqueId: 'water-on-lid',
    imagePath: IMAGE_ASSETS.lidWater,
    imageCaption: 'Lifting the lid and removing the water pooled on top',
  },
  {
    id: 'step-coriander-curry-mix',
    phase: 'Finish & Rest',
    title: 'Add Cilantro & Mix',
    shortTitle: 'Cilantro & Leaves',
    originalDirective: 'Add Coriander and curry leaf -> Mix',
    instruction: 'Sprinkle chopped fresh cilantro (coriander leaves) and fresh curry leaves, then mix gently.',
    chefDetail: 'Fresh herbs added at the end release bright aromatic oils.',
    timerSeconds: 0,
    heat: 'lowest',
    lidState: 'open',
    ingredientIds: ['coriander-leaves', 'curry-leaves'],
    techniqueId: 'dum-rest',
    imagePath: IMAGE_ASSETS.garnishReady,
    imageCaption: 'Hand sprinkling chopped cilantro and curry leaves into the pan',
  },
  {
    id: 'step-close-lid-final-1min',
    phase: 'Finish & Rest',
    title: 'Close the Lid',
    shortTitle: 'Close Lid (1m)',
    originalDirective: 'Close lid -> Wait 1 min',
    instruction: 'CLOSE THE LID NOW! Cover the pan tightly on Lowest Heat for 1 final minute.',
    chefDetail: 'Closing the lid traps the fresh cilantro and curry leaf essential oils inside the dish.',
    timerSeconds: 60,
    heat: 'lowest',
    lidState: 'closed-mandatory',
    lidReminderNote: 'Close the lid tightly right now to lock in fresh herb aroma.',
    ingredientIds: ['coriander-leaves'],
    techniqueId: 'dum-rest',
    imagePath: IMAGE_ASSETS.lidWater,
    imageCaption: 'Closing the lid tightly for 1 final minute',
  },
  {
    id: 'step-turn-off-stove-5min',
    phase: 'Finish & Rest',
    title: 'Stove Off & Rest',
    shortTitle: 'Stove Off (5m)',
    originalDirective: 'Turn off the stove -> Wait 5 min',
    instruction: 'Turn OFF the stove burner completely. KEEP THE LID CLOSED and let rest for 5 minutes.',
    chefDetail: '5 minutes of covered rest lets carryover heat settle the flavors and separate the spiced oil.',
    timerSeconds: 300,
    heat: 'off',
    lidState: 'closed-mandatory',
    lidReminderNote: 'Keep the lid closed for the full 5-minute stove-off rest.',
    ingredientIds: [],
    techniqueId: 'dum-rest',
    imagePath: IMAGE_ASSETS.garnishReady,
    imageCaption: 'Stove turned off while the covered pan rests for 5 minutes',
  },
  {
    id: 'step-eat',
    phase: 'Finish & Rest',
    title: 'Open Lid & Eat',
    shortTitle: 'Serve & Eat',
    originalDirective: 'Eat',
    instruction: 'Open the lid, inhale the rich aroma of tempered spices and herbs, and serve hot!',
    chefDetail: 'Your dish is ready—enjoy with steamed rice, roti, or naan.',
    timerSeconds: 0,
    heat: 'off',
    lidState: 'open',
    ingredientIds: ['main-ingredient', 'coriander-leaves'],
    techniqueId: 'dum-rest',
    imagePath: IMAGE_ASSETS.garnishReady,
    imageCaption: 'Finished curry garnished with cilantro ready to eat',
  },
];

export function getFilteredSteps(config: RecipeConfig): CookingStep[] {
  const customLabel = config.customMainName?.trim()
    ? config.customMainName.trim()
    : config.mainType === 'meat'
      ? 'Meat'
      : config.mainType === 'paneer'
        ? 'Paneer'
        : 'Vegetables';

  const filtered = RAW_RECIPE_STEPS.filter((step) => {
    if (step.optionalTomatoStep && !config.includeTomato) {
      return false;
    }
    if (step.meatSpecificStep && config.mainType !== 'meat') {
      return false;
    }
    return true;
  });

  return filtered.map((step, index) => {
    const title = step.id === 'step-main-mix'
      ? `Add ${customLabel} & Mix`
      : step.title;
    return {
      ...step,
      title,
      stepNumber: index + 1,
    };
  });
}

export function formatTimerDisplay(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function calculateProgressPercent(currentIndex: number, totalSteps: number): number {
  if (totalSteps <= 1) return 100;
  const safeIndex = Math.min(Math.max(0, currentIndex), totalSteps - 1);
  return Math.round(((safeIndex + 1) / totalSteps) * 100);
}

export function calculateRemainingTimeSeconds(
  steps: CookingStep[],
  currentIndex: number,
  currentStepRemaining: number
): number {
  if (steps.length === 0 || currentIndex >= steps.length) return 0;
  let total = Math.max(0, currentStepRemaining);
  for (let i = currentIndex + 1; i < steps.length; i++) {
    total += steps[i].timerSeconds;
  }
  return total;
}

export function calculateTotalTimeSeconds(steps: CookingStep[]): number {
  return steps.reduce((sum, step) => sum + Math.max(0, step.timerSeconds), 0);
}

export function formatHumanDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  if (s === 0) return 'Action';
  if (s < 60) return `${s}s`;
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return rem === 0 ? `${mins}m` : `${mins}m ${rem}s`;
}

export function computeWallClockRemaining(endTimeMs: number, nowMs: number): number {
  return Math.max(0, Math.ceil((endTimeMs - nowMs) / 1000));
}

export function getLidReminderState(step: CookingStep): {
  requiresAlert: boolean;
  badgeText: string;
  instruction: string;
  urgency: 'critical' | 'water-on-lid' | 'remove-water' | 'none';
} {
  if (step.lidState === 'closed-mandatory') {
    return {
      requiresAlert: true,
      badgeText: 'Close the Lid Tightly',
      instruction:
        step.lidReminderNote ||
        'Close the pan lid tightly right now so steam and aroma stay locked inside.',
      urgency: 'critical',
    };
  }
  if (step.lidState === 'closed-water-on-lid') {
    return {
      requiresAlert: true,
      badgeText: 'Lid Closed + Pour Water on Lid',
      instruction:
        step.lidReminderNote ||
        'Keep the lid closed and pour water on top of the steel lid plate.',
      urgency: 'water-on-lid',
    };
  }
  if (step.lidState === 'remove-lid-water') {
    return {
      requiresAlert: true,
      badgeText: 'Remove Water from Top of Lid',
      instruction:
        step.lidReminderNote ||
        'Hold the hot lid level with a cloth and pour off top water.',
      urgency: 'remove-water',
    };
  }
  return {
    requiresAlert: false,
    badgeText: 'Lid Open — Uncovered',
    instruction: 'Cook uncovered so moisture evaporates and spices fry cleanly.',
    urgency: 'none',
  };
}

export function parseVoiceCommand(transcript: string): VoiceAction | null {
  const clean = transcript.trim().toLowerCase();
  if (!clean) return null;

  if (/\b(next|forward|done|finished|skip|continue)\b/.test(clean)) {
    return 'NEXT_STEP';
  }
  if (/\b(back|previous|prev|go back)\b/.test(clean)) {
    return 'PREV_STEP';
  }
  if (/\b(start|pause|timer|stop timer|resume|wait)\b/.test(clean)) {
    return 'START_PAUSE_TIMER';
  }
  if (/\b(reset|restart)\b/.test(clean)) {
    return 'RESET_TIMER';
  }
  if (/\b(read|repeat|speak|say again|instruction)\b/.test(clean)) {
    return 'READ_ALOUD';
  }
  if (/\b(lid|cover|close lid)\b/.test(clean)) {
    return 'CHECK_LID';
  }
  return null;
}

export function detectClapSpike(
  rmsVal: number,
  peakVal: number,
  lastClapTimestamp: number,
  now: number,
  threshold = 0.28
): boolean {
  if (now - lastClapTimestamp < 900) {
    return false;
  }
  return peakVal >= threshold && rmsVal >= threshold * 0.45;
}

export interface AccentPreset {
  id: string;
  name: string;
  hex: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'cobalt', name: 'Indigo Flame', hex: '#3B82F6' },
  { id: 'ember', name: 'Saffron Ember', hex: '#EA580C' },
  { id: 'turmeric', name: 'Turmeric Gold', hex: '#D97706' },
  { id: 'crimson', name: 'Kashmiri Chilli', hex: '#E11D48' },
  { id: 'curry', name: 'Curry Leaf', hex: '#10B981' },
  { id: 'violet', name: 'Cardamom Violet', hex: '#8B5CF6' },
];

export function normalizeHexColor(input: string): string | null {
  const cleaned = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    const expanded = cleaned
      .split('')
      .map((c) => c + c)
      .join('')
      .toUpperCase();
    return `#${expanded}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return `#${cleaned.toUpperCase()}`;
  }
  return null;
}

export function resolveGitHubRepoUrl(
  envRepoUrl?: string,
  hostname?: string,
  pathname?: string
): string {
  if (envRepoUrl && /^https?:\/\/github\.com\/[^/]+\/[^/]+/.test(envRepoUrl.trim())) {
    return envRepoUrl.trim().replace(/\/+$/, '');
  }

  const host = (hostname ?? (typeof window !== 'undefined' ? window.location.hostname : '')).toLowerCase();
  const path = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');

  if (host.endsWith('.github.io')) {
    const owner = host.replace(/\.github\.io$/, '');
    const segments = path.split('/').filter(Boolean);
    if (owner && segments.length > 0) {
      return `https://github.com/${owner}/${segments[0]}`;
    }
    if (owner) {
      return `https://github.com/${owner}/simple-cooking`;
    }
  }

  return 'https://github.com/desi-vibecoder/simple-cooking';
}


