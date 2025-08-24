export default function MetricCard({ title, value, subtitle, icon: Icon, delay = 0 }) {
  return (
    <div 
      className="block-card p-6 block-fade grid-pattern"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-primary border-2 border-gray-200 flex items-center justify-center shadow-block">
          <Icon size={20} className="text-white" strokeWidth={2} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-gray-900 mb-1">{value}</div>
          <div className="text-xs font-mono text-gray-500 uppercase tracking-wider font-bold">{subtitle}</div>
        </div>
      </div>
      <div className="text-sm font-mono text-gray-600 uppercase tracking-wider font-bold">{title}</div>
    </div>
  );
}