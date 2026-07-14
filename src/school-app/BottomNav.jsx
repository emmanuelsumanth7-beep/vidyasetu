import { parentTabs } from './data.js';

export function BottomNav({ active, setActive }) {
  return (
    <nav className="bottom-nav animate-slide-up" aria-label="Parent navigation">
      {parentTabs.map((tab, index) => {
        const Icon = tab.icon;
        return (
          <button 
            key={tab.id} 
            className={`interactive-hover ${active === tab.id ? 'active pulse' : ''}`} 
            style={{ animationDelay: `${index * 50}ms` }}
            type="button" 
            onClick={() => setActive(tab.id)}
          >
            <Icon size={23} className={active === tab.id ? 'icon-bounce' : ''} />
            <span>{tab.label}</span>
            <small>{tab.kn}</small>
          </button>
        );
      })}
    </nav>
  );
}
