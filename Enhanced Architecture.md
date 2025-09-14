# Enhanced Architecture & Asset Guide for Euskal Ikastetxea

## 🏗️ Architectural Improvements

### 1. Event Manager (Message Bus System)

**Problem**: Direct coupling between systems makes code harder to maintain and scale.

**Solution**: Implement a centralized event system for loose coupling.

```javascript
// events/EventManager.js
export class EventManager {
    constructor() {
        this.listeners = new Map();
    }
    
    subscribe(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType).push(callback);
    }
    
    unsubscribe(eventType, callback) {
        if (this.listeners.has(eventType)) {
            const callbacks = this.listeners.get(eventType);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    emit(eventType, data = null) {
        if (this.listeners.has(eventType)) {
            this.listeners.get(eventType).forEach(callback => {
                callback(data);
            });
        }
    }
}

// Usage Example:
// When quiz is completed
eventManager.emit('QUIZ_COMPLETED', { score: 85, topic: 'greetings' });

// Systems listening for this event
eventManager.subscribe('QUIZ_COMPLETED', (data) => {
    rewardSystem.checkAchievements(data);
    progressTracker.updateProgress(data);
    saveManager.saveProgress();
});
```

**Events to implement:**
- `LESSON_COMPLETED`
- `ACHIEVEMENT_UNLOCKED` 
- `LEVEL_UP`
- `DIALOGUE_FINISHED`
- `AREA_ENTERED`
- `VOCABULARY_LEARNED`

### 2. Enhanced Scene Manager

**Current**: Basic StateManager  
**Improved**: Full Scene lifecycle management

```javascript
// scenes/SceneManager.js
export class SceneManager {
    constructor(game) {
        this.game = game;
        this.scenes = new Map();
        this.currentScene = null;
        this.nextScene = null;
        this.transitioning = false;
    }
    
    registerScene(name, sceneClass) {
        this.scenes.set(name, sceneClass);
    }
    
    async switchTo(sceneName, transitionData = null) {
        if (this.transitioning) return;
        
        const SceneClass = this.scenes.get(sceneName);
        if (!SceneClass) {
            throw new Error(`Scene ${sceneName} not found`);
        }
        
        this.transitioning = true;
        
        // Cleanup current scene
        if (this.currentScene) {
            await this.currentScene.onExit();
            this.currentScene.cleanup();
        }
        
        // Create and initialize new scene
        this.currentScene = new SceneClass(this.game);
        await this.currentScene.preload();
        await this.currentScene.onEnter(transitionData);
        
        this.transitioning = false;
    }
    
    update(deltaTime) {
        if (this.currentScene && !this.transitioning) {
            this.currentScene.update(deltaTime);
        }
    }
    
    render(ctx) {
        if (this.currentScene) {
            this.currentScene.render(ctx);
        }
    }
}

// Base Scene Class
export class Scene {
    constructor(game) {
        this.game = game;
        this.loaded = false;
    }
    
    async preload() {
        // Load scene-specific assets
        this.loaded = true;
    }
    
    async onEnter(data) {
        // Scene initialization
    }
    
    async onExit() {
        // Cleanup before leaving
    }
    
    update(deltaTime) {
        // Scene logic
    }
    
    render(ctx) {
        // Scene rendering
    }
    
    cleanup() {
        // Memory cleanup
    }
}
```

**Scene Types to Implement:**
- `MainMenuScene`
- `OverworldScene`
- `ClassroomScene`
- `DialogueScene`
- `QuizScene`
- `InventoryScene`
- `SettingsScene`

### 3. Data-Driven Map System with Tiled

**Tool**: Tiled Map Editor (free, industry standard)  
**Export Format**: JSON

```javascript
// world/TiledMapLoader.js
export class TiledMapLoader {
    constructor() {
        this.loadedMaps = new Map();
    }
    
    async loadMap(mapPath) {
        if (this.loadedMaps.has(mapPath)) {
            return this.loadedMaps.get(mapPath);
        }
        
        const response = await fetch(`maps/${mapPath}.json`);
        const mapData = await response.json();
        
        const processedMap = this.processMapData(mapData);
        this.loadedMaps.set(mapPath, processedMap);
        
        return processedMap;
    }
    
    processMapData(rawData) {
        return {
            width: rawData.width,
            height: rawData.height,
            tilewidth: rawData.tilewidth,
            tileheight: rawData.tileheight,
            layers: this.processLayers(rawData.layers),
            objects: this.processObjects(rawData),
            properties: rawData.properties || {}
        };
    }
    
    processLayers(layers) {
        return layers.map(layer => ({
            name: layer.name,
            data: layer.data,
            opacity: layer.opacity || 1,
            visible: layer.visible !== false,
            type: layer.type,
            properties: layer.properties || {}
        }));
    }
    
    processObjects(mapData) {
        const objects = [];
        
        mapData.layers.forEach(layer => {
            if (layer.type === 'objectgroup') {
                layer.objects.forEach(obj => {
                    objects.push({
                        id: obj.id,
                        name: obj.name,
                        type: obj.type,
                        x: obj.x,
                        y: obj.y,
                        width: obj.width,
                        height: obj.height,
                        properties: obj.properties || {},
                        layer: layer.name
                    });
                });
            }
        });
        
        return objects;
    }
}

// Usage in MapManager
export class MapManager {
    constructor() {
        this.loader = new TiledMapLoader();
        this.currentMap = null;
        this.npcs = [];
        this.interactables = [];
        this.triggers = [];
    }
    
    async loadArea(areaName) {
        this.currentMap = await this.loader.loadMap(areaName);
        this.setupGameObjects();
    }
    
    setupGameObjects() {
        this.npcs = [];
        this.interactables = [];
        this.triggers = [];
        
        this.currentMap.objects.forEach(obj => {
            switch(obj.type) {
                case 'npc':
                    this.createNPC(obj);
                    break;
                case 'interactable':
                    this.createInteractable(obj);
                    break;
                case 'trigger':
                    this.createTrigger(obj);
                    break;
                case 'door':
                    this.createDoor(obj);
                    break;
            }
        });
    }
}
```

