export function GlassCard({ children, className = '', as: Element = 'section', interactive = false }) {
  return <Element className={`glass-card ${interactive ? 'interactive-hover' : ''} ${className}`}>{children}</Element>;
}
