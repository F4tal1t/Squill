import { CheckCircle, Plus, FileText } from 'lucide-react';

export default function ActivityFeed({ activities = [] }) {
  const defaultActivities = [
    {
      id: 1,
      type: 'task',
      title: 'TASK UPDATED',
      description: 'WEBSITE UPDATED A TASK',
      time: '40 MINS AGO',
      icon: CheckCircle,
      color: 'bg-primary'
    },
    {
      id: 2,
      type: 'deal',
      title: 'DEAL ADDED',
      description: 'PENCILS UPDATED A TASK',
      time: '1 DAY AGO',
      icon: Plus,
      color: 'bg-primary'
    },
    {
      id: 3,
      type: 'article',
      title: 'PUBLISHED ARTICLE',
      description: 'SOCIALS UPDATED A ARTICLE',
      time: '40 MINS AGO',
      icon: FileText,
      color: 'bg-primary'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="block-card p-6 block-fade grid-pattern">
      <h3 className="text-lg font-mono font-bold text-gray-900 uppercase tracking-wider mb-6">RECENT ACTIVITIES</h3>
      
      <div className="space-y-3">
        {displayActivities.map((activity, index) => {
          const Icon = activity.icon || CheckCircle;
          return (
            <div 
              key={activity.id || index}
              className="flex items-center space-x-4 p-3 border-2 border-gray-100 hover:border-primary transition-colors block-fade"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-8 h-8 bg-primary border-2 border-gray-200 flex items-center justify-center shadow-block">
                {Icon && <Icon size={14} className="text-white" strokeWidth={2} />}
              </div>
              
              <div className="flex-1">
                <h4 className="font-mono font-bold text-gray-900 text-sm uppercase">{activity.title}</h4>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider font-bold">{activity.description}</p>
              </div>
              
              <div className="text-xs font-mono text-gray-400 uppercase font-bold">
                {activity.time}
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-6 py-3 text-xs font-mono text-primary hover:text-gray-900 font-bold uppercase tracking-wider border-t-3 border-gray-200 transition-colors hover:bg-gray-50">
        VIEW ALL ACTIVITIES
      </button>
    </div>
  );
}