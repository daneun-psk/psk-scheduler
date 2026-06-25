import React, { useState } from 'react';
import { 
  FileSpreadsheet, Bot, Play, Download, CheckCircle2, 
  CalendarDays, ClipboardPaste, Loader2, Database, Building2, Cpu, 
  CalendarClock, Plus, Trash2, Edit, X, Search, Upload, Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('fcst');
  const [fcstInput, setFcstInput] = useState('');
  const [sompInput, setSompInput] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  // [기본 마스터 데이터]
  const defaultRules = {
    lineMap: { 'T1': 'SEC-T1(USA)', 'P1D': 'SEC-P1(D)(KR)' },
    fabClientMap: { 'SEC-T1(USA)': 'Samsung Electronics', 'SEC-P1(D)(KR)': 'Samsung Electronics' },
    modelMap: { 'SUPRA-N-M': { model: 'SUPRA Nm (J)', pm: 0 } },
    atmMaster: [],
    vacMaster: []
  };

  const [mappingRules, setMappingRules] = useState(() => {
    const saved = localStorage.getItem('pskMasterData_v3');
    return saved ? JSON.parse(saved) : defaultRules;
  });

  const saveRules = (newRules) => {
    setMappingRules(newRules);
    localStorage.setItem('pskMasterData_v3', JSON.stringify(newRules));
  };

  const showNotification = (msg) => {
    setStatus({ type: 'success', message: msg });
    setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
  };

  // [알고리즘: FCST 배정 로직]
  const processData = () => {
    setStatus({ type: 'loading', message: '데이터 병합 중...' });
    setTimeout(() => {
      try {
        const atmLoad = {};
        mappingRules.atmMaster.forEach(atm => { atmLoad[atm.id] = 0; });
        
        const fcstLines = fcstInput.trim().split('\n');
        const processed = [];
        let successCount = 0;

        let fcstHeaderIdx = -1;
        let reqDateIndices = [];
        let qtyIdx = -1;

        for (let i = 0; i < Math.min(5, fcstLines.length); i++) {
          const cols = fcstLines[i].split('\t').map(c => c.trim());
          cols.forEach((c, idx) => {
            if (c.includes('필요납기')) reqDateIndices.push(idx);
            if (c.includes('수량')) qtyIdx = idx;
          });
          if (reqDateIndices.length > 0) { fcstHeaderIdx = i; break; }
        }

        const dataRows = fcstHeaderIdx !== -1 ? fcstLines.slice(fcstHeaderIdx + 1) : fcstLines;

        dataRows.forEach((row) => {
          const cols = row.split('\t').map(c => c.trim());
          if (cols.some(c => c.includes('신규'))) {
            const rawLine = Object.keys(mappingRules.lineMap).find(key => cols.includes(key));
            const rawModel = Object.keys(mappingRules.modelMap).find(key => cols.includes(key));
            const qty = (qtyIdx !== -1 && cols[qtyIdx]) ? parseInt(cols[qtyIdx]) : 1;
            const reqDate = reqDateIndices.length > 0 ? cols[reqDateIndices[reqDateIndices.length - 1]] : '';
            
            const fab = rawLine ? mappingRules.lineMap[rawLine] : '';
            const modelInfo = rawModel ? mappingRules.modelMap[rawModel] : { model: '', pm: 0 };
            
            const reqDateObj = reqDate ? new Date(reqDate.replace(/\./g, '-')) : null;

            for(let i=0; i<qty; i++) {
              let assignedAtm = '';
              let remarks = '신규 자동배정';
              
              if (reqDateObj) {
                let matched = null;
                for (let j = mappingRules.atmMaster.length - 1; j >= 0; j--) {
                  if (new Date(mappingRules.atmMaster[j].shipDate) <= reqDateObj) {
                    matched = mappingRules.atmMaster[j]; break;
                  }
                }
                if (matched) {
                  assignedAtm = matched.id;
                  if (++atmLoad[matched.id] > matched.maxCapa) remarks = `CAPA초과 (${atmLoad[matched.id]}/${matched.maxCapa})`;
                } else {
                  remarks = '적합한 ATM없음';
                }
              }

              processed.push({
                '고객사': mappingRules.fabClientMap[fab] || '', 'FAB': fab, 'PM': modelInfo.pm, '모델': modelInfo.model,
                '배정 LOT': assignedAtm, '비고': remarks, '납품일': reqDate, '_isNew': true
              });
              successCount++;
            }
          }
        });
        setResults(processed);
        setStatus({ type: 'success', message: `${successCount}건 배정 완료` });
      } catch (e) { setStatus({ type: 'error', message: '데이터 파싱 오류' }); }
    }, 500);
  };

  // [UI 렌더링]
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-[#1a233a] text-white p-6">
        <h1 className="text-xl font-bold mb-8 text-blue-400">PSK Scheduler</h1>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('fcst')} className="block w-full text-left p-2 hover:bg-gray-800">FCST 스케줄러</button>
          <button onClick={() => setActiveTab('master')} className="block w-full text-left p-2 hover:bg-gray-800">마스터 데이터 관리</button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'fcst' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <textarea className="h-48 p-4 border rounded" placeholder="FCST 데이터" onChange={e => setFcstInput(e.target.value)} />
              <textarea className="h-48 p-4 border rounded" placeholder="기존 SOMP 데이터" onChange={e => setSompInput(e.target.value)} />
            </div>
            <button onClick={processData} className="bg-blue-600 text-white px-6 py-2 rounded">배정 시작</button>
            {results.length > 0 && (
              <table className="w-full bg-white shadow rounded">
                <thead><tr>{Object.keys(results[0]).filter(k=>k!=='_isNew').map(h=><th key={h} className="p-2 border">{h}</th>)}</tr></thead>
                <tbody>{results.map((r,i) => <tr key={i}>{Object.entries(r).filter(([k])=>k!=='_isNew').map(([k,v])=><td key={k} className="p-2 border">{v}</td>)}</tr>)}</tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* 마스터 데이터 관리 UI (모델, 라인, ATM, VAC 섹션 포함) */}
            <h2 className="text-2xl font-bold">마스터 데이터 관리</h2>
            {/* 모델/라인 설정 로직 여기에 배치 */}
            {/* ATM/VAC 스케줄 표 여기에 배치 */}
          </div>
        )}
      </main>
    </div>
  );
}