import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { audioSynth } from '../../services/audioSynth';
import { Aura3DButton } from '../tactile/Aura3DButton';
import { isSupabaseConfigured } from '../../services/supabaseClient';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithPassword, signUp, signInWithMagicLink, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup' | 'magic'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    audioSynth.playKeypressTick();
    setErrorMsg(null);
    setSuccessMsg(null);
    closeAuthModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    audioSynth.playKeypressTick();

    if (!isSupabaseConfigured) {
      setErrorMsg('Servidor Supabase não configurado neste ambiente. O app continuará salvando seus dados localmente como Convidado.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (tab === 'login') {
        const { error } = await signInWithPassword(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          audioSynth.playSuccessNote(3);
        }
      } else if (tab === 'signup') {
        const { error } = await signUp(email, password, displayName || 'Explorador Aura', username);
        if (error) {
          setErrorMsg(error.message);
        } else {
          audioSynth.playSuccessNote(4);
          setSuccessMsg('Caderno criado com sucesso! Verifique seu email se a confirmação for exigida.');
        }
      } else if (tab === 'magic') {
        const { error } = await signInWithMagicLink(email);
        if (error) {
          setErrorMsg(error.message);
        } else {
          audioSynth.playSuccessNote(3);
          setSuccessMsg('Enviamos um link de acesso direto para seu email!');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado na autenticação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    audioSynth.playKeypressTick();
    if (!isSupabaseConfigured) {
      setErrorMsg('Supabase não configurado para autenticação Google.');
      return;
    }
    const { error } = await signInWithGoogle();
    if (error) setErrorMsg(error.message);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(32, 37, 34, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--color-bg-surface, #FFFDF6)',
          border: '2px solid var(--color-ink, #202522)',
          boxShadow: '0 8px 0 var(--color-ink, #202522)',
          borderRadius: '24px',
          padding: '24px 20px',
          position: 'relative',
          color: 'var(--color-text-primary, #202522)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--color-ink-secondary, #5C645F)',
          }}
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        {/* Header Stamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-verdigris, #176B5B)' }} />
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: 'var(--color-verdigris, #176B5B)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            § REGISTRO COGNITIVO
          </span>
        </div>

        <h2
          style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            margin: '0 0 6px',
            fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
          }}
        >
          {tab === 'login' ? 'Acessar seu Caderno' : tab === 'signup' ? 'Iniciar seu Caderno' : 'Link Mágico por Email'}
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-secondary, #5C645F)', margin: '0 0 16px', lineHeight: 1.4 }}>
          Sincronize seu DNA Matemático, selos de maestria e histórico de Elo em qualquer tela.
        </p>

        {/* Tab Selector */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--color-paper, #F7F4EA)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '16px',
            border: '1px solid var(--color-border-subtle, #D9D5C8)',
          }}
        >
          {(['login', 'signup', 'magic'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                audioSynth.playKeypressTick();
                setTab(t);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tab === t ? 'var(--color-bg-surface, #FFFDF6)' : 'transparent',
                boxShadow: tab === t ? '0 2px 0 var(--color-border-bold, #C2BDAE)' : 'none',
                fontWeight: 800,
                fontSize: '0.74rem',
                color: tab === t ? 'var(--color-verdigris, #176B5B)' : 'var(--color-ink-secondary, #5C645F)',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              {t === 'login' ? 'Entrar' : t === 'signup' ? 'Cadastrar' : 'Link Mágico'}
            </button>
          ))}
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--color-coral-soft, #F8DED9)',
              border: '1px solid var(--color-coral, #E76F61)',
              borderRadius: '12px',
              color: 'var(--color-coral-bevel, #C75144)',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--color-verdigris-soft, #DCEBE5)',
              border: '1px solid var(--color-verdigris, #176B5B)',
              borderRadius: '12px',
              color: 'var(--color-verdigris, #176B5B)',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            <ShieldCheck size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tab === 'signup' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>
                  Nome de Exibição
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--color-ink-secondary, #5C645F)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                      backgroundColor: 'var(--color-paper, #F7F4EA)',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>
                  Identificador (@username)
                </label>
                <input
                  type="text"
                  placeholder="ex: hipatia.alexandria"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '.'))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                    backgroundColor: 'var(--color-paper, #F7F4EA)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--color-ink-secondary, #5C645F)' }} />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                  backgroundColor: 'var(--color-paper, #F7F4EA)',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {tab !== 'magic' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '4px' }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--color-ink-secondary, #5C645F)' }} />
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--color-border-subtle, #D9D5C8)',
                    backgroundColor: 'var(--color-paper, #F7F4EA)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: '8px' }}>
            <Aura3DButton
              variant="brand"
              size="md"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Conectando...'
                : tab === 'login'
                ? 'Entrar no Caderno'
                : tab === 'signup'
                ? 'Criar Caderno Oficial'
                : 'Enviar Link de Acesso'}
            </Aura3DButton>
          </div>
        </form>

        {/* Alternative Google Sign In */}
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--color-border-subtle, #D9D5C8)' }}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="aura-3d-btn aura-3d-btn--paper"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <span>Continuar com Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
