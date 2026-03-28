"use client";

import { useState, useRef, useEffect } from "react";
import { DEPTS, B2B_CATS, COPRO_CATS } from "@/lib/constants";
import {
  Send, Square, Sparkles, MapPin, Building2, Home, Search,
  Plus, X, Play, RotateCcw, ChevronRight, FolderPlus, Folder,
} from "lucide-react";

function BotMessage({ children, icon: Icon, delay = 0 }) {
  const [visible, setVisible] = useState(delay === 0);
  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  if (!visible) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles size={13} className="text-white" />
        </div>
        <div className="flex gap-1 py-3">
          <div className="w-1.5 h-1.5 bg-content-faint rounded-full animate-bounce [animation-delay:0ms]" />
          <div className="w-1.5 h-1.5 bg-content-faint rounded-full animate-bounce [animation-delay:150ms]" />
          <div className="w-1.5 h-1.5 bg-content-faint rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        {Icon ? <Icon size={13} className="text-white" /> : <Sparkles size={13} className="text-white" />}
      </div>
      <div className="flex-1 text-sm text-[#e4e4e7] leading-relaxed">{children}</div>
    </div>
  );
}

function UserMessage({ children }) {
  return (
    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="bg-indigo-600/20 border border-indigo-500/20 rounded-xl px-4 py-2 text-sm text-indigo-300 max-w-[80%]">
        {children}
      </div>
    </div>
  );
}

