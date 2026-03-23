import React from 'react';

const DashboardCard = ({ title, amount, color, icon: Icon }) => {
  return (
    <div className={`p-6 rounded-xl shadow-md bg-white border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${amount.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-full bg-gray-50`}>
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
