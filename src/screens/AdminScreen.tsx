import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  Download,
  AlertTriangle,
  Megaphone,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
} from '../components/icons';
import { useAdminStore } from '../store/admin.store';
import { useUIStore } from '../store/ui.store';
import { useOrderStore } from '../store/order.store';
import { useAuthStore } from '../store/auth.store';
import { useFeedStore } from '../store/feed.store';
import { formatPrice } from '../utils/formatPrice';

export const AdminScreen: React.FC = () => {
  const {
    buySellActive,
    sellerDefaultOpen,
    disputesAccepting,
    newSignupsOpen,
    platformFeePercent,
    metrics,
    journal,
    tickets,
    toggleBuySell,
    toggleSellerDefault,
    toggleDisputes,
    toggleSignups,
    setPlatformFee,
    addJournalEntry,
  } = useAdminStore();

  const { navigateBack, addToast } = useUIStore();
  const { orders } = useOrderStore();
  const { currentUser, updateProfile } = useAuthStore();
  const { posts, refreshPosts } = useFeedStore();

  const [activeTab, setActiveTab] = useState<'metrics' | 'orders' | 'tickets' | 'journal' | 'notices' | 'founder'>('metrics');

  // Official Notice publisher state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeCta, setNoticeCta] = useState('');

  const exportJournalCsv = (): void => {
    const headers = ['ID', 'Actor', 'Action', 'Target', 'Details', 'Timestamp'];
    const rows = journal.map((j) => [
      j.id,
      `"${j.actor}"`,
      j.action,
      j.target,
      `"${j.details}"`,
      j.timestamp,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abihani_audit_journal_${Date.now()}.csv`;
    a.click();
    addToast('Audit journal CSV downloaded');
  };

  const handlePublishNotice = (): void => {
    if (!noticeTitle.trim() && !noticeMessage.trim()) return;
    useFeedStore.getState().dismissNotice();
    useFeedStore.setState({
      officialNotice: {
        id: `notice_${Date.now()}`,
        title: noticeTitle.trim() || 'Official Notice',
        message: noticeMessage.trim(),
        ctaLabel: noticeCta.trim() || undefined,
        ctaLink: 'terms',
        createdAt: new Date().toISOString(),
      },
    });

    addJournalEntry({
      actor: 'Admin',
      action: 'PUBLISH_NOTICE',
      target: 'FEED',
      details: `Published notice: "${noticeTitle}"`,
    });

    addToast('Official notice published to feed', 'success');
    setNoticeTitle('');
    setNoticeMessage('');
    setNoticeCta('');
  };

  // Founder Superpowers (Own personal account only)
  const handleBoostFollowers = (): void => {
    updateProfile({ followersCount: currentUser.followersCount + 50 });
    addJournalEntry({
      actor: 'Founder',
      action: 'FOUNDER_BOOST_FOLLOWERS',
      target: currentUser.handle,
      details: 'Added +50 followers to personal account.',
    });
    addToast('+50 followers added to personal account', 'success');
  };

  const handleFeaturePost = (postId: string): void => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    post.viewsCount += 500;
    post.likesCount += 25;
    refreshPosts(currentUser.id);
    addJournalEntry({
      actor: 'Founder',
      action: 'FOUNDER_FEATURE_POST',
      target: postId,
      details: 'Boosted engagement score on personal post.',
    });
    addToast('Post boosted in For You feed', 'success');
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0F] text-[#F5F0E6] pb-28 pt-safe select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <button onClick={navigateBack} className="p-1 rounded text-neutral-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#E7C27A]" />
            <h1 className="text-sm font-extrabold text-[#F5F0E6]">Admin Dashboard</h1>
          </div>
        </div>

        <button
          onClick={exportJournalCsv}
          className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[#E7C27A] hover:bg-neutral-800"
        >
          <Download className="w-3.5 h-3.5" />
          <span>CSV Journal</span>
        </button>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto">
        {/* 1. MASTER SWITCHES: TOP OF ADMIN, ALWAYS VISIBLE */}
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#E7C27A] block mb-2 px-1">
            Platform Master Switches
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Buy & Sell Switch */}
            <div
              onClick={toggleBuySell}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                buySellActive
                  ? 'bg-neutral-900 border-[#4ADE80]/40'
                  : 'bg-neutral-900 border-[#FF3B3B]/40'
              }`}
            >
              <div>
                <span className="text-xs font-bold block text-[#F5F0E6]">Buy & Sell</span>
                <span className={`text-[10px] font-bold ${buySellActive ? 'text-[#4ADE80]' : 'text-[#FF3B3B]'}`}>
                  {buySellActive ? 'Active' : 'Paused'}
                </span>
              </div>
              {buySellActive ? (
                <ToggleRight className="w-6 h-6 text-[#4ADE80]" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-[#FF3B3B]" />
              )}
            </div>

            {/* Seller Default Switch */}
            <div
              onClick={toggleSellerDefault}
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold block text-[#F5F0E6]">Seller Default</span>
                <span className="text-[10px] font-bold text-[#E7C27A]">
                  {sellerDefaultOpen ? 'Open' : 'Restricted'}
                </span>
              </div>
              {sellerDefaultOpen ? (
                <ToggleRight className="w-6 h-6 text-[#E7C27A]" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-neutral-500" />
              )}
            </div>

            {/* Disputes Switch */}
            <div
              onClick={toggleDisputes}
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold block text-[#F5F0E6]">Disputes Queue</span>
                <span className={`text-[10px] font-bold ${disputesAccepting ? 'text-[#4ADE80]' : 'text-[#FF3B3B]'}`}>
                  {disputesAccepting ? 'Accepting' : 'Frozen'}
                </span>
              </div>
              {disputesAccepting ? (
                <ToggleRight className="w-6 h-6 text-[#4ADE80]" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-[#FF3B3B]" />
              )}
            </div>

            {/* Signups Switch */}
            <div
              onClick={toggleSignups}
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold block text-[#F5F0E6]">New Signups</span>
                <span className="text-[10px] font-bold text-[#E7C27A]">
                  {newSignupsOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              {newSignupsOpen ? (
                <ToggleRight className="w-6 h-6 text-[#E7C27A]" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-neutral-500" />
              )}
            </div>
          </div>
        </div>

        {/* 2. Platform Fee Admin Control */}
        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold block text-[#F5F0E6]">Platform Fee (%)</span>
            <span className="text-[10px] text-neutral-400">Snapshot upon order creation</span>
          </div>
          <div className="flex items-center gap-2">
            {[0.5, 1.0, 2.5, 5.0].map((fee) => (
              <button
                key={fee}
                onClick={() => setPlatformFee(fee)}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  platformFeePercent === fee
                    ? 'bg-[#E7C27A] text-[#0B0B0F]'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {fee}%
              </button>
            ))}
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex border-b border-neutral-800 gap-4 text-xs font-bold overflow-x-auto no-scrollbar pb-1">
          {(['metrics', 'orders', 'tickets', 'journal', 'notices', 'founder'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`capitalize pb-1 whitespace-nowrap ${
                activeTab === t ? 'text-[#E7C27A] border-b-2 border-[#E7C27A]' : 'text-neutral-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab 1: Metrics */}
        {activeTab === 'metrics' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-[#B8B2A6] block">Users (Today / Total)</span>
                <span className="text-lg font-extrabold text-[#F5F0E6] tabular-nums">
                  {metrics.usersToday} / {metrics.usersTotal}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-[#B8B2A6] block">Orders (Today / Total)</span>
                <span className="text-lg font-extrabold text-[#F5F0E6] tabular-nums">
                  {metrics.ordersToday} / {metrics.ordersTotal}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-[#B8B2A6] block">GMV Total</span>
                <span className="text-base font-extrabold text-[#E7C27A] tabular-nums">
                  {formatPrice(metrics.gmvTotal)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-[#B8B2A6] block">Completed Orders (Done)</span>
                <span className="text-lg font-extrabold text-[#4ADE80] tabular-nums">
                  {metrics.doneOrdersCount}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#F5F0E6] block">Cancelled Orders</span>
                <span className="text-[10px] text-neutral-400">Separately audited</span>
              </div>
              <span className="text-sm font-extrabold text-[#FF3B3B] tabular-nums">
                {metrics.cancelledOrdersCount}
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Dispute Resolution */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F5F0E6]">{o.orderNumber}</span>
                  <span className="text-[10px] font-mono text-[#E7C27A]">{formatPrice(o.amount)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Buyer: @{o.buyer.handle}</span>
                  <span>Seller: @{o.seller.handle}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60">
                  <span className="text-[10px] font-bold text-[#4ADE80]">{o.status}</span>
                  <span className="text-[10px] text-neutral-500">{o.settlementMethod}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{t.subject}</span>
                  <span className="text-[10px] text-[#E7C27A]">{t.status}</span>
                </div>
                <p className="text-xs text-neutral-400">{t.messages[0]?.text}</p>
                <span className="text-[9px] text-neutral-500 block">From: @{t.userHandle}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Immutable Journal */}
        {activeTab === 'journal' && (
          <div className="space-y-2">
            <span className="text-[11px] text-neutral-400 block mb-1">
              Append-only audit ledger (never deletable)
            </span>
            <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar font-mono text-[10px]">
              {journal.map((j) => (
                <div key={j.id} className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80">
                  <div className="flex justify-between text-[#E7C27A]">
                    <span>[{j.action}]</span>
                    <span>{new Date(j.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-neutral-300 mt-1">{j.details}</p>
                  <span className="text-neutral-500 mt-0.5 block">Actor: {j.actor}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Official Notices Creator */}
        {activeTab === 'notices' && (
          <div className="space-y-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E7C27A]">
              <Megaphone className="w-4 h-4" />
              <span>Create Official Notice</span>
            </div>
            <input
              type="text"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="Notice Title (e.g. Welcome to Abihani)"
              className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-[#F5F0E6]"
            />
            <textarea
              value={noticeMessage}
              onChange={(e) => setNoticeMessage(e.target.value)}
              rows={3}
              placeholder="Announcement text (appears in feed every 15 posts)..."
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-[#F5F0E6] resize-none"
            />
            <input
              type="text"
              value={noticeCta}
              onChange={(e) => setNoticeCta(e.target.value)}
              placeholder="Optional CTA label (e.g. Read Guidelines)"
              className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-[#F5F0E6]"
            />
            <button
              onClick={handlePublishNotice}
              className="w-full h-11 rounded-xl bg-[#C41E3A] text-white text-xs font-bold shadow hover:bg-[#b01a33]"
            >
              Publish to Feed
            </button>
          </div>
        )}

        {/* Tab 6: Founder Superpowers */}
        {activeTab === 'founder' && (
          <div className="space-y-4 p-4 rounded-2xl bg-neutral-900 border border-[#E7C27A]/30">
            <div>
              <span className="text-xs font-bold text-[#E7C27A] block">
                Founder Superpowers (Own Account Only)
              </span>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Rule: Only on your own personal account. Never on fake accounts. All journaled.
              </p>
            </div>

            <button
              onClick={handleBoostFollowers}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 text-xs font-bold text-[#F5F0E6] hover:bg-neutral-700 flex items-center justify-between"
            >
              <span>Add +50 Followers (Personal Account)</span>
              <TrendingUp className="w-4 h-4 text-[#4ADE80]" />
            </button>

            <div>
              <span className="text-[11px] font-bold text-neutral-300 block mb-2">
                Feature Personal Post in For You Feed:
              </span>
              <div className="space-y-2">
                {posts
                  .filter((p) => p.sellerId === currentUser.id)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-neutral-950 flex items-center justify-between text-xs"
                    >
                      <span className="truncate max-w-[200px] text-[#B8B2A6]">{p.caption}</span>
                      <button
                        onClick={() => handleFeaturePost(p.id)}
                        className="px-2.5 py-1 rounded bg-[#E7C27A] text-[#0B0B0F] font-bold text-[10px]"
                      >
                        Feature
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
