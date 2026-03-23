import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const TransactionList = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Recent Transactions
        </h2>
        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
          {transactions.length} Total
        </span>
      </div>
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No transactions yet.</div>
        ) : (
          transactions.map((t, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                  {t.type === 'income' ? (
                    <ArrowDownLeft className={`w-5 h-5 ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t.description}</p>
                  <p className="text-xs text-gray-500 capitalize">{t.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400">Just now</p>
              </div>
            </div>
          )).reverse()
        )}
      </div>
    </div>
  );
};

export default TransactionList;
