import React, { useState } from 'react';
import { Check, Scale, Sparkles, UtensilsCrossed, BookOpen } from 'lucide-react';
import {
  INGREDIENTS,
  TECHNIQUES,
  IMAGE_ASSETS,
  IngredientItem,
  TechniqueItem,
} from '../utils/recipeLogic';
import { ResilientImage } from './ResilientImage';

interface IngredientsTechniquesViewProps {
  initialFilter?: 'all' | 'ingredients' | 'techniques';
  checkedIngredients: Record<string, boolean>;
  onToggleIngredient: (id: string) => void;
  onStartCooking: () => void;
}

export const IngredientsTechniquesView: React.FC<IngredientsTechniquesViewProps> = ({
  initialFilter = 'all',
  checkedIngredients,
  onToggleIngredient,
  onStartCooking,
}) => {
  const [subView, setSubView] = useState<'all' | 'ingredients' | 'techniques'>(initialFilter);
  const [servingsMultiplier, setServingsMultiplier] = useState<1 | 2 | 3>(1);
  const [selectedTechnique, setSelectedTechnique] = useState<TechniqueItem>(TECHNIQUES[0]);

  React.useEffect(() => {
    setSubView(initialFilter);
  }, [initialFilter]);

  const checkedCount = INGREDIENTS.filter((item) => checkedIngredients[item.id]).length;

  return (
    <div className="space-y-10">
      {/* Hero Banner with Masala Dabba Flat-Lay */}
      <div className="rounded-3xl border border-[#1C1613]/12 bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C84B11]">
              <span>Universal Indian Masala Architecture</span>
              <span aria-hidden="true">·</span>
              <span>13 Essential Ingredients</span>
              <span aria-hidden="true">·</span>
              <span>4 Core Techniques</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1613] tracking-tight">
              Every Ingredient & Technique in Visual Detail
            </h2>
            <p className="text-sm sm:text-base text-[#655A52] leading-relaxed max-w-2xl">
              Master the universal Indian homestyle flow: from crackling 2 chitikedu of Jilakara &amp; Aavalu on lowest heat, to staged onion salting and the rimmed water-on-lid steam technique.
            </p>
          </div>

          {/* Interactive Chitikedu Pinch & Scale Calculator */}
          <div className="rounded-2xl bg-[#FAF7F2] border border-[#1C1613]/10 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1C1613]">
                <Scale className="w-4 h-4 text-[#C84B11]" />
                <span>Chitikedu (Pinch) &amp; Batch Scale Calculator</span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#1C1613]/10">
                {([1, 2, 3] as const).map((mult) => (
                  <button
                    key={mult}
                    type="button"
                    onClick={() => setServingsMultiplier(mult)}
                    className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      servingsMultiplier === mult
                        ? 'bg-[#1C1613] text-[#FAF7F2]'
                        : 'text-[#655A52] hover:text-[#1C1613]'
                    }`}
                  >
                    {mult === 1 ? '1x Standard (3–4p)' : mult === 2 ? '2x Family (6–8p)' : '3x Feast'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white rounded-xl p-3 border border-[#1C1613]/8">
                <p className="text-xs text-[#655A52]">Jilakara &amp; Aavalu</p>
                <p className="text-base font-bold font-mono-tabular text-[#1C1613] mt-0.5">
                  {2 * servingsMultiplier} chitikedu (~{(0.5 * servingsMultiplier).toFixed(1)} tsp)
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#1C1613]/8">
                <p className="text-xs text-[#655A52]">Stage 1 Onion Salt</p>
                <p className="text-base font-bold font-mono-tabular text-[#1C1613] mt-0.5">
                  {1 * servingsMultiplier} chitikedu (~{(0.25 * servingsMultiplier).toFixed(2)} tsp)
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#1C1613]/8">
                <p className="text-xs text-[#655A52]">Water on Top of Lid</p>
                <p className="text-base font-bold font-mono-tabular text-[#1C1613] mt-0.5">
                  {(0.5 * servingsMultiplier).toFixed(1)} cup warm water
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-1 p-1 bg-[#F3EDE2] rounded-xl">
              <button
                type="button"
                onClick={() => setSubView('all')}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  subView === 'all' ? 'bg-white text-[#1C1613] shadow-xs' : 'text-[#655A52] hover:text-[#1C1613]'
                }`}
              >
                Show All ({INGREDIENTS.length + TECHNIQUES.length})
              </button>
              <button
                type="button"
                onClick={() => setSubView('ingredients')}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  subView === 'ingredients' ? 'bg-white text-[#1C1613] shadow-xs' : 'text-[#655A52] hover:text-[#1C1613]'
                }`}
              >
                Ingredients ({checkedCount}/{INGREDIENTS.length} Checked)
              </button>
              <button
                type="button"
                onClick={() => setSubView('techniques')}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  subView === 'techniques' ? 'bg-white text-[#1C1613] shadow-xs' : 'text-[#655A52] hover:text-[#1C1613]'
                }`}
              >
                Techniques ({TECHNIQUES.length})
              </button>
            </div>

            <button
              type="button"
              onClick={onStartCooking}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C84B11] hover:bg-[#B03E0B] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Return to Guided Cooker
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#1C1613]">
          <ResilientImage
            src={IMAGE_ASSETS.masalaDabba}
            alt="Authentic Indian spice box (Masala Dabba) with cumin, mustard seeds, turmeric, red chilli, धनिया, onions, ginger-garlic paste, tomatoes, and fresh coriander"
            className="w-full h-full lg:h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
            <p className="text-xs font-medium text-white/80">
              Mise en Place · Universal Indian Tadka &amp; Masala
            </p>
            <p className="text-sm font-semibold mt-0.5">
              Prepare spices within arm&apos;s reach before turning on High Heat
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Visual Ingredient Cards with Prep Checkboxes */}
      {(subView === 'all' || subView === 'ingredients') && (
        <section aria-labelledby="ingredients-heading" className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#1C1613]/10 pb-3">
            <div>
              <h3 id="ingredients-heading" className="text-xl font-bold text-[#1C1613]">
                01. Visual Ingredient Checklist &amp; Exact Quantities
              </h3>
              <p className="text-xs text-[#655A52] mt-1">
                Tap any ingredient card to mark it prepped on your kitchen counter before starting High Heat.
              </p>
            </div>
            <span className="text-xs font-mono-tabular font-semibold text-[#2A6F48]">
              {checkedCount} of {INGREDIENTS.length} ingredients ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INGREDIENTS.map((item: IngredientItem) => {
              const isChecked = !!checkedIngredients[item.id];
              return (
                <article
                  key={item.id}
                  className={`rounded-2xl border overflow-hidden transition-colors flex flex-col justify-between ${
                    isChecked
                      ? 'bg-[#2A6F48]/6 border-[#2A6F48]/40'
                      : 'bg-white border-[#1C1613]/12'
                  }`}
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-[#1C1613]">
                      <ResilientImage
                        src={item.imagePath}
                        alt={item.name}
                        objectPosition={item.cropPosition}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-3.5 text-white">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-mono-tabular font-semibold text-[#FDE68A]">
                            {item.quantity}
                          </span>
                          {item.optional && (
                            <span className="text-white/85 font-medium">
                              Optional
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-base font-bold text-[#1C1613] leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#1C1613]/85 leading-relaxed">
                        {item.measurementTip}
                      </p>
                      <p className="text-xs text-[#655A52] pt-1 border-t border-[#1C1613]/8">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      type="button"
                      onClick={() => onToggleIngredient(item.id)}
                      className={`w-full min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
                        isChecked
                          ? 'bg-[#2A6F48] text-white'
                          : 'bg-[#FAF7F2] hover:bg-[#F3EDE2] text-[#1C1613] border border-[#1C1613]/15'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isChecked ? 'Prepped on Counter ✓' : 'Mark Ingredient Ready'}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Section 2: Master Indian Cooking Techniques */}
      {(subView === 'all' || subView === 'techniques') && (
        <section aria-labelledby="techniques-heading" className="space-y-5">
          <div className="border-b border-[#1C1613]/10 pb-3">
            <h3 id="techniques-heading" className="text-xl font-bold text-[#1C1613]">
              02. Core Indian Cooking Techniques &amp; Science
            </h3>
            <p className="text-xs text-[#655A52] mt-1">
              Why the heat shift, chitikedu salting, and water-on-top-of-lid condensation work in every kitchen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 flex flex-col gap-3">
              {TECHNIQUES.map((tech, idx) => {
                const active = selectedTechnique.id === tech.id;
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setSelectedTechnique(tech)}
                    className={`w-full text-left p-4 rounded-2xl border transition-colors ${
                      active
                        ? 'bg-[#1C1613] text-[#FAF7F2] border-[#1C1613]'
                        : 'bg-white text-[#1C1613] border-[#1C1613]/12 hover:bg-[#F3EDE2]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs opacity-75">
                      <span>0{idx + 1} · {tech.indianTerm}</span>
                      <BookOpen className="w-4 h-4 shrink-0" />
                    </div>
                    <p className="text-base font-bold mt-1">{tech.title}</p>
                    <p className={`text-xs mt-1 line-clamp-2 ${active ? 'text-[#FAF7F2]/80' : 'text-[#655A52]'}`}>
                      {tech.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 rounded-3xl border border-[#1C1613]/12 bg-white overflow-hidden flex flex-col justify-between">
              <div className="relative h-64 sm:h-72 w-full bg-[#1C1613]">
                <ResilientImage
                  src={selectedTechnique.imagePath}
                  alt={selectedTechnique.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 text-white">
                  <p className="text-xs font-medium text-[#FDE68A]">
                    {selectedTechnique.indianTerm}
                  </p>
                  <h4 className="text-xl font-bold mt-0.5">{selectedTechnique.title}</h4>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-[#655A52]">How to Execute</h5>
                  <p className="text-sm text-[#1C1613] mt-1 leading-relaxed">
                    {selectedTechnique.summary}
                  </p>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#C84B11] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Culinary Science — Why It Works
                  </h5>
                  <p className="text-sm text-[#1C1613] mt-1 leading-relaxed">
                    {selectedTechnique.whyItWorks}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1C1613]/10 flex items-start gap-2.5 text-xs text-[#2A6F48] font-medium">
                  <UtensilsCrossed className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Chef Tip: {selectedTechnique.proTip}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
