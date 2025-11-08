# HeyAI Admin Console - Frontend (Hackathon Submission)

HeyAI Admin Console is the frontend interface for a voice-enabled AI assistant platform. This submission showcases a modern React/Next.js dashboard with stunning 3D visuals, real-time voice interaction demos, and comprehensive admin management tools.

## ✨ Key Features

### 🎨 Interactive Landing Page
- **3D Particle System**: WebGL-powered background with dynamic particle animations
- **Siri-like Voice Visualization**: Real-time audio waveform display mimicking Apple's Siri interface
- **Responsive Hero Section**: Modern landing page with smooth animations

### 🛠️ Admin Dashboard
- **Agent Management**: Add, configure, and manage AI voice agents
- **Payment Processing**: Billing and payment history interface
- **Usage Analytics**: Real-time usage statistics and history tracking
- **Modern UI Components**: Built with Radix UI primitives and Tailwind CSS

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + custom design system
- **3D Graphics**: Three.js + React Three Fiber
- **UI Components**: Radix UI primitives
- **State Management**: React hooks + context
- **TypeScript**: Full type safety

### Key Technical Highlights
- Custom WebGL shaders for particle simulation
- Real-time audio visualization components
- Responsive design across all devices
- Accessible UI components following WCAG guidelines

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation & Development

1. **Clone and install dependencies:**
   ```bash
   git clone [repository-url]
   cd HeyAI-admin-console
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```

3. **Open in browser:**
   ```bash
   "$BROWSER" http://localhost:3000
   ```

### Production Build
```bash
pnpm build
pnpm start
```

## 🎮 Demo Instructions

### Landing Page Features
1. **Particle Animation**: The background features an interactive 3D particle system
2. **Voice Demo**: Click the microphone icon to see the Siri-like voice visualization
3. **Responsive Design**: Test on different screen sizes

### Admin Dashboard
1. Navigate to `/admin` to access the dashboard
2. **Add Agent**: `/admin/add-agent` - Create new AI voice agents
3. **Payments**: `/admin/payment` - Manage billing and subscriptions  
4. **Analytics**: `/admin/usage-history` - View usage statistics

## 🎨 UI/UX Highlights

- **Design System**: Consistent spacing, typography, and color schemes
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Optimized 3D rendering with 60fps particle animations
- **Mobile-First**: Responsive design works seamlessly on all devices

## 🔧 Key Components

### 3D Graphics Engine
- **Location**: `components/gl/`
- **Features**: Custom particle simulation, WebGL shaders, performance optimization
- **Controls**: Leva debugging panel for real-time parameter adjustment

### Voice Visualization
- **Component**: `components/siri-animation.tsx`
- **Features**: Real-time audio waveform, smooth animations, Apple-inspired design