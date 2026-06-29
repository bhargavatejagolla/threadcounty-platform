# ThreadCounty (NovaWeave AI™) 🧵✨

![ThreadCounty Hero](public/logo.png)

ThreadCounty is a next-generation AI-powered fabric analysis and quality control platform. Built with Next.js 14, it features the proprietary **NovaWeave AI™** engine for true explainable machine vision in textile manufacturing.

## 🌟 Features

- **Fabric Scanner**: Drag-and-drop high-resolution fabric scans to instantly detect anomalies, thread count variations, and structural defects.
- **Explainable AI**: Visual heatmaps and confidence scores highlight exactly *why* a fabric passed or failed QC.
- **Mission Control Dashboard**: Real-time analytics, recent inspections, and system health monitoring in a gorgeous glassmorphism UI.
- **Analysis Vault**: Secure, searchable historical storage of all fabric scans and their corresponding AI reports.
- **Performance Center**: System metrics and AI model accuracy tracking.
- **Interactive WebGL Backgrounds**: Stunning, hardware-accelerated visual effects using Three.js and OGL (Lightfall, Ferrofluid, LineWaves).

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS animations
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **WebGL**: [Three.js](https://threejs.org/) & [OGL](https://github.com/oframe/ogl) (via React-Bits)
- **Authentication & Database**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: React Hook Form + Zod validation

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- A Supabase project (for authentication and database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/threadcounty-platform.git
   cd threadcounty-platform
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install --ignore-engines
   ```
   *(Note: `--legacy-peer-deps` is required due to Three.js/OGL peer dependency resolution in modern React environments).*

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deployment (Vercel)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`) in the Vercel project settings.
4. Deploy! Vercel will automatically detect Next.js and configure the build settings (`npm run build`).

## 📁 Project Structure

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/ui/`: Reusable UI components (Shadcn, WebGL backgrounds, etc.).
- `src/components/layout/`: Global layout components (Navbar, Sidebar, Footer).
- `src/lib/`: Utility functions, Supabase client, and computer vision mock logic.
- `public/`: Static assets (logos, images).

## 📄 License

This project is licensed under the MIT License.
