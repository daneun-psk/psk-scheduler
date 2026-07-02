import React from 'react';
import { CheckCircle2, X, Edit, Trash2 } from 'lucide-react';

export default function ScheduleTable({ items, editId, editVal, setEditVal, onEdit, onSave, onCancel, onRemove, thColor = 'text-gray-600', displayLotId }) {
  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className={`px-4 py-3 ${thColor}`}>ID</th>
            <th className={`px-4 py-3 ${thColor}`}>Part 납품일</th>
            <th className={`px-4 py-3 ${thColor}`}>생산 완료일</th>
            <th className={`px-4 py-3 ${thColor}`}>출하 가능일</th>
            <th className={`px-4 py-3 ${thColor}`}>최대 Capa</th>
            <th className={`px-4 py-3 text-center ${thColor}`}>관리</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50 group transition-colors">
              <td className="px-4 py-3 font-bold text-gray-800">{displayLotId(item.id)}</td>
              {editId === item.id ? (
                <>
                  <td className="px-2 py-2"><input type="date" className="border p-1 text-xs rounded w-full" value={editVal.partDate} onChange={e => setEditVal({...editVal, partDate: e.target.value})} /></td>
                  <td className="px-2 py-2"><input type="date" className="border p-1 text-xs rounded w-full" value={editVal.prodDate} onChange={e => setEditVal({...editVal, prodDate: e.target.value})} /></td>
                  <td className="px-2 py-2"><input type="date" className="border p-1 text-xs rounded w-full" value={editVal.shipDate} onChange={e => setEditVal({...editVal, shipDate: e.target.value})} /></td>
                  <td className="px-2 py-2"><input type="number" className="border p-1 text-xs rounded w-16" value={editVal.capa} onChange={e => setEditVal({...editVal, capa: e.target.value})} /></td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <button onClick={() => onSave(item.id)} className="text-green-600 hover:text-green-800"><CheckCircle2 size={18}/></button>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3 text-gray-600">{item.partDate}</td>
                  <td className="px-4 py-3 text-gray-600">{item.prodDate}</td>
                  <td className="px-4 py-3 text-gray-600">{item.shipDate}</td>
                  <td className="px-4 py-3 font-bold text-gray-700">{item.maxCapa}</td>
                  <td className="px-4 py-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="text-gray-400 hover:text-blue-600"><Edit size={16}/></button>
                    <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan="6" className="text-center py-6 text-gray-400">검색 결과가 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
