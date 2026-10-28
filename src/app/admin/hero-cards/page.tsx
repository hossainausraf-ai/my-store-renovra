'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Pencil, Trash2, Plus, Image as ImageIcon, CheckCircle, X } from 'lucide-react';

type HeroCard = {
  id: string;
  name: string;
  logo_url: string;
  features: string[];
  emojis: string[];
  order_idx: number;
};

export default function HeroCardsAdmin() {
  const [cards, setCards] = useState<HeroCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<HeroCard | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [emojis, setEmojis] = useState<string[]>(['']);
  const [orderIdx, setOrderIdx] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('hero_cards')
      .select('*')
      .order('order_idx', { ascending: true });
    
    if (error) {
      console.error('Error fetching cards:', error);
    } else if (data) {
      setCards(data);
    }
    setIsLoading(false);
  };

  const handleOpenModal = (card?: HeroCard) => {
    if (card) {
      setEditingCard(card);
      setName(card.name);
      setLogoUrl(card.logo_url);
      setFeatures(card.features?.length ? card.features : ['']);
      setEmojis(card.emojis?.length ? card.emojis : ['']);
      setOrderIdx(card.order_idx || 0);
    } else {
      setEditingCard(null);
      setName('');
      setLogoUrl('');
      setFeatures(['']);
      setEmojis(['']);
      setOrderIdx(cards.length + 1);
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

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `hero-cards/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setLogoUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty fields
    const cleanedFeatures = features.filter(f => f.trim() !== '');
    const cleanedEmojis = emojis.filter(e => e.trim() !== '');

    const cardData = {
      name,
      logo_url: logoUrl,
      features: cleanedFeatures,
      emojis: cleanedEmojis,
      order_idx: orderIdx
    };

    if (editingCard) {
      const { error } = await supabase
        .from('hero_cards')
        .update(cardData)
        .eq('id', editingCard.id);
      
      if (error) alert('Error updating card: ' + error.message);
    } else {
      const { error } = await supabase
        .from('hero_cards')
        .insert([cardData]);
      
      if (error) alert('Error creating card: ' + error.message);
    }

    handleCloseModal();
    fetchCards();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      const { error } = await supabase
        .from('hero_cards')
        .delete()
        .eq('id', id);
      
      if (error) alert('Error deleting card');
      else fetchCards();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hero Section Cards</h1>
          <p className="text-gray-400">Manage the sliding cards in the Hero section</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Card
        </button>
      </div>

      {isLoading ? (
        <div className="text-gray-400">Loading cards...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card.id} className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2">
                  {card.logo_url ? (
                    <img src={card.logo_url} alt={card.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-black font-bold">{card.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(card)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(card.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{card.name}</h3>
              <div className="text-sm text-gray-400 mb-4">Order: {card.order_idx}</div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {card.emojis?.map((e, i) => <span key={i} className="text-xl">{e}</span>)}
              </div>

              <div className="space-y-2 flex-1">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Features</p>
                {card.features?.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex gap-2 items-start text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
                {card.features?.length > 3 && (
                  <div className="text-sm text-gray-500 italic">+{card.features.length - 3} more</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--surface)] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[var(--surface)] border-b border-white/10 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-white">{editingCard ? 'Edit Card' : 'Add New Card'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Card Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Canva Pro"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Display Order</label>
                  <input
                    type="number"
                    value={orderIdx}
                    onChange={(e) => setOrderIdx(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Logo Image</label>
                <div className="flex gap-4 items-start">
                  {logoUrl && (
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shrink-0">
                      <img src={logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none text-sm"
                      placeholder="Image URL or upload below..."
                    />
                    <label className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm text-gray-300">
                      <ImageIcon className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm text-gray-300 flex justify-between">
                  Features (Text Descriptions)
                  <button type="button" onClick={() => setFeatures([...features, ''])} className="text-blue-400 hover:text-blue-300 text-xs font-bold">+ Add Feature</button>
                </label>
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newF = [...features];
                        newF[idx] = e.target.value;
                        setFeatures(newF);
                      }}
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                      placeholder={`Feature ${idx + 1}`}
                    />
                    <button type="button" onClick={() => setFeatures(features.filter((_, i) => i !== idx))} className="text-red-400 hover:bg-red-500/10 px-3 rounded-lg border border-red-500/20">X</button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <label className="text-sm text-gray-300 flex justify-between">
                  Floating Emojis (e.g. 🔥, 🚀)
                  <button type="button" onClick={() => setEmojis([...emojis, ''])} className="text-blue-400 hover:text-blue-300 text-xs font-bold">+ Add Emoji</button>
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-black/30 border border-white/10 rounded-lg pr-1 pl-2 focus-within:border-blue-500">
                      <input
                        type="text"
                        value={emoji}
                        onChange={(e) => {
                          const newE = [...emojis];
                          newE[idx] = e.target.value;
                          setEmojis(newE);
                        }}
                        className="w-12 bg-transparent text-xl py-1 text-center focus:outline-none"
                        placeholder="✨"
                      />
                      <button type="button" onClick={() => setEmojis(emojis.filter((_, i) => i !== idx))} className="text-red-400 p-1 hover:bg-red-500/20 rounded">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 rounded-xl text-white font-medium hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-colors">
                  {editingCard ? 'Update Card' : 'Save Card'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
