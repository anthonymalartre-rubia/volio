// Décor de fond pour les pages auth (login, signup, reset, forgot).
// Theme-aware : visible discrètement en dark, quasi invisible en light.
// À insérer en absolute dans un container relative.

export default function AuthBackgroundDecor() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Blobs gradient — visibles en dark seulement, opacité réduite en light */}
      <div className="absolute top-[-15%] left-[-10%] w-[450px] h-[450px] rounded-full bg-violet-600/20 dark:bg-violet-500/20 blur-[100px] opacity-30 dark:opacity-100" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 dark:bg-indigo-500/15 blur-[120px] opacity-30 dark:opacity-100" />

      {/* Grid pattern subtil — uniquement visible en dark */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
