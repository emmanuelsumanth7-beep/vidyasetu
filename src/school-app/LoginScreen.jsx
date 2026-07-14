import { ArrowRight, Bell, Bus, CheckCircle2, Phone, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n.jsx';
import { roles } from './data.js';
import { GlassCard } from './GlassCard.jsx';
import { LanguageToggle } from './LanguageToggle.jsx';

export function LoginScreen({ onRoleSelect }) {
  const { t } = useLanguage();

  return (
    <main className="login-screen animate-fade-in">
      <header className="brand-bar">
        <div className="brand-mark">
          <Shield size={26} />
        </div>
        <div>
          <h1>{t('appName')}</h1>
          <p>{t('meaning')}</p>
        </div>
        <LanguageToggle />
      </header>

      <section className="login-hero">
        <div className="hero-copy">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className="eyebrow">{t('pitch')}</span>
            <span className="version-badge animate-pulse-slow">{t('beta')}</span>
          </div>
          <h2>
            <span className="typewriter">{t('appName')}</span>{' '}
            <span className="typewriter delay-1">{t('appNameKannada')}</span>
          </h2>
          <p className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            {t('heroDescription')}
          </p>
          <div className="premium-score">
            <div>
              <strong>4</strong>
              <span>{t('rolePortals')}</span>
            </div>
            <div>
              <strong>2</strong>
              <span>{t('languages')}</span>
            </div>
            <div>
              <strong>12+</strong>
              <span>{t('schoolModules')}</span>
            </div>
          </div>
          <div className="trust-row">
            <span><CheckCircle2 size={18} /> {t('englishKannada')}</span>
            <span><CheckCircle2 size={18} /> {t('parentFirstUx')}</span>
            <span><CheckCircle2 size={18} /> {t('adminReady')}</span>
          </div>
        </div>

        <div className="login-panel animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="login-panel-inner">
            <div className="phone-preview" aria-hidden="true">
              <div className="phone-speaker" />
              <div className="preview-top">
                <span>{t('todayPreview')}</span>
                <strong>95%</strong>
              </div>
              <div className="preview-child">
                <img src="https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?auto=format&fit=crop&w=160&q=80" alt="" />
                <div>
                  <strong>Ananya</strong>
                  <span>{t('class')} 5A</span>
                </div>
              </div>
              <div className="preview-grid">
                <span><CheckCircle2 size={18} /> {t('present')}</span>
                <span><Bus size={18} /> 12 min</span>
                <span><Bell size={18} /> {t('notices')}</span>
                <span><Sparkles size={18} /> {t('dailyDiary')}</span>
              </div>
            </div>

          <h3>{t('chooseRole')}</h3>
          <div className="role-grid">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <button 
                  key={role.id} 
                  className="role-card animate-slide-up" 
                  style={{ animationDelay: `${index * 100}ms` }}
                  type="button" 
                  onClick={() => onRoleSelect(role.id)}
                >
                  <Icon size={32} />
                  <strong>{t(role.id)}</strong>
                  <span>{t(`${role.id}Hint`)}</span>
                  <ArrowRight size={20} />
                </button>
              );
            })}
          </div>

          <div className="otp-box">
            <label>
              <Phone size={18} />
              <input inputMode="tel" placeholder={t('phone')} defaultValue="+91 98765 43210" />
            </label>
            <button type="button">{t('otp')}</button>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
