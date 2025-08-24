import { Search, MoreHorizontal } from 'lucide-react';

export default function DataTable({ title, data = [], columns = [] }) {
  const defaultData = [
    {
      id: '12388',
      customer: 'CHARITY DOES',
      from: 'RUSSIA',
      price: '$2652',
      status: 'PROCESS',
      statusColor: 'bg-primary'
    },
    {
      id: '12386',
      customer: 'CHARITY DOES',
      from: 'RUSSIA',
      price: '$2652',
      status: 'OPEN',
      statusColor: 'bg-blue-400'
    }
  ];

  const defaultColumns = [
    { key: 'id', label: 'INVOICE' },
    { key: 'customer', label: 'CUSTOMERS' },
    { key: 'from', label: 'FROM' },
    { key: 'price', label: 'PRICE' },
    { key: 'status', label: 'STATUS' }
  ];

  const displayData = data.length > 0 ? data : defaultData;
  const displayColumns = columns.length > 0 ? columns : defaultColumns;

  return (
    <div className="block-card p-6 block-fade grid-pattern">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-mono font-bold text-gray-900 uppercase tracking-wider">{title || 'ORDER STATUS'}</h3>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1 font-bold">OVERVIEW OF LATEST MONTH</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search size={14} className="input-icon text-gray-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="SEARCH"
              className="input-block input-with-icon pr-4 py-2 text-xs w-32"
            />
          </div>
          <button className="p-2 border-3 border-gray-200 hover:border-primary transition-colors shadow-block">
            <MoreHorizontal size={14} className="text-gray-400" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border-3 border-gray-200">
        <table className="w-full bg-white">
          <thead>
            <tr className="border-b-3 border-gray-200 bg-gray-50">
              {displayColumns.map((column) => (
                <th key={column.key} className="text-left py-4 px-4 text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, index) => (
              <tr 
                key={row.id || index} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors block-fade"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {displayColumns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-sm">
                    {column.key === 'status' ? (
                      <span className={`px-3 py-1 text-xs font-mono font-bold text-white uppercase tracking-wider border-2 border-gray-200 shadow-block ${row.statusColor || 'bg-gray-500'}`}>
                        {row[column.key]}
                      </span>
                    ) : (
                      <span className="font-mono text-gray-800 uppercase font-bold text-xs">{row[column.key]}</span>
                    )}
                  </td>
                ))}
                <td className="py-3 px-4">
                  <button className="p-1 border-2 border-gray-200 hover:border-primary transition-colors">
                    <MoreHorizontal size={12} className="text-gray-400" strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t-3 border-gray-200">
        <span className="text-xs font-mono text-gray-500 uppercase font-bold tracking-wider">SHOWING 1 TO 20 ENTRIES</span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-6 h-6 text-xs font-mono font-bold transition-colors border-2 shadow-block ${
                page === 1 
                  ? 'bg-primary text-white border-primary' 
                  : 'text-gray-500 border-gray-200 hover:border-primary'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}