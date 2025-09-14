# Educational Video Game: Euskera School - Pokémon Style
## Analysis and Approach for the Client

### 🎮 General Concept
An educational video game in 2D RPG format, similar to Pokémon, where students explore a virtual school, interacting with characters, reading signs, and completing activities to learn Basque in an immersive and fun way.

### 🏗️ System Architecture

#### **1. Game Engine**
- **Canvas 2D HTML5**: Main rendering
- **State System**: Menus, exploration, dialogues, inventory
- **Game Loop**: Update/Render at 60fps
- **Event System**: Interactions and triggers

#### **2. World Management**
- **MapManager**: Map loading and rendering
- **TileEngine**: Tile system for the world
- **CollisionSystem**: Collision and boundary detection
- **TransitionManager**: Changes between classrooms/areas

#### **3. Character System**
- **Player**: Player avatar with grid-based movement
- **NPCManager**: Teachers, students, school staff
- **DialogueSystem**: Multiple choice conversation system
- **CharacterController**: Movement and animations

---

### 🏫 Virtual School Structure

#### **Main Areas**
1. **Entrance Hall**
   - Reception with general information
   - Notice board (in Basque)
   - Secretary's office with administrative NPC

2. **Themed Classrooms**
   - **Vocabulary Classroom**: Labeled objects
   - **Grammar Classroom**: Interactive exercises
   - **Conversation Classroom**: Dialogues with NPCs
   - **Basque Culture Classroom**: History and traditions

3. **Common Areas**
   - **Cafeteria**: Informal conversations
   - **Library**: Interactive books and stories
   - **Courtyard**: Traditional Basque games
   - **Gym**: Sports with specific terminology

4. **Special Areas**
   - **Language Lab**: Pronunciation mini-games
   - **Music Room**: Traditional songs
   - **Garden**: Nature and environmental vocabulary

---

### 💻 Technical Architecture - Core Classes

#### **Core Classes**
```
Game
├── GameEngine (main engine)
├── StateManager (state management)
├── AssetLoader (resource loading)
└── SaveManager (player progress)

World
├── Map (school maps)
├── Tile (world elements)
├── Zone (specific areas)
└── InteractableObject (clickable objects)

Characters
├── Player (player)
├── NPC (non-playable characters)
├── Teacher (specialized teachers)
└── Student (other students)

Learning
├── LessonManager (lessons and content)
├── ProgressTracker (progress tracking)
├── QuizSystem (assessments)
└── RewardSystem (achievements and badges)

UI
├── DialogueBox (conversations)
├── Inventory (collected objects)
├── MenuSystem (navigation)
└── HUD (main interface)
```

#### **Learning Systems**
- **ContentDatabase**: Basque language content database
- **AdaptiveLearning**: Difficulty adjustment based on progress
- **SpeechRecognition**: Pronunciation recognition (optional)
- **ProgressAnalytics**: Learning metrics

---

### 🎯 Game Mechanics

#### **Exploration and Navigation**
- **Grid-Based Movement**: Like classic Pokémon (4 directions)
- **Proximity Interaction**: Indicative icons
- **Fast Travel**: School map for quick movement
- **Guided Missions**: Clear objectives to guide learning

#### **Progress System**
- **Proficiency Levels**: A1, A2, B1, B2, C1, C2
- **XP System**: Experience points for completing activities
- **Badges/Achievements**: Recognition for specific milestones
- **Knowledge Inventory**: Words and phrases learned

#### **Educational Interactions**
- **Informative Posters**: Hover for translation/pronunciation
- **Contextual Dialogues**: Conversations adapted to the level
- **Mini-games**: Specific activities by skill
- **Integrated Assessments**: Natural quizzes within the narrative

---

### 🎨 Visual and Audio Elements

#### **Art and Aesthetics**
- **16-bit Pixel Art**: Nostalgic and accessible style
- **Basque Color Palette**: Green, red, white
- **Animated Sprites**: Characters with personality
- **Responsive UI**: Adaptable to different devices

#### **Audio System**
- **Ambient Music**: Soft melodies for each area
- **Sound Effects**: Feedback for interactions
- **Voices in Basque**: Native pronunciation (essential)
- **Cultural Sounds**: Txistu, drum, etc.

---

### 📱 Technical Considerations

#### **Web Technologies**
- **HTML5 Canvas**: Optimized 2D rendering
- **JavaScript ES6+**: Object-oriented programming
- **Web Audio API**: Advanced sound system
- **LocalStorage**: Local progress saving
- **PWA Ready**: Installable as a mobile app


#### **Optimization**
- **Asset Streaming**: Progressive loading of resources
- **Memory Management**: Cleaning up unused objects
- **Mobile Responsive**: Touch controls and adaptive UI
- **Offline Capability**: Functionality without internet

#### **Accessibility**
- **Subtitles**: For all audio
- **Configurable Controls**: Keyboard and mouse/touch
- **Speed Options**: Adjustable text and audio
- **High Contrast Mode**: For users with visual impairments

---

### 📊 Development Plan

#### **Phase 1: Foundation (4 weeks)**
- Basic game engine
- Map and navigation system
- Functional player character
- Basic dialogue system

#### **Phase 2: Core Systems (6 weeks)**
- NPCs and interaction system
- Educational content database
- Progress and save system
- Main UI/UX

#### **Phase 3: Content Creation (8 weeks)**
- Creation of all school maps
- Implementation of lessons and activities
- Audio recording in Basque
- Educational mini-games

#### **Phase 4: Polish & Testing (4 weeks)**
- Balancing of educational content
- Extensive testing
- Performance optimization
- Deployment and distribution

---

### 💰 Commercial Considerations

#### **Distribution Platforms**
- **Web Direct**: Own hosting with subscription
- **Institutional**: Licenses for schools
- **App Stores**: PWA version in stores
- **LMS Integration**: Compatible with educational platforms

#### **Monetization Model**
- **Freemium**: Free basic content, advanced content for a fee
- **Educational Licenses**: Subscriptions for institutions
- **Additional Content**: DLCs with new areas and lessons

#### **Success Metrics**
- **Engagement**: Playtime and retention
- **Learning Outcomes**: Measurable educational progress
- **User Satisfaction**: Ratings and feedback
- **Adoption Rate**: Growth in active users

---

### ✅ Deliverables for the Client

1. **Playable Prototype**: 15-20 minute demo
2. **Design Document**: Complete specifications
3. **Development Plan**: Detailed timeline with milestones
4. **Budget**: Breakdown of costs by phase
5. **Market Analysis**: Competition and opportunities
6. **Marketing Strategy**: Launch and promotion plan

### 🎯 Value Proposition

**For Students**: Immersive, fun, and pressure-free learning
**For Teachers**: Support tool with progress metrics
**For Institutions**: Innovative solution for teaching Basque
**For Basque Culture**: Preservation and promotion of the language in a modern way