### 4. Component-Entity System (Optional but Recommended)

For complex NPCs with multiple behaviors:

```javascript
// entities/ComponentSystem.js
export class Entity {
    constructor(id) {
        this.id = id;
        this.components = new Map();
    }
    
    addComponent(component) {
        this.components.set(component.constructor.name, component);
        component.entity = this;
        return this;
    }
    
    getComponent(componentType) {
        return this.components.get(componentType.name);
    }
    
    hasComponent(componentType) {
        return this.components.has(componentType.name);
    }
    
    update(deltaTime) {
        for (const component of this.components.values()) {
            if (component.update) {
                component.update(deltaTime);
            }
        }
    }
}

// Example Components
export class PositionComponent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class SpriteComponent {
    constructor(spritePath) {
        this.sprite = null;
        this.currentFrame = 0;
        this.animationSpeed = 100;
        // Load sprite...
    }
}

export class DialogueComponent {
    constructor(dialogues) {
        this.dialogues = dialogues;
        this.currentDialogueIndex = 0;
    }
}

export class TeacherAIComponent {
    constructor() {
        this.state = 'idle';
        this.lessonPlan = [];
        this.patience = 100;
    }
    
    update(deltaTime) {
        // AI behavior logic
    }
}

// Usage: Creating a teacher NPC
const teacher = new Entity('teacher_mikel')
    .addComponent(new PositionComponent(64, 96))
    .addComponent(new SpriteComponent('sprites/teachers/mikel.png'))
    .addComponent(new DialogueComponent(teacherDialogues))
    .addComponent(new TeacherAIComponent());
```

## 🎨 Pokemon Emerald Graphics Assets

### Authentic GBA Specifications
- **Resolution**: 240x160 pixels
- **Color Depth**: 15-bit (32,768 colors)
- **Tile Size**: 16x16 pixels for backgrounds
- **Sprite Size**: 32x32 pixels for characters
- **Palette**: 16 colors per palette, 16 palettes max
- **Animation**: 3-4 frames for walking cycles

### Best Asset Sources

#### **1. Itch.io (Premium Quality)**
**Search Terms:**
- "16-bit school tileset"
- "GBA style RPG assets"
- "Pokemon-style sprites"
- "Retro classroom tileset"

**Recommended Creators:**
- **LimeZu**: Exceptional pixel art, perfect GBA style
- **Szadi art**: Modern pixel art with retro feel
- **Pixel Frog**: High-quality character sprites
- **Kronovi**: Detailed environment tilesets

**Specific Asset Packs to Look For:**
- "Modern School Interior" tilesets
- "16x16 Character Base" for NPCs
- "Classroom Furniture Pack"
- "School Building Exterior"

#### **2. OpenGameArt.org (Free Assets)**
**Filter By:**
- Art Style: Pixel Art
- Resolution: 16x16 or 32x32
- License: CC0 (most permissive)

**Search for:**
- "school sprites"
- "classroom tileset" 
- "student character"
- "teacher sprite"

#### **3. Custom Commission Guidelines**
If commissioning custom art, provide these specifications:

**Style Reference:** Pokemon Emerald screenshots  
**Technical Specs:**
- 16x16px tiles for environment
- 32x32px sprites for characters  
- Limited color palette (max 16 colors per sprite)
- Clean, chunky pixel art style
- No anti-aliasing or smooth gradients

**Cultural Elements Needed:**
- Basque flag colors (red, white, green)
- Traditional Basque clothing elements
- Ikurriña (Basque flag) decorations
- Cultural symbols and patterns

