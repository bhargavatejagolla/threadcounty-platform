'use client';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold sm:text-5xl">About ThreadCounty</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Revolutionizing textile inspection through Artificial Intelligence and Computer Vision.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Our Story</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          ThreadCounty was founded with a simple goal: to eliminate the tedious, manual processes involved in textile analysis. For decades, determining warp and weft counts, detecting defects, and analyzing weave patterns relied on the human eye. We brought state-of-the-art AI to the textile industry, empowering manufacturers, researchers, and students to analyze fabrics instantly with exceptional accuracy.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
          <p className="text-muted-foreground">
            To provide accessible, high-precision automated textile analysis tools that improve quality control, reduce waste, and enhance educational research globally.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Our Vision</h2>
          <p className="text-muted-foreground">
            To become the industry standard for AI-powered fabric inspection, continually pushing the boundaries of what computer vision can achieve in the textile sector.
          </p>
        </section>
      </div>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Technology Stack</h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <li className="bg-muted p-4 rounded-lg font-medium">React & Next.js</li>
          <li className="bg-muted p-4 rounded-lg font-medium">Supabase</li>
          <li className="bg-muted p-4 rounded-lg font-medium">Python AI Models</li>
          <li className="bg-muted p-4 rounded-lg font-medium">Tailwind CSS</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Timeline</h2>
        <div className="border-l-2 border-primary pl-6 space-y-8">
          <div>
            <h3 className="font-bold text-lg">2024 - Concept</h3>
            <p className="text-muted-foreground">The initial idea for an automated thread counter is born.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">2025 - Beta Launch</h3>
            <p className="text-muted-foreground">First prototype tested by textile engineering students.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">2026 - ThreadCounty Hackathon</h3>
            <p className="text-muted-foreground">The launch of our full-stack, enterprise-ready platform.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