function OptionChips({ options, selected, onToggle, colorClass = "indigo" }) {
  const colors = {
    indigo: { active: "bg-indigo-600/20 border-indigo-500/30 text-indigo-400", inactive: "border-line-hover text-content-tertiary hover:border-content-faint hover:text-content-secondary" },
    blue: { active: "bg-blue-600/20 border-blue-500/30 text-blue-400", inactive: "border-line-hover text-content-tertiary hover:border-content-faint hover:text-content-secondary" },
    purple: { active: "bg-purple-600/20 border-purple-500/30 text-purple-400", inactive: "border-line-hover text-content-tertiary hover:border-content-faint hover:text-content-secondary" },
  };
  const c = colors[colorClass] || colors.indigo;

  return (
    <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
      {options.map((opt) => {
        const value = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const isActive = selected.includes(value);
        return (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all active:scale-[0.97] ${isActive ? c.active : c.inactive}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

const FOLDER_COLORS = [
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'blue', label: 'Bleu', class: 'bg-blue-500' },
  { value: 'purple', label: 'Violet', class: 'bg-purple-500' },
  { value: 'green', label: 'Vert', class: 'bg-green-500' },
  { value: 'amber', label: 'Ambre', class: 'bg-amber-500' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-500' },
];

export default function SearchPanel({
  onStartScraping,
  onStopScraping,
  isSearching,
  apiKeySet,
  searchProgress,
  folders = [],
  onCreateFolder,
}) {
  const [step, setStep] = useState(0);
  const [searchType, setSearchType] = useState(null);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [customQueries, setCustomQueries] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('indigo');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 50);
    }
  }, [step, searchType, selectedDepts, selectedCats, customQueries, confirmed, isSearching, showNewFolder]);

  const handleTypeSelect = (type) => {
    setSearchType(type);
    setSelectedDepts(Object.keys(DEPTS));
    setStep(1);
  };

  const toggleDept = (code) => {
    setSelectedDepts((prev) =>
      prev.includes(code) ? prev.filter((d) => d !== code) : [...prev, code]
    );
  };

  const toggleCat = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const confirmDepts = () => {
    if (selectedDepts.length === 0) return;
    if (searchType === 'b2b') setSelectedCats([...B2B_CATS]);
    else if (searchType === 'copro') setSelectedCats([...COPRO_CATS]);
    else setSelectedCats([...B2B_CATS, ...COPRO_CATS]);
    setStep(2);
  };

  const confirmCats = () => {
    if (selectedCats.length === 0) return;
    setStep(3);
  };

  const addCustom = () => {
    if (customInput.trim()) {
      setCustomQueries((prev) => [...prev, customInput.trim()]);
      setCustomInput('');
    }
  };

  const skipCustom = () => setStep(4);
  const confirmCustom = () => setStep(4);

  const selectFolder = (folder) => {
    setSelectedFolder(folder);
    setStep(5);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const folder = await onCreateFolder(newFolderName.trim(), newFolderColor);
    if (folder) {
      setSelectedFolder(folder);
      setNewFolderName('');
      setShowNewFolder(false);
      setStep(5);
    }
  };

  const handleLaunch = () => {
    setConfirmed(true);
    const b2b = searchType === 'b2b' || searchType === 'both'
      ? selectedCats.filter((c) => B2B_CATS.includes(c))
      : [];
    const copro = searchType === 'copro' || searchType === 'both'
      ? selectedCats.filter((c) => COPRO_CATS.includes(c))
      : [];
    onStartScraping(selectedDepts, b2b, copro, customQueries, selectedFolder?.id);
  };

  const handleReset = () => {
    setStep(0);
    setSearchType(null);
    setSelectedDepts([]);
    setSelectedCats([]);
    setCustomQueries([]);
    setCustomInput('');
    setSelectedFolder(null);
    setNewFolderName('');
    setShowNewFolder(false);
    setConfirmed(false);
  };

  const b2bCount = selectedCats.filter((c) => B2B_CATS.includes(c)).length;
  const coproCount = selectedCats.filter((c) => COPRO_CATS.includes(c)).length;
  const totalQueries = selectedDepts.length * selectedCats.length + customQueries.length;

  const progress = searchProgress?.total > 0
    ? (searchProgress.current / searchProgress.total) * 100
    : 0;

  const folderColorClass = (color) => {
    const map = { indigo: 'bg-indigo-500', blue: 'bg-blue-500', purple: 'bg-purple-500', green: 'bg-green-500', amber: 'bg-amber-500', rose: 'bg-rose-500' };
    return map[color] || map.indigo;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-content-primary mb-1">Recherche</h2>
        <p className="text-sm text-content-muted">Definissez votre cible en quelques etapes</p>
      </div>

      {!apiKeySet && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-6">
          <Sparkles size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-400">Configuration requise</p>
            <p className="text-xs text-content-tertiary mt-1">
              Definissez <code className="px-1.5 py-0.5 rounded bg-surface-elevated text-content-secondary text-[11px]">GOOGLE_PLACES_API_KEY</code> dans les variables Vercel.
            </p>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="rounded-2xl border border-line bg-surface-card overflow-hidden"
      >
        <div className="p-5 space-y-5 max-h-[calc(100vh-16rem)] overflow-y-auto">

          {/* Step 1: Type */}
          <BotMessage>
            Quel type de prospects recherchez-vous ?
          </BotMessage>

          {step === 0 && !searchType && (
            <div className="flex flex-wrap gap-2 pl-10 animate-in fade-in duration-300">
              <button
                onClick={() => handleTypeSelect('b2b')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line-hover text-sm font-medium text-content-secondary hover:border-blue-500/30 hover:text-blue-400 hover:bg-blue-600/10 transition-all active:scale-[0.97]"
              >
                <Building2 size={15} />
                B2B — Entreprises
              </button>
              <button
                onClick={() => handleTypeSelect('copro')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line-hover text-sm font-medium text-content-secondary hover:border-purple-500/30 hover:text-purple-400 hover:bg-purple-600/10 transition-all active:scale-[0.97]"
              >
                <Home size={15} />
                Copropriete — Syndics
              </button>
              <button
                onClick={() => handleTypeSelect('both')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line-hover text-sm font-medium text-content-secondary hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-600/10 transition-all active:scale-[0.97]"
              >
                <Sparkles size={15} />
                Les deux
              </button>
            </div>
          )}

          {searchType && (
            <UserMessage>
              {searchType === 'b2b' ? 'B2B — Entreprises' : searchType === 'copro' ? 'Copropriete — Syndics' : 'B2B + Copropriete'}
            </UserMessage>
          )}

          {/* Step 2: Departments */}
          {step >= 1 && (
            <>
              <BotMessage icon={MapPin} delay={step === 1 ? 400 : 0}>
                <div>
                  Dans quels departements ? <span className="text-content-muted">(tous selectionnes par defaut)</span>
                </div>
              </BotMessage>

              {step === 1 && (
                <div className="pl-10 space-y-3">
                  <OptionChips
                    options={Object.entries(DEPTS).map(([code, d]) => ({ value: code, label: `${code} ${d.name}` }))}
                    selected={selectedDepts}
                    onToggle={toggleDept}
                    colorClass="indigo"
                  />
                  <button
                    onClick={confirmDepts}
                    disabled={selectedDepts.length === 0}
                    className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition disabled:text-content-faint disabled:cursor-not-allowed"
                  >
                    Continuer <ChevronRight size={14} />
                  </button>
                </div>
              )}

              {step > 1 && (
                <UserMessage>
                  {selectedDepts.map((d) => DEPTS[d]?.name).join(', ')}
                </UserMessage>
              )}
            </>
          )}

          {/* Step 3: Categories */}
          {step >= 2 && (
            <>
              <BotMessage icon={searchType === 'copro' ? Home : Building2} delay={step === 2 ? 400 : 0}>
                <div>
                  Quelles categories ? <span className="text-content-muted">(toutes selectionnees par defaut)</span>
                </div>
              </BotMessage>

              {step === 2 && (
                <div className="pl-10 space-y-3">
                  {(searchType === 'both') && (
                    <p className="text-[10px] uppercase tracking-wider text-blue-400/60 font-semibold">B2B</p>
                  )}
                  {(searchType === 'b2b' || searchType === 'both') && (
                    <OptionChips
                      options={B2B_CATS}
                      selected={selectedCats}
                      onToggle={toggleCat}
                      colorClass="blue"
                    />
                  )}
                  {(searchType === 'both') && (
                    <p className="text-[10px] uppercase tracking-wider text-purple-400/60 font-semibold pt-2">Copropriete</p>
                  )}
                  {(searchType === 'copro' || searchType === 'both') && (
                    <OptionChips
                      options={COPRO_CATS}
                      selected={selectedCats}
                      onToggle={toggleCat}
                      colorClass="purple"
                    />
                  )}
                  <button
                    onClick={confirmCats}
                    disabled={selectedCats.length === 0}
                    className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition disabled:text-content-faint disabled:cursor-not-allowed"
                  >
                    Continuer <ChevronRight size={14} />
                  </button>
                </div>
              )}

              {step > 2 && (
                <UserMessage>
                  {selectedCats.length} categories selectionnees
                  {searchType === 'both' && ` (${b2bCount} B2B, ${coproCount} Copro)`}
                </UserMessage>
              )}
            </>
          )}

          {/* Step 4: Custom queries */}
          {step >= 3 && (
            <>
              <BotMessage icon={Search} delay={step === 3 ? 400 : 0}>
                Voulez-vous ajouter des recherches personnalisees ? <span className="text-content-muted">(optionnel)</span>
              </BotMessage>

              {step === 3 && (
                <div className="pl-10 space-y-3 animate-in fade-in duration-300">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustom()}
                      placeholder="Ex: plombier Martinique, notaire 972..."
                      className="flex-1 bg-surface-deep border border-line rounded-xl px-4 py-2.5 text-sm text-content-primary placeholder-content-faint focus:outline-none focus:border-indigo-500/40 transition"
                    />
                    <button
                      onClick={addCustom}
                      disabled={!customInput.trim()}
                      className="px-3 py-2.5 rounded-xl bg-surface-elevated hover:bg-line-hover text-content-secondary transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {customQueries.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {customQueries.map((q, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                          {q}
                          <button onClick={() => setCustomQueries((prev) => prev.filter((_, idx) => idx !== i))} className="text-amber-600 hover:text-amber-300">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {customQueries.length > 0 ? (
                      <button onClick={confirmCustom} className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition">
                        Continuer <ChevronRight size={14} />
                      </button>
                    ) : (
                      <button onClick={skipCustom} className="flex items-center gap-1.5 text-sm font-medium text-content-muted hover:text-content-secondary transition">
                        Passer <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {step > 3 && customQueries.length > 0 && (
                <UserMessage>
                  {customQueries.length} recherche{customQueries.length > 1 ? 's' : ''} personnalisee{customQueries.length > 1 ? 's' : ''}
                </UserMessage>
              )}
              {step > 3 && customQueries.length === 0 && (
                <UserMessage>Pas de recherche personnalisee</UserMessage>
              )}
            </>
          )}

          {/* Step 5: Folder selection */}
          {step >= 4 && (
            <>
              <BotMessage icon={Folder} delay={step === 4 ? 400 : 0}>
                Dans quelle liste stocker ces leads ?
              </BotMessage>

              {step === 4 && (
                <div className="pl-10 space-y-3 animate-in fade-in duration-300">
                  {/* Existing folders */}
                  {folders.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {folders.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => selectFolder(f)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line-hover text-sm font-medium text-content-secondary hover:border-indigo-500/30 hover:text-[#e4e4e7] hover:bg-surface-elevated transition-all active:scale-[0.97]"
                        >
                          <div className={`w-2.5 h-2.5 rounded-full ${folderColorClass(f.color)}`} />
                          {f.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Create new folder */}
                  {!showNewFolder ? (
                    <button
                      onClick={() => setShowNewFolder(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-line-hover text-sm font-medium text-content-muted hover:border-indigo-500/30 hover:text-indigo-400 transition-all active:scale-[0.97]"
                    >
                      <FolderPlus size={15} />
                      Creer une nouvelle liste
                    </button>
                  ) : (
                    <div className="rounded-xl bg-surface-deep border border-line p-4 space-y-3">
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                        placeholder="Nom de la liste..."
                        autoFocus
                        className="w-full bg-transparent border border-line rounded-lg px-3 py-2 text-sm text-content-primary placeholder-content-faint focus:outline-none focus:border-indigo-500/40 transition"
                      />
                      <div className="flex gap-2">
                        {FOLDER_COLORS.map((c) => (
                          <button
                            key={c.value}
                            onClick={() => setNewFolderColor(c.value)}
                            className={`w-6 h-6 rounded-full ${c.class} transition-all ${newFolderColor === c.value ? 'ring-2 ring-offset-2 ring-offset-surface-deep ring-white/30 scale-110' : 'opacity-50 hover:opacity-80'}`}
                            title={c.label}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCreateFolder}
                          disabled={!newFolderName.trim()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus size={12} />
                          Creer
                        </button>
                        <button
                          onClick={() => { setShowNewFolder(false); setNewFolderName(''); }}
                          className="px-3 py-1.5 rounded-lg text-xs text-content-muted hover:text-content-secondary transition"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step > 4 && selectedFolder && (
                <UserMessage>
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${folderColorClass(selectedFolder.color)}`} />
                    {selectedFolder.name}
                  </span>
                </UserMessage>
              )}
            </>
          )}

          {/* Step 6: Confirm & Launch */}
          {step >= 5 && !confirmed && (
            <BotMessage icon={Sparkles} delay={400}>
              <div className="space-y-3">
                <p>Votre recherche est prete.</p>
                <div className="rounded-xl bg-surface-deep border border-line p-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-content-muted">Departements</span>
                    <span className="text-content-secondary font-mono">{selectedDepts.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-content-muted">Categories</span>
                    <span className="text-content-secondary font-mono">{selectedCats.length}</span>
                  </div>
                  {customQueries.length > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-content-muted">Custom</span>
                      <span className="text-content-secondary font-mono">{customQueries.length}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-content-muted">Liste</span>
                    <span className="text-content-secondary flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${folderColorClass(selectedFolder?.color)}`} />
                      {selectedFolder?.name}
                    </span>
                  </div>
                  <div className="border-t border-line pt-2 flex justify-between text-xs">
                    <span className="text-content-tertiary font-medium">Total requetes</span>
                    <span className="text-indigo-400 font-bold font-mono">{totalQueries}</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleLaunch}
                    disabled={!apiKeySet}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-surface-elevated disabled:text-content-faint text-white font-semibold text-sm transition-all disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 disabled:shadow-none active:scale-[0.97]"
                  >
                    <Play size={14} />
                    Lancer
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line-hover text-sm text-content-muted hover:text-content-secondary hover:border-content-faint transition active:scale-[0.97]"
                  >
                    <RotateCcw size={14} />
                    Recommencer
                  </button>
                </div>
              </div>
            </BotMessage>
          )}

          {/* Search in progress */}
          {isSearching && (
            <BotMessage icon={Search}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-content-secondary">
                    {searchProgress?.currentQuery || "Initialisation..."}
                  </span>
                </div>
                <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-content-faint">
                  <span>{searchProgress?.current}/{searchProgress?.total}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <button
                  onClick={onStopScraping}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/10 border border-red-600/20 hover:bg-red-600/20 text-red-400 text-sm font-medium transition active:scale-[0.97]"
                >
                  <Square size={14} />
                  Arreter
                </button>
              </div>
            </BotMessage>
          )}

          {/* Search complete */}
          {confirmed && !isSearching && (
            <BotMessage icon={Sparkles}>
              <div className="space-y-3">
                <p>Recherche terminee !</p>
                {searchProgress?.logs?.length > 0 && (
                  <p className="text-content-muted text-xs">
                    {searchProgress.logs[searchProgress.logs.length - 1]}
                  </p>
                )}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-line-hover text-sm text-content-muted hover:text-content-secondary hover:border-content-faint transition active:scale-[0.97]"
                >
                  <RotateCcw size={14} />
                  Nouvelle recherche
                </button>
              </div>
            </BotMessage>
          )}
        </div>

        {/* Logs */}
        {isSearching && searchProgress?.logs?.length > 0 && (
          <details className="border-t border-line">
            <summary className="px-5 py-2.5 text-[10px] uppercase tracking-wider text-content-faint font-semibold cursor-pointer hover:text-content-muted">
              Logs ({searchProgress.logs.length})
            </summary>
            <div className="px-5 pb-4 max-h-40 overflow-y-auto">
              <div className="font-mono text-[11px] text-content-faint space-y-0.5">
                {searchProgress.logs.slice(-20).map((log, i) => (
                  <div key={i} className={log.startsWith('Error') ? 'text-red-400/60' : ''}>
                    <span className="text-content-dim mr-2">{String(i + 1).padStart(2, '0')}</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
