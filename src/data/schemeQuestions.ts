import { Question } from '../types';

export const SCHEME_QUESTIONS: Question[] = [
  // ==========================================
  // GENERAL MATHEMATICS (SS1 - SS3)
  // ==========================================
  {
    id: 'math-001',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 1,
    week: 1,
    topic: 'Number Bases (I)',
    subtopic: 'Base Conversion',
    question: 'Convert the binary number 11011₂ to base 10 (denary).',
    options: ['23', '27', '31', '25'],
    correctAnswer: 1,
    explanation: '1×2⁴ + 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 16 + 8 + 0 + 2 + 1 = 27₁₀.'
  },
  {
    id: 'math-002',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 1,
    week: 2,
    topic: 'Number Bases (II)',
    subtopic: 'Base Operations',
    question: 'Evaluate the binary addition: 1011₂ + 110₂ in base 2.',
    options: ['10001₂', '10010₂', '10000₂', '11101₂'],
    correctAnswer: 0,
    explanation: '1011₂ (11) + 110₂ (6) = 17₁₀. Converting 17 to base 2: 17 = 16 + 1 = 10001₂.'
  },
  {
    id: 'math-003',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 1,
    week: 3,
    topic: 'Modular Arithmetic',
    subtopic: 'Modulo Operations',
    question: 'Find the value of (23 + 34) (mod 7).',
    options: ['1', '3', '5', '4'],
    correctAnswer: 0,
    explanation: '23 + 34 = 57. 57 divided by 7 equals 8 with a remainder of 1. Therefore, 57 ≡ 1 (mod 7).'
  },
  {
    id: 'math-004',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 1,
    week: 4,
    topic: 'Indices',
    subtopic: 'Laws of Indices',
    question: 'Simplify (81)^(3/4).',
    options: ['9', '18', '27', '36'],
    correctAnswer: 2,
    explanation: '81^(3/4) = (⁴√81)³ = 3³ = 27.'
  },
  {
    id: 'math-005',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 1,
    week: 5,
    topic: 'Standard Form',
    subtopic: 'Scientific Notation',
    question: 'Express 0.000458 in standard form (A × 10ⁿ where 1 ≤ A < 10).',
    options: ['4.58 × 10⁻⁴', '4.58 × 10⁴', '45.8 × 10⁻⁵', '0.458 × 10⁻³'],
    correctAnswer: 0,
    explanation: 'Moving the decimal point 4 places to the right yields 4.58 × 10⁻⁴.'
  },
  {
    id: 'math-006',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 1,
    week: 6,
    topic: 'Logarithms (I)',
    subtopic: 'Logarithmic Definitions',
    question: 'If log₁₀(x) = 3, what is the value of x?',
    options: ['30', '300', '1000', '3000'],
    correctAnswer: 2,
    explanation: 'By the definition of logarithms, log_b(y) = z implies bᶻ = y. Thus x = 10³ = 1000.'
  },
  {
    id: 'math-007',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 1,
    week: 9,
    topic: 'Definition of Sets',
    subtopic: 'Types of Sets',
    question: 'A set that has no elements is called what?',
    options: ['Universal set', 'Singleton set', 'Null or Empty set', 'Power set'],
    correctAnswer: 2,
    explanation: 'A set containing no members is denoted as ∅ or {} and is termed the null, void, or empty set.'
  },
  {
    id: 'math-008',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 1,
    week: 10,
    topic: 'Set Operations',
    subtopic: 'Venn Diagrams',
    question: 'In a class of 40 students, 25 play football and 20 play volleyball. If every student plays at least one game, how many play both?',
    options: ['5', '10', '15', '8'],
    correctAnswer: 0,
    explanation: 'n(A ∪ B) = n(A) + n(B) - n(A ∩ B) => 40 = 25 + 20 - x => x = 45 - 40 = 5.'
  },
  {
    id: 'math-009',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 2,
    week: 1,
    topic: 'Factorisation of Quadratic Expressions',
    subtopic: 'Quadratic Equations',
    question: 'Factorize completely: 2x² + 7x + 3.',
    options: ['(2x + 1)(x + 3)', '(2x + 3)(x + 1)', '(2x - 1)(x - 3)', '(x + 2)(2x + 3)'],
    correctAnswer: 0,
    explanation: 'Product = 6, Sum = 7. Factors are 6 and 1: 2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3).'
  },
  {
    id: 'math-010',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 2,
    week: 4,
    topic: 'Logical Reasoning',
    subtopic: 'Truth Tables & Conjunctions',
    question: 'In symbolic logic, the compound statement "p ∧ q" is TRUE only when:',
    options: ['Either p is true or q is true', 'Both p and q are true', 'p is true and q is false', 'Both p and q are false'],
    correctAnswer: 1,
    explanation: 'A conjunction (∧) is true if and only if both constituent statements p and q are simultaneously true.'
  },
  {
    id: 'math-011',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 2,
    week: 6,
    topic: 'Mensuration of Solid Shapes',
    subtopic: 'Arc Length & Sectors',
    question: 'The formula for the length of an arc of a circle subtending angle θ at the center of radius r is:',
    options: ['(θ / 360) × πr²', '(θ / 360) × 2πr', '(θ / 180) × 2πr', '(θ / 360) × πr'],
    correctAnswer: 1,
    explanation: 'Arc length L = (θ / 360) × 2πr where θ is the angle in degrees.'
  },
  {
    id: 'math-012',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 3,
    week: 5,
    topic: 'Trigonometry',
    subtopic: 'Trig Ratios of Special Angles',
    question: 'What is the exact value of sin(30°)?',
    options: ['1/√2', '√3/2', '1/2', '1'],
    correctAnswer: 2,
    explanation: 'For the special equilateral triangle construction, sin(30°) = Opposite/Hypotenuse = 1/2.'
  },
  {
    id: 'math-013',
    subject: 'General Mathematics',
    classLevel: 'SS1',
    term: 3,
    week: 8,
    topic: 'Statistics',
    subtopic: 'Measures of Central Tendency',
    question: 'Find the median of the following numbers: 4, 8, 3, 9, 7, 6, 12.',
    options: ['6', '7', '8', '6.5'],
    correctAnswer: 1,
    explanation: 'Arranging in ascending order: 3, 4, 6, 7, 8, 9, 12. The middle (4th) item is 7.'
  },

  // ==========================================
  // ENGLISH STUDIES (SS1 - SS3)
  // ==========================================
  {
    id: 'eng-001',
    subject: 'English Studies',
    classLevel: 'SS1',
    term: 1,
    week: 1,
    topic: 'Speech Sounds',
    subtopic: 'Consonant /ʒ/',
    question: 'Which of the following words contains the consonant sound /ʒ/?',
    options: ['Church', 'Television', 'Judge', 'Shine'],
    correctAnswer: 1,
    explanation: 'In the word "Television", the letter combination "si" is pronounced /ʒ/ as in vision, measure, occasion.'
  },
  {
    id: 'eng-002',
    subject: 'English Studies',
    classLevel: 'SS1',
    term: 1,
    week: 3,
    topic: 'Grammatical Structures',
    subtopic: 'Noun Phrases',
    question: 'Identify the noun phrase functioning as the subject in: "The clever little boy solved the puzzle."',
    options: ['The clever little boy', 'solved the puzzle', 'the puzzle', 'clever little boy solved'],
    correctAnswer: 0,
    explanation: '"The clever little boy" is a noun phrase with "boy" as headword modified by determiners and adjectives, acting as subject.'
  },
  {
    id: 'eng-003',
    subject: 'English Studies',
    classLevel: 'SS1',
    term: 1,
    week: 6,
    topic: 'Pronouns',
    subtopic: 'Relative Pronouns',
    question: 'Fill in the blank with the appropriate relative pronoun: "The doctor ______ performed the surgery is Nigerian."',
    options: ['which', 'who', 'whom', 'whose'],
    correctAnswer: 1,
    explanation: '"Who" is used as the subject relative pronoun referring to human beings.'
  },
  {
    id: 'eng-004',
    subject: 'English Studies',
    classLevel: 'SS1',
    term: 2,
    week: 9,
    topic: 'Concord',
    subtopic: 'Subject-Verb Agreement',
    question: 'Choose the correct option: "Neither the teacher nor the students ______ present at the assembly."',
    options: ['was', 'were', 'is', 'are being'],
    correctAnswer: 1,
    explanation: 'Under the rule of proximity with "neither... nor", the verb agrees with the closer subject ("students", which is plural => "were").'
  },
  {
    id: 'eng-005',
    subject: 'English Studies',
    classLevel: 'SS1',
    term: 2,
    week: 11,
    topic: 'Vocabulary Development',
    subtopic: 'Stock Exchange Register',
    question: 'In stock broking, what term describes a market condition where prices are consistently rising?',
    options: ['Bearish market', 'Bullish market', 'Stagnant market', 'Deflationary index'],
    correctAnswer: 1,
    explanation: 'A "bullish market" is characterized by investor optimism and rising asset or stock prices.'
  },
  {
    id: 'eng-006',
    subject: 'English Studies',
    classLevel: 'SS1',
    term: 3,
    week: 4,
    topic: 'Speech Work',
    subtopic: 'Emphatic Stress',
    question: 'In the sentence: "MARY bought the blue bicycle yesterday", who bought the bicycle?',
    options: ['John', 'Mary, and nobody else', 'The shopkeeper', 'Mary\'s sister'],
    correctAnswer: 1,
    explanation: 'Emphatic stress on "MARY" highlights that Mary, and specifically no other person, made the purchase.'
  },

  // ==========================================
  // BIOLOGY (SS1 - SS3)
  // ==========================================
  {
    id: 'bio-001',
    subject: 'Biology',
    classLevel: 'SS1',
    term: 1,
    week: 1,
    topic: 'Recognising Living Things',
    subtopic: 'Levels of Organization of Life',
    question: 'Which of the following represents the correct sequence of increasing complexity in levels of organization?',
    options: [
      'Cell → Organ → Tissue → System → Organism',
      'Cell → Tissue → Organ → System → Organism',
      'Tissue → Cell → Organ → Organism → System',
      'Organ → Tissue → Cell → System → Organism'
    ],
    correctAnswer: 1,
    explanation: 'Cells organize into tissues, tissues into organs, organs into organ systems, which form complete organisms.'
  },
  {
    id: 'bio-002',
    subject: 'Biology',
    classLevel: 'SS1',
    term: 1,
    week: 4,
    topic: 'The Cell',
    subtopic: 'Organelles and Functions',
    question: 'Which organelle is universally termed the powerhouse of the eukaryotic cell because it produces ATP?',
    options: ['Ribosome', 'Golgi apparatus', 'Mitochondrion', 'Endoplasmic reticulum'],
    correctAnswer: 2,
    explanation: 'Mitochondria are the primary sites for cellular aerobic respiration and ATP generation.'
  },
  {
    id: 'bio-003',
    subject: 'Biology',
    classLevel: 'SS1',
    term: 1,
    week: 5,
    topic: 'Cell and Its Environment',
    subtopic: 'Osmosis & Plasmolysis',
    question: 'What happens to a red blood cell when placed in a hypotonic solution?',
    options: ['It crenates (shrinks)', 'It undergoes haemolysis (bursts)', 'It becomes turgid with no change', 'It plasmolyses'],
    correctAnswer: 1,
    explanation: 'Because animal cells lack a rigid cellulose wall, net water influx by osmosis in a hypotonic solution causes the cell membrane to burst (haemolysis).'
  },
  {
    id: 'bio-004',
    subject: 'Biology',
    classLevel: 'SS1',
    term: 1,
    week: 7,
    topic: 'Properties of the Cell',
    subtopic: 'Cellular Respiration',
    question: 'In the absence of oxygen, pyruvic acid in animal muscle cells is converted into:',
    options: ['Ethanol and CO₂', 'Lactic acid', 'Citric acid', 'Glucose-6-phosphate'],
    correctAnswer: 1,
    explanation: 'During anaerobic glycolysis in mammalian muscle tissue, pyruvate acts as hydrogen acceptor producing lactic acid.'
  },
  {
    id: 'bio-005',
    subject: 'Biology',
    classLevel: 'SS1',
    term: 2,
    week: 1,
    topic: 'Tissue and Supporting System',
    subtopic: 'Types of Skeleton',
    question: 'Earthworms maintain their shape and move using which type of skeleton?',
    options: ['Exoskeleton of chitin', 'Hydrostatic skeleton', 'Endoskeleton of cartilage', 'Calcareous shell'],
    correctAnswer: 1,
    explanation: 'Earthworms rely on fluid under pressure inside their coelomic cavity, known as a hydrostatic skeleton.'
  },
  {
    id: 'bio-006',
    subject: 'Biology',
    classLevel: 'SS1',
    term: 2,
    week: 10,
    topic: 'Trophic Levels',
    subtopic: 'Food Chains & Energy Flow',
    question: 'In an ecological food chain, what percentage of energy is approximately transferred from one trophic level to the next?',
    options: ['10%', '50%', '90%', '100%'],
    correctAnswer: 0,
    explanation: 'According to Lindeman\'s 10% Law, approximately 90% of energy is lost as metabolic heat and waste, leaving only ~10% transferred.'
  },

  // ==========================================
  // CHEMISTRY (SS1 - SS3)
  // ==========================================
  {
    id: 'chm-001',
    subject: 'Chemistry',
    classLevel: 'SS1',
    term: 1,
    week: 5,
    topic: 'Standard Separation Techniques',
    subtopic: 'Fractional Distillation',
    question: 'Which separation technique is used in oil refineries to separate crude oil into gasoline, kerosene, and diesel?',
    options: ['Simple crystallization', 'Paper chromatography', 'Fractional distillation', 'Sublimation'],
    correctAnswer: 2,
    explanation: 'Fractional distillation separates miscible liquids that have close boiling points based on their boiling points.'
  },
  {
    id: 'chm-002',
    subject: 'Chemistry',
    classLevel: 'SS1',
    term: 1,
    week: 10,
    topic: 'Particulate Nature of Matter',
    subtopic: 'Isotopy and Atomic Structure',
    question: 'Isotopes of a given element have the same number of:',
    options: ['Neutrons but different protons', 'Protons but different neutrons', 'Electrons but different protons', 'Mass numbers'],
    correctAnswer: 1,
    explanation: 'Isotopes are atoms of the same element having identical atomic numbers (protons) but different mass numbers (neutrons).'
  },
  {
    id: 'chm-003',
    subject: 'Chemistry',
    classLevel: 'SS1',
    term: 2,
    week: 1,
    topic: 'Chemical Combination',
    subtopic: 'Chemical Bonds',
    question: 'What type of bond is formed when electrons are completely transferred from a metal atom to a non-metal atom?',
    options: ['Covalent bond', 'Electrovalent (Ionic) bond', 'Dative coordinate bond', 'Metallic bond'],
    correctAnswer: 1,
    explanation: 'Electrovalent or ionic bonding occurs via complete electron transfer between electropositive metals and electronegative non-metals.'
  },
  {
    id: 'chm-004',
    subject: 'Chemistry',
    classLevel: 'SS1',
    term: 2,
    week: 6,
    topic: 'Gas Laws',
    subtopic: "Boyle's and Charles's Laws",
    question: "According to Boyle's law, at constant temperature, the volume of a given mass of gas is:",
    options: [
      'Directly proportional to its pressure',
      'Inversely proportional to its pressure',
      'Directly proportional to absolute temperature',
      'Independent of pressure'
    ],
    correctAnswer: 1,
    explanation: "Boyle's law states that P₁V₁ = P₂V₂ at constant temperature (V ∝ 1/P)."
  },
  {
    id: 'chm-005',
    subject: 'Chemistry',
    classLevel: 'SS1',
    term: 2,
    week: 9,
    topic: 'Acids, Bases and Salts',
    subtopic: 'Characteristics & Indicators',
    question: 'A solution with a pH of 3 is best classified as:',
    options: ['Neutral', 'Strongly basic', 'Weakly alkaline', 'Strongly acidic'],
    correctAnswer: 3,
    explanation: 'On the pH scale (0-14), values below 7 indicate acidity, and pH 3 is strongly acidic.'
  },
  {
    id: 'chm-006',
    subject: 'Chemistry',
    classLevel: 'SS1',
    term: 3,
    week: 8,
    topic: 'Hydrocarbons',
    subtopic: 'Alkanes and Homologous Series',
    question: 'What is the general molecular formula for the Alkane homologous series?',
    options: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙH₂ₙ₊₁OH'],
    correctAnswer: 1,
    explanation: 'Alkanes are saturated open-chain hydrocarbons with the general formula CₙH₂ₙ₊₂ (e.g. Methane CH₄, Ethane C₂H₆).'
  },

  // ==========================================
  // PHYSICS (SS1 - SS3)
  // ==========================================
  {
    id: 'phy-001',
    subject: 'Physics',
    classLevel: 'SS1',
    term: 1,
    week: 1,
    topic: 'Introduction to Physics',
    subtopic: 'Fundamental and Derived Quantities',
    question: 'Which of the following is a fundamental physical quantity in the S.I. system?',
    options: ['Velocity', 'Electric current', 'Force', 'Volume'],
    correctAnswer: 1,
    explanation: 'The 7 SI fundamental quantities are length, mass, time, electric current (Ampere), temperature, amount of substance, and luminous intensity.'
  },
  {
    id: 'phy-002',
    subject: 'Physics',
    classLevel: 'SS1',
    term: 1,
    week: 7,
    topic: 'Rectilinear Acceleration',
    subtopic: 'Equations of Motion',
    question: 'A car starts from rest and accelerates uniformly at 2 m/s² for 5 seconds. What is its final velocity?',
    options: ['5 m/s', '10 m/s', '15 m/s', '20 m/s'],
    correctAnswer: 1,
    explanation: 'Using v = u + at: with initial velocity u = 0, a = 2 m/s², t = 5 s => v = 0 + (2 × 5) = 10 m/s.'
  },
  {
    id: 'phy-003',
    subject: 'Physics',
    classLevel: 'SS1',
    term: 1,
    week: 8,
    topic: 'Scalars and Vectors',
    subtopic: 'Vector Distinction',
    question: 'Which of the following is a vector quantity?',
    options: ['Speed', 'Mass', 'Displacement', 'Energy'],
    correctAnswer: 2,
    explanation: 'Displacement has both magnitude and a specified direction, unlike scalar quantities like mass, speed, or energy.'
  },
  {
    id: 'phy-004',
    subject: 'Physics',
    classLevel: 'SS1',
    term: 2,
    week: 2,
    topic: 'Thermal Expansivity',
    subtopic: 'Linear and Cubic Expansion',
    question: 'The cubic expansivity (γ) of an isotropic solid substance is related to its linear expansivity (α) by:',
    options: ['γ = α', 'γ = 2α', 'γ = 3α', 'γ = α / 3'],
    correctAnswer: 2,
    explanation: 'Volume/cubic expansivity γ = 3α for isotropic materials, while superficial expansivity β = 2α.'
  },
  {
    id: 'phy-005',
    subject: 'Physics',
    classLevel: 'SS1',
    term: 2,
    week: 8,
    topic: 'Electric Field & Circuits',
    subtopic: "Ohm's Law",
    question: "If a current of 2 Amperes flows through a resistor connected to a 12V battery, what is the resistance?",
    options: ['24 Ω', '6 Ω', '10 Ω', '14 Ω'],
    correctAnswer: 1,
    explanation: "By Ohm's law, V = IR => R = V / I = 12V / 2A = 6 Ω."
  },
  {
    id: 'phy-006',
    subject: 'Physics',
    classLevel: 'SS1',
    term: 3,
    week: 1,
    topic: 'Elastic Properties of Solids',
    subtopic: "Hooke's Law",
    question: "Hooke's law states that provided the elastic limit is not exceeded, extension is directly proportional to:",
    options: ['Applied load / Force', 'Original length squared', 'Cross-sectional area', 'Elastic potential energy'],
    correctAnswer: 0,
    explanation: "F = ke, where force F is directly proportional to spring extension e up to the elastic limit."
  },

  // ==========================================
  // CIVIC EDUCATION & GOVERNMENT (SS1 - SS3)
  // ==========================================
  {
    id: 'civ-001',
    subject: 'Civic Education',
    classLevel: 'SS1',
    term: 1,
    week: 1,
    topic: 'Values in Society',
    subtopic: 'Definition and Types of Values',
    question: 'Which of the following values promotes impartiality and fairness in human relationships?',
    options: ['Selfishness', 'Justice', 'Prejudice', 'Greed'],
    correctAnswer: 1,
    explanation: 'Justice guarantees that every citizen receives fair, equitable, and impartial treatment under the law.'
  },
  {
    id: 'civ-002',
    subject: 'Civic Education',
    classLevel: 'SS1',
    term: 1,
    week: 5,
    topic: 'HIV and AIDS Awareness',
    subtopic: 'Transmission and Prevention',
    question: 'Which of the following is NOT a mode of transmission for HIV?',
    options: [
      'Transfusion of unscreened infected blood',
      'Sharing unsterilized sharp objects',
      'Hugging or shaking hands with an infected person',
      'Mother-to-child transmission during birth'
    ],
    correctAnswer: 2,
    explanation: 'HIV cannot be transmitted through casual, non-sexual physical contact such as hugging, shaking hands, or sharing eating utensils.'
  },
  {
    id: 'civ-003',
    subject: 'Civic Education',
    classLevel: 'SS1',
    term: 2,
    week: 1,
    topic: 'Democracy',
    subtopic: 'Characteristics of Democracy',
    question: 'What is a core pillar of a genuine democratic system?',
    options: [
      'Rule by military decree',
      'Periodic free and fair elections with citizen participation',
      'Hereditary succession to power',
      'Single-party dictatorship'
    ],
    correctAnswer: 1,
    explanation: 'Democracy is founded on sovereignty of the people exercised through regular, transparent, free, and competitive elections.'
  },
  {
    id: 'civ-004',
    subject: 'Civic Education',
    classLevel: 'SS1',
    term: 2,
    week: 4,
    topic: 'Major Pillars of Democracy',
    subtopic: 'Organs of Government',
    question: 'Which organ of government is constitutionally empowered to interpret laws and administer justice?',
    options: ['The Legislature', 'The Executive', 'The Judiciary', 'The Civil Service'],
    correctAnswer: 2,
    explanation: 'The Judiciary adjudicates disputes, interprets the constitution, and ensures compliance with established laws.'
  },
  {
    id: 'civ-005',
    subject: 'Government',
    classLevel: 'SS1',
    term: 1,
    week: 2,
    topic: 'Basic Concepts of Government',
    subtopic: 'Sovereignty',
    question: 'The supreme legal authority of a state to make and enforce laws without external interference is termed:',
    options: ['Legitimacy', 'Sovereignty', 'Influence', 'Bureaucracy'],
    correctAnswer: 1,
    explanation: 'Sovereignty denotes supreme, absolute, and unchallengeable power possessed by an independent state.'
  },
  {
    id: 'civ-006',
    subject: 'Government',
    classLevel: 'SS1',
    term: 2,
    week: 7,
    topic: 'Separation of Powers',
    subtopic: 'Checks and Balances',
    question: 'The doctrine of Separation of Powers was popularized by which political philosopher?',
    options: ['Baron de Montesquieu', 'Karl Marx', 'Thomas Hobbes', 'Adam Smith'],
    correctAnswer: 0,
    explanation: 'French philosopher Baron de Montesquieu articulated the separation of legislative, executive, and judicial branches in "The Spirit of the Laws" (1748).'
  },

  // ==========================================
  // COMPUTER STUDIES & DATA PROCESSING (SS1 - SS3)
  // ==========================================
  {
    id: 'cmp-001',
    subject: 'Computer Studies',
    classLevel: 'SS1',
    term: 1,
    week: 1,
    topic: 'Overview of Computer System',
    subtopic: 'Hardware & Software',
    question: 'The physical, touchable components of a computer system are collectively called:',
    options: ['Software', 'Hardware', 'Firmware', 'Humanware'],
    correctAnswer: 1,
    explanation: 'Hardware encompasses all physical, electronic, and mechanical devices comprising a computer system.'
  },
  {
    id: 'cmp-002',
    subject: 'Computer Studies',
    classLevel: 'SS1',
    term: 1,
    week: 5,
    topic: 'Pre-Computer Computing Devices',
    subtopic: 'Early Inventors',
    question: 'Who is widely regarded as the Father of Computers for conceiving the Analytical Engine?',
    options: ['Blaise Pascal', 'Charles Babbage', 'John Napier', 'Herman Hollerith'],
    correctAnswer: 1,
    explanation: 'Charles Babbage designed the mechanical Analytical Engine in the 1830s, establishing the foundational architecture of modern computing.'
  },
  {
    id: 'cmp-003',
    subject: 'Computer Studies',
    classLevel: 'SS1',
    term: 1,
    week: 9,
    topic: 'BASIC Programming',
    subtopic: 'Acronym and Statements',
    question: 'What is the full meaning of the programming language acronym "BASIC"?',
    options: [
      'Binary Applied System Instruction Code',
      "Beginner's All-purpose Symbolic Instruction Code",
      'Broadband Automated Software Interface Controller',
      'Basic Algorithm Script for Internal Computing'
    ],
    correctAnswer: 1,
    explanation: 'BASIC stands for Beginner\'s All-purpose Symbolic Instruction Code, developed in 1964 at Dartmouth College.'
  },
  {
    id: 'cmp-004',
    subject: 'Data Processing',
    classLevel: 'SS1',
    term: 2,
    week: 9,
    topic: 'Spreadsheets',
    subtopic: 'Formulas and Cell Referencing',
    question: 'In Microsoft Excel, every mathematical formula must strictly begin with which symbol?',
    options: ['#', '@', '=', ':'],
    correctAnswer: 2,
    explanation: 'All formulas and functions in spreadsheet packages like Excel and Google Sheets must commence with an equal sign (=).'
  },
  {
    id: 'cmp-005',
    subject: 'Data Processing',
    classLevel: 'SS1',
    term: 3,
    week: 7,
    topic: 'Database Management Systems (DBMS)',
    subtopic: 'Database Objects',
    question: 'Which database object is utilized to ask questions or extract specific filtered records from a database table?',
    options: ['Query', 'Form', 'Report', 'Macro'],
    correctAnswer: 0,
    explanation: 'A Query searches, filters, and extracts records matching specified criteria from one or more database tables.'
  },

  // ==========================================
  // ECONOMICS & COMMERCE (SS1 - SS3)
  // ==========================================
  {
    id: 'eco-001',
    subject: 'Economics',
    classLevel: 'SS1',
    term: 1,
    week: 1,
    topic: 'Basic Economic Concepts',
    subtopic: 'Opportunity Cost & Scarcity',
    question: 'The alternative foregone when a choice is made among competing wants is known as:',
    options: ['Scale of preference', 'Opportunity cost', 'Marginal utility', 'Social cost'],
    correctAnswer: 1,
    explanation: 'Opportunity cost is the real value of the next best alternative sacrificed when making a decision.'
  },
  {
    id: 'eco-002',
    subject: 'Economics',
    classLevel: 'SS1',
    term: 1,
    week: 4,
    topic: 'Concepts of Demand and Supply',
    subtopic: 'Law of Demand',
    question: 'The law of demand states that all other factors held constant, as price increases:',
    options: [
      'Quantity demanded increases',
      'Quantity demanded decreases',
      'Quantity supplied decreases',
      'Demand curve shifts outward to the right'
    ],
    correctAnswer: 1,
    explanation: 'There is an inverse relationship between price and quantity demanded (ceteris paribus).'
  },
  {
    id: 'eco-003',
    subject: 'Commerce',
    classLevel: 'SS1',
    term: 1,
    week: 6,
    topic: 'Types of Trade',
    subtopic: 'Entrepot Trade',
    question: 'What is "Entrepot Trade"?',
    options: [
      'Trading only within domestic local markets',
      'The re-exportation of imported goods to other countries without substantial transformation',
      'Barter exchange of agricultural products',
      'Government monopolized foreign trade'
    ],
    correctAnswer: 1,
    explanation: 'Entrepot trade is the importation of goods from one country and subsequent re-exporting to another country.'
  },
  {
    id: 'eco-004',
    subject: 'Commerce',
    classLevel: 'SS1',
    term: 2,
    week: 1,
    topic: 'Wholesale Trade',
    subtopic: 'Channels of Distribution',
    question: 'In the conventional channel of distribution, the wholesaler acts as an intermediary between:',
    options: [
      'Manufacturer and Retailer',
      'Retailer and Final Consumer',
      'Government and Transporter',
      'Banker and Customer'
    ],
    correctAnswer: 0,
    explanation: 'The classic distribution channel is: Manufacturer → Wholesaler → Retailer → Consumer.'
  },

  // ==========================================
  // TRADE & VOCATIONAL SUBJECTS (SS1 - SS3)
  // ==========================================
  {
    id: 'trd-001',
    subject: 'Technical Drawing',
    classLevel: 'SS1',
    term: 1,
    week: 1,
    topic: 'Drawing Materials and Equipment',
    subtopic: 'T-Square and Set Squares',
    question: 'The primary instrument used in conjunction with a drawing board to draw horizontal lines is the:',
    options: ['Protractor', 'T-square', 'French curve', 'Divider'],
    correctAnswer: 1,
    explanation: 'A T-square has a stock and blade, held firmly against the left edge of the board to draw true horizontal lines.'
  },
  {
    id: 'trd-002',
    subject: 'Building Construction',
    classLevel: 'SS1',
    term: 2,
    week: 1,
    topic: 'Setting Out',
    subtopic: '3:4:5 Method',
    question: 'The "3:4:5 method" during setting out on a construction site is utilized to establish:',
    options: ['A straight boundary line', 'A perfect right angle (90° corner)', 'The depth of the trench', 'The foundation level'],
    correctAnswer: 1,
    explanation: "Based on Pythagoras' theorem (3² + 4² = 5²), the 3:4:5 method guarantees accurate 90-degree square corners."
  },
  {
    id: 'trd-003',
    subject: 'Catering Craft',
    classLevel: 'SS1',
    term: 1,
    week: 1,
    topic: 'Hospitality Industry & Catering',
    subtopic: 'Culinary Concepts',
    question: 'Which cooking technique involves submerging food entirely in heated fat or vegetable oil?',
    options: ['Poaching', 'Deep frying', 'Braising', 'Steaming'],
    correctAnswer: 1,
    explanation: 'Deep frying cooks food by full immersion in hot fat or oil at high temperatures (usually 160°C - 190°C).'
  },
  {
    id: 'trd-004',
    subject: 'Animal Husbandry',
    classLevel: 'SS1',
    term: 2,
    week: 1,
    topic: 'Livestock Reproduction',
    subtopic: 'Oestrus Cycle',
    question: 'The period during which a female farm animal accepts mating with the male is called:',
    options: ['Lactation period', 'Gestation period', 'Heat / Oestrus period', 'Parturition'],
    correctAnswer: 2,
    explanation: 'Heat (oestrus) is the phase in the reproductive cycle when ovulation occurs and the female is receptive to mating.'
  }
];

