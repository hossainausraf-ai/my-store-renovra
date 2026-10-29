'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Pencil, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  CheckCircle2, 
  X, 
  Loader2, 
  Upload, 
  Sparkles,
  GripVertical,
  Check
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export interface HeroCard {
  id: string;
  name: string;
  logo_url: string;
  features: string[];
  emojis: string[];
  order_idx?: number;
}

const PRESET_EMOJIS = ['🚀', '🔥', '✨', '💡', '👑', '🎨', '⚡', '🧠', '❤️', '😍'];

export default function AdminHeroCardsPage() {
  const [cards, setCards] = useState<HeroCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<HeroCard | null>(null);

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [emojis, setEmojis] = useState<string[]>(['🚀', '✨', '🔥']);
  const [orderIdx, setOrderIdx] = useState(0);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hero-cards');
      const data = await res.json();
      if (data.success && Array.isArray(data.cards)) {
        setCards(data.cards);
      }
    } catch (e) {
      console.error('Error fetching hero cards:', e);
      showNotification('error', 'হিরো কার্ড লোড করতে সমস্যা হয়েছে!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleOpenModal = (card?: HeroCard) => {
    if (card) {
      setEditingCard(card);
      setName(card.name);
      setLogoUrl(card.logo_url || '');
      setFeatures(card.features && card.features.length > 0 ? card.features : ['']);
      setEmojis(card.emojis && card.emojis.length > 0 ? card.emojis : ['🚀', '✨', '🔥']);
      setOrderIdx(card.order_idx || 0);
    } else {
      setEditingCard(null);
      setName('');
      setLogoUrl('');
      setFeatures(['Instant access credentials', '100% Genuine private access', '24/7 Replacement warranty']);
      setEmojis(['🚀', '😍', '❤️', '🔥', '✨']);
      setOrderIdx(cards.length);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setLogoUrl(data.url);
        showNotification('success', 'লোগো সফলভাবে আপলোড হয়েছে!');
      } else {
        showNotification('error', data.message || 'ইমেজ আপলোড ব্যর্থ হয়েছে!');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showNotification('error', 'ইমেজ আপলোড করতে সমস্যা হয়েছে!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('error', 'দয়া করে কার্ডের নাম লিখুন।');
      return;
    }

    setIsSaving(true);
    const cleanedFeatures = features.map(f => f.trim()).filter(Boolean);
    const cleanedEmojis = emojis.map(em => em.trim()).filter(Boolean);

    const payload = {
      id: editingCard?.id,
      name: name.trim(),
      logo_url: logoUrl.trim(),
      features: cleanedFeatures,
      emojis: cleanedEmojis,
      order_idx: Number(orderIdx) || 0
    };

    try {
      const res = await fetch('/api/hero-cards', {
        method: editingCard ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', editingCard ? 'হিরো কার্ড আপডেট সফল হয়েছে!' : 'নতুন হিরো কার্ড সফলভাবে যোগ করা হয়েছে!');
        handleCloseModal();
        fetchCards();
      } else {
        showNotification('error', data.message || 'কার্ড সংরক্ষণ করতে সমস্যা হয়েছে!');
      }
    } catch (err: any) {
      console.error('Save card error:', err);
      showNotification('error', 'সার্ভারে সংযোগ করা যায়নি।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই হিরো কার্ডটি ডিলিট করতে চান?')) return;

    try {
      const res = await fetch(`/api/hero-cards?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setCards(prev => prev.filter(c => c.id !== id));
        showNotification('success', 'হিরো কার্ড ডিলিট করা হয়েছে!');
      } else {
        showNotification('error', data.message || 'ডিলিট করতে সমস্যা হয়েছে!');
      }
    } catch {
      showNotification('error', 'সার্ভারে সংযোগ করা যায়নি।');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCards(items);

    try {
      await fetch('/api/hero-cards/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: items.map(c => c.id) })
      });
      showNotification('success', 'কার্ডের ক্রম সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (e) {
      console.error('Error reordering hero cards:', e);
      showNotification('error', 'ক্রম পরিবর্তন সংরক্ষণ করা যায়নি।');
    }
  };

  const addPresetEmoji = (em: string) => {
    if (!emojis.includes(em)) {
      setEmojis(prev => [...prev, em]);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold transition-all ${
          notification.type === 'success' 
            ? 'bg-green-950 border-green-500/40 text-green-300' 
            : 'bg-red-950 border-red-500/40 text-red-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#ccff00]" />
            হিরো সেকশন কার্ডসমূহ (Hero Cards)
          </h1>
          <p className="text-gray-400 text-sm">
            হোমপেজের শীর্ষে প্রদর্শিত অ্যানিমেটেড কার্ডের নাম, লোগো, ফিচার ও ইমোজি সম্পূর্ণভাবে ম্যানেজ করুন।
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          নতুন হিরো কার্ড যোগ করুন
        </button>
      </div>

      {/* Help banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1F2937]/50 border border-white/10 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ccff00] shrink-0" />
          <span>এই কার্ডগুলো হোমপেজের শীর্ষ হিরো সেকশনে স্বয়ংক্রিয়ভাবে স্লাইড ও রোটেট হয়ে কাস্টমারদের আকর্ষণ করে।</span>
        </div>
        <div className="text-gray-400 hidden sm:flex items-center gap-1.5 font-medium">
          <GripVertical className="w-4 h-4 text-[#ccff00]" />
          <span>ক্রম পরিবর্তন করতে কার্ড ড্র্যাগ করুন</span>
        </div>
      </div>

      {/* Hero Cards Drag & Drop Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="hero-cards-list" direction="horizontal">
          {(provided) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {isLoading ? (
                <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  হিরো কার্ডগুলো লোড হচ্ছে...
                </div>
              ) : cards.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-black/10">
                  কোনো হিরো কার্ড পাওয়া যায়নি। তৈরি করতে "+ নতুন হিরো কার্ড যোগ করুন" বাটনে চাপুন।
                </div>
              ) : (
                cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          ...(snapshot.isDragging ? { opacity: 0.85, zIndex: 100 } : {})
                        }}
                        className={`bg-[var(--surface)] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between group hover:border-white/20 hover:shadow-2xl transition-all ${
                          snapshot.isDragging ? 'shadow-blue-500/30 shadow-2xl border-blue-500/60 ring-2 ring-blue-500/30 scale-105' : ''
                        }`}
                      >
                        <div>
                          {/* Card Top Row with Logo & Drag Handle */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 p-2.5 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                              {card.logo_url ? (
                                <img src={card.logo_url} alt={card.name} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <Layers className="w-7 h-7 text-gray-400" />
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[#ccff00] uppercase tracking-wider bg-[#ccff00]/10 border border-[#ccff00]/20 px-2 py-0.5 rounded-full font-mono">
                                #{index + 1}
                              </span>

                              <div
                                {...provided.dragHandleProps}
                                className="p-1.5 bg-black/40 hover:bg-white/10 rounded-lg border border-white/10 text-white/40 hover:text-[#ccff00] cursor-grab active:cursor-grabbing transition-colors"
                                title="কার্ডের ক্রম পরিবর্তন করতে ড্র্যাগ করুন"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {card.name}
                          </h3>

                          {/* Features Checklist */}
                          {card.features && card.features.length > 0 && (
                            <div className="space-y-1.5 mb-4">
                              {card.features.slice(0, 4).map((f, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span className="truncate">{f}</span>
                                </div>
                              ))}
                              {card.features.length > 4 && (
                                <span className="text-[10px] text-gray-500 italic block">
                                  +{card.features.length - 4} more features
                                </span>
                              )}
                            </div>
                          )}

                          {/* Floating Emojis */}
                          {card.emojis && card.emojis.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3 pt-2 border-t border-white/5">
                              {card.emojis.map((em, i) => (
                                <span key={i} className="text-base px-2 py-0.5 rounded-lg bg-black/40 border border-white/5">
                                  {em}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <span className="text-[11px] text-gray-500">
                            {card.features?.length || 0}টি ফিচার
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenModal(card)}
                              className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors cursor-pointer"
                              title="কার্ড এডিট করুন"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(card.id)}
                              className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                              title="কার্ড ডিলিট করুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#ccff00]" />
                {editingCard ? 'হিরো কার্ড এডিট করুন' : 'নতুন হিরো কার্ড তৈরি করুন'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Card Name */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  কার্ডের নাম (Tool / Product Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ChatGPT Plus, Canva Pro, Envato Elements"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Logo Image Upload & URL */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  লোগো ইমেজ (Logo URL বা আপলোড করুন)
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-inner">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <input
                      type="text"
                      placeholder="ইমেজ URL দিন (https://...)"
                      value={logoUrl}
                      onChange={e => setLogoUrl(e.target.value)}
                      className="w-full bg-[#1F2937]/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer">
                      {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{isUploading ? 'আপলোড হচ্ছে...' : 'কম্পিউটার থেকে লোগো আপলোড করুন'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        disabled={isUploading} 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                    কার্ডের সুবিধাসমূহ (Features List)
                  </label>
                  <button
                    type="button"
                    onClick={() => setFeatures(prev => [...prev, ''])}
                    className="text-xs font-bold text-[#ccff00] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> + নতুন লাইন যোগ করুন
                  </button>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={e => {
                          const updated = [...features];
                          updated[idx] = e.target.value;
                          setFeatures(updated);
                        }}
                        className="flex-1 bg-[#1F2937]/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder={`ফিচার #${idx + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                        className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs border border-red-500/20"
                        title="মুছুন"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Emojis */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                    ভাসমান ইমোজিসমূহ (Floating Emojis)
                  </label>
                  <button
                    type="button"
                    onClick={() => setEmojis(prev => [...prev, '✨'])}
                    className="text-xs font-bold text-[#ccff00] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> + ইমোজি দিন
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-gray-400 mr-1">ক্লিক করে যোগ করুন:</span>
                  {PRESET_EMOJIS.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => addPresetEmoji(em)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-sm transition-transform active:scale-90"
                    >
                      {em}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {emojis.map((emoji, idx) => (
                    <div key={idx} className="flex items-center bg-black/40 border border-white/10 rounded-xl px-2 py-1 gap-1">
                      <input
                        type="text"
                        value={emoji}
                        onChange={e => {
                          const updated = [...emojis];
                          updated[idx] = e.target.value;
                          setEmojis(updated);
                        }}
                        className="w-8 bg-transparent text-center text-base focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setEmojis(emojis.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-400 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingCard ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
