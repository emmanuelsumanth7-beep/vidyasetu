import { useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from './i18n.jsx';
import { LanguageToggle } from './school-app/LanguageToggle.jsx';
import { LoginScreen } from './school-app/LoginScreen.jsx';
import { ParentPortal } from './school-app/parent/ParentPortal.jsx';
import { TeacherPortal } from './school-app/teacher/TeacherPortal.jsx';
import { StaffPortal } from './school-app/staff/StaffPortal.jsx';
import { PrincipalDashboard } from './school-app/principal/PrincipalDashboard.jsx';

function AppContent() {
  const [role, setRole] = useState(null);
  const theme = 'light'; // Locked to pristine white theme
  const { t } = useLanguage();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('vidya-theme', theme);
  }, [theme]);

  return (
    <>
      <div className="floating-language fade-in-down">
        <LanguageToggle />
      </div>
      <div key={role || 'login'} className="fade-in-up app-transition-wrapper" style={{ height: '100%', width: '100%' }}>
        {!role ? (
          <LoginScreen onRoleSelect={setRole} />
        ) : (
          <>
            {role === 'parent' && <ParentPortal onBack={() => setRole(null)} />}
            {role === 'teacher' && <TeacherPortal onBack={() => setRole(null)} />}
            {role === 'staff' && <StaffPortal onBack={() => setRole(null)} />}
            {role === 'principal' && <PrincipalDashboard onBack={() => setRole(null)} />}
          </>
        )}
      </div>
      <span className="sr-only">{t('appName')}</span>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