export const SUBJECT_TOPICS: Record<string, string[]> = {
  'General Mathematics': [
    'Number Bases (I)',
    'Number Bases (II)',
    'Modular Arithmetic',
    'Indices',
    'Standard Form',
    'Logarithms (I)',
    'Definition of Sets',
    'Set Operations',
    'Factorisation of Quadratic Expressions',
    'Logical Reasoning',
    'Mensuration of Solid Shapes',
    'Trigonometry',
    'Statistics'
  ],
  'English Studies': [
    'Speech Sounds',
    'Grammatical Structures',
    'Pronouns',
    'Concord',
    'Vocabulary Development',
    'Speech Work'
  ],
  'Biology': [
    'Recognising Living Things',
    'The Cell',
    'Cell and Its Environment',
    'Properties of the Cell',
    'Tissue and Supporting System',
    'Trophic Levels'
  ],
  'Chemistry': [
    'Standard Separation Techniques',
    'Particulate Nature of Matter',
    'Chemical Combination',
    'Gas Laws',
    'Acids, Bases and Salts',
    'Hydrocarbons'
  ],
  'Physics': [
    'Introduction to Physics',
    'Rectilinear Acceleration',
    'Scalars and Vectors',
    'Thermal Expansivity',
    'Electric Field & Circuits',
    'Elastic Properties of Solids'
  ],
  'Civic Education': [
    'Values in Society',
    'HIV and AIDS Awareness',
    'Democracy',
    'Major Pillars of Democracy'
  ],
  'Government': [
    'Basic Concepts of Government',
    'Separation of Powers'
  ],
  'Computer Studies': [
    'Overview of Computer System',
    'Pre-Computer Computing Devices',
    'BASIC Programming'
  ],
  'Data Processing': [
    'Spreadsheets',
    'Database Management Systems (DBMS)'
  ],
  'Economics': [
    'Basic Economic Concepts',
    'Concepts of Demand and Supply'
  ],
  'Commerce': [
    'Types of Trade',
    'Wholesale Trade'
  ],
  'Trade & Vocational': [
    'Technical Drawing',
    'Building Construction',
    'Catering Craft',
    'Animal Husbandry'
  ]
};
