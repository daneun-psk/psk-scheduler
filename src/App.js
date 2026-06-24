import React, { useState } from 'react';
import { 
  FileSpreadsheet, Bot, Play, Download, AlertCircle, CheckCircle2, 
  CalendarDays, ClipboardPaste, Loader2, Database, Building2, Cpu, 
  CalendarClock, Plus, Trash2, Save
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('fcst');
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
      { id: 'ATM-102', start: '2026-01-13', end: '2026-01-29', maxCapa: 6 },
      { id: 'ATM-104', start: '2026-01-29', end: '2026-02-19', maxCapa: 6 }
    ]
  };

  const [mappingRules, setMappingRules] = useState(() => {
    const saved = localStorage.getItem('pskMasterData');
    return saved ? JSON.parse(saved) : defaultRules;
  });

  const saveRules = (newRules) => {
    setMappingRules(newRules);
    localStorage.setItem('pskMasterData', JSON.stringify(newRules));
  };

  const [newLine, setNewLine] = useState({ client: '', line: '', fab: '' });
  const [newModel, setNewModel] = useState({ raw: '', somp: '', pm: 0 });
  const [newAtm, setNewAtm] = useState({ id: '', start: '', end: '', capa: 6 });

  const processData = () => {
    setStatus({ type: 'loading', message: '데이터 스캔 중...' });
    setResults([]);

    setTimeout(() => {
      try {
        const fcstRows = fcstInput.trim().split('\n');
        const processed = [];
        let successCount = 0;
        let failCount = 0;

        const atmLoad = {};
        mappingRules.atmMaster.forEach(atm => { atmLoad[atm.id] = 0; });
        
        const sompRows = sompInput.trim().split('\n');
        sompRows.forEach(row => {
          const cols = row.split(/\t+| {2,}/).map(c => c.trim());
          cols.forEach(c => {
            if (c.startsWith('ATM-') && atmLoad[c] !== undefined) {
              atmLoad[c]++;
            }
          });
        });
        
        fcstRows.forEach((row) => {
          const cols = row.split(/\t+| {2,}/).map(c => c.trim());
          const isNew = cols.some(c => c && c.includes('신규'));
          
          if (isNew) {
            const rawLine = Object.keys(mappingRules.lineMap).find(key => cols.includes(key));
            const rawModel = Object.keys(mappingRules.modelMap).find(key => cols.includes(key));
            
            const qtyStr = cols.find(c => /^\d{1,3}$/.test(c));
            const qty = qtyStr ? parseInt(qtyStr) : 1;

            const dateMatches = cols.filter(c => /^\d{4}[-.]\d{2}[-.]\d{2}/.test(c));
            const rawDate = dateMatches.length > 0 ? dateMatches[dateMatches.length - 1] : '';
            const reqDate = rawDate.replace(/\./g, '-');

            const fabName = rawLine ? mappingRules.lineMap[rawLine] : '';
            const clientName = fabName ? (mappingRules.fabClientMap[fabName] || '') : '';
            const modelInfo = rawModel ? mappingRules.modelMap[rawModel] : { model: '', pm: '' };

            if (!rawLine || !rawModel) failCount++;

            let reqDateObj = reqDate ? new Date(reqDate) : null;

            for(let i=0; i<qty; i++) {
              let assignedAtm = ''; 
              let prodEndDate = ''; 
              let shipAvailableDate = ''; 
              let finalReqDate = ''; 
              let remarksArr = [];

              if (!rawLine) remarksArr.push('라인 미등록');
              if (!rawModel) remarksArr.push('모델 미등록');
              if (!reqDate) remarksArr.push('납품일 누락');

              if (reqDateObj) {
                const matchedAtm = mappingRules.atmMaster.find(atm => {
                  const startDate = new Date(atm.start);
                  const endDate = new Date(atm.end);
                  return reqDateObj >= startDate && reqDateObj <= endDate;
                });

                if (matchedAtm) {
                  assignedAtm = matchedAtm.id; 
                  prodEndDate = matchedAtm.end; 
                  shipAvailableDate = matchedAtm.end; 
                  finalReqDate = reqDate;
                  
                  if (atmLoad[matchedAtm.id] >= matchedAtm.maxCapa) { 
                    remarksArr.push(`Capa 초과 (${atmLoad[matchedAtm.id] + 1}/${matchedAtm.maxCapa})`); 
                  }
                  atmLoad[matchedAtm.id]++;
                } else {
                  remarksArr.push('적합한 ATM 없음');
                }
              }

              if (remarksArr.length === 0) remarksArr.push('신규 자동배정');

              processed.push({
                '고객사': clientName, 
                'FAB': fabName, 
                'PM': modelInfo.pm, 
                '모델': modelInfo.model,
                '배정 LOT': assignedAtm, 
                '비고': remarksArr.join(', '), 
                '납품일': finalReqDate, 
                '생산완료일': prodEndDate, 
                '출하가능일': shipAvailableDate
              });
              successCount++;
            }
          }
        });

        if (successCount === 0) {
          setStatus({ type: 'error', message: '신규 데이터가 없습니다.' });
        } else {
          setResults(processed);
          setStatus({ type: 'success', message: `배정 완료 (${successCount}건)` });
        }
      } catch (err) {
        setStatus({ type: 'error', message: '데이터 오류가 발생했습니다.' });
      }
    }, 800);
  };

  const downloadExcel = () => {
    if (results.length === 0) return;
    const headers = Object.keys(results[0]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + 
      [headers.join(","), ...results.map(r => Object.values(r).map(v => `"${v}"`).join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "SOMP_Upload.csv");
    document.body.appendChild(link);
    link.click();
  };

  const addLineRule = () => {
    if(!newLine.line || !newLine.fab || !newLine.client) return;
    const updated = { ...mappingRules };
    updated.lineMap[newLine.line] = newLine.fab;
    updated.fabClientMap[newLine.fab] = newLine.client;
    saveRules(updated);
    setNewLine({ client: '', line: '', fab: '' });
  };
  
  const removeLineRule = (line) => { 
    const updated = { ...mappingRules }; 
    delete updated.lineMap[line]; 
    saveRules(updated); 
  };

  const addModelRule = () => {
    if(!newModel.raw || !newModel.somp) return;
    const updated = { ...mappingRules };
    updated.modelMap[newModel.raw] = { model: newModel.somp, pm: parseInt(newModel.pm) || 0 };
    saveRules(updated);
    setNewModel({ raw: '', somp: '', pm: 0 });
  };

  const removeModelRule = (raw) => { 
    const updated = { ...mappingRules }; 
    delete updated.modelMap[raw]; 
    saveRules(updated); 
  };

  const addAtmRule = () => {
    if(!newAtm.id || !newAtm.start || !newAtm.end) return;
    const updated = { ...mappingRules };
    updated.atmMaster = [...updated.atmMaster, { ...newAtm, maxCapa: parseInt(newAtm.capa) || 6 }]
      .sort((a, b) => new Date(a.start) - new Date(b.start)); 
    saveRules(updated);
    setNewAtm({ id: '', start: '', end: '', capa: 6 });
  };

  const removeAtmRule = (id) => { 
    const updated = { ...mappingRules }; 
    updated.atmMaster = updated.atmMaster.filter(atm => atm.id !== id); 
    saveRules(updated); 
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-[#1a233a] text-gray-300 flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 bg-[#111827] border-b border-gray-700">
          <span className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="text-blue-400 w-6 h-6" /> Team AI Portal
          </span>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActiveTab('fcst')} 
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm ${activeTab === 'fcst' ? 'bg-blue-600/20 text-blue-400 font-bold' : 'hover:bg-gray-800'}`}
              >
                <CalendarDays className="w-4 h-4" /> FCST 스케줄러
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('master')} 
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm ${activeTab === 'master' ? 'bg-blue-600/20 text-blue-400 font-bold' : 'hover:bg-gray-800'}`}
              >
                <Database className="w-4 h-4" /> 마스터 데이터 관리
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 z-10 shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            {activeTab === 'fcst' ? 'FCST 배정 모드' : 'Admin 설정 모드'}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'fcst' ? (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
                  <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <ClipboardPaste className="w-4 h-4 text-blue-600" /> 신규 FCST 데이터
                  </h3>
                  <textarea 
                    className="w-full h-48 border-0 bg-gray-50 p-4 text-xs resize-none" 
                    placeholder="데이터 붙여넣기..." 
                    onChange={(e) => setFcstInput(e.target.value)} 
                    value={fcstInput}
                  />
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
                  <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <ClipboardPaste className="w-4 h-4 text-green-600" /> 기존 SOMP 데이터
                  </h3>
                  <textarea 
                    className="w-full h-48 border-0 bg-gray-50 p-4 text-xs resize-none" 
                    placeholder="데이터 붙여넣기..." 
                    onChange={(e) => setSompInput(e.target.value)} 
                    value={sompInput}
                  />
                </div>
              </div>

              <div className="flex justify-center py-2">
                <button 
                  onClick={processData} 
                  disabled={status.type === 'loading'} 
                  className="px-10 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white flex items-center gap-2"
                >
                  {status.type === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  배정 시작
                </button>
              </div>

              {status.message && status.type !== 'loading' && (
                <div className="p-4 rounded-lg bg-green-50 text-green-800 font-bold text-center">
                  {status.message}
                </div>
              )}

              {results.length > 0 && (
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                  <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold flex items-center gap-2"><FileSpreadsheet className="w-5 h-5" /> 결과 확인</h3>
                    <button onClick={downloadExcel} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm font-bold rounded flex items-center gap-2">
                      <Download className="w-4 h-4" /> 엑셀 다운로드
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#303387] text-white">
                        <tr>{Object.keys(results[0]).map((h, i) => <th key={i} className="px-4 py-2">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {results.map((row, i) => (
                          <tr key={i} className={row['비고'] !== '신규 자동배정' ? 'bg-red-50' : ''}>
                            {Object.entries(row).map(([key, val], j) => (
                              <td key={j} className="px-4 py-2">{val}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-white rounded-xl shadow border p-6">
                <h4 className="font-bold flex items-center gap-2 mb-4"><Building2 className="text-indigo-600" /> 라인 매핑</h4>
                <div className="flex gap-2 mb-4">
                  <input placeholder="고객사" className="border p-2 flex-1 rounded text-sm" value={newLine.client} onChange={e => setNewLine({...newLine, client: e.target.value})}/>
                  <input placeholder="입력 라인" className="border p-2 flex-1 rounded text-sm" value={newLine.line} onChange={e => setNewLine({...newLine, line: e.target.value})}/>
                  <input placeholder="변환 FAB" className="border p-2 flex-1 rounded text-sm" value={newLine.fab} onChange={e => setNewLine({...newLine, fab: e.target.value})}/>
                  <button onClick={addLineRule} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-bold"><Plus size={16}/></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(mappingRules.lineMap).map(([line, fab], idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 border rounded bg-gray-50 text-sm">
                      <span><b className="text-indigo-600">{line}</b> ➡️ {fab}</span>
                      <button onClick={() => removeLineRule(line)} className="text-red-500"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border p-6">
                <h4 className="font-bold flex items-center gap-2 mb-4"><Cpu className="text-blue-600" /> 모델 매핑</h4>
                <div className="flex gap-2 mb-4">
                  <input placeholder="Raw 모델" className="border p-2 flex-1 rounded text-sm" value={newModel.raw} onChange={e => setNewModel({...newModel, raw: e.target.value})}/>
                  <input placeholder="변환 모델" className="border p-2 flex-1 rounded text-sm" value={newModel.somp} onChange={e => setNewModel({...newModel, somp: e.target.value})}/>
                  <input placeholder="PM" type="number" className="border p-2 w-20 rounded text-sm" value={newModel.pm} onChange={e => setNewModel({...newModel, pm: e.target.value})}/>
                  <button onClick={addModelRule} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold"><Plus size={16}/></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(mappingRules.modelMap).map(([raw, info], idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 border rounded bg-gray-50 text-sm">
                      <span><b className="text-blue-600">{raw}</b> ➡️ {info.model} ({info.pm})</span>
                      <button onClick={() => removeModelRule(raw)} className="text-red-500"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border p-6">
                <h4 className="font-bold flex items-center gap-2 mb-4"><CalendarClock className="text-green-600" /> ATM 스케줄</h4>
                <div className="flex gap-2 mb-4">
                  <input placeholder="ID" className="border p-2 flex-1 rounded text-sm" value={newAtm.id} onChange={e => setNewAtm({...newAtm, id: e.target.value})}/>
                  <input type="date" className="border p-2 flex-1 rounded text-sm" value={newAtm.start} onChange={e => setNewAtm({...newAtm, start: e.target.value})}/>
                  <input type="date" className="border p-2 flex-1 rounded text-sm" value={newAtm.end} onChange={e => setNewAtm({...newAtm, end: e.target.value})}/>
                  <input placeholder="Capa" type="number" className="border p-2 w-24 rounded text-sm" value={newAtm.capa} onChange={e => setNewAtm({...newAtm, capa: e.target.value})}/>
                  <button onClick={addAtmRule} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold"><Plus size={16}/></button>
                </div>
                <table className="w-full text-sm text-left border">
                  <thead className="bg-gray-100">
                    <tr><th className="p-2 border">ID</th><th className="p-2 border">시작</th><th className="p-2 border">종료</th><th className="p-2 border">Capa</th><th className="p-2 border">삭제</th></tr>
                  </thead>
                  <tbody>
                    {mappingRules.atmMaster.map((atm, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 border font-bold">{atm.id}</td><td className="p-2 border">{atm.start}</td><td className="p-2 border">{atm.end}</td><td className="p-2 border text-green-700 font-bold">{atm.maxCapa}</td>
                        <td className="p-2 border"><button onClick={() => removeAtmRule(atm.id)} className="text-red-500"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}