// Shared GummyGum avatar library, hosted on the hub so every experience
// draws from the same illustrated set instead of maintaining its own.
export const GUMMYGUM_AVATAR_COUNT = 26;
export const GUMMYGUM_AVATAR_BASE_URL = 'https://gummygum.app/avatars';
export const GUMMY_AVATARS = Array.from({ length: GUMMYGUM_AVATAR_COUNT }, (_, i) => ({
  id: `av-${i + 1}`,
  url: `${GUMMYGUM_AVATAR_BASE_URL}/av-${i + 1}.svg`,
}));

export const QUESTIONS = [
  {
    "q": "Which vitamin is primarily produced by the human body when exposed to sunlight?",
    "type": "mc",
    "opts": [
      "Vitamin C",
      "Vitamin D",
      "Vitamin B12",
      "Vitamin A"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which South American country is the defending FIFA World Cup champion heading into the 2026 tournament, having won in 2022?",
    "type": "mc",
    "opts": [
      "Brazil",
      "Uruguay",
      "Argentina",
      "Chile"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Coco Chanel, a pioneer of modern women's fashion, founded which iconic fashion house?",
    "type": "mc",
    "opts": [
      "Dior",
      "Chanel",
      "Givenchy",
      "Balenciaga"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "What does \"SUV\" stand for?",
    "type": "mc",
    "opts": [
      "Sport Utility Vehicle",
      "Standard Utility Van",
      "Sport Urban Vehicle",
      "Sedan Utility Vehicle"
    ],
    "answer": 0,
    "category": "General Knowledge"
  },
  {
    "q": "Which country is the largest by land area in the world?",
    "type": "mc",
    "opts": [
      "Canada",
      "China",
      "Russia",
      "United States"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which English football club plays its home matches at Old Trafford?",
    "type": "mc",
    "opts": [
      "Manchester City",
      "Liverpool",
      "Manchester United",
      "Chelsea"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Ralph Lauren's brand is most associated with which style of menswear?",
    "type": "mc",
    "opts": [
      "Streetwear",
      "Preppy, classic American style",
      "Avant-garde",
      "Techwear"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which car manufacturer uses a four-ring logo representing four merged companies?",
    "type": "mc",
    "opts": [
      "BMW",
      "Audi",
      "Volkswagen",
      "Mercedes-Benz"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which African country was the first to gain independence from colonial rule in sub-Saharan Africa, in 1957?",
    "type": "mc",
    "opts": [
      "Nigeria",
      "Ghana",
      "Kenya",
      "Senegal"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "In football, what is the term for scoring three goals in a single match by one player?",
    "type": "mc",
    "opts": [
      "A brace",
      "A hat-trick",
      "A treble",
      "A triple"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which brand is best known for men's tailoring and is often called \"the world's finest menswear house,\" headquartered in Naples?",
    "type": "mc",
    "opts": [
      "Zegna",
      "Brioni",
      "Canali",
      "Kiton"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which company owns the car brands Bugatti and Bentley within its portfolio?",
    "type": "mc",
    "opts": [
      "BMW Group",
      "Volkswagen Group",
      "Stellantis",
      "Renault-Nissan"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which currency is used across most of the European Union?",
    "type": "mc",
    "opts": [
      "Franc",
      "Euro",
      "Pound",
      "Mark"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which country hosted the 2010 FIFA World Cup, the first held on African soil?",
    "type": "mc",
    "opts": [
      "Egypt",
      "Nigeria",
      "South Africa",
      "Morocco"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which Italian fashion house is known for its interlocking \"GG\" logo?",
    "type": "mc",
    "opts": [
      "Prada",
      "Versace",
      "Gucci",
      "Fendi"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which Japanese automaker produces the Land Cruiser and Corolla?",
    "type": "mc",
    "opts": [
      "Honda",
      "Nissan",
      "Toyota",
      "Mazda"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which continent is the Sahara Desert located on?",
    "type": "mc",
    "opts": [
      "Asia",
      "Africa",
      "South America",
      "Australia"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which Spanish football club is known by the nickname \"Los Blancos\"?",
    "type": "mc",
    "opts": [
      "Barcelona",
      "Atlético Madrid",
      "Real Madrid",
      "Sevilla"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which fashion house is known for its signature checked pattern, popular in trench coats and scarves?",
    "type": "mc",
    "opts": [
      "Louis Vuitton",
      "Burberry",
      "Coach",
      "Aquascutum"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which car maker's logo features a three-pointed star inside a circle?",
    "type": "mc",
    "opts": [
      "BMW",
      "Mercedes-Benz",
      "Audi",
      "Peugeot"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which organization is responsible for setting global monetary policy cooperation among member countries, headquartered in Washington D.C.?",
    "type": "mc",
    "opts": [
      "World Bank",
      "International Monetary Fund (IMF)",
      "World Trade Organization",
      "United Nations"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which country's national team is nicknamed \"the Super Eagles\"?",
    "type": "mc",
    "opts": [
      "Ghana",
      "Nigeria",
      "Senegal",
      "Cameroon"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which brand's monogram canvas (LV) is one of the most recognized in luxury fashion?",
    "type": "mc",
    "opts": [
      "Hermès",
      "Louis Vuitton",
      "Celine",
      "Loewe"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which country's national car brand is Hyundai?",
    "type": "mc",
    "opts": [
      "Japan",
      "South Korea",
      "China",
      "Taiwan"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "In current global affairs, which international body is the main forum for climate change negotiations, holding annual COP summits?",
    "type": "mc",
    "opts": [
      "World Health Organization",
      "United Nations Framework Convention on Climate Change (UNFCCC)",
      "International Energy Agency",
      "World Bank"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "How many teams competed in the 2026 FIFA World Cup, a first for the tournament?",
    "type": "mc",
    "opts": [
      "32",
      "40",
      "48",
      "64"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Giorgio Armani is most associated with which style?",
    "type": "mc",
    "opts": [
      "Streetwear and sneakers",
      "Understated, tailored elegance",
      "Punk-inspired fashion",
      "Bohemian prints"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which luxury car brand's badge features a \"Spirit of Ecstasy\" hood ornament?",
    "type": "mc",
    "opts": [
      "Bentley",
      "Rolls-Royce",
      "Jaguar",
      "Aston Martin"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Who is the current President of the United States as of 2026?",
    "type": "mc",
    "opts": [
      "Joe Biden",
      "Donald Trump",
      "Kamala Harris",
      "JD Vance"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which club has won the most UEFA Champions League titles?",
    "type": "mc",
    "opts": [
      "AC Milan",
      "Barcelona",
      "Real Madrid",
      "Bayern Munich"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which designer founded the fashion house famous for the \"New Look\" silhouette in 1947?",
    "type": "mc",
    "opts": [
      "Coco Chanel",
      "Christian Dior",
      "Yves Saint Laurent",
      "Hubert de Givenchy"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which country is home to the car brand Ferrari?",
    "type": "mc",
    "opts": [
      "Germany",
      "France",
      "Italy",
      "Spain"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which metal is the primary component of stainless steel that gives it corrosion resistance?",
    "type": "mc",
    "opts": [
      "Nickel",
      "Chromium",
      "Zinc",
      "Titanium"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "In football, what card does a referee show for a serious offense that results in a player being sent off?",
    "type": "mc",
    "opts": [
      "Yellow card",
      "Red card",
      "Blue card",
      "Orange card"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which luxury brand is famous for its signature red-soled women's shoes?",
    "type": "mc",
    "opts": [
      "Jimmy Choo",
      "Manolo Blahnik",
      "Christian Louboutin",
      "Stuart Weitzman"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Tesla's Model 3 and Model Y are primarily what type of vehicle?",
    "type": "mc",
    "opts": [
      "Hybrid",
      "Fully electric",
      "Plug-in hybrid",
      "Hydrogen fuel cell"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which social media platform is currently owned by Elon Musk under the parent company X Corp?",
    "type": "mc",
    "opts": [
      "Instagram",
      "Twitter (X)",
      "TikTok",
      "Threads"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "How many players from each team are on the football pitch at kickoff (including the goalkeeper)?",
    "type": "mc",
    "opts": [
      "10",
      "11",
      "12",
      "9"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which designer is credited with introducing the tuxedo suit for women, \"Le Smoking\"?",
    "type": "mc",
    "opts": [
      "Coco Chanel",
      "Yves Saint Laurent",
      "Christian Dior",
      "Pierre Cardin"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which three countries are jointly hosting the 2026 FIFA World Cup?",
    "type": "mc",
    "opts": [
      "USA, Mexico, and Canada",
      "Brazil, Argentina, and Uruguay",
      "Spain, Portugal, and Morocco",
      "Qatar, Saudi Arabia, and UAE"
    ],
    "answer": 0,
    "category": "General Knowledge"
  },
  {
    "q": "Which ocean is the largest by surface area?",
    "type": "mc",
    "opts": [
      "Atlantic Ocean",
      "Indian Ocean",
      "Pacific Ocean",
      "Arctic Ocean"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which player is widely regarded as having won the most Ballon d'Or awards in history?",
    "type": "mc",
    "opts": [
      "Cristiano Ronaldo",
      "Lionel Messi",
      "Pelé",
      "Diego Maradona"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which fashion house, founded by a designer known as \"Lagerfeld's rival,\" is known for bold prints and Medusa head logo?",
    "type": "mc",
    "opts": [
      "Versace",
      "Dolce & Gabbana",
      "Armani",
      "Moschino"
    ],
    "answer": 0,
    "category": "General Knowledge"
  },
  {
    "q": "Which car brand is famous for the Mustang, a classic American muscle car?",
    "type": "mc",
    "opts": [
      "Chevrolet",
      "Dodge",
      "Ford",
      "Chrysler"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "What is the world's most spoken native language by number of speakers?",
    "type": "mc",
    "opts": [
      "English",
      "Spanish",
      "Mandarin Chinese",
      "Hindi"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which country won the first-ever FIFA World Cup in 1930?",
    "type": "mc",
    "opts": [
      "Brazil",
      "Argentina",
      "Uruguay",
      "Italy"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which planet in our solar system is known as the \"Red Planet\"?",
    "type": "mc",
    "opts": [
      "Jupiter",
      "Mars",
      "Venus",
      "Saturn"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which country has hosted the most FIFA World Cup tournaments in men's football (including as sole or joint host)?",
    "type": "mc",
    "opts": [
      "Brazil",
      "Germany",
      "Mexico",
      "Italy"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "What is the capital city of Japan?",
    "type": "mc",
    "opts": [
      "Osaka",
      "Kyoto",
      "Tokyo",
      "Yokohama"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "Which gas do humans primarily exhale as a waste product of respiration?",
    "type": "mc",
    "opts": [
      "Oxygen",
      "Carbon dioxide",
      "Nitrogen",
      "Hydrogen"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which value is best described as \"doing the right thing even when no one is watching\"?",
    "type": "mc",
    "opts": [
      "Innovation",
      "Integrity",
      "Speed",
      "Ambition"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "What does the \"C\" in the common workplace acronym \"DEI\" stand for?",
    "type": "mc",
    "opts": [
      "Collaboration",
      "Communication",
      "Diversity, Equity, and Inclusion",
      "Creativity"
    ],
    "answer": 2,
    "category": "General Knowledge"
  },
  {
    "q": "When a team works together to achieve a common goal, which core value are they practicing?",
    "type": "mc",
    "opts": [
      "Autonomy",
      "Collaboration",
      "Competition",
      "Isolation"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "What is the term for being open to new ideas, changing course when necessary, and adapting to market shifts?",
    "type": "mc",
    "opts": [
      "Rigidness",
      "Agility",
      "Overtime",
      "Micromanagement"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "\"Owning your mistakes, delivering on your promises, and being responsible for your outcomes\" describes:",
    "type": "mc",
    "opts": [
      "Accountability",
      "Punctuality",
      "Creativity",
      "Empathy"
    ],
    "answer": 0,
    "category": "General Knowledge"
  },
  {
    "q": "Which behavior is key to building a \"Psychologically Safe\" work environment?",
    "type": "mc",
    "opts": [
      "Pointing fingers when things go wrong",
      "Allowing people to speak up without fear of punishment",
      "Keeping all decisions completely secret",
      "Never asking for feedback"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "What value does a company show when it prioritizes understanding and sharing the feelings of both its clients and employees?",
    "type": "mc",
    "opts": [
      "Profitability",
      "Empathy",
      "Efficiency",
      "Dominance"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Which of the following is the healthiest approach to professional feedback?",
    "type": "mc",
    "opts": [
      "Only giving feedback during annual reviews",
      "Giving constructive, timely, and actionable feedback",
      "Avoiding feedback to keep everyone happy",
      "Only giving negative feedback"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "What does a \"Customer-Centric\" value system mean?",
    "type": "mc",
    "opts": [
      "Putting the customer's needs at the heart of all business decisions",
      "Charging customers the highest possible price",
      "Only talking to customers when they complain",
      "Letting customers run the internal team meetings"
    ],
    "answer": 0,
    "category": "General Knowledge"
  },
  {
    "q": "What does the term \"Synergy\" mean in teamwork?",
    "type": "mc",
    "opts": [
      "Working alone to get tasks done faster",
      "The combined effect of a team being greater than the sum of individual efforts",
      "Having the loudest person make all the decisions",
      "Copying another team's work"
    ],
    "answer": 1,
    "category": "General Knowledge"
  },
  {
    "q": "Under the value of \"Continuous Learning,\" what is the best way to handle a project failure?",
    "type": "mc",
    "opts": [
      "Pretending it never happened",
      "Finding someone to blame",
      "Conducting a post-mortem to learn and improve next time",
      "Stopping all future projects"
    ],
    "answer": 2,
    "category": "Company Values"
  },
  {
    "q": "Which of these is a positive sign of healthy \"Work-Life Balance\"?",
    "type": "mc",
    "opts": [
      "Replying to emails at 2:00 AM every night",
      "Taking designated time off to rest and recharge",
      "Never taking a single lunch break",
      "Working through every weekend"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What value is a company promoting when they encourage employees to \"think outside the box\" and build new solutions?",
    "type": "mc",
    "opts": [
      "Conformity",
      "Innovation",
      "Tradition",
      "Compliance"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "When we value \"Transparency\" in a company, we mean:",
    "type": "mc",
    "opts": [
      "Having glass walls in the office",
      "Open, honest, and clear communication about goals and challenges",
      "Keeping secrets from team members",
      "Making decisions without any data"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What is the ultimate goal of \"Active Listening\" in a team meeting?",
    "type": "mc",
    "opts": [
      "Waiting for your turn to speak",
      "Listening to fully understand the other person, not just to reply",
      "Multitasking and checking your emails",
      "Agreeing with everything even if you don't understand"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What corporate term describes treating company resources as if they were your own?",
    "type": "mc",
    "opts": [
      "Bureaucracy",
      "Ownership mindset",
      "Micromanagement",
      "Compliance"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "If an employee challenges the status quo with a better solution, they are demonstrating:",
    "type": "mc",
    "opts": [
      "Insubordination",
      "Innovation and Courage",
      "Indifference",
      "Rigidity"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What core pillar ensures that everyone in an organization gets equal access to opportunities?",
    "type": "mc",
    "opts": [
      "Hierarchy",
      "Equity",
      "Nepotism",
      "Seniority"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "Which phrase best sums up the principle of \"Inclusion\" in the workplace?",
    "type": "mc",
    "opts": [
      "\"Inviting everyone to sit at the table and ensuring their voices are heard\"",
      "\"Hiring people just to meet statistical quotas\"",
      "\"Forcing everyone to agree on every single idea\"",
      "\"Keeping teams separated based on their skill sets\""
    ],
    "answer": 0,
    "category": "Company Values"
  },
  {
    "q": "What is the value of honoring diverse backgrounds and treating everyone with dignity?",
    "type": "mc",
    "opts": [
      "Authority",
      "Respect",
      "Paternalism",
      "Tolerance"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "A manager who shares credit for a project's success with the entire team is displaying:",
    "type": "mc",
    "opts": [
      "Insecurity",
      "Humility and Leadership",
      "Favoritism",
      "Over-delegation"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What does \"Corporate Social Responsibility\" (CSR) look like in practice?",
    "type": "mc",
    "opts": [
      "Maximizing profits at the expense of local environmental laws",
      "Actively giving back to and protecting the communities where you operate",
      "Avoiding taxes through offshore shell corporate structures",
      "Running mandatory marketing ads about product pricing"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "When a company is highly focused on \"Results Orientation,\" it means they prioritize:",
    "type": "mc",
    "opts": [
      "Spending long hours at the desk regardless of output",
      "Delivering tangible value and meeting strategic targets effectively",
      "Writing highly detailed, multi-page daily updates",
      "Following rigid rules even if it prevents the goal from being met"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What behavior directly violates the value of \"Integrity\"?",
    "type": "mc",
    "opts": [
      "Admitting you made a mistake on a financial report",
      "Taking credit for a colleague's hard work and ideas",
      "Asking for clarification on a project deadline",
      "Challenging an assumption in a meeting"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What value describes a team's ability to bounce back quickly from a major setback or market disruption?",
    "type": "mc",
    "opts": [
      "Complacency",
      "Resilience",
      "Stagnation",
      "Defensiveness"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "Celebrating a teammate's promotion or win is a clear demonstration of:",
    "type": "mc",
    "opts": [
      "Professional jealousy",
      "Team Spirit and Supportive Culture",
      "Corporate politics",
      "Upward management"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What does \"Excellence\" mean as a sustainable corporate standard?",
    "type": "mc",
    "opts": [
      "Being completely flawless on the first try without any practice",
      "Consistently delivering high-quality work and striving to improve",
      "Working until exhaustion every day",
      "Refusing to take on new or difficult projects"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "When cross-functional teams work together seamlessly across departments, they break down:",
    "type": "mc",
    "opts": [
      "Financial metrics",
      "Corporate Silos",
      "Legal compliance",
      "Executive hierarchies"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "An environment where mistakes are treated openly as lessons rather than targets for punishment has high:",
    "type": "mc",
    "opts": [
      "Psychological safety",
      "Employee turnover",
      "Bureaucratic oversight",
      "Internal friction"
    ],
    "answer": 0,
    "category": "Company Values"
  },
  {
    "q": "Aligning your daily work tasks with the company's ultimate long-term mission demonstrates:",
    "type": "mc",
    "opts": [
      "Autonomy",
      "Strategic Alignment",
      "Independent thinking",
      "Presenteeism"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "Which approach represents \"Proactivity\" in a workspace?",
    "type": "mc",
    "opts": [
      "Waiting until a crisis happens to start thinking of a solution",
      "Anticipating potential problems and building a plan before they occur",
      "Relying entirely on your manager to assign every micro-task",
      "Ignoring a bug because it isn't explicitly in your job description"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What is the value of open communication across all levels of a company's hierarchy?",
    "type": "mc",
    "opts": [
      "Top-down command",
      "Open-door policy",
      "Information gating",
      "Executive privilege"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "When a company heavily invests in green energy and reducing waste, its core value is:",
    "type": "mc",
    "opts": [
      "Profit maximization",
      "Environmental Sustainability",
      "Rapid expansion",
      "Resource exploitation"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What element is crucial for establishing \"Trust\" within a professional project team?",
    "type": "mc",
    "opts": [
      "Keeping track of everyone's exact keyboard stroke activity",
      "Consistent reliability and transparent communication",
      "Avoiding any difficult conversations or debates",
      "Blaming the team leader whenever a goal is missed"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "Striving to make products or services incredibly easy and intuitive for the end-user reflects:",
    "type": "mc",
    "opts": [
      "Complexity",
      "Simplicity",
      "Over-engineering",
      "Bureaucracy"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "An executive who stops to listen to a frontline intern's idea is showcasing a lack of:",
    "type": "mc",
    "opts": [
      "Experience",
      "Ego / Arrogance",
      "Strategy",
      "Leadership"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What does the concept of \"Data-Driven Decision Making\" value most?",
    "type": "mc",
    "opts": [
      "Going entirely with gut feelings or personal biases",
      "Using objective metrics, analysis, and facts to guide choices",
      "Doing whatever the loudest person in the room wants",
      "Copying a competitor's strategy without checking your internal data"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "The internal drive to constantly find faster, cheaper, or better ways to serve clients is:",
    "type": "mc",
    "opts": [
      "Stagnation",
      "Continuous Improvement (Kaizen)",
      "Conformity",
      "Micromanagement"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What value is broken when an organization uses deceptive marketing tricks to boost short-term sales?",
    "type": "mc",
    "opts": [
      "Agility",
      "Honesty / Authenticity",
      "Growth mindset",
      "Competitiveness"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "Giving employees the freedom to choose how they complete their work while holding them responsible for the output values:",
    "type": "mc",
    "opts": [
      "Micromanagement",
      "Empowerment / Autonomy",
      "Centralization",
      "Command and control"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What term defines a workplace culture that actively welcomes people of different races, genders, ages, and backgrounds?",
    "type": "mc",
    "opts": [
      "Uniformity",
      "Diversity",
      "Assimilation",
      "Segregation"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "When leaders pull data and actively seek perspectives from frontline workers, they are reducing:",
    "type": "mc",
    "opts": [
      "Profit margins",
      "The feedback loop / Gap",
      "Core values",
      "Team collaboration"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "In a value-led workplace, how should a conflict between two employees be resolved?",
    "type": "mc",
    "opts": [
      "Through rumors and office gossip",
      "Through open, constructive, and professional dialogue",
      "By ignoring it until one person leaves the company",
      "By choosing a winner based on corporate seniority"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "Consistently showing up prepared and respecting the time allocated for meetings shows:",
    "type": "mc",
    "opts": [
      "Ambition",
      "Professionalism and Punctuality",
      "Bureaucracy",
      "Compliance"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What does a \"Growth Mindset\" value most in employees?",
    "type": "mc",
    "opts": [
      "Believing intelligence is completely fixed and unchangeable",
      "Embracing challenges and viewing effort as the path to mastery",
      "Avoiding any tasks that might result in public failure",
      "Relying purely on natural talent without putting in practice"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What does \"Ethical Leadership\" prioritize above hitting arbitrary short-term targets?",
    "type": "mc",
    "opts": [
      "Personal wealth creation",
      "Moral principles and long-term systemic health",
      "Corporate public relations spin",
      "Competitive dominance"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "When a company streamlines its processes to eliminate useless paperwork, it values:",
    "type": "mc",
    "opts": [
      "Complexity",
      "Efficiency",
      "Formality",
      "Red tape"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What behavior establishes high \"Team Cohesion\"?",
    "type": "mc",
    "opts": [
      "Actively helping a struggling teammate meet their deadline",
      "Competing internally by hiding critical data from peers",
      "Criticizing project failures behind closed doors",
      "Working completely solo without ever checking in"
    ],
    "answer": 0,
    "category": "Company Values"
  },
  {
    "q": "Making sure that your company's vendor contracts are fair and free of exploitation shows:",
    "type": "mc",
    "opts": [
      "Aggressive negotiation",
      "Ethical sourcing and Fairness",
      "Shareholder supremacy",
      "Supply chain centralization"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "The ultimate metric of a team living out its core organizational values is:",
    "type": "mc",
    "opts": [
      "Having them written on a colorful poster in the breakroom",
      "Employees consistently demonstrating those behaviors in daily actions",
      "Mentioning them once a year during the annual review gala",
      "Having a high marketing budget dedicated to value branding"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "Which country has won the most FIFA World Cup trophies?",
    "type": "mc",
    "opts": [
      "Germany",
      "Italy",
      "Brazil",
      "Argentina"
    ],
    "answer": 2,
    "category": "Company Values"
  },
  {
    "q": "How many players from one team are on the court at the same time in a basketball game?",
    "type": "mc",
    "opts": [
      "5",
      "6",
      "11",
      "7"
    ],
    "answer": 0,
    "category": "Company Values"
  },
  {
    "q": "In tennis, what word is used to represent a score of zero?",
    "type": "mc",
    "opts": [
      "Nil",
      "Love",
      "Nada",
      "Blank"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "Which sport is associated with the term \"Formula 1\"?",
    "type": "mc",
    "opts": [
      "Horse Racing",
      "Cycling",
      "Car Racing",
      "Yachting"
    ],
    "answer": 2,
    "category": "Company Values"
  },
  {
    "q": "How long is a standard professional football (soccer) match, excluding extra time?",
    "type": "mc",
    "opts": [
      "80 minutes",
      "90 minutes",
      "100 minutes",
      "60 minutes"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "What is the highest score possible with a single dart throw?",
    "type": "mc",
    "opts": [
      "50",
      "60",
      "100",
      "180"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "In which sport would you use a shuttlecock?",
    "type": "mc",
    "opts": [
      "Table Tennis",
      "Badminton",
      "Volleyball",
      "Squash"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "How many rings are on the official Olympic flag?",
    "type": "mc",
    "opts": [
      "4",
      "5",
      "6",
      "7"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "Which of these is NOT a real stroke in swimming?",
    "type": "mc",
    "opts": [
      "Butterfly",
      "Backstroke",
      "Doggy paddle",
      "Breaststroke"
    ],
    "answer": 2,
    "category": "Company Values"
  },
  {
    "q": "What is the nickname of the Nigerian national men's football team?",
    "type": "mc",
    "opts": [
      "Indomitable Lions",
      "Super Eagles",
      "Black Stars",
      "Teranga Lions"
    ],
    "answer": 1,
    "category": "Company Values"
  },
  {
    "q": "In bowling, what is it called when you get three strikes in a row?",
    "type": "mc",
    "opts": [
      "A Turkey",
      "A Hat-Trick",
      "A Triple Play",
      "A Clover"
    ],
    "answer": 0,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which sport uses a heavy ball to knock down ten pins?",
    "type": "mc",
    "opts": [
      "Billiards",
      "Bowling",
      "Golf",
      "Rugby"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What color card does a referee show to completely expel a player from a football match?",
    "type": "mc",
    "opts": [
      "Yellow Card",
      "Blue Card",
      "Red Card",
      "Green Card"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which grand slam tennis tournament is played on grass courts?",
    "type": "mc",
    "opts": [
      "US Open",
      "Wimbledon",
      "French Open",
      "Australian Open"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "How many players are on the field for a single team in a standard cricket match?",
    "type": "mc",
    "opts": [
      "9",
      "10",
      "11",
      "12"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What is the name of the fictional kingdom where Disney's Frozen takes place?",
    "type": "mc",
    "opts": [
      "Genovia",
      "Arendelle",
      "Far Far Away",
      "Wakanda"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which movie is famously known for the line: \"May the Force be with you\"?",
    "type": "mc",
    "opts": [
      "Star Trek",
      "Star Wars",
      "Harry Potter",
      "The Matrix"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Who is known as the \"King of Pop\"?",
    "type": "mc",
    "opts": [
      "Elvis Presley",
      "Michael Jackson",
      "Prince",
      "Justin Timberlake"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "In the movie The Lion King, what does the phrase \"Hakuna Matata\" mean?",
    "type": "mc",
    "opts": [
      "No worries",
      "Stay strong",
      "Good morning",
      "Family forever"
    ],
    "answer": 0,
    "category": "Sports & Entertainment"
  },
  {
    "q": "How many members were there in the legendary British rock band, The Beatles?",
    "type": "mc",
    "opts": [
      "3",
      "4",
      "5",
      "6"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which superhero's alter ego is billionaire Bruce Wayne?",
    "type": "mc",
    "opts": [
      "Iron Man",
      "Spider-Man",
      "Batman",
      "Thor"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What is the name of the main green ogre in the DreamWorks animated franchise?",
    "type": "mc",
    "opts": [
      "Shrek",
      "Fiona",
      "Donkey",
      "Grinch"
    ],
    "answer": 0,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which popular streaming service has a signature sound described as \"Tudum\"?",
    "type": "mc",
    "opts": [
      "Prime Video",
      "Netflix",
      "Disney+",
      "YouTube"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Who is the wizarding world's headmaster of Hogwarts in most of the Harry Potter series?",
    "type": "mc",
    "opts": [
      "Severus Snape",
      "Albus Dumbledore",
      "Sirius Black",
      "Ron Weasley"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which music genre originated in Jamaica in the late 1960s?",
    "type": "mc",
    "opts": [
      "Afrobeat",
      "Reggae",
      "Salsa",
      "Hip Hop"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "In the sitcom Friends, what is the name of the coffee shop where they always hang out?",
    "type": "mc",
    "opts": [
      "Central Perk",
      "Starbucks",
      "Cafe Nero",
      "The Daily Grind"
    ],
    "answer": 0,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which actor played the character of Jack Dawson in the 1997 movie Titanic?",
    "type": "mc",
    "opts": [
      "Brad Pitt",
      "Leonardo DiCaprio",
      "Tom Cruise",
      "Matt Damon"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What is the highest-grossing film of all time (unadjusted for inflation)?",
    "type": "mc",
    "opts": [
      "Titanic",
      "Avengers: Endgame",
      "Avatar",
      "Jurassic World"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What instrument does Lizzo famously play during her performances?",
    "type": "mc",
    "opts": [
      "Violin",
      "Flute",
      "Saxophone",
      "Keytar"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which social media platform popularized short-form vertical videos with the \"For You Page\" (FYP)?",
    "type": "mc",
    "opts": [
      "Instagram",
      "Snapchat",
      "TikTok",
      "X (Twitter)"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What is the name of the island where the park is built in Jurassic Park?",
    "type": "mc",
    "opts": [
      "Isla Nublar",
      "Skull Island",
      "Madagascar",
      "Ibiza"
    ],
    "answer": 0,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Who sang the hit 2010 World Cup anthem \"Waka Waka (This Time for Africa)\"?",
    "type": "mc",
    "opts": [
      "Beyoncé",
      "Shakira",
      "Rihanna",
      "Taylor Swift"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "In the game Minecraft, what is the default male character's name?",
    "type": "mc",
    "opts": [
      "Alex",
      "Steve",
      "John",
      "Mario"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What is the name of the toy cowboy in the movie Toy Story?",
    "type": "mc",
    "opts": [
      "Buzz Lightyear",
      "Woody",
      "Slinky",
      "Rex"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which of these is NOT one of the houses in Harry Potter?",
    "type": "mc",
    "opts": [
      "Gryffindor",
      "Slytherin",
      "Hufflepuff",
      "Voldemort"
    ],
    "answer": 3,
    "category": "Sports & Entertainment"
  },
  {
    "q": "How many players from each team are on a football pitch at kickoff (including the goalkeeper)?",
    "type": "mc",
    "opts": [
      "10",
      "11",
      "12",
      "9"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which country won the first-ever FIFA World Cup in 1930?",
    "type": "mc",
    "opts": [
      "Brazil",
      "Argentina",
      "Uruguay",
      "Italy"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which English football club plays its home matches at Old Trafford?",
    "type": "mc",
    "opts": [
      "Manchester City",
      "Liverpool",
      "Manchester United",
      "Chelsea"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which player has won the most Ballon d'Or awards in history?",
    "type": "mc",
    "opts": [
      "Cristiano Ronaldo",
      "Lionel Messi",
      "Pelé",
      "Diego Maradona"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "How many teams competed in the 2026 FIFA World Cup?",
    "type": "mc",
    "opts": [
      "32",
      "40",
      "48",
      "64"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which Spanish football club is known by the nickname \"Los Blancos\"?",
    "type": "mc",
    "opts": [
      "Barcelona",
      "Atlético Madrid",
      "Real Madrid",
      "Sevilla"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which club has won the most UEFA Champions League titles?",
    "type": "mc",
    "opts": [
      "AC Milan",
      "Barcelona",
      "Real Madrid",
      "Bayern Munich"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which South American country won the FIFA World Cup in 2022?",
    "type": "mc",
    "opts": [
      "Brazil",
      "Uruguay",
      "Argentina",
      "Chile"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which three countries are jointly hosting the 2026 FIFA World Cup?",
    "type": "mc",
    "opts": [
      "USA, Mexico, and Canada",
      "Brazil, Argentina, and Uruguay",
      "Spain, Portugal, and Morocco",
      "Qatar, Saudi Arabia, and UAE"
    ],
    "answer": 0,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which country has hosted the most FIFA World Cup tournaments in men's football history?",
    "type": "mc",
    "opts": [
      "Brazil",
      "Germany",
      "Mexico",
      "Italy"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What is the primary streaming platform behind the hit original series \"Stranger Things\"?",
    "type": "mc",
    "opts": [
      "Hulu",
      "Netflix",
      "Amazon Prime Video",
      "Disney+"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Coco Chanel is the world-renowned founder of which iconic global fashion house?",
    "type": "mc",
    "opts": [
      "Dior",
      "Chanel",
      "Givenchy",
      "Balenciaga"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Ralph Lauren's label is best known globally for pioneering which style of menswear?",
    "type": "mc",
    "opts": [
      "Streetwear",
      "Preppy, classic American style",
      "Avant-garde",
      "Techwear"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which Italian fashion house features the iconic interlocking \"GG\" logo?",
    "type": "mc",
    "opts": [
      "Prada",
      "Versace",
      "Gucci",
      "Fendi"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which luxury fashion brand is famous for its distinct red-soled high-end women's shoes?",
    "type": "mc",
    "opts": [
      "Jimmy Choo",
      "Manolo Blahnik",
      "Christian Louboutin",
      "Stuart Weitzman"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which African country is known as the world's largest producer of cocoa?",
    "type": "mc",
    "opts": [
      "Kenya",
      "Nigeria",
      "Ivory Coast",
      "Ghana"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What is the currency of Nigeria?",
    "type": "mc",
    "opts": [
      "Cedi",
      "Naira",
      "Shilling",
      "Rand"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which African e-commerce company was the first to be listed on the New York Stock Exchange?",
    "type": "mc",
    "opts": [
      "Konga",
      "Takealot",
      "Jumia",
      "Kilimall"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "M-Pesa, a pioneering mobile money service, originated in which country?",
    "type": "mc",
    "opts": [
      "Tanzania",
      "Uganda",
      "Kenya",
      "Rwanda"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which is the largest economy in Africa by GDP?",
    "type": "mc",
    "opts": [
      "South Africa",
      "Egypt",
      "Nigeria",
      "Algeria"
    ],
    "answer": 2,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What does \"Ubuntu,\" a popular African philosophy, roughly translate to?",
    "type": "mc",
    "opts": [
      "\"I think, therefore I am\"",
      "\"I am because we are\"",
      "\"Strength in silence\"",
      "\"The land is our mother\""
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which African country is famous for its Maasai Mara wildlife reserve and safari tourism?",
    "type": "mc",
    "opts": [
      "Tanzania",
      "Kenya",
      "Botswana",
      "Zambia"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which fabric, known for its colorful wax prints, is strongly associated with West African fashion?",
    "type": "mc",
    "opts": [
      "Kente",
      "Ankara",
      "Adire",
      "Aso Oke"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Which African country is the leading producer of gold on the continent?",
    "type": "mc",
    "opts": [
      "South Africa",
      "Ghana",
      "Mali",
      "Tanzania"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "Dangote Group, one of Africa's largest conglomerates, was founded in which country?",
    "type": "mc",
    "opts": [
      "Ghana",
      "Nigeria",
      "Senegal",
      "Cameroon"
    ],
    "answer": 1,
    "category": "Sports & Entertainment"
  },
  {
    "q": "What is the traditional Ethiopian dish made from fermented flatbread called?",
    "type": "mc",
    "opts": [
      "Fufu",
      "Injera",
      "Ugali",
      "Banku"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country uses the Rand as its official currency?",
    "type": "mc",
    "opts": [
      "Zimbabwe",
      "Namibia",
      "South Africa",
      "Botswana"
    ],
    "answer": 2,
    "category": "African Business & Culture"
  },
  {
    "q": "Which continent-wide free trade agreement aims to boost intra-African trade?",
    "type": "mc",
    "opts": [
      "ECOWAS",
      "AfCFTA",
      "SADC",
      "COMESA"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Kente cloth, a symbol of royalty and prestige, originates from which country?",
    "type": "mc",
    "opts": [
      "Nigeria",
      "Ghana",
      "Ivory Coast",
      "Senegal"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country is the largest producer of oil?",
    "type": "mc",
    "opts": [
      "Angola",
      "Algeria",
      "Nigeria",
      "Libya"
    ],
    "answer": 2,
    "category": "African Business & Culture"
  },
  {
    "q": "What is the name of Africa's tallest mountain, located in Tanzania?",
    "type": "mc",
    "opts": [
      "Mount Kenya",
      "Mount Kilimanjaro",
      "Table Mountain",
      "Simien Mountains"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which South African company became Africa's first tech \"unicorn\" area player in e-commerce/media investment?",
    "type": "mc",
    "opts": [
      "MTN",
      "Naspers",
      "Shoprite",
      "Sasol"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which West African country is famous for producing high-quality shea butter?",
    "type": "mc",
    "opts": [
      "Ghana",
      "Kenya",
      "Egypt",
      "Rwanda"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "What is the name of the traditional Nigerian pounded starchy side dish often eaten with soup?",
    "type": "mc",
    "opts": [
      "Jollof",
      "Fufu",
      "Suya",
      "Egusi"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African stock exchange is the largest by market capitalization?",
    "type": "mc",
    "opts": [
      "Nigerian Exchange",
      "Egyptian Exchange",
      "Johannesburg Stock Exchange",
      "Nairobi Securities Exchange"
    ],
    "answer": 2,
    "category": "African Business & Culture"
  },
  {
    "q": "Jollof rice is a beloved dish with friendly rivalry mainly between which two countries?",
    "type": "mc",
    "opts": [
      "Kenya and Tanzania",
      "Nigeria and Ghana",
      "Morocco and Algeria",
      "South Africa and Zimbabwe"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country is the leading exporter of tea?",
    "type": "mc",
    "opts": [
      "Uganda",
      "Kenya",
      "Malawi",
      "Rwanda"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "What does the acronym \"SME\" commonly stand for in African business discussions?",
    "type": "mc",
    "opts": [
      "Small and Medium Enterprises",
      "Sub-Saharan Market Economy",
      "State Managed Enterprise",
      "Strategic Market Expansion"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Which country is home to Africa's busiest airport, a hub for the continent?",
    "type": "mc",
    "opts": [
      "Kenya (Nairobi)",
      "Ethiopia (Addis Ababa)",
      "Nigeria (Lagos)",
      "South Africa (Johannesburg)"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "The \"Big Five\" African animals popular in tourism include lion, leopard, rhino, elephant, and which other?",
    "type": "mc",
    "opts": [
      "Cheetah",
      "Buffalo",
      "Hyena",
      "Giraffe"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country is famous for producing Rooibos tea?",
    "type": "mc",
    "opts": [
      "South Africa",
      "Kenya",
      "Morocco",
      "Zimbabwe"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Safaricom, a major telecom and mobile money company, is based in which country?",
    "type": "mc",
    "opts": [
      "Uganda",
      "Tanzania",
      "Kenya",
      "Rwanda"
    ],
    "answer": 2,
    "category": "African Business & Culture"
  },
  {
    "q": "What is the traditional colorful hand-woven cloth of the Yoruba people in Nigeria called?",
    "type": "mc",
    "opts": [
      "Kente",
      "Aso Oke",
      "Kitenge",
      "Adire"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country is the top producer of coffee on the continent?",
    "type": "mc",
    "opts": [
      "Kenya",
      "Ethiopia",
      "Uganda",
      "Tanzania"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "What is the name of the pan-African airline based in Ethiopia, one of the continent's largest carriers?",
    "type": "mc",
    "opts": [
      "Kenya Airways",
      "South African Airways",
      "Ethiopian Airlines",
      "Egyptair"
    ],
    "answer": 2,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country is famous for its historic spice trade on the island of Zanzibar?",
    "type": "mc",
    "opts": [
      "Kenya",
      "Tanzania",
      "Mozambique",
      "Madagascar"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which market is known as one of the largest open-air markets in West Africa, located in Lagos?",
    "type": "mc",
    "opts": [
      "Balogun Market",
      "Kejetia Market",
      "Mercato",
      "Merkato"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "In many African cultures, what is the term for the traditional bride price or gifts given by a groom's family?",
    "type": "mc",
    "opts": [
      "Lobola / Bride price",
      "Harambee",
      "Ubuntu",
      "Griot"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Which country is Africa's largest producer of platinum?",
    "type": "mc",
    "opts": [
      "Zimbabwe",
      "South Africa",
      "Botswana",
      "Namibia"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "What is a \"griot\" in West African culture?",
    "type": "mc",
    "opts": [
      "A traditional healer",
      "A storyteller and oral historian",
      "A market trader",
      "A village chief"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which East African country is renowned for long-distance running talent and athletics tourism?",
    "type": "mc",
    "opts": [
      "Kenya",
      "Somalia",
      "Djibouti",
      "Eritrea"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Flutterwave, a major African fintech unicorn, was co-founded with roots in which country?",
    "type": "mc",
    "opts": [
      "Ghana",
      "Nigeria",
      "Kenya",
      "Egypt"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "What is the term for a communal work/self-help gathering common in East Africa, notably Kenya?",
    "type": "mc",
    "opts": [
      "Harambee",
      "Ubuntu",
      "Indaba",
      "Lobola"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country is the largest producer of diamonds by value?",
    "type": "mc",
    "opts": [
      "Sierra Leone",
      "Botswana",
      "Angola",
      "Namibia"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Suya, a popular spicy grilled skewered meat snack, is most associated with which country?",
    "type": "mc",
    "opts": [
      "Ghana",
      "Nigeria",
      "Senegal",
      "Cameroon"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country's stock market and business hub is centered in the city of Casablanca?",
    "type": "mc",
    "opts": [
      "Algeria",
      "Tunisia",
      "Morocco",
      "Libya"
    ],
    "answer": 2,
    "category": "African Business & Culture"
  },
  {
    "q": "What is \"ugali,\" a staple food in East Africa, primarily made from?",
    "type": "mc",
    "opts": [
      "Cassava flour",
      "Maize flour",
      "Rice",
      "Plantain"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country is a leading producer of vanilla?",
    "type": "mc",
    "opts": [
      "Madagascar",
      "Uganda",
      "Ivory Coast",
      "Comoros"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Interswitch, a fintech company that became one of Africa's first unicorns, is based in which country?",
    "type": "mc",
    "opts": [
      "Kenya",
      "Nigeria",
      "South Africa",
      "Ghana"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "What is the name of the traditional Zulu/Nguni beaded craftwork often sold to tourists in South Africa?",
    "type": "mc",
    "opts": [
      "Kente weaving",
      "Beadwork",
      "Batik",
      "Raffia art"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country is famous for its rich oil-driven economy centered in Luanda?",
    "type": "mc",
    "opts": [
      "Nigeria",
      "Angola",
      "Gabon",
      "Congo"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "What is the term for a traditional African community meeting or council for discussing important matters?",
    "type": "mc",
    "opts": [
      "Indaba",
      "Harambee",
      "Griot",
      "Lobola"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Which African country's economy is heavily driven by phosphate exports?",
    "type": "mc",
    "opts": [
      "Morocco",
      "Tunisia",
      "Egypt",
      "Algeria"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "M-KOPA, a pay-as-you-go solar energy company, was founded to serve customers primarily in which region?",
    "type": "mc",
    "opts": [
      "West Africa",
      "East Africa",
      "North Africa",
      "Southern Africa"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "What is the name of the vibrant, colorful print fabric commonly worn in East and Central Africa, similar to Ankara?",
    "type": "mc",
    "opts": [
      "Kente",
      "Kitenge",
      "Adire",
      "Aso Oke"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Who co-founded Tesla and SpaceX and later acquired Twitter (X)?",
    "type": "mc",
    "opts": [
      "Peter Thiel",
      "Elon Musk",
      "Sam Altman",
      "Larry Page"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "What does \"AI\" stand for?",
    "type": "mc",
    "opts": [
      "Artificial Intelligence",
      "Automated Interface",
      "Applied Informatics",
      "Algorithmic Interaction"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Which company designs both the hardware and software for the iPhone?",
    "type": "mc",
    "opts": [
      "Samsung",
      "Google",
      "Apple",
      "Huawei"
    ],
    "answer": 2,
    "category": "African Business & Culture"
  },
  {
    "q": "What does \"www\" stand for?",
    "type": "mc",
    "opts": [
      "World Wide Web",
      "Wired World Web",
      "Web Working Worldwide",
      "World Web Wire"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Which platform did Elon Musk rename from a bird-logo brand to a single letter?",
    "type": "mc",
    "opts": [
      "Instagram",
      "Threads",
      "Twitter (now X)",
      "Snapchat"
    ],
    "answer": 2,
    "category": "African Business & Culture"
  },
  {
    "q": "What does \"USB\" stand for?",
    "type": "mc",
    "opts": [
      "Universal Serial Bus",
      "Unified System Board",
      "Universal Storage Bridge",
      "Uniform Signal Bus"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Who co-founded Microsoft alongside Paul Allen?",
    "type": "mc",
    "opts": [
      "Steve Jobs",
      "Bill Gates",
      "Tim Cook",
      "Larry Ellison"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "Which company's virtual assistant is named Alexa?",
    "type": "mc",
    "opts": [
      "Google",
      "Apple",
      "Amazon",
      "Samsung"
    ],
    "answer": 2,
    "category": "African Business & Culture"
  },
  {
    "q": "Which company owns YouTube?",
    "type": "mc",
    "opts": [
      "Microsoft",
      "Google",
      "Amazon",
      "Meta"
    ],
    "answer": 1,
    "category": "African Business & Culture"
  },
  {
    "q": "In tech, \"app\" is short for which word?",
    "type": "mc",
    "opts": [
      "Application",
      "Appliance",
      "Approval",
      "Applet"
    ],
    "answer": 0,
    "category": "African Business & Culture"
  },
  {
    "q": "Which company released the chatbot ChatGPT?",
    "type": "mc",
    "opts": [
      "Google DeepMind",
      "OpenAI",
      "Anthropic",
      "Meta AI"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does \"GPS\" stand for?",
    "type": "mc",
    "opts": [
      "Global Positioning System",
      "Geographic Placement Service",
      "Global Path Sensor",
      "General Positioning Signal"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which company developed the Android operating system?",
    "type": "mc",
    "opts": [
      "Samsung",
      "Google",
      "Huawei",
      "Xiaomi"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which field of technology focuses on cars that drive themselves?",
    "type": "mc",
    "opts": [
      "Robotics",
      "Autonomous vehicles",
      "Telematics",
      "Cybernetics"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which company owns both Instagram and WhatsApp?",
    "type": "mc",
    "opts": [
      "Google",
      "Meta (Facebook)",
      "Twitter/X",
      "Snap Inc."
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does \"VR\" stand for?",
    "type": "mc",
    "opts": [
      "Video Rendering",
      "Virtual Reality",
      "Visual Response",
      "Virtual Routing"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Who co-founded Apple alongside Steve Jobs and built the original Apple I computer?",
    "type": "mc",
    "opts": [
      "Steve Wozniak",
      "John Sculley",
      "Jony Ive",
      "Tim Cook"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "\"Wi-Fi\" is commonly used as shorthand for which term?",
    "type": "mc",
    "opts": [
      "Wireless Fidelity",
      "Wide Frequency",
      "Wired Field Interface",
      "Wireless Filter"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which company manufactures the PlayStation console line?",
    "type": "mc",
    "opts": [
      "Microsoft",
      "Nintendo",
      "Sony",
      "Sega"
    ],
    "answer": 2,
    "category": "Tech"
  },
  {
    "q": "Which electric vehicle company did Elon Musk join early and later lead as CEO?",
    "type": "mc",
    "opts": [
      "Rivian",
      "Tesla",
      "Lucid Motors",
      "Nio"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which programming language runs natively in web browsers to make pages interactive?",
    "type": "mc",
    "opts": [
      "Python",
      "JavaScript",
      "Java",
      "C++"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does \"CPU\" stand for?",
    "type": "mc",
    "opts": [
      "Central Processing Unit",
      "Core Program Utility",
      "Computer Power Unit",
      "Central Program Unit"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which company created the Windows operating system?",
    "type": "mc",
    "opts": [
      "IBM",
      "Microsoft",
      "Apple",
      "Google"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What term describes storing and accessing data over the internet rather than a local device?",
    "type": "mc",
    "opts": [
      "Cloud computing",
      "Edge computing",
      "Grid computing",
      "Distributed hosting"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which messaging app, owned by Meta, is widely known for end-to-end encryption?",
    "type": "mc",
    "opts": [
      "Telegram",
      "WhatsApp",
      "Signal",
      "WeChat"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does \"AR\" stand for in tech?",
    "type": "mc",
    "opts": [
      "Automated Response",
      "Augmented Reality",
      "Adaptive Rendering",
      "Applied Robotics"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Who founded Amazon and later stepped down as CEO to focus on Blue Origin?",
    "type": "mc",
    "opts": [
      "Elon Musk",
      "Jeff Bezos",
      "Jack Ma",
      "Larry Page"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which company's name became a common verb meaning \"to search online\"?",
    "type": "mc",
    "opts": [
      "Yahoo",
      "Bing",
      "Google",
      "Ask Jeeves"
    ],
    "answer": 2,
    "category": "Tech"
  },
  {
    "q": "How is a \"startup\" best defined?",
    "type": "mc",
    "opts": [
      "A newly established, fast-growing company aiming to scale",
      "Any small business regardless of growth",
      "A government-funded research lab",
      "A publicly traded corporation"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "What does \"IoT\" stand for?",
    "type": "mc",
    "opts": [
      "Internet of Things",
      "Internet of Technology",
      "Integration of Things",
      "Interface of Tools"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which company created TikTok?",
    "type": "mc",
    "opts": [
      "Tencent",
      "ByteDance",
      "Alibaba",
      "Baidu"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What term describes digital money like Bitcoin that isn't issued by a central bank?",
    "type": "mc",
    "opts": [
      "E-cash",
      "Cryptocurrency",
      "Digital tender",
      "Virtual currency"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which company is known for the \"Think Different\" ad campaign and minimalist product design?",
    "type": "mc",
    "opts": [
      "Sony",
      "Apple",
      "Samsung",
      "LG"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does \"SaaS\" stand for?",
    "type": "mc",
    "opts": [
      "Software as a Service",
      "System as a Solution",
      "Storage as a Server",
      "Software Application Suite"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Who founded Facebook (now Meta) in his Harvard dorm room?",
    "type": "mc",
    "opts": [
      "Jack Dorsey",
      "Mark Zuckerberg",
      "Evan Spiegel",
      "Sean Parker"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does \"HTML\" stand for?",
    "type": "mc",
    "opts": [
      "HyperText Markup Language",
      "HyperText Modern Language",
      "Home Tool Markup Language",
      "HyperTransfer Markup Language"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which company develops macOS, the operating system for Mac computers?",
    "type": "mc",
    "opts": [
      "Microsoft",
      "Apple",
      "IBM",
      "Linux Foundation"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What field of AI focuses on understanding and generating human language, powering chatbots?",
    "type": "mc",
    "opts": [
      "Natural Language Processing (NLP)",
      "Computer Vision",
      "Robotics Process Automation",
      "Data Mining"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which company makes the Galaxy series of smartphones?",
    "type": "mc",
    "opts": [
      "Apple",
      "Samsung",
      "Huawei",
      "Xiaomi"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does \"5G\" refer to?",
    "type": "mc",
    "opts": [
      "5 Gigabytes of storage",
      "The fifth generation of mobile network technology",
      "A brand of gaming graphics card",
      "5 Gadgets bundled together"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which company owns and operates the Bing search engine?",
    "type": "mc",
    "opts": [
      "Google",
      "Microsoft",
      "Yahoo",
      "Apple"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which broader field does \"machine learning\" fall under?",
    "type": "mc",
    "opts": [
      "Cloud computing",
      "Artificial Intelligence",
      "Cybersecurity",
      "Network engineering"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which streaming platform produced the original series \"Stranger Things\"?",
    "type": "mc",
    "opts": [
      "Hulu",
      "Netflix",
      "Amazon Prime Video",
      "Disney+"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What term describes the practice of protecting systems and networks from digital attacks?",
    "type": "mc",
    "opts": [
      "Cybersecurity",
      "Data mining",
      "Network hosting",
      "Cloud provisioning"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which video call platform saw explosive growth during the shift to remote work?",
    "type": "mc",
    "opts": [
      "Skype",
      "Zoom",
      "Google Meet",
      "Microsoft Teams"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does \"QR\" in QR code stand for?",
    "type": "mc",
    "opts": [
      "Quick Response",
      "Quality Rating",
      "Quantum Read",
      "Query Request"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which company is the parent holding company of Google?",
    "type": "mc",
    "opts": [
      "Meta",
      "Alphabet",
      "Amazon",
      "Microsoft"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In startup terminology, what is a \"unicorn\"?",
    "type": "mc",
    "opts": [
      "A startup that has failed after raising funding",
      "A privately held startup valued at over $1 billion",
      "A startup founded by a solo entrepreneur",
      "A publicly traded tech company"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which company popularized foldable smartphones with its Galaxy Fold line?",
    "type": "mc",
    "opts": [
      "Apple",
      "Samsung",
      "Google",
      "Huawei"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In AI, what is a \"hallucination\"?",
    "type": "mc",
    "opts": [
      "A hardware malfunction causing screen glitches",
      "When an AI confidently generates false or fabricated information",
      "A type of computer virus",
      "An error caused by overheating processors"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In CSS Flexbox, which property aligns flex items along the cross axis?",
    "type": "mc",
    "opts": [
      "justify-content",
      "align-items",
      "flex-direction",
      "align-self"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which HTTP status code signifies that a requested resource was successfully created on the server?",
    "type": "mc",
    "opts": [
      "200 OK",
      "201 Created",
      "204 No Content",
      "301 Moved Permanently"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In modern React, which hook is primarily used for handling side effects like API subscriptions or data fetching?",
    "type": "mc",
    "opts": [
      "useState",
      "useEffect",
      "useMemo",
      "useReducer"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which HTML5 element provides an API for drawing 2D graphics dynamically via JavaScript?",
    "type": "mc",
    "opts": [
      "<canvas>",
      "<svg>",
      "<graphic>",
      "<paint>"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "What is the primary difference between synchronous and asynchronous execution in JavaScript?",
    "type": "mc",
    "opts": [
      "Synchronous code executes sequentially blocking the call stack; Asynchronous executes without blocking",
      "Synchronous code is faster than asynchronous code",
      "Asynchronous code can only run inside Web Workers",
      "Synchronous code uses promises while asynchronous code uses callbacks"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which HTTP request header is used to pass authentication credentials such as a Bearer JWT token?",
    "type": "mc",
    "opts": [
      "Content-Type",
      "Authorization",
      "Accept",
      "User-Agent"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does the browser security standard CORS stand for?",
    "type": "mc",
    "opts": [
      "Cross-Origin Resource Sharing",
      "Centralized Object Routing Standard",
      "Client Origin Remote Server",
      "Cascading Open Resource System"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "In JavaScript, what does the strict equality operator (===) check that the loose operator (==) does not?",
    "type": "mc",
    "opts": [
      "Memory address pointer",
      "Both value and data type without type coercion",
      "String byte length",
      "Prototype chain inheritance"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which protocol enables full-duplex, persistent two-way communication between client and server over a single TCP socket?",
    "type": "mc",
    "opts": [
      "HTTP/1.1",
      "WebSocket",
      "FTP",
      "SMTP"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In CSS layout, what is the default value of an element's 'position' property?",
    "type": "mc",
    "opts": [
      "relative",
      "absolute",
      "static",
      "fixed"
    ],
    "answer": 2,
    "category": "Tech"
  },
  {
    "q": "What does SSR stand for in modern web architectures like Next.js and Remix?",
    "type": "mc",
    "opts": [
      "Server-Side Rendering",
      "Single-State Redirection",
      "Secure Script Routing",
      "System Storage Registry"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "In JavaScript, which array method returns a new array with elements that pass a provided test function?",
    "type": "mc",
    "opts": [
      "map()",
      "filter()",
      "forEach()",
      "reduce()"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What is the purpose of the 'viewport' meta tag in HTML responsive web design?",
    "type": "mc",
    "opts": [
      "To control the page dimensions and scaling on mobile devices",
      "To preload external CSS stylesheets",
      "To enable GPU acceleration in the browser",
      "To prevent search engine web indexing"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "What is the average time complexity of finding a value in a balanced Binary Search Tree?",
    "type": "mc",
    "opts": [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which Git command creates a new local branch and immediately switches your workspace to it?",
    "type": "mc",
    "opts": [
      "git branch -new <name>",
      "git checkout -b <name>",
      "git merge <name>",
      "git switch -c <name>"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Which fundamental data structure operates strictly on a Last-In, First-Out (LIFO) order?",
    "type": "mc",
    "opts": [
      "Queue",
      "Stack",
      "Priority Queue",
      "Hash Table"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What programming paradigm emphasizes pure mathematical functions and immutability over shared mutable state?",
    "type": "mc",
    "opts": [
      "Object-Oriented Programming",
      "Functional Programming",
      "Imperative Programming",
      "Procedural Programming"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In SQL, which clause filters rows produced by an aggregate function with GROUP BY?",
    "type": "mc",
    "opts": [
      "WHERE",
      "HAVING",
      "ORDER BY",
      "FILTER"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What is a 'race condition' in concurrent programming?",
    "type": "mc",
    "opts": [
      "When CPU clock speed throttles under load",
      "When output is unexpectedly dependent on the uncontrollable timing/order of concurrent threads",
      "When a computer runs out of virtual memory",
      "When network latency exceeds socket timeout limits"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In object-oriented design, what is 'polymorphism'?",
    "type": "mc",
    "opts": [
      "The ability of different classes to respond to the same interface method in their own way",
      "Hiding internal object details within private variables",
      "Inheriting attributes directly from multiple parent classes",
      "Converting source code directly into machine assembly"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which Git command combines the commits of one branch into another?",
    "type": "mc",
    "opts": [
      "git pull",
      "git merge",
      "git fetch",
      "git push"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does the software design acronym 'DRY' stand for?",
    "type": "mc",
    "opts": [
      "Don't Repeat Yourself",
      "Do Refactor Yearly",
      "Data Retrieval Yield",
      "Direct Resource Yield"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "In Python, which of the following standard built-in data types is immutable?",
    "type": "mc",
    "opts": [
      "List",
      "Dictionary",
      "Tuple",
      "Set"
    ],
    "answer": 2,
    "category": "Tech"
  },
  {
    "q": "What is the primary role of a Garbage Collector in runtimes like V8, JVM, and Go?",
    "type": "mc",
    "opts": [
      "Deleting old log files from disk",
      "Automatically reclaiming unreferenced heap memory to prevent memory leaks",
      "Compressing database indexes",
      "Formatting minified JavaScript bundles"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What is the worst-case time complexity of standard Quicksort without randomized pivots?",
    "type": "mc",
    "opts": [
      "O(log n)",
      "O(n log n)",
      "O(n^2)",
      "O(2^n)"
    ],
    "answer": 2,
    "category": "Tech"
  },
  {
    "q": "In relational database design, what is a 'Foreign Key' used for?",
    "type": "mc",
    "opts": [
      "Encrypting sensitive table columns",
      "Establishing a referential link between columns in two tables",
      "Indexing columns for full-text search",
      "Auto-incrementing primary integer identifiers"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What type of attack involves an attacker injecting malicious client scripts into web pages viewed by other users?",
    "type": "mc",
    "opts": [
      "SQL Injection",
      "Cross-Site Scripting (XSS)",
      "Buffer Overflow",
      "Denial of Service"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What does 'MFA' stand for in identity and cybersecurity?",
    "type": "mc",
    "opts": [
      "Multi-Factor Authentication",
      "Master File Access",
      "Main Firewall Architecture",
      "Message Forwarding Algorithm"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which social engineering attack uses deceptive communications to trick users into divulging passwords or financial info?",
    "type": "mc",
    "opts": [
      "Ransomware",
      "Phishing",
      "Man-in-the-Middle",
      "Keylogging"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What security framework operates on the guiding principle of 'never trust, always verify' even inside network boundaries?",
    "type": "mc",
    "opts": [
      "Zero Trust Architecture",
      "Perimeter Security",
      "Virtual Private Network",
      "Air-Gap Strategy"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "In cryptography, how does symmetric encryption differ from asymmetric encryption?",
    "type": "mc",
    "opts": [
      "Symmetric uses a single shared secret key; Asymmetric uses a mathematically linked public/private key pair",
      "Symmetric encryption cannot be decrypted once applied",
      "Asymmetric encryption only works on passwords",
      "Symmetric algorithms are only used in hardware chips"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "What type of attack floods an online server with massive traffic from a distributed botnet to make it inaccessible?",
    "type": "mc",
    "opts": [
      "DDoS (Distributed Denial of Service)",
      "Trojan Horse",
      "Brute Force Attack",
      "SQL Injection"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "What is a 'Zero-Day vulnerability' in cybersecurity?",
    "type": "mc",
    "opts": [
      "A vulnerability with zero system impact",
      "A software security flaw unknown to the vendor for which no official patch exists",
      "A computer virus that executes on the first day of the year",
      "A trial version of enterprise endpoint protection"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What cryptographic protocol encrypts HTTP traffic to form secure HTTPS connections?",
    "type": "mc",
    "opts": [
      "TLS (Transport Layer Security)",
      "FTP",
      "SSH",
      "SNMP"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "In secure password storage, what is a 'salt'?",
    "type": "mc",
    "opts": [
      "A random cryptographic string prepended to a password before hashing to thwart rainbow tables",
      "An encryption key stored in plaintext",
      "A rule requiring at least one special symbol",
      "A timer that forces password expiration after 90 days"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which vulnerability occurs when user input is concatenated directly into a database command without parameterization?",
    "type": "mc",
    "opts": [
      "Cross-Site Request Forgery (CSRF)",
      "SQL Injection (SQLi)",
      "Path Traversal",
      "Server-Side Request Forgery"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In Python, which library is the industry standard for tabular data manipulation, filtering, and analysis?",
    "type": "mc",
    "opts": [
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Requests"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What phenomenon occurs when a machine learning model fits training data noise too closely and fails to generalize to test data?",
    "type": "mc",
    "opts": [
      "Underfitting",
      "Overfitting",
      "Data Leakage",
      "Model Quantization"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In machine learning, what paradigm uses training data paired with explicit ground-truth labels?",
    "type": "mc",
    "opts": [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Self-Organizing Mapping"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "What does 'EDA' stand for in the initial phase of data science projects?",
    "type": "mc",
    "opts": [
      "Exploratory Data Analysis",
      "Estimated Distribution Algorithm",
      "External Data Acquisition",
      "Exact Dataset Alignment"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "In SQL, which aggregate function counts the number of non-null records in a query result?",
    "type": "mc",
    "opts": [
      "SUM()",
      "COUNT()",
      "TOTAL()",
      "AGG()"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "Why is a dataset divided into separate Training and Test splits before model evaluation?",
    "type": "mc",
    "opts": [
      "To minimize hard disk consumption",
      "To evaluate how well the model predicts on unseen, real-world data",
      "To eliminate all outliers automatically",
      "To double the computational training speed"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In artificial neural networks, what is the primary role of a non-linear activation function like ReLU?",
    "type": "mc",
    "opts": [
      "Enabling the network to learn complex, non-linear relationships in data",
      "Compressing the weights into 8-bit integers",
      "Setting the learning rate schedule automatically",
      "Encrypting training input tensors"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "Which machine learning problem group does K-Means algorithm belong to?",
    "type": "mc",
    "opts": [
      "Supervised classification",
      "Unsupervised clustering",
      "Reinforcement learning",
      "Linear regression"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "In statistical summary metrics, what is the 'median' of an ordered numerical dataset?",
    "type": "mc",
    "opts": [
      "The value appearing with highest frequency",
      "The middle numerical value separating the higher half from the lower half",
      "The arithmetic mean of all items",
      "The difference between upper quartile and minimum"
    ],
    "answer": 1,
    "category": "Tech"
  },
  {
    "q": "What is the primary benefit of feature scaling (such as Min-Max normalization or Z-score standardization)?",
    "type": "mc",
    "opts": [
      "Preventing features with large scales from disproportionately dominating gradient descent optimization",
      "Removing missing values from database columns",
      "Converting text data into audio files",
      "Reducing the number of training epochs to one"
    ],
    "answer": 0,
    "category": "Tech"
  },
  {
    "q": "In classification metrics, which term describes the proportion of true positives out of all actual positive cases in reality?",
    "type": "mc",
    "opts": [
      "Precision",
      "Recall (Sensitivity)",
      "Specificity",
      "F1-Score"
    ],
    "answer": 1,
    "category": "Tech"
  }
];

export const LETTERS = ['A', 'B', 'C', 'D'];

export const INITIAL_OPPONENTS = [
  { name: 'Phantom', vehicle: GUMMY_AVATARS[1].url, banter: 'Quietly dangerous.', score: 0, streak: 0 },
  { name: 'Wrangler', vehicle: GUMMY_AVATARS[2].url, banter: 'May the best driver win.', score: 0, streak: 0 },
  { name: 'Mustang', vehicle: GUMMY_AVATARS[3].url, banter: 'I came here to win.', score: 0, streak: 0 },
  { name: 'Hilux', vehicle: GUMMY_AVATARS[4].url, banter: 'Underestimate me — please.', score: 0, streak: 0 },
];

export const INITIAL_PLAYER = {
  name: '',
  vehicle: GUMMY_AVATARS[0].url,
  banter: '',
  score: 0,
  streak: 0
};
