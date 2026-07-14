export function IconButton({ icon: Icon, label, sublabel, active, onClick, tone = 'default' }) {
  return (
    <button className={`icon-button interactive-hover animate-scale-in ${active ? 'active pulse' : ''} ${tone}`} type="button" onClick={onClick}>
      <span className="icon-button-symbol">{Icon ? <Icon size={34} strokeWidth={2.2} className="icon-bounce" /> : null}</span>
      <span>{label}</span>
      {sublabel ? <small>{sublabel}</small> : null}
    </button>
  );
}