### Asset Organization Structure
```
assets/
├── graphics/
│   ├── tilesets/
│   │   ├── school_interior_16x16.png
│   │   ├── classroom_furniture_16x16.png
│   │   ├── basque_decorations_16x16.png
│   │   └── school_exterior_16x16.png
│   ├── characters/
│   │   ├── student_male_32x32.png
│   │   ├── student_female_32x32.png
│   │   ├── teacher_mikel_32x32.png
│   │   └── principal_ane_32x32.png
│   ├── ui/
│   │   ├── dialogue_box_pokemon_style.png
│   │   ├── menu_frame_gba.png
│   │   └── hud_elements.png
│   └── effects/
│       ├── interaction_sparkle.png
│       └── achievement_star.png
```

## 🎵 Audio Assets for Pokemon Emerald Feel

### Chiptune Music Specifications
- **Format**: OGG Vorbis (web-optimized)
- **Channels**: Mono or Stereo
- **Sample Rate**: 22kHz (authentic GBA feel)
- **Style**: 8-bit/16-bit chiptune

### Best Audio Sources

#### **1. Itch.io Audio Packs**
**Search Terms:**
- "chiptune school music"
- "16-bit RPG soundtrack"
- "GBA style audio"
- "retro game music pack"

**Recommended Composers:**
- **Abstraction**: Professional chiptune soundtracks
- **SketchyLogic**: Nostalgic 8-bit compositions
- **Juhani Junkala**: Free high-quality chiptunes

#### **2. Freesound.org**
**Search for:**
- "8-bit beep"
- "retro menu sound"
- "pixel game sfx"
- "chiptune loop"

**Filter by:**
- License: CC0 or CC-BY
- Format: WAV or OGG
- Quality: 16-bit minimum

#### **3. Essential Sound Effects List**
```
sfx/
├── interface/
│   ├── menu_select.wav (Pokemon-style beep)
│   ├── menu_back.wav (lower pitch beep)
│   ├── dialogue_advance.wav (text scroll sound)
│   └── achievement.wav (success chime)
├── interaction/
│   ├── door_open.wav
│   ├── footstep_indoor.wav
│   ├── paper_rustle.wav (reading signs)
│   └── correct_answer.wav
└── ambient/
    ├── classroom_quiet.wav
    ├── cafeteria_chatter.wav
    └── hallway_footsteps.wav
```

### Euskera Voice Acting

#### **Where to Find Voice Talent:**
**Professional Sources:**
- **Voices.com**: Filter by "Basque" language
- **Voice123.com**: International voice talent marketplace
- **Fiverr**: Budget-friendly options with Basque speakers

**Community Sources:**
- **Reddit**: r/basque, r/languagelearning
- **Facebook Groups**: "Euskera Learning" communities
- **University Contacts**: Basque studies departments
- **Cultural Centers**: Euskal Etxeak (Basque Centers) worldwide

#### **Voice Recording Specifications:**
- **Format**: WAV, 44.1kHz, 16-bit
- **Length**: 2-5 seconds per phrase
- **Style**: Clear, friendly, educational tone
- **Content Needed**:
  - Common vocabulary (100+ words)
  - Greetings and basic phrases
  - Numbers 1-20
  - Colors, days, months
  - Classroom instructions

### Audio Integration Code Example
```javascript
// audio/AudioManager.js
export class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = new Map();
        this.music = new Map();
        this.currentMusic = null;
        this.sfxVolume = 0.7;
        this.musicVolume = 0.5;
    }
    
    async loadAudio(name, path, type = 'sfx') {
        try {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            if (type === 'music') {
                this.music.set(name, audioBuffer);
            } else {
                this.sounds.set(name, audioBuffer);
            }
        } catch (error) {
            console.error(`Failed to load audio: ${name}`, error);
        }
    }
    
    playSound(name, volume = this.sfxVolume) {
        const sound = this.sounds.get(name);
        if (!sound) return;
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = sound;
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start(0);
    }
    
    playEuskeraWord(word) {
        // Play pronunciation for learning
        this.playSound(`euskera_${word}`);
    }
}
```

## 🔧 GPT Codex Integration Tips

### Optimized Prompts for GPT Codex

**When asking for code generation:**

```
Create a Pokemon Emerald-style [COMPONENT] for my HTML5 Canvas game:
- Use ES6 modules and classes
- 16-bit pixel art aesthetic
- 240x160 base resolution
- Grid-based movement (16px tiles)
- Include proper error handling
- Add detailed comments
- Follow the existing architecture pattern: [paste relevant class structure]

Specific requirements: [list specific features needed]
```

**For debugging:**
```
Debug this Pokemon-style game code. The issue is [specific problem].
Context: This is part of a Basque language learning game with these systems: [list relevant systems]
Expected behavior: [describe what should happen]
Current behavior: [describe what's happening]
```

### Code Organization for GPT Codex

Structure your requests to leverage the existing architecture:
1. **Reference the Event Manager** when asking for feature communication
2. **Mention Scene structure** when adding new game states  
3. **Include Tiled map integration** when working with world features
4. **Specify Pokemon Emerald style** for all visual components

This enhanced architecture will make your game much more maintainable and provide the authentic Pokemon Emerald experience you're looking for!
