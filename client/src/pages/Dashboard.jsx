import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiJSON } from '../api';
import TopBar from '../components/TopBar';
import HeroStats from '../components/HeroStats';
import CodeEntry from '../components/CodeEntry';
import RankBar from '../components/RankBar';
import StreakBar from '../components/StreakBar';
import RewardsPanel from '../components/RewardsPanel';
import NoodleCatch from '../components/NoodleCatch';
import Leaderboard from '../components/Leaderboard';
import LevelUpOverlay from '../components/LevelUpOverlay';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [levelUp, setLevelUp] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiJSON('/api/user/me');
      setUser(data);
    } catch {
      localStorage.removeItem('ua_token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  function handleLogout() {
    localStorage.removeItem('ua_token');
    navigate('/login');
  }

  function handleRedemption(result) {
    setUser(result.user);
    if (result.levelUp && result.newLevel) {
      setLevelUp(result.newLevel);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="font-display text-4xl text-red-arena tracking-widest animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {levelUp && (
        <LevelUpOverlay level={levelUp} onDismiss={() => setLevelUp(null)} />
      )}

      <TopBar user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <HeroStats user={user} />
        <StreakBar recentDays={user?.recentDays || []} streak={user?.current_streak || 0} />
        <CodeEntry user={user} onRedemption={handleRedemption} />
        <RankBar totalPacks={user?.total_packs || 0} currentLevel={user?.current_level || 0} />
        <RewardsPanel currentLevel={user?.current_level || 0} />
        <NoodleCatch />
        <Leaderboard currentUserId={user?.id} />
      </main>
    </div>
  );
}
