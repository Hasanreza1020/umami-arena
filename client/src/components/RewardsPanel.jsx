import { useState } from 'react';

const REWARDS = [
  {
    level: 1,
    title: 'Genin',
    icon: '🎖️',
    label: 'Welcome Badge',
    description: 'Profile title "Genin" unlocked',
    type: 'badge',
    value: null,
  },
  {
    level: 2,
    title: 'Ramen Apprentice',
    icon: '🏷️',
    label: '10% Discount',
    description: 'Use at checkout',
    type: 'code',
    value: 'RAMEN10OFF',
  },
  {
    level: 3,
    title: 'Broth Samurai',
    icon: '🍜',
    label: 'Free Pack Code',
    description: 'Redeem for one free pack',
    type: 'code',
    value: 'FREE-PACK-2024',
  },
  {
    level: 4,
    title: 'Umami Oni',
    icon: '👹',
    label: 'Early Access + VIP',
    description: 'New flavor preview + VIP badge',
    type: 'code',
    value: 'FLAVOR-VIP-001',
  },
  {
    level: 5,
    title: 'The Ramen God',
    icon: '🔱',
    label: 'Mystery Reward Box',
    description: 'Shipping info required',
    type: 'shipping',
    value: null,
  },
];

function RewardCard({ reward, unlocked }) {
  const [copied, setCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function copy() {
    navigator.clipboard.writeText(reward.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`flex flex-col p-4 border transition-all ${
        unlocked
          ? 'bg-surface border-border'
          : 'bg-surface/50 border-border/50 opacity-60'
      }`}
      style={{
        borderRadius: '6px',
        boxShadow: unlocked && reward.level >= 4 ? '0 0 12px rgba(232,51,42,0.2)' : 'none',
        minWidth: 0,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{unlocked ? reward.icon : '🔒'}</span>
        <div>
          <p className="text-text-muted text-xs uppercase tracking-widest">{reward.title}</p>
        </div>
      </div>

      <p className="text-text-primary font-semibold text-sm mb-1">{reward.label}</p>
      <p className="text-text-muted text-xs mb-3 flex-1">{reward.description}</p>

      {unlocked && reward.type === 'code' && reward.value && (
        <div>
          <div
            className="bg-bg border border-border px-3 py-2 font-mono text-xs text-amber text-center mb-2 tracking-widest"
            style={{ borderRadius: '4px' }}
          >
            {reward.value}
          </div>
          <button
            onClick={copy}
            className="w-full text-xs py-2 border border-border text-text-muted hover:border-amber hover:text-amber transition-colors"
            style={{ borderRadius: '4px' }}
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
      )}

      {unlocked && reward.type === 'badge' && (
        <div
          className="bg-red-arena/10 border border-red-arena/20 text-red-arena text-xs py-2 text-center"
          style={{ borderRadius: '4px' }}
        >
          ✓ Unlocked
        </div>
      )}

      {unlocked && reward.type === 'shipping' && (
        <div>
          {!submitted ? (
            showForm ? (
              <div className="space-y-2">
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your shipping address..."
                  className="w-full bg-bg border border-border text-text-primary text-xs p-2 resize-none focus:outline-none focus:border-amber"
                  style={{ borderRadius: '4px' }}
                  rows={3}
                />
                <button
                  onClick={() => address.trim() && setSubmitted(true)}
                  className="w-full text-xs py-2 bg-red-arena text-white hover:bg-red-600 transition-colors"
                  style={{ borderRadius: '4px' }}
                >
                  Submit Address
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full text-xs py-2 border border-amber text-amber hover:bg-amber/10 transition-colors"
                style={{ borderRadius: '4px' }}
              >
                Claim Mystery Box
              </button>
            )
          ) : (
            <div className="text-amber text-xs text-center py-2">✓ Address submitted!</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RewardsPanel({ currentLevel }) {
  return (
    <div className="bg-surface border border-border p-6" style={{ borderRadius: '6px' }}>
      <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Arena Rewards</p>
      <h2 className="font-display text-2xl text-text-primary tracking-wide mb-6">RANK REWARDS</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {REWARDS.map((reward) => (
          <RewardCard
            key={reward.level}
            reward={reward}
            unlocked={currentLevel >= reward.level}
          />
        ))}
      </div>
    </div>
  );
}
