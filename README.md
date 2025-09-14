# Euskal Ikastetxea

_Educational Video Game: Euskera School - Pokémon Style_

An educational video game in 2D RPG format, similar to Pokémon, where students explore a virtual school, interacting with characters, reading signs, and completing activities to learn Basque in an immersive and fun way.

## Current Status

Euskal Ikastetxea is in active development. The core engine, scene management, and a basic world are now functional, laying the groundwork for further content and systems.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the development server**
   ```bash
   npm start
   ```
4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in a web browser.

## Tech Stack

- **HTML5 Canvas** for rendering
- **JavaScript (ES6 Modules)** for game logic
- **Node.js** with the `serve` package for the development server

## Architecture

The project is organized into modular systems that power gameplay and user interaction:

- **GameEngine** – orchestrates the game loop, rendering, and global state.
- **EventManager** – dispatches and listens for in-game events.
- **SceneManager** – handles transitions between scenes such as the world map and dialogues.
- **TileEngine** – renders tile-based maps and manages collisions.
- **DialogueEngine** – displays conversations and branching dialogue choices.

## Project Structure

```
src/
├── core/      # Base engine classes (GameEngine, EventManager, SceneManager)
├── scenes/    # Scene definitions and transitions
├── world/     # Tile maps, assets, and world configuration
├── events/    # Event definitions and triggers
└── ui/        # UI components like dialogue boxes and menus
```

## Project Vision & Roadmap

### Virtual School Structure

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

### Game Mechanics

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

### Development Plan

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

### Additional Vision

#### Visual and Audio Elements
- **16-bit Pixel Art** with a Basque color palette
- **Ambient Music** and cultural sound effects
- **Voices in Basque** to showcase native pronunciation

#### Technical Considerations
- **HTML5 Canvas** and **Web Audio API**
- **LocalStorage** for saving progress
- **PWA Ready** for installation on devices

#### Commercial Considerations
- **Freemium** model with optional DLCs
- **Institutional Licenses** for schools
- **Success Metrics** focused on engagement and learning outcomes

#### Deliverables
1. **Playable Prototype**: 15–20 minute demo
2. **Design Document**: Complete specifications
3. **Development Plan**: Detailed timeline with milestones
4. **Budget**: Breakdown of costs by phase
5. **Market Analysis**: Competition and opportunities
6. **Marketing Strategy**: Launch and promotion plan

#### Value Proposition
- **For Students**: Immersive, fun, and pressure-free learning
- **For Teachers**: Support tool with progress metrics
- **For Institutions**: Innovative solution for teaching Basque
- **For Basque Culture**: Preservation and promotion of the language in a modern way

