'use client';

// ─────────────────────────────────────────────────────────────────────
// FormRenderer — Client component pour /f/[slug] (Sprint F2)
// ─────────────────────────────────────────────────────────────────────
// Render dynamique des form_fields :
//   - text, email, tel, textarea, select, radio, checkbox, number, date,
//     file, rating, hidden
//   - Validation client : required, validation.regex, min/max length, min/max
//   - Logique conditionnelle (conditional_logic.show_if = {field_key, operator, value})
//     operators : equals, not_equals, contains, is_empty, is_not_empty
//   - Multi-step si schema.pages.length > 1 (progress bar + navigation)
//   - Honeypot caché "website"
//   - Submit POST FormData → /api/public/forms/[slug]/submit
//   - Success state custom (settings.success_message) ou défaut
//   - Redirection auto si settings.redirect_url
//
// Style : ultra-discret, focus pink Volia, plein écran responsive.
// Aucune dépendance lourde (pas de react-hook-form, pas de zod).
// ─────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useState, useRef } from 'react';
import { Loader2, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Star, Upload } from 'lucide-react';

const DEFAULT_SUCCESS = 'Merci pour votre soumission !';

// Évalue un operator de conditional_logic
function evalCondition(operator, value, currentVal) {
  const cv = currentVal == null ? '' : String(currentVal);
  const v = value == null ? '' : String(value);
  switch (operator) {
    case 'equals':
      return cv === v;
    case 'not_equals':
      return cv !== v;
    case 'contains':
      return cv.toLowerCase().includes(v.toLowerCase());
    case 'is_empty':
      return cv.trim() === '';
    case 'is_not_empty':
      return cv.trim() !== '';
    default:
      return true;
  }
}

function isFieldVisible(field, answers) {
  const cl = field.conditional_logic;
  if (!cl || !cl.show_if) return true;
  const { field_key, operator, value } = cl.show_if;
  if (!field_key || !operator) return true;
  return evalCondition(operator, value, answers[field_key]);
}

function validateField(field, value) {
  const errors = [];
  const isEmpty = value == null || value === '' || (Array.isArray(value) && value.length === 0);

  if (field.required && isEmpty && field.field_type !== 'hidden') {
    errors.push('Ce champ est requis');
    return errors;
  }
  if (isEmpty) return errors;

  const v = field.validation || {};
  const strVal = String(value);

  if (field.field_type === 'email') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
      errors.push('Email invalide');
    }
  }
  if (field.field_type === 'tel') {
    if (!/^[+\d\s().-]{6,}$/.test(strVal)) {
      errors.push('Numéro invalide');
    }
  }
  if (field.field_type === 'number') {
    const n = Number(strVal);
    if (Number.isNaN(n)) errors.push('Nombre invalide');
    else {
      if (v.min !== undefined && n < Number(v.min)) errors.push(`Minimum : ${v.min}`);
      if (v.max !== undefined && n > Number(v.max)) errors.push(`Maximum : ${v.max}`);
    }
  }
  if (typeof v.minLength === 'number' && strVal.length < v.minLength) {
    errors.push(`Minimum ${v.minLength} caractères`);
  }
  if (typeof v.maxLength === 'number' && strVal.length > v.maxLength) {
    errors.push(`Maximum ${v.maxLength} caractères`);
  }
  if (typeof v.regex === 'string' && v.regex.length > 0) {
    try {
      const re = new RegExp(v.regex);
      if (!re.test(strVal)) errors.push(v.regexMessage || 'Format invalide');
    } catch {}
  }
  return errors;
}

