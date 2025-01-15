

import React from 'react';
import { useNDK } from '../context/NDKContext';

export default function MainContent(): React.ReactElement {

  const { ndk } = useNDK();

  return (
    <main className="flex-1 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Your Universal Nostr Client
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect, share, and explore the decentralized social network from anywhere
          </p>
          
          {!ndk && (
            <div className="animate-bounce">
              <p className="text-yellow-400">Please wait, connecting to Nostr network...</p>
            </div>
          )}
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon="🔐"
            title="Secure"
            description="End-to-end encryption keeps your data safe"
          />
          <FeatureCard
            icon="⚡"
            title="Fast"
            description="Lightning-quick interactions and updates"
          />
          <FeatureCard
            icon="🌐"
            title="Universal"
            description="Works across all major browsers"
          />
          <FeatureCard
            icon="🔄"
            title="Real-time"
            description="Instant updates and notifications"
          />
          <FeatureCard
            icon="📱"
            title="Responsive"
            description="Perfect experience on any device"
          />
          <FeatureCard
            icon="🎨"
            title="Customizable"
            description="Personalize your Nostr experience"
          />
        </section>

        {/* Quick Actions */}
        <section className="text-center">
          <h3 className="text-2xl font-semibold mb-6">Quick Actions</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <QuickActionButton
              text="Create Post"
              onClick={() => {}}
              icon="✏️"
            />
            <QuickActionButton
              text="Find Friends"
              onClick={() => {}}
              icon="👥"
            />
            <QuickActionButton
              text="Settings"
              onClick={() => {}}
              icon="⚙️"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl 
                    hover:bg-gray-700/50 transition-all duration-300
                    transform hover:scale-105">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function QuickActionButton({ text, onClick, icon }: {
  text: string;
  onClick: () => void;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-purple-600 hover:bg-purple-700
                 rounded-lg transition-all duration-300
                 flex items-center gap-2 shadow-lg hover:scale-105"
    >
      <span>{icon}</span>
      <span>{text}</span>
    </button>
  );
}