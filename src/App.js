import React, { useState } from 'react';
import { 
  FileSpreadsheet, Bot, Play, Download, AlertCircle, CheckCircle2, 
  CalendarDays, ClipboardPaste, Loader2, Database, Building2, Cpu, 
  CalendarClock, Plus, Trash2, Edit, X, Search, Upload, Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('master');
  const [fcstInput, setFcstInput] = useState('');
  const [sompInput, setSompInput] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const defaultRules = {
    lineMap: { 
      'T1': 'SEC-T1(USA)', 'P1D': 'SEC-P1(D)(KR)', 'P1F': 'SEC-P1(F)(KR)',
      'P2D': 'SEC-P2(D)(KR)', 'P2F': 'SEC-P2(F)(KR)', 'P3F': 'SEC-P3(F)(KR)',
      'P4D': 'SEC-P4(D)(KR)', 'P4H': 'SEC-P4(H)(KR)', 'X2': 'SEC-X2L(CN)'
    },
    fabClientMap: {
      'SEC-T1(USA)': 'Samsung Electronics', 'SEC-P1(D)(KR)': 'Samsung Electronics',
      'SEC-P1(F)(KR)': 'Samsung Electronics', 'SEC-P2(D)(KR)': 'Samsung Electronics',
      'SEC-P2(F)(KR)': 'Samsung Electronics', 'SEC-P3(F)(KR)': 'Samsung Electronics',
      'SEC-P4(D)(KR)': 'Samsung Electronics', 'SEC-P4(H)(KR)': 'Samsung Electronics',
      'SEC-X2L(CN)': 'Samsung Electronics'
    },
    modelMap: { 
      'SUPRA-N-M': { model: 'SUPRA Nm (J)', pm: 0 }, 
      'SUPRA-N': { model: 'SUPRA N', pm: 0 }
    },
    atmMaster: [
      { id: 'ATM-101', partDate: '2026-01-06', prodDate: '2026-01-22', shipDate: '2026-01-23', maxCapa: 6 },
      { id: 'ATM-102', partDate: '2026-01-14', prodDate: '2026-01-30', shipDate: '2026-02-02', maxCapa: 6 },
      { id: 'ATM-103', partDate: '2026-01-22', prodDate: '2026-02-09', shipDate: '2026-02-10', maxCapa: 6 },
      { id: 'ATM-104', partDate: '2026-01-30', prodDate: '2026-02-20', shipDate: '2026-02-23', maxCapa: 6 },
      { id: 'ATM-105', partDate: '2026-02-09', prodDate: '2026-03-03', shipDate: '2026-03-04', maxCapa: 6 }
    ],
    vacMaster: [
      { id: 'VAC-201', partDate: '2026-01-06', prodDate: '2026-01-30', shipDate: '2026-02-02', maxCapa: 4 },
      { id: 'VAC-202', partDate: '2026-01-19', prodDate: '2026-02-12', shipDate: '2026-02-13', maxCapa: 4 },
      { id: 'VAC-203', partDate: '2026-01-30', prodDate: '2026-03-03', shipDate: '2026-03-04', maxCapa: 4 }
    ]
  };

  const [mappingRules, setMappingRules] = useState(() => {
    const saved = localStorage.getItem('pskMasterData_v3');
    const parsed = saved ? JSON.parse(saved) : null;
    return parsed ? { ...defaultRules, ...parsed, vacMaster: parsed.vacMaster || defaultRules.vacMaster } : defaultRules;
  });

  const saveRules = (newRules) => {
    setMappingRules(newRules);
    localStorage.setItem('pskMasterData_v3', JSON.stringify(newRules));
  };

  const showNotification = (msg, type = 'success') => {
    setStatus({ type, message: msg });
    setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
  };

  const processData = () => {
    setStatus({ type: 'loading', message: '데이터 병합 및 스캔 중...' });
    setResults([]);

    setTimeout(() => {
      try {
        const atmLoad = {};
        mappingRules.atmMaster.forEach(atm => { atmLoad[atm.id] = 0; });
        
        const sompLines = sompInput.trim().split('\n').filter(line => line.trim() !== '');
        const existingData = [];
        let sompHeaders = [];

        if (sompLines.length > 0) {
          sompHeaders = sompLines[0].split('\t').map(h => h.trim());
          for (let i = 1; i < sompLines.length; i++) {
            const cols = sompLines[i].split('\t').map(c => c.trim());
            const rowObj = {};
            sompHeaders.forEach((h, idx) => { rowObj[h] = cols[idx] || ''; });
            existingData.push({ ...rowObj, _isNew: false });

            cols.forEach(c => {
              if (c.startsWith('ATM-') && atmLoad[c] !== undefined) atmLoad[c]++;
            });
          }
        }

        const fcstLines = fcstInput.trim().split('\n').filter(line => line.trim() !== '');
        const processed = [];
        let successCount = 0;
        
        let fcstHeaderIdx = -1;
        let reqDateIndices = [];
        let qtyIdx = -1;

        for (let i = 0; i < Math.min(5, fcstLines.length); i++) {
          const cols = fcstLines[i].split('\t').map(c => c.trim());
          const indices = [];
          cols.forEach((c, idx) => {
            if (c.includes('필요납기')) indices.push(idx);
            if (c.includes('수량')) qtyIdx = idx;
          });
          if (indices.length > 0) {
            fcstHeaderIdx = i;
            reqDateIndices = indices;
            break;
          }
        }

        const dataRows = fcstHeaderIdx !== -1 ? fcstLines.slice(fcstHeaderIdx + 1) : fcstLines;

        dataRows.forEach((row) => {
          const cols = row.split('\t').map(c => c.trim());
          const isNew = cols.some(c => c && c.includes('신규'));
          
          if (isNew) {
            const rawLine = Object.keys(mappingRules.lineMap).find(key => cols.includes(key));
            const rawModel = Object.keys(mappingRules.modelMap).find(key => cols.includes(key));
            
            let qty = 1;
            if (qtyIdx !== -1 && cols[qtyIdx]) {
              qty = parseInt(cols[qtyIdx].replace(/[^0-9]/g, '')) || 1;
            } else {
              const qtyStr = cols.find(c => /^\d{1,3}$/.test(c));
              qty = qtyStr ? parseInt(qtyStr) : 1;
            }

            let rawDate = '';
            let prevDateRaw = '';
            let isDateChanged = false;

            if (reqDateIndices.length > 0) {
              const currIdx = reqDateIndices[reqDateIndices.length - 1]; 
              rawDate = cols[currIdx] || '';
              if (reqDateIndices.length > 1) {
                const prevIdx = reqDateIndices[0]; 
                prevDateRaw = cols[prevIdx] || '';
                if (prevDateRaw && rawDate && prevDateRaw !== rawDate) isDateChanged = true;
              }
            }

            const reqDate = rawDate.replace(/\./g, '-');
            const prevReqDate = prevDateRaw.replace(/\./g, '-');
            const fabName = rawLine ? mappingRules.lineMap[rawLine] : '';
            const clientName = fabName ? (mappingRules.fabClientMap[fabName] || '') : '';
            const modelInfo = rawModel ? mappingRules.modelMap[rawModel] : { model: '', pm: '' };

            let reqDateObj = reqDate ? new Date(reqDate) : null;

            for(let i=0; i<qty; i++) {
              let assignedAtm = ''; 
              let prodEndDate = ''; 
              let shipAvailableDate = ''; 
              let remarksArr = [];

              if (isDateChanged) remarksArr.push(`납기변경(${prevReqDate} ➡️ ${reqDate})`);

              if (reqDateObj) {
                let matchedAtm = null;
                for (let j = mappingRules.atmMaster.length - 1; j >= 0; j--) {
                  const atm = mappingRules.atmMaster[j];
                  if (new Date(atm.shipDate) <= reqDateObj) {
                    matchedAtm = atm; break;
                  }
                }

                if (matchedAtm) {
                  assignedAtm = matchedAtm.id; 
                  prodEndDate = matchedAtm.prodDate; 
                  shipAvailableDate = matchedAtm.shipDate; 
                  const currentLoad = atmLoad[matchedAtm.id] + 1;
                  if (currentLoad > matchedAtm.maxCapa) { 
                    remarksArr.push(`CAPA초과 (${currentLoad}/${matchedAtm.maxCapa})`); 
                  }
                  atmLoad[matchedAtm.id] = currentLoad;
                } else {
                  remarksArr.push('적합한 ATM없음');
                }
              }

              if (remarksArr.length === 0) remarksArr.push('신규 자동배정');
              processed.push({
                '고객사': clientName, 'FAB': fabName, 'PM': modelInfo.pm, '모델': modelInfo.model,
                '배정 LOT': assignedAtm, '비고': remarksArr.join(', '), 
                '납품일': reqDate, '생산완료일': prodEndDate, '출하가능일': shipAvailableDate, '_isNew': true 
              });
              successCount++;
            }
          }
        });

        setResults([...existingData, ...processed]);
        setStatus({ type: 'success', message: `배정 완료 (${successCount}건 추가)` });
      } catch (err) {
        setStatus({ type: 'error', message: '데이터 오류가 발생했습니다.' });
      }
    }, 800);
  };

  const getHeaders = () => {
    if (results.length === 0) return [];
    const headerSet = new Set();
    results.forEach(row => Object.keys(row).forEach(key => key !== '_isNew' && headerSet.add(key)));
    return Array.from(headerSet);
  };

  const downloadExcel = () => {
    if (results.length === 0) return;
    const headers = getHeaders();
    const csvContent = "\uFEFF" + [headers.join(","), ...results.map(r => headers.map(h => `"${r[h] || ''}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `FCST_Result_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  // ... (마스터 데이터 관리를 위한 추가 함수들은 이전 코드와 동일하게 구성하시면 됩니다.)

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-[#1a233a] text-gray-300 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 bg-[#111827]"><span className="text-xl font-bold text-white flex items-center gap-2"><Bot className="text-blue-400" /> Team AI Portal</span></div>
        <nav className="flex-1 py-4">
          <button onClick={() => setActiveTab('fcst')} className={`w-full flex items-center gap-3 px-6 py-3 ${activeTab === 'fcst' ? 'bg-blue-600/20 text-blue-400 font-bold' : ''}`}><CalendarDays size={16}/> FCST 스케줄러</button>
          <button onClick={() => setActiveTab('master')} className={`w-full flex items-center gap-3 px-6 py-3 ${activeTab === 'master' ? 'bg-blue-600/20 text-blue-400 font-bold' : ''}`}><Database size={16}/> 마스터 데이터 관리</button>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {/* 배정 및 마스터 UI 구현 영역 */}
        </div>
      </main>
    </div>
  );
}