function FieldRenderer({ field, value, onChange, error }) {
  const baseInput =
    'w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 transition-colors';
  const errorRing = error ? 'border-rose-400 focus:ring-rose-500/40 focus:border-rose-500' : '';
  const inputCls = `${baseInput} ${errorRing}`;

  const id = `field_${field.field_key}`;

  if (field.field_type === 'hidden') {
    return <input type="hidden" name={field.field_key} value={value || ''} />;
  }

  if (field.field_type === 'textarea') {
    return (
      <textarea
        id={id}
        name={field.field_key}
        rows={5}
        placeholder={field.placeholder || ''}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
        required={field.required}
      />
    );
  }

  if (field.field_type === 'select') {
    const opts = Array.isArray(field.options) ? field.options : [];
    return (
      <select
        id={id}
        name={field.field_key}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
        required={field.required}
      >
        <option value="">— Choisir —</option>
        {opts.map((opt, i) => {
          const ov = typeof opt === 'object' ? (opt.value ?? opt.label) : opt;
          const ol = typeof opt === 'object' ? (opt.label ?? opt.value) : opt;
          return <option key={i} value={ov}>{ol}</option>;
        })}
      </select>
    );
  }

  if (field.field_type === 'radio') {
    const opts = Array.isArray(field.options) ? field.options : [];
    return (
      <div className="space-y-2">
        {opts.map((opt, i) => {
          const ov = typeof opt === 'object' ? (opt.value ?? opt.label) : opt;
          const ol = typeof opt === 'object' ? (opt.label ?? opt.value) : opt;
          const selected = String(value || '') === String(ov);
          return (
            <label
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                selected
                  ? 'bg-pink-50 border-pink-300'
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <input
                type="radio"
                name={field.field_key}
                value={ov}
                checked={selected}
                onChange={() => onChange(ov)}
                className="accent-pink-600"
                required={field.required}
              />
              <span className="text-sm text-zinc-800">{ol}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (field.field_type === 'checkbox') {
    // 2 modes : si options[] → multi-checkbox (value = array)
    //           sinon → boolean unique (consentement)
    const opts = Array.isArray(field.options) ? field.options : [];
    if (opts.length === 0) {
      return (
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-1 accent-pink-600"
            required={field.required}
          />
          <span className="text-sm text-zinc-700">{field.label}</span>
        </label>
      );
    }
    const arrVal = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {opts.map((opt, i) => {
          const ov = typeof opt === 'object' ? (opt.value ?? opt.label) : opt;
          const ol = typeof opt === 'object' ? (opt.label ?? opt.value) : opt;
          const checked = arrVal.includes(ov);
          return (
            <label
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                checked ? 'bg-pink-50 border-pink-300' : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <input
                type="checkbox"
                value={ov}
                checked={checked}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...arrVal, ov]
                    : arrVal.filter((x) => x !== ov);
                  onChange(next);
                }}
                className="accent-pink-600"
              />
              <span className="text-sm text-zinc-800">{ol}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (field.field_type === 'file') {
    return (
      <label className="block">
        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:border-pink-300 hover:bg-pink-50/30 transition-colors cursor-pointer">
          <Upload size={18} className="text-zinc-400" />
          <span className="text-sm text-zinc-600">
            {value && value.name ? value.name : 'Choisir un fichier (max 10 Mo)'}
          </span>
        </div>
        <input
          id={id}
          name={field.field_key}
          type="file"
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          required={field.required}
        />
      </label>
    );
  }

  if (field.field_type === 'rating') {
    const max = field.validation?.max || 5;
    const current = Number(value) || 0;
    return (
      <div className="flex items-center gap-1.5">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="p-1 transition-transform active:scale-90"
            aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          >
            <Star
              size={28}
              className={n <= current ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}
            />
          </button>
        ))}
      </div>
    );
  }

  if (field.field_type === 'date') {
    return (
      <input
        id={id}
        name={field.field_key}
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
        required={field.required}
      />
    );
  }

  // text / email / tel / number (default)
  const inputType =
    field.field_type === 'email'
      ? 'email'
      : field.field_type === 'tel'
      ? 'tel'
      : field.field_type === 'number'
      ? 'number'
      : 'text';

  return (
    <input
      id={id}
      name={field.field_key}
      type={inputType}
      placeholder={field.placeholder || ''}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
      required={field.required}
      min={field.validation?.min}
      max={field.validation?.max}
      minLength={field.validation?.minLength}
      maxLength={field.validation?.maxLength}
    />
  );
}

export default function FormRenderer({ form, slug, isEmbed = false }) {
  const settings = form.settings || {};
  const schema = form.schema || {};
  const pages = Array.isArray(schema.pages) && schema.pages.length > 0
    ? schema.pages
    : [{ id: 1, title: form.name }];
  const allFields = useMemo(
    () => (Array.isArray(form.fields) ? form.fields : []),
    [form.fields]
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const startedAtRef = useRef(Date.now());

  const isMultiStep = pages.length > 1;
  const pageNumber = currentPage + 1;

  // Filtre les fields visibles à la page courante (avec logique conditionnelle)
  const currentPageNumber = pages[currentPage]?.id || currentPage + 1;
  const visibleFields = allFields.filter((f) => {
    const onThisPage = (f.page || 1) === currentPageNumber;
    if (!onThisPage) return false;
    return isFieldVisible(f, answers);
  });

  function updateAnswer(key, val) {
    setAnswers((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validatePage(pageIdx) {
    const pn = pages[pageIdx]?.id || pageIdx + 1;
    const pageFields = allFields.filter(
      (f) => (f.page || 1) === pn && isFieldVisible(f, answers)
    );
    const next = {};
    let ok = true;
    for (const f of pageFields) {
      const errs = validateField(f, answers[f.field_key]);
      if (errs.length > 0) {
        next[f.field_key] = errs[0];
        ok = false;
      }
    }
    setErrors(next);
    return ok;
  }

  function goNext() {
    if (validatePage(currentPage)) {
      setCurrentPage((p) => Math.min(pages.length - 1, p + 1));
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  function goPrev() {
    setCurrentPage((p) => Math.max(0, p - 1));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    // Validation finale : toutes les pages
    let allOk = true;
    const allErrors = {};
    for (let i = 0; i < pages.length; i++) {
      const pn = pages[i]?.id || i + 1;
      const pageFields = allFields.filter(
        (f) => (f.page || 1) === pn && isFieldVisible(f, answers)
      );
      for (const f of pageFields) {
        const errs = validateField(f, answers[f.field_key]);
        if (errs.length > 0) {
          allErrors[f.field_key] = errs[0];
          allOk = false;
        }
      }
    }
    if (!allOk) {
      setErrors(allErrors);
      // Saute à la 1ère page contenant une erreur
      for (let i = 0; i < pages.length; i++) {
        const pn = pages[i]?.id || i + 1;
        const has = allFields.some(
          (f) => (f.page || 1) === pn && allErrors[f.field_key]
        );
        if (has) {
          setCurrentPage(i);
          break;
        }
      }
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const fd = new FormData();
      // Honeypot (champ caché — si rempli par un bot, le backend rejette)
      fd.append('website', e.target.elements?.website?.value || '');
      // Completion time (ms) → metadata utile pour anti-bot serveur
      fd.append('_completion_time_ms', String(Date.now() - startedAtRef.current));
      // Toutes les answers
      for (const [k, v] of Object.entries(answers)) {
        if (v == null) continue;
        if (v instanceof File) {
          fd.append(`file:${k}`, v);
        } else if (Array.isArray(v)) {
          fd.append(k, JSON.stringify(v));
        } else if (typeof v === 'boolean') {
          fd.append(k, v ? 'true' : 'false');
        } else {
          fd.append(k, String(v));
        }
      }

      const res = await fetch(`/api/public/forms/${slug}/submit`, {
        method: 'POST',
        body: fd,
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitError(json.error || `Erreur ${res.status}`);
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setSubmitting(false);

      if (settings.redirect_url && /^https?:\/\//.test(settings.redirect_url)) {
        // Délai léger pour laisser voir le success state
        setTimeout(() => {
          window.location.href = settings.redirect_url;
        }, 800);
      }
    } catch (err) {
      console.error('[FormRenderer] submit failed', err);
      setSubmitError(err.message || 'Erreur réseau');
      setSubmitting(false);
    }
  }

  function resetForm() {
    setAnswers({});
    setErrors({});
    setSubmitted(false);
    setSubmitError(null);
    setCurrentPage(0);
    startedAtRef.current = Date.now();
  }

  // ───── Success state ─────
  if (submitted) {
    return (
      <div
        className={`rounded-2xl ${
          isEmbed ? 'bg-transparent border-0' : 'bg-white border border-zinc-200 shadow-sm'
        } p-8 sm:p-10 text-center`}
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
          {settings.success_title || 'Soumission reçue'}
        </h2>
        <p className="text-sm text-zinc-600 max-w-md mx-auto">
          {settings.success_message || DEFAULT_SUCCESS}
        </p>
        {settings.redirect_url ? (
          <p className="mt-4 text-xs text-zinc-400">Redirection en cours…</p>
        ) : (
          <button
            type="button"
            onClick={resetForm}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium transition-colors"
          >
            Soumettre une autre réponse
          </button>
        )}
      </div>
    );
  }

  // ───── Form ─────
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`rounded-2xl ${
        isEmbed ? 'bg-transparent border-0 p-0' : 'bg-white border border-zinc-200 shadow-sm p-6 sm:p-8'
      }`}
    >
      {/* Honeypot (caché en CSS, jamais montré) */}
      <div style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          {form.name}
        </h1>
        {form.description && (
          <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{form.description}</p>
        )}
      </div>

      {/* Progress bar multi-step */}
      {isMultiStep && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span>
              Étape {pageNumber} sur {pages.length}
            </span>
            <span>{Math.round((pageNumber / pages.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
              style={{ width: `${(pageNumber / pages.length) * 100}%` }}
            />
          </div>
          {pages[currentPage]?.title && pages[currentPage].title !== form.name && (
            <p className="mt-3 text-sm font-semibold text-zinc-700">
              {pages[currentPage].title}
            </p>
          )}
          {pages[currentPage]?.description && (
            <p className="mt-1 text-xs text-zinc-500">
              {pages[currentPage].description}
            </p>
          )}
        </div>
      )}

      {/* Fields */}
      <div className="space-y-5">
        {visibleFields.length === 0 && (
          <p className="text-sm text-zinc-500 italic">
            Aucun champ sur cette page.
          </p>
        )}
        {visibleFields.map((field) => {
          if (field.field_type === 'hidden') {
            return (
              <FieldRenderer
                key={field.id}
                field={field}
                value={answers[field.field_key]}
                onChange={(v) => updateAnswer(field.field_key, v)}
              />
            );
          }
          const err = errors[field.field_key];
          return (
            <div key={field.id} className="space-y-1.5">
              {field.field_type !== 'checkbox' || (Array.isArray(field.options) && field.options.length > 0) ? (
                <label
                  htmlFor={`field_${field.field_key}`}
                  className="block text-sm font-medium text-zinc-800"
                >
                  {field.label}
                  {field.required && <span className="text-rose-500 ml-0.5">*</span>}
                </label>
              ) : null}
              <FieldRenderer
                field={field}
                value={answers[field.field_key]}
                onChange={(v) => updateAnswer(field.field_key, v)}
                error={err}
              />
              {field.help_text && !err && (
                <p className="text-xs text-zinc-500">{field.help_text}</p>
              )}
              {err && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {err}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="mt-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-px" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-7 flex items-center justify-between gap-3">
        {isMultiStep && currentPage > 0 ? (
          <button
            type="button"
            onClick={goPrev}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={16} /> Précédent
          </button>
        ) : (
          <div />
        )}

        {isMultiStep && currentPage < pages.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold shadow-lg shadow-pink-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            Suivant <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold shadow-lg shadow-pink-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {settings.submit_label || 'Envoyer'}
          </button>
        )}
      </div>
    </form>
  );
}
