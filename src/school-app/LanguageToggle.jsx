import { Languages } from 'lucide-react';
import { useLanguage } from '../i18n.jsx';

export function LanguageToggle({ theme, setTheme }) {
  const { language, switchLanguage, t } = useLanguage();

  return (
    <div className="top-actions animate-fade-in" aria-label={t('language')}>
      <button
        className="pill-toggle interactive-hover"
        type="button"
        onClick={() => switchLanguage(language === 'en' ? 'kn' : 'en')}
      >
        <Languages size={18} className="icon-spin-hover" />
        <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
      </button>
    </div>
  );
}
