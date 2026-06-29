import React, { useState } from 'react';
import {
  FileSpreadsheet, Bot, Play, Download, AlertCircle, CheckCircle2,
  CalendarDays, ClipboardPaste, Loader2, Database, Building2, Cpu,
  CalendarClock, Plus, Trash2, Save, Edit, X, Search, Upload, Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('master');
  const [fcstInput, setFcstInput] = useState('');
  const [sompInput, setSompInput] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

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
      { id: 'ATM-105', partDate: '2026-02-09', prodDate: '2026-03-03', shipDate: '2026-03-04', maxCapa: 6 },
      { id: 'ATM-106', partDate: '2026-02-20', prodDate: '2026-03-11', shipDate: '2026-03-12', maxCapa: 6 },
      { id: 'ATM-107', partDate: '2026-03-03', prodDate: '2026-03-19', shipDate: '2026-03-20', maxCapa: 6 },
      { id: 'ATM-108', partDate: '2026-03-11', prodDate: '2026-03-27', shipDate: '2026-03-30', maxCapa: 6 },
      { id: 'ATM-109', partDate: '2026-03-19', prodDate: '2026-04-06', shipDate: '2026-04-07', maxCapa: 6 },
      { id: 'ATM-110', partDate: '2026-03-27', prodDate: '2026-04-14', shipDate: '2026-04-15', maxCapa: 6 },
      { id: 'ATM-111', partDate: '2026-04-06', prodDate: '2026-04-22', shipDate: '2026-04-23', maxCapa: 6 },
      { id: 'ATM-112', partDate: '2026-04-14', prodDate: '2026-04-30', shipDate: '2026-05-04', maxCapa: 6 },
      { id: 'ATM-113', partDate: '2026-04-22', prodDate: '2026-05-12', shipDate: '2026-05-13', maxCapa: 6 },
      { id: 'ATM-114', partDate: '2026-04-30', prodDate: '2026-05-20', shipDate: '2026-05-21', maxCapa: 6 },
      { id: 'ATM-115', partDate: '2026-05-12', prodDate: '2026-05-29', shipDate: '2026-06-01', maxCapa: 6 },
      { id: 'ATM-116', partDate: '2026-05-20', prodDate: '2026-06-09', shipDate: '2026-06-10', maxCapa: 6 },
      { id: 'ATM-117', partDate: '2026-05-29', prodDate: '2026-06-17', shipDate: '2026-06-18', maxCapa: 6 },
      { id: 'ATM-118', partDate: '2026-06-09', prodDate: '2026-06-25', shipDate: '2026-06-26', maxCapa: 6 },
      { id: 'ATM-119', partDate: '2026-06-17', prodDate: '2026-07-03', shipDate: '2026-07-06', maxCapa: 6 },
      { id: 'ATM-120', partDate: '2026-06-25', prodDate: '2026-07-13', shipDate: '2026-07-14', maxCapa: 6 },
      { id: 'ATM-121', partDate: '2026-07-03', prodDate: '2026-07-21', shipDate: '2026-07-22', maxCapa: 6 },
      { id: 'ATM-122', partDate: '2026-07-13', prodDate: '2026-07-29', shipDate: '2026-07-30', maxCapa: 6 },
      { id: 'ATM-123', partDate: '2026-07-21', prodDate: '2026-08-06', shipDate: '2026-08-07', maxCapa: 6 },
      { id: 'ATM-124', partDate: '2026-07-29', prodDate: '2026-08-14', shipDate: '2026-08-18', maxCapa: 6 },
      { id: 'ATM-125', partDate: '2026-08-06', prodDate: '2026-08-25', shipDate: '2026-08-26', maxCapa: 6 },
      { id: 'ATM-126', partDate: '2026-08-14', prodDate: '2026-09-02', shipDate: '2026-09-03', maxCapa: 6 },
      { id: 'ATM-127', partDate: '2026-08-25', prodDate: '2026-09-10', shipDate: '2026-09-11', maxCapa: 6 },
      { id: 'ATM-128', partDate: '2026-09-02', prodDate: '2026-09-18', shipDate: '2026-09-21', maxCapa: 6 },
      { id: 'ATM-129', partDate: '2026-09-10', prodDate: '2026-09-30', shipDate: '2026-10-01', maxCapa: 6 },
      { id: 'ATM-130', partDate: '2026-09-18', prodDate: '2026-10-12', shipDate: '2026-10-13', maxCapa: 6 },
      { id: 'ATM-131', partDate: '2026-09-30', prodDate: '2026-10-20', shipDate: '2026-10-21', maxCapa: 6 },
      { id: 'ATM-132', partDate: '2026-10-12', prodDate: '2026-10-28', shipDate: '2026-10-29', maxCapa: 6 },
      { id: 'ATM-133', partDate: '2026-10-20', prodDate: '2026-11-05', shipDate: '2026-11-06', maxCapa: 6 },
      { id: 'ATM-134', partDate: '2026-10-28', prodDate: '2026-11-13', shipDate: '2026-11-16', maxCapa: 6 },
      { id: 'ATM-135', partDate: '2026-11-05', prodDate: '2026-11-23', shipDate: '2026-11-24', maxCapa: 6 },
      { id: 'ATM-136', partDate: '2026-11-13', prodDate: '2026-12-01', shipDate: '2026-12-02', maxCapa: 6 },
      { id: 'ATM-137', partDate: '2026-11-23', prodDate: '2026-12-09', shipDate: '2026-12-10', maxCapa: 6 },
      { id: 'ATM-138', partDate: '2026-12-01', prodDate: '2026-12-17', shipDate: '2026-12-18', maxCapa: 6 },
      { id: 'ATM-139', partDate: '2026-12-09', prodDate: '2026-12-28', shipDate: '2026-12-29', maxCapa: 6 },
      { id: 'ATM-140', partDate: '2026-12-17', prodDate: '2027-01-06', shipDate: '2027-01-07', maxCapa: 6 }
    ],
    vacGeneralMaster: [
      { id: 'VAC-201', partDate: '2026-01-06', prodDate: '2026-01-30', shipDate: '2026-02-02', maxCapa: 4 },
      { id: 'VAC-202', partDate: '2026-01-19', prodDate: '2026-02-12', shipDate: '2026-02-13', maxCapa: 4 },
      { id: 'VAC-203', partDate: '2026-01-30', prodDate: '2026-03-03', shipDate: '2026-03-04', maxCapa: 4 },
      { id: 'VAC-204', partDate: '2026-02-12', prodDate: '2026-03-16', shipDate: '2026-03-17', maxCapa: 4 },
      { id: 'VAC-205', partDate: '2026-03-03', prodDate: '2026-03-27', shipDate: '2026-03-30', maxCapa: 4 },
      { id: 'VAC-206', partDate: '2026-03-16', prodDate: '2026-04-09', shipDate: '2026-04-10', maxCapa: 4 },
      { id: 'VAC-207', partDate: '2026-03-27', prodDate: '2026-04-22', shipDate: '2026-04-23', maxCapa: 4 },
      { id: 'VAC-208', partDate: '2026-04-09', prodDate: '2026-05-07', shipDate: '2026-05-08', maxCapa: 4 },
      { id: 'VAC-209', partDate: '2026-04-22', prodDate: '2026-05-20', shipDate: '2026-05-21', maxCapa: 4 },
      { id: 'VAC-210', partDate: '2026-05-07', prodDate: '2026-06-04', shipDate: '2026-06-05', maxCapa: 4 },
      { id: 'VAC-211', partDate: '2026-05-20', prodDate: '2026-06-17', shipDate: '2026-06-18', maxCapa: 4 },
      { id: 'VAC-212', partDate: '2026-06-04', prodDate: '2026-06-30', shipDate: '2026-07-01', maxCapa: 4 },
      { id: 'VAC-213', partDate: '2026-06-17', prodDate: '2026-07-13', shipDate: '2026-07-14', maxCapa: 4 },
      { id: 'VAC-214', partDate: '2026-06-30', prodDate: '2026-07-24', shipDate: '2026-07-27', maxCapa: 4 },
      { id: 'VAC-215', partDate: '2026-07-13', prodDate: '2026-08-06', shipDate: '2026-08-07', maxCapa: 4 },
      { id: 'VAC-216', partDate: '2026-07-24', prodDate: '2026-08-20', shipDate: '2026-08-21', maxCapa: 4 },
      { id: 'VAC-217', partDate: '2026-08-06', prodDate: '2026-09-02', shipDate: '2026-09-03', maxCapa: 4 },
      { id: 'VAC-218', partDate: '2026-08-20', prodDate: '2026-09-15', shipDate: '2026-09-16', maxCapa: 4 },
      { id: 'VAC-219', partDate: '2026-09-02', prodDate: '2026-09-30', shipDate: '2026-10-01', maxCapa: 4 },
      { id: 'VAC-220', partDate: '2026-09-15', prodDate: '2026-10-15', shipDate: '2026-10-16', maxCapa: 4 },
      { id: 'VAC-221', partDate: '2026-09-30', prodDate: '2026-10-28', shipDate: '2026-10-29', maxCapa: 4 },
      { id: 'VAC-222', partDate: '2026-10-15', prodDate: '2026-11-10', shipDate: '2026-11-11', maxCapa: 4 },
      { id: 'VAC-223', partDate: '2026-10-28', prodDate: '2026-11-23', shipDate: '2026-11-24', maxCapa: 4 },
      { id: 'VAC-224', partDate: '2026-11-10', prodDate: '2026-12-04', shipDate: '2026-12-07', maxCapa: 4 },
      { id: 'VAC-225', partDate: '2026-11-23', prodDate: '2026-12-17', shipDate: '2026-12-18', maxCapa: 4 },
      { id: 'VAC-226', partDate: '2026-12-04', prodDate: '2026-12-31', shipDate: '2027-01-04', maxCapa: 4 }
    ],
    vacDecMaster: [
      { id: 'DEC-201', partDate: '2026-01-06', prodDate: '2026-02-23', shipDate: '2026-02-24', maxCapa: 4 },
      { id: 'DEC-203', partDate: '2026-01-30', prodDate: '2026-03-20', shipDate: '2026-03-23', maxCapa: 4 },
      { id: 'DEC-205', partDate: '2026-03-03', prodDate: '2026-04-15', shipDate: '2026-04-16', maxCapa: 4 },
      { id: 'DEC-207', partDate: '2026-03-27', prodDate: '2026-05-13', shipDate: '2026-05-14', maxCapa: 4 },
      { id: 'DEC-209', partDate: '2026-04-22', prodDate: '2026-06-10', shipDate: '2026-06-11', maxCapa: 4 },
      { id: 'DEC-211', partDate: '2026-05-20', prodDate: '2026-07-06', shipDate: '2026-07-07', maxCapa: 4 },
      { id: 'DEC-213', partDate: '2026-06-17', prodDate: '2026-07-30', shipDate: '2026-07-31', maxCapa: 4 },
      { id: 'DEC-215', partDate: '2026-07-13', prodDate: '2026-08-26', shipDate: '2026-08-27', maxCapa: 4 },
      { id: 'DEC-217', partDate: '2026-08-06', prodDate: '2026-09-21', shipDate: '2026-09-22', maxCapa: 4 },
      { id: 'DEC-219', partDate: '2026-09-02', prodDate: '2026-10-21', shipDate: '2026-10-22', maxCapa: 4 },
      { id: 'DEC-221', partDate: '2026-09-30', prodDate: '2026-11-16', shipDate: '2026-11-17', maxCapa: 4 },
      { id: 'DEC-223', partDate: '2026-10-28', prodDate: '2026-12-10', shipDate: '2026-12-11', maxCapa: 4 },
      { id: 'DEC-225', partDate: '2026-11-23', prodDate: '2027-01-07', shipDate: '2027-01-08', maxCapa: 4 }
    ]
  };

  const [mappingRules, setMappingRules] = useState(() => {
    const saved = localStorage.getItem('pskMasterData_v4');
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed) {
      return {
        ...defaultRules,
        ...parsed,
        vacGeneralMaster: parsed.vacGeneralMaster || defaultRules.vacGeneralMaster,
        vacDecMaster: parsed.vacDecMaster || defaultRules.vacDecMaster,
      };
    }
    return defaultRules;
  });

  const saveRules = (newRules) => {
    setMappingRules(newRules);
    localStorage.setItem('pskMasterData_v4', JSON.stringify(newRules));
  };

  const showNotification = (msg, type = 'success') => {
    setStatus({ type, message: msg });
    setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
  };

  // ==========================================
  // 배정 로직 (FCST 스케줄러 탭)
  // 날짜 정규화: 포맷 통일 후 YYYY-MM-DD 문자열 반환 (비교용)
  const normDate = (d) => {
    if (!d) return '';
    const s = String(d).trim().replace(/\./g, '-').replace(/\//g, '-');
    const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (!m) return '';
    return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  };

  // ==========================================
  const processData = () => {
    setStatus({ type: 'loading', message: '데이터 분석 중...' });
    setResults([]);
    setAnalysisResult(null);

    setTimeout(() => {
      try {
        const atmLoad = {};
        mappingRules.atmMaster.forEach(atm => { atmLoad[atm.id] = 0; });

        // ── SOMP 파싱 ──────────────────────────────────────
        const sompLines = sompInput.trim().split('\n').filter(line => line.trim() !== '');
        const existingData = [];
        let sompHeaders = [];

        if (sompLines.length > 0) {
          sompHeaders = sompLines[0].split('\t').map(h => h.trim());
          for (let i = 1; i < sompLines.length; i++) {
            const cols = sompLines[i].split('\t').map(c => c.trim());
            const rowObj = {};
            sompHeaders.forEach((h, idx) => { rowObj[h] = cols[idx] || ''; });
            existingData.push({ ...rowObj, _isNew: false, _status: '기존' });
            cols.forEach(c => {
              if (c.startsWith('ATM-') && atmLoad[c] !== undefined) atmLoad[c]++;
            });
          }
        }

        // ── SOMP S/N 인덱스 생성 ───────────────────────────
        // 고객납기 소스 우선순위:
        //   1. 비고의 [납기:...] 태그 (신규 데이터, 가장 신뢰)
        //   2. 납품일 — LOT 날짜가 아닌 경우만 (구버전 데이터: 납품일=고객날짜였던 시절)
        //   3. 빈 문자열 → 유지 처리 (날짜 비교 불가, 오탐 방지)
        const allLotDates = new Set([
          ...mappingRules.atmMaster,
          ...(mappingRules.vacGeneralMaster || []),
          ...(mappingRules.vacDecMaster || []),
        ].flatMap(l => [l.partDate, l.prodDate, l.shipDate].filter(Boolean)));

        const sompSNMap = {};
        existingData.forEach((row, idx) => {
          const bigo = row['비고'] || '';
          const m = bigo.match(/\[S\/N:([^\]]+)\]/);
          if (m) {
            const sn = m[1];
            const nakgiFromBigo = extractNakgi(bigo);
            const nakgiFromPartDate = (!allLotDates.has(row['납품일']) && row['납품일']) ? row['납품일'] : '';
            const partDate = normDate(nakgiFromBigo || nakgiFromPartDate);
            if (!sompSNMap[sn]) sompSNMap[sn] = [];
            sompSNMap[sn].push({ idx, partDate });
          }
        });

        // ── FCST 헤더 감지 ─────────────────────────────────
        const fcstLines = fcstInput.trim().split('\n').filter(line => line.trim() !== '');
        let fcstHeaderIdx = -1;
        let reqDateIndices = [];
        let qtyIdx = -1;
        let snIdx = -1; // 구매 S/N 컬럼 인덱스

        for (let i = 0; i < Math.min(5, fcstLines.length); i++) {
          const cols = fcstLines[i].split('\t').map(c => c.trim());
          const indices = [];
          cols.forEach((c, idx) => {
            if (c.includes('필요납기')) indices.push(idx);
            if (c.includes('수량')) qtyIdx = idx;
            // 구매 S/N 컬럼 감지: '구매S/N', '구매 S/N', 'S/N' 등 포함
            if (snIdx === -1 && /구매.?s\/?n|^s\/?n$/i.test(c.replace(/\s/g, ''))) snIdx = idx;
          });
          if (indices.length > 0) {
            fcstHeaderIdx = i;
            reqDateIndices = indices;
            break;
          }
        }

        const dataRows = fcstHeaderIdx !== -1 ? fcstLines.slice(fcstHeaderIdx + 1) : fcstLines;

        // ── 분류 결과 수집 ─────────────────────────────────
        const newItems = [];
        const changedItems = [];
        let unchangedCount = 0;
        const fcstSNSet = new Set();
        const fcstCustomers = new Set();

        dataRows.forEach((row) => {
          const cols = row.split('\t').map(c => c.trim());
          const isNew = cols.some(c => c && c.includes('신규'));
          if (!isNew) return;

          // S/N: 헤더에서 감지된 컬럼 우선, 없으면 숫자로만 이뤄진 값 탐색 (MEMORY/FOUNDRY 등 제외)
          let inputSN = '';
          if (snIdx !== -1) {
            inputSN = cols[snIdx] || '';
          } else {
            // 헤더 미감지 시: 5자리 이상 숫자 패턴 찾기
            const snCandidate = cols.find(c => /^\d{5,}$/.test(c));
            inputSN = snCandidate || cols[0] || '';
          }
          const rawLine = Object.keys(mappingRules.lineMap).find(key => cols.includes(key));
          const rawModel = Object.keys(mappingRules.modelMap).find(key => cols.includes(key));
          const fabName = rawLine ? mappingRules.lineMap[rawLine] : '';
          const clientName = fabName ? (mappingRules.fabClientMap[fabName] || '') : '';
          if (clientName) fcstCustomers.add(clientName);
          const modelInfo = rawModel ? mappingRules.modelMap[rawModel] : { model: '', pm: '' };

          let qty = 1;
          if (qtyIdx !== -1 && cols[qtyIdx]) {
            qty = parseInt(cols[qtyIdx].replace(/[^0-9]/g, '')) || 1;
          } else {
            const qtyStr = cols.find(c => /^\d{1,3}$/.test(c));
            qty = qtyStr ? parseInt(qtyStr) : 1;
          }

          let rawDate = '', prevDateRaw = '', isDateChanged = false;
          if (reqDateIndices.length > 0) {
            const currIdx = reqDateIndices[reqDateIndices.length - 1];
            rawDate = cols[currIdx] || '';
            if (reqDateIndices.length > 1) {
              const prevIdx = reqDateIndices[0];
              prevDateRaw = cols[prevIdx] || '';
              if (prevDateRaw && rawDate && prevDateRaw !== rawDate) isDateChanged = true;
            }
          } else {
            const dateMatches = cols.filter(c => /^\d{4}[-.]\d{2}[-.]\d{2}/.test(c));
            if (dateMatches.length > 0) {
              rawDate = dateMatches[dateMatches.length - 1];
              if (dateMatches.length >= 2) {
                prevDateRaw = dateMatches[dateMatches.length - 2];
                if (prevDateRaw !== rawDate) isDateChanged = true;
              }
            }
          }

          const reqDate = rawDate.replace(/\./g, '-');
          const prevReqDate = prevDateRaw.replace(/\./g, '-');
          if (inputSN) fcstSNSet.add(inputSN);

          // ── S/N 기반 분류 ──────────────────────────────
          const existingEntries = inputSN ? sompSNMap[inputSN] : null;

          if (existingEntries && existingEntries.length > 0) {
            const existingDate = existingEntries[0].partDate;
            const normExisting = normDate(existingDate);
            const normReq = normDate(reqDate);

            if (!normExisting || normExisting === normReq) {
              // 유지 — 날짜 없거나 동일 (날짜 없으면 고객 납기 보완)
              unchangedCount += qty;
              existingEntries.forEach(e => {
                existingData[e.idx]._status = '유지';
                // 비고에 [납기:...] 없으면 보완 (구버전 데이터 대응)
                const bigo = existingData[e.idx]['비고'] || '';
                if (!bigo.includes('[납기:') && reqDate) {
                  existingData[e.idx]['비고'] = `[납기:${reqDate}]` + (bigo.trim() ? ` ${bigo}` : '');
                }
              });
            } else {
              // 납기변경 — 고객 납기만 업데이트 (납품일=LOT partDate는 건드리지 않음)
              changedItems.push({ sn: inputSN, oldDate: normExisting, newDate: normReq, clientName, fabName, model: modelInfo.model });
              existingEntries.forEach(e => {
                existingData[e.idx]._status = '납기변경';
                // 비고의 [납기:...] 태그만 업데이트 (고객 납기 별도 컬럼 없음)
                let prevBigo = existingData[e.idx]['비고'] || '';
                if (prevBigo.includes('[납기:')) {
                  prevBigo = prevBigo.replace(/\[납기:[^\]]*\]/, `[납기:${reqDate}]`);
                } else {
                  prevBigo = `[납기:${reqDate}]` + (prevBigo.trim() ? ` ${prevBigo}` : '');
                }
                existingData[e.idx]['비고'] = prevBigo;
              });
            }
            return; // 중복 추가 방지
          }

          // ── 신규 처리 ──────────────────────────────────
          // 신규 처리 시 진단 메시지 수집 (대시보드용, 비고 미포함)
          const diagMsgs = [];
          if (!rawLine) diagMsgs.push('라인 미등록');
          if (!rawModel) diagMsgs.push('모델 미등록');
          if (!reqDate) diagMsgs.push('납품일 누락');
          if (isDateChanged) diagMsgs.push(`납기변경(${prevReqDate}→${reqDate})`);

          const reqDateObj = reqDate ? new Date(reqDate) : null;
          for (let i = 0; i < qty; i++) {
            let assignedAtm = '', lotPartDate = '', prodEndDate = '', shipAvailableDate = '';
            let capaWarning = '';

            if (reqDateObj) {
              let matchedAtm = null;
              const targetReqDate = new Date(reqDateObj);
              targetReqDate.setHours(0, 0, 0, 0);
              for (let j = mappingRules.atmMaster.length - 1; j >= 0; j--) {
                const atm = mappingRules.atmMaster[j];
                if (!atm.shipDate) continue;
                const shipDateObj = new Date(atm.shipDate);
                shipDateObj.setHours(0, 0, 0, 0);
                if (shipDateObj <= targetReqDate) { matchedAtm = atm; break; }
              }
              if (matchedAtm) {
                assignedAtm = matchedAtm.id;
                lotPartDate = matchedAtm.partDate;
                prodEndDate = matchedAtm.prodDate;
                shipAvailableDate = matchedAtm.shipDate;
                const currentLoad = atmLoad[matchedAtm.id] + 1;
                if (currentLoad > matchedAtm.maxCapa) capaWarning = `CAPA초과(${currentLoad}/${matchedAtm.maxCapa})`;
                atmLoad[matchedAtm.id] = currentLoad;
              }
            }

            // 비고: [S/N:xxx] [납기:YYYY-MM-DD] 만 유지 (나머지는 대시보드)
            const bigoArr = [];
            if (inputSN) bigoArr.push(`[S/N:${inputSN}]`);
            if (reqDate) bigoArr.push(`[납기:${reqDate}]`);
            if (capaWarning) bigoArr.push(capaWarning); // CAPA는 LOT 운영상 필요

            newItems.push({
              '그룹': 'Sales',
              '고객사': clientName, 'FAB': fabName, 'PM': modelInfo.pm, '모델': modelInfo.model,
              '배정 LOT': assignedAtm, '비고': bigoArr.join(' '),
              '납품일': lotPartDate,
              '생산완료일': prodEndDate, '출하가능일': shipAvailableDate,
              '_isNew': true, '_status': '신규',
              '_diagMsgs': diagMsgs.length ? diagMsgs : undefined,
            });
          }
        });

        // ── 삭제 후보 감지 ─────────────────────────────────
        const deletedCandidates = [];
        Object.entries(sompSNMap).forEach(([sn, entries]) => {
          if (!fcstSNSet.has(sn)) {
            const row = existingData[entries[0].idx];
            const rowCustomer = row['고객사'] || '';
            if (fcstCustomers.size === 0 || fcstCustomers.has(rowCustomer)) {
              deletedCandidates.push({ sn, clientName: rowCustomer, fabName: row['FAB'] || '', partDate: entries[0].partDate });
            }
          }
        });

        const combinedResults = [...existingData, ...newItems];

        setAnalysisResult({
          newCount: newItems.length,
          changedItems,
          unchangedCount,
          deletedCandidates,
        });

        if (combinedResults.length === 0) {
          setStatus({ type: 'error', message: '출력할 데이터가 없습니다.' });
        } else {
          setResults(combinedResults);
          setStatus({
            type: 'success',
            message: `분석 완료 — 신규 ${newItems.length}건 / 납기변경 ${changedItems.length}건 / 변경없음 ${unchangedCount}건 / 삭제후보 ${deletedCandidates.length}건`
          });
        }
      } catch (err) {
        setStatus({ type: 'error', message: '데이터 파싱 중 오류가 발생했습니다.' });
      }
    }, 800);
  };

  const getHeaders = () => {
    if (results.length === 0) return [];
    const headerSet = new Set();
    results.forEach(row => { Object.keys(row).forEach(key => { if (!key.startsWith('_')) headerSet.add(key); }); });
    return Array.from(headerSet);
  };

  const toggleGroup = (key) => setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const [expandedCapaLots, setExpandedCapaLots] = useState({});
  const toggleCapaLot = (lotId) => setExpandedCapaLots(prev => ({ ...prev, [lotId]: !prev[lotId] }));

  const computeCapaIssues = () => {
    if (results.length === 0) return [];
    const allLots = [
      ...mappingRules.atmMaster,
      ...(mappingRules.vacGeneralMaster || []),
      ...(mappingRules.vacDecMaster || []),
    ];
    const lotMap = {};
    allLots.forEach(lot => { lotMap[lot.id] = { ...lot, items: [] }; });

    results.forEach(row => {
      const lotId = row['배정 LOT'] || row['배정LOT'];
      if (lotId && lotMap[lotId]) lotMap[lotId].items.push(row);
    });

    return Object.values(lotMap)
      .filter(lot => lot.items.length > lot.maxCapa)
      .map(lot => ({
        lotId: lot.id,
        shipDate: lot.shipDate,
        maxCapa: lot.maxCapa,
        used: lot.items.length,
        overCount: lot.items.length - lot.maxCapa,
        items: lot.items.map(item => ({
          clientName: item['고객사'] || '-',
          model: item['모델'] || '-',
          reqDate: item['납품일'] || '-',
          sn: extractSN(item['비고']),
          gap: (lot.shipDate && item['납품일'])
            ? Math.floor((new Date(item['납품일']) - new Date(lot.shipDate)) / 86400000)
            : null,
        })).sort((a, b) => (b.gap ?? 0) - (a.gap ?? 0)),
      }))
      .sort((a, b) => b.overCount - a.overCount);
  };

  const extractSN = (bigo) => {
    const m = (bigo || '').match(/\[S\/N:([^\]]+)\]/);
    return m ? m[1] : '-';
  };

  // 비고에서 고객납기 추출: [납기:YYYY-MM-DD]
  const extractNakgi = (bigo) => {
    const m = (bigo || '').match(/\[납기:([^\]]+)\]/);
    return m ? m[1].trim() : '';
  };

  const applyLotChange = (sn, suggestedLotId) => {
    const allLots = [
      ...mappingRules.atmMaster,
      ...(mappingRules.vacGeneralMaster || []),
      ...(mappingRules.vacDecMaster || []),
    ];
    const newLot = allLots.find(l => l.id === suggestedLotId);
    if (!newLot) return;

    const updatedResults = results.map(row => {
      const rowSN = extractSN(row['비고']);
      if (rowSN !== sn) return row;
      const currentLotId = row['배정 LOT'] || row['배정LOT'];
      const prevBigo = row['비고'] || '';
      return {
        ...row,
        '배정 LOT': suggestedLotId,
        '납품일': newLot.partDate,
        '생산완료일': newLot.prodDate,
        '출하가능일': newLot.shipDate,
        '비고': prevBigo, // 비고는 [S/N:] [납기:] 유지, LOT 변경 이력은 최적화 패널에서 확인
        _status: row._status === '납기변경' ? '납기변경' : '재배정',
      };
    });

    setResults(updatedResults);
    // 업데이트된 results로 즉시 재최적화 → 패널 유지
    runOptimization(updatedResults);
  };

  const runOptimization = (targetResults = null) => {
    const baseResults = targetResults || results;
    if (baseResults.length === 0) return;

    const allLots = [
      ...mappingRules.atmMaster,
      ...(mappingRules.vacGeneralMaster || []),
      ...(mappingRules.vacDecMaster || []),
    ];

    // 납기변경된 S/N 집합
    const changedSNSet = new Set((analysisResult?.changedItems || []).map(c => c.sn));

    // 현재 LOT 부하 집계
    const loadMap = {};
    allLots.forEach(lot => { loadMap[lot.id] = { used: 0, maxCapa: lot.maxCapa, shipDate: lot.shipDate }; });
    baseResults.forEach(row => {
      const lotId = row['배정 LOT'] || row['배정LOT'];
      if (lotId && loadMap[lotId]) loadMap[lotId].used++;
    });

    // (고객사, 모델) 그룹화 — 그룹=Sales + 배정 LOT + 납품일 있는 것만
    const groups = {};
    baseResults.forEach((row) => {
      const lotId = row['배정 LOT'] || row['배정LOT'];
      const reqDate = extractNakgi(row['비고']);
      const group = row['그룹'] || '';
      if (!lotId || !reqDate || lotId === '-' || lotId === '' || lotId === '미배정') return;
      if (group !== 'Sales') return;
      const key = `${row['고객사'] || ''}||${row['모델'] || ''}`;
      if (!groups[key]) groups[key] = { clientName: row['고객사'] || '', modelName: row['모델'] || '', items: [] };
      groups[key].items.push(row);
    });

    // 그룹별 분석
    const groupResults = Object.entries(groups).map(([key, { clientName, modelName, items }]) => {
      const itemResults = items.map(item => {
        const currentLotId = item['배정 LOT'] || item['배정LOT'];
        // 고객납기는 비고의 [납기:...] 태그에서 추출 (별도 컬럼 없음)
        const reqDate = extractNakgi(item['비고']);
        const reqDateObj = new Date(reqDate);
        const sn = extractSN(item['비고']);

        // LOT 풀 결정
        let pool;
        if (currentLotId.startsWith('ATM-')) pool = mappingRules.atmMaster;
        else if (currentLotId.startsWith('VAC-')) pool = mappingRules.vacGeneralMaster || [];
        else if (currentLotId.startsWith('DEC-')) pool = mappingRules.vacDecMaster || [];
        else return { type: 'unknown', sn, currentLotId, reqDate };

        const currentLot = pool.find(l => l.id === currentLotId);
        const currentShipObj = currentLot ? new Date(currentLot.shipDate) : null;

        const isDateChanged = changedSNSet.has(sn);

        const currentShipDate = currentLot?.shipDate || '';

        // 가능한 LOT 목록: shipDate ≤ 납기 AND (현재 LOT이거나 CAPA 여유)
        const eligible = pool.filter(lot => {
          const shipObj = new Date(lot.shipDate);
          const isCurrent = lot.id === currentLotId;
          const hasRoom = loadMap[lot.id] && (isCurrent || loadMap[lot.id].used < lot.maxCapa);
          return shipObj <= reqDateObj && hasRoom;
        });

        // 현재 LOT 자체가 납기 초과 → 다른 LOT으로 대안 탐색
        if (currentShipObj && currentShipObj > reqDateObj) {
          const altEligible = eligible.filter(lot => lot.id !== currentLotId);
          if (altEligible.length > 0) {
            const altLot = altEligible.reduce((best, lot) =>
              new Date(lot.shipDate) > new Date(best.shipDate) ? lot : best
            );
            const altGap = Math.floor((reqDateObj - new Date(altLot.shipDate)) / 86400000);
            return {
              type: 'improve', sn, currentLotId, currentShipDate,
              suggestedLotId: altLot.id, suggestedShipDate: altLot.shipDate,
              currentGap: null, optimalGap: altGap, gapReduction: null,
              reqDate, isDateChanged,
              msg: `현 LOT 납기초과 → ${altLot.id} 재배정 필요`,
            };
          }
          return {
            type: 'invalid', sn, currentLotId, currentShipDate, reqDate, isDateChanged,
            msg: `출하일(${currentShipDate}) > 납기(${reqDate}) — 대안 LOT 없음`
          };
        }

        if (eligible.length === 0) {
          return { type: 'invalid', sn, currentLotId, currentShipDate, reqDate, isDateChanged, msg: '가용 LOT 없음' };
        }

        // 최적 LOT = shipDate가 납기에 가장 가까운 것
        const optimalLot = eligible.reduce((best, lot) =>
          new Date(lot.shipDate) > new Date(best.shipDate) ? lot : best
        );

        const currentGap = currentShipObj
          ? Math.floor((reqDateObj - currentShipObj) / 86400000) : null;
        const optimalGap = Math.floor((reqDateObj - new Date(optimalLot.shipDate)) / 86400000);

        if (optimalLot.id !== currentLotId) {
          return {
            type: 'improve', sn, currentLotId, currentShipDate,
            suggestedLotId: optimalLot.id, suggestedShipDate: optimalLot.shipDate,
            currentGap, optimalGap,
            gapReduction: (currentGap ?? 0) - optimalGap,
            reqDate, isDateChanged,
          };
        }

        return { type: 'optimal', sn, currentLotId, currentShipDate, currentGap, reqDate, isDateChanged };
      });

      return {
        key, clientName, modelName, items: itemResults,
        invalidCount: itemResults.filter(r => r.type === 'invalid').length,
        improveCount: itemResults.filter(r => r.type === 'improve').length,
        dateChangeCount: itemResults.filter(r => r.isDateChanged && r.type !== 'optimal').length,
        optimalCount: itemResults.filter(r => r.type === 'optimal').length,
      };
    }).sort((a, b) => (b.invalidCount * 100 + b.dateChangeCount * 10 + b.improveCount) - (a.invalidCount * 100 + a.dateChangeCount * 10 + a.improveCount));

    setOptimizationResult({
      groups: groupResults,
      totalInvalid: groupResults.reduce((s, g) => s + g.invalidCount, 0),
      totalImprovable: groupResults.reduce((s, g) => s + g.improveCount, 0),
      totalDateChange: groupResults.reduce((s, g) => s + g.dateChangeCount, 0),
      totalOptimal: groupResults.reduce((s, g) => s + g.optimalCount, 0),
    });
    setExpandedGroups({});
  };

  const downloadExcel = async () => {
    if (results.length === 0) return;
    setStatus({ type: 'loading', message: '엑셀 파일 생성 중...' });
    try {
      const ExcelJS = window.ExcelJS;
      const saveAs = window.saveAs;
      if (!ExcelJS || !saveAs) throw new Error('CDN 라이브러리 로드 실패');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('FCST 배정결과');
      const headers = getHeaders();

      worksheet.columns = headers.map(h => ({
        header: h, key: h,
        width: h === '비고' ? 35 : (h === '모델' || h === '고객사' ? 20 : 15)
      }));

      results.forEach(row => {
        const rowData = {};
        headers.forEach(h => { rowData[h] = row[h] || ''; });
        worksheet.addRow(rowData);
      });

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6E0B4' } };
        cell.font = { bold: true, color: { argb: 'FF000000' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          });
        }
      });

      worksheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: results.length + 1, column: headers.length } };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `FCST_Merged_Result_${new Date().toISOString().split('T')[0]}.xlsx`);
      setStatus({ type: 'success', message: '엑셀(.xlsx) 다운로드가 완료되었습니다.' });
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
    } catch (error) {
      console.error("Excel export error:", error);
      setStatus({ type: 'error', message: '엑셀 다운로드 실패.' });
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
    }
  };

  // ==========================================
  // 마스터 데이터 관리 상태
  // ==========================================

  const [newLine, setNewLine] = useState({ client: '', line: '', fab: '' });
  const [searchLine, setSearchLine] = useState('');
  const [editLineId, setEditLineId] = useState(null);
  const [editLineVal, setEditLineVal] = useState({ fab: '', client: '' });
  const [showBulkLine, setShowBulkLine] = useState(false);
  const [bulkLineInput, setBulkLineInput] = useState('');

  const [newModel, setNewModel] = useState({ raw: '', somp: '', pm: 0 });
  const [searchModel, setSearchModel] = useState('');
  const [editModelId, setEditModelId] = useState(null);
  const [editModelVal, setEditModelVal] = useState({ somp: '', pm: 0 });
  const [showBulkModel, setShowBulkModel] = useState(false);
  const [bulkModelInput, setBulkModelInput] = useState('');

  const [newAtm, setNewAtm] = useState({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 6 });
  const [searchAtm, setSearchAtm] = useState('');
  const [editAtmId, setEditAtmId] = useState(null);
  const [editAtmVal, setEditAtmVal] = useState({ partDate: '', prodDate: '', shipDate: '', capa: 6 });
  const [showBulkAtm, setShowBulkAtm] = useState(false);
  const [bulkAtmInput, setBulkAtmInput] = useState('');

  // VAC General
  const [newVacGeneral, setNewVacGeneral] = useState({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 4 });
  const [searchVacGeneral, setSearchVacGeneral] = useState('');
  const [editVacGeneralId, setEditVacGeneralId] = useState(null);
  const [editVacGeneralVal, setEditVacGeneralVal] = useState({ partDate: '', prodDate: '', shipDate: '', capa: 4 });
  const [showBulkVacGeneral, setShowBulkVacGeneral] = useState(false);
  const [bulkVacGeneralInput, setBulkVacGeneralInput] = useState('');

  // VAC DEC
  const [newVacDec, setNewVacDec] = useState({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 4 });
  const [searchVacDec, setSearchVacDec] = useState('');
  const [editVacDecId, setEditVacDecId] = useState(null);
  const [editVacDecVal, setEditVacDecVal] = useState({ partDate: '', prodDate: '', shipDate: '', capa: 4 });
  const [showBulkVacDec, setShowBulkVacDec] = useState(false);
  const [bulkVacDecInput, setBulkVacDecInput] = useState('');

  // ==========================================
  // 라인/모델 CRUD
  // ==========================================
  const addLineRule = () => {
    if (!newLine.line || !newLine.fab || !newLine.client) return;
    const updated = { ...mappingRules };
    updated.lineMap[newLine.line] = newLine.fab;
    updated.fabClientMap[newLine.fab] = newLine.client;
    saveRules(updated); setNewLine({ client: '', line: '', fab: '' }); showNotification('라인이 성공적으로 등록되었습니다.');
  };
  const saveEditedLine = (line) => {
    const updated = { ...mappingRules };
    updated.lineMap[line] = editLineVal.fab;
    updated.fabClientMap[editLineVal.fab] = editLineVal.client;
    saveRules(updated); setEditLineId(null); showNotification('라인 정보가 수정되었습니다.');
  };
  const removeLineRule = (line) => { const updated = { ...mappingRules }; delete updated.lineMap[line]; saveRules(updated); showNotification('라인이 삭제되었습니다.'); };
  const handleBulkLine = () => {
    const rows = bulkLineInput.trim().split('\n');
    const updated = { ...mappingRules };
    let count = 0;
    rows.forEach(row => {
      const cols = row.split('\t').map(c => c.trim());
      if (cols.length >= 3) { const [client, line, fab] = cols; if (line && fab) { updated.lineMap[line] = fab; updated.fabClientMap[fab] = client; count++; } }
    });
    saveRules(updated); setBulkLineInput(''); setShowBulkLine(false); showNotification(`${count}건의 라인이 일괄 등록되었습니다.`);
  };

  const addModelRule = () => {
    if (!newModel.raw || !newModel.somp) return;
    const updated = { ...mappingRules };
    updated.modelMap[newModel.raw] = { model: newModel.somp, pm: parseInt(newModel.pm) || 0 };
    saveRules(updated); setNewModel({ raw: '', somp: '', pm: 0 }); showNotification('모델이 등록되었습니다.');
  };
  const saveEditedModel = (raw) => {
    const updated = { ...mappingRules };
    updated.modelMap[raw] = { model: editModelVal.somp, pm: parseInt(editModelVal.pm) || 0 };
    saveRules(updated); setEditModelId(null); showNotification('모델 정보가 수정되었습니다.');
  };
  const removeModelRule = (raw) => { const updated = { ...mappingRules }; delete updated.modelMap[raw]; saveRules(updated); showNotification('모델이 삭제되었습니다.'); };
  const handleBulkModel = () => {
    const rows = bulkModelInput.trim().split('\n');
    const updated = { ...mappingRules };
    let count = 0;
    rows.forEach(row => {
      const cols = row.split('\t').map(c => c.trim());
      if (cols.length >= 2 && cols[0] && cols[1]) { updated.modelMap[cols[0]] = { model: cols[1], pm: parseInt(cols[2]) || 0 }; count++; }
    });
    saveRules(updated); setBulkModelInput(''); setShowBulkModel(false); showNotification(`${count}건의 모델이 일괄 등록되었습니다.`);
  };

  const parseSmartDate = (val) => {
    if (!val) return '';
    const match = val.match(/(\d+)월\s*(\d+)일/);
    if (match) return `2026-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
    if (/\d{4}-\d{2}-\d{2}/.test(val)) return val;
    return val;
  };

  const handleSmartBulkSchedule = (inputData, targetKey, defaultCapa = 6) => {
    const rows = inputData.trim().split('\n').map(r => r.split('\t').map(c => c.trim()));
    const updated = { ...mappingRules };
    let count = 0;
    const isTransposed = rows.some(r => r[0] && (r[0].includes('내부관리번호') || r[0].includes('ATM') || r[0].includes('VAC') || r[0].includes('DEC')));

    if (isTransposed) {
      const idRow = rows.find(r => r[0].includes('내부관리번호'));
      const partRow = rows.find(r => r[0].includes('Part 납품일'));
      const prodRow = rows.find(r => r[0].includes('생산 완료일'));
      const shipRow = rows.find(r => r[0].includes('출하 가능일'));
      const capaRow = rows.find(r => r[0].includes('Capa'));
      if (idRow) {
        for (let i = 1; i < idRow.length; i++) {
          const id = idRow[i];
          if (!id) continue;
          updated[targetKey] = updated[targetKey].filter(item => item.id !== id);
          updated[targetKey].push({
            id,
            partDate: partRow ? parseSmartDate(partRow[i]) : '',
            prodDate: prodRow ? parseSmartDate(prodRow[i]) : '',
            shipDate: shipRow ? parseSmartDate(shipRow[i]) : '',
            maxCapa: capaRow && capaRow[i] ? parseInt(capaRow[i].replace(/[^0-9]/g, '')) : defaultCapa
          });
          count++;
        }
      }
    } else {
      rows.forEach(cols => {
        if (cols.length >= 4) {
          const [id, part, prod, ship, capa] = cols;
          if (id && part) {
            updated[targetKey] = updated[targetKey].filter(item => item.id !== id);
            updated[targetKey].push({ id, partDate: parseSmartDate(part), prodDate: parseSmartDate(prod), shipDate: parseSmartDate(ship), maxCapa: parseInt(capa) || defaultCapa });
            count++;
          }
        }
      });
    }
    updated[targetKey].sort((a, b) => new Date(a.partDate || 0) - new Date(b.partDate || 0));
    saveRules(updated);
    return count;
  };

  // ATM CRUD
  const addAtmRule = () => {
    if (!newAtm.id || !newAtm.partDate) return;
    const updated = { ...mappingRules };
    updated.atmMaster = [...updated.atmMaster, { ...newAtm, maxCapa: parseInt(newAtm.capa) || 6 }].sort((a, b) => new Date(a.partDate) - new Date(b.partDate));
    saveRules(updated); setNewAtm({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 6 }); showNotification('ATM 일정이 등록되었습니다.');
  };
  const saveEditedAtm = (id) => {
    const updated = { ...mappingRules };
    updated.atmMaster = updated.atmMaster.map(atm => atm.id === id ? { ...atm, ...editAtmVal, maxCapa: parseInt(editAtmVal.capa) } : atm).sort((a, b) => new Date(a.partDate) - new Date(b.partDate));
    saveRules(updated); setEditAtmId(null); showNotification('ATM 수정 완료');
  };
  const removeAtmRule = (id) => { const updated = { ...mappingRules }; updated.atmMaster = updated.atmMaster.filter(a => a.id !== id); saveRules(updated); showNotification('ATM 삭제됨'); };
  const handleBulkAtm = () => { const count = handleSmartBulkSchedule(bulkAtmInput, 'atmMaster', 6); setBulkAtmInput(''); setShowBulkAtm(false); showNotification(`스마트 파싱 완료: ${count}건 ATM 등록`); };

  // VAC General CRUD
  const addVacGeneralRule = () => {
    if (!newVacGeneral.id || !newVacGeneral.partDate) return;
    const updated = { ...mappingRules };
    updated.vacGeneralMaster = [...updated.vacGeneralMaster, { ...newVacGeneral, maxCapa: parseInt(newVacGeneral.capa) || 4 }].sort((a, b) => new Date(a.partDate) - new Date(b.partDate));
    saveRules(updated); setNewVacGeneral({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 4 }); showNotification('VAC General 일정이 등록되었습니다.');
  };
  const saveEditedVacGeneral = (id) => {
    const updated = { ...mappingRules };
    updated.vacGeneralMaster = updated.vacGeneralMaster.map(v => v.id === id ? { ...v, ...editVacGeneralVal, maxCapa: parseInt(editVacGeneralVal.capa) } : v).sort((a, b) => new Date(a.partDate) - new Date(b.partDate));
    saveRules(updated); setEditVacGeneralId(null); showNotification('VAC General 수정 완료');
  };
  const removeVacGeneralRule = (id) => { const updated = { ...mappingRules }; updated.vacGeneralMaster = updated.vacGeneralMaster.filter(v => v.id !== id); saveRules(updated); showNotification('VAC General 삭제됨'); };
  const handleBulkVacGeneral = () => { const count = handleSmartBulkSchedule(bulkVacGeneralInput, 'vacGeneralMaster', 4); setBulkVacGeneralInput(''); setShowBulkVacGeneral(false); showNotification(`스마트 파싱 완료: ${count}건 VAC General 등록`); };

  // VAC DEC CRUD
  const addVacDecRule = () => {
    if (!newVacDec.id || !newVacDec.partDate) return;
    const updated = { ...mappingRules };
    updated.vacDecMaster = [...updated.vacDecMaster, { ...newVacDec, maxCapa: parseInt(newVacDec.capa) || 4 }].sort((a, b) => new Date(a.partDate) - new Date(b.partDate));
    saveRules(updated); setNewVacDec({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 4 }); showNotification('VAC DEC 일정이 등록되었습니다.');
  };
  const saveEditedVacDec = (id) => {
    const updated = { ...mappingRules };
    updated.vacDecMaster = updated.vacDecMaster.map(v => v.id === id ? { ...v, ...editVacDecVal, maxCapa: parseInt(editVacDecVal.capa) } : v).sort((a, b) => new Date(a.partDate) - new Date(b.partDate));
    saveRules(updated); setEditVacDecId(null); showNotification('VAC DEC 수정 완료');
  };
  const removeVacDecRule = (id) => { const updated = { ...mappingRules }; updated.vacDecMaster = updated.vacDecMaster.filter(v => v.id !== id); saveRules(updated); showNotification('VAC DEC 삭제됨'); };
  const handleBulkVacDec = () => { const count = handleSmartBulkSchedule(bulkVacDecInput, 'vacDecMaster', 4); setBulkVacDecInput(''); setShowBulkVacDec(false); showNotification(`스마트 파싱 완료: ${count}건 VAC DEC 등록`); };

  // 필터링
  const filteredLines = Object.entries(mappingRules.lineMap).filter(([line, fab]) =>
    line.toLowerCase().includes(searchLine.toLowerCase()) || fab.toLowerCase().includes(searchLine.toLowerCase()) ||
    (mappingRules.fabClientMap[fab] || '').toLowerCase().includes(searchLine.toLowerCase())
  );
  const filteredModels = Object.entries(mappingRules.modelMap).filter(([raw, info]) =>
    raw.toLowerCase().includes(searchModel.toLowerCase()) || info.model.toLowerCase().includes(searchModel.toLowerCase())
  );
  const filteredAtms = mappingRules.atmMaster.filter(atm => atm.id.toLowerCase().includes(searchAtm.toLowerCase()));
  const filteredVacGenerals = (mappingRules.vacGeneralMaster || []).filter(v => v.id.toLowerCase().includes(searchVacGeneral.toLowerCase()));
  const filteredVacDecs = (mappingRules.vacDecMaster || []).filter(v => v.id.toLowerCase().includes(searchVacDec.toLowerCase()));

  // 공통 스케줄 테이블 렌더러
  const renderScheduleTable = ({ items, editId, editVal, setEditVal, onEdit, onSave, onCancel, onRemove, thColor = 'text-gray-600' }) => (
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
              <td className="px-4 py-3 font-bold text-gray-800">{item.id}</td>
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

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-[#1a233a] text-gray-300 flex flex-col shadow-xl z-20 shrink-0">
        <div className="h-16 flex items-center px-6 bg-[#111827] border-b border-gray-700">
          <span className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="text-blue-400 w-6 h-6" /> Team AI Portal
          </span>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <button onClick={() => setActiveTab('fcst')} className={`w-full flex items-center gap-3 px-6 py-3 text-sm ${activeTab === 'fcst' ? 'bg-blue-600/20 text-blue-400 font-bold border-r-4 border-blue-500' : 'hover:bg-gray-800'}`}>
                <CalendarDays className="w-4 h-4" /> FCST 스케줄러
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('master')} className={`w-full flex items-center gap-3 px-6 py-3 text-sm ${activeTab === 'master' ? 'bg-blue-600/20 text-blue-400 font-bold border-r-4 border-blue-500' : 'hover:bg-gray-800'}`}>
                <Database className="w-4 h-4" /> 마스터 데이터 관리
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10 shrink-0">
          <h2 className="text-lg font-bold text-gray-800">
            {activeTab === 'fcst' ? 'FCST 자동 배정 및 병합(Merge)' : 'Admin 마스터 데이터 관리'}
          </h2>
          {status.message && status.type !== 'loading' && activeTab === 'master' && (
            <div className="px-4 py-2 bg-green-100 text-green-800 text-sm font-bold rounded-full animate-pulse flex items-center gap-2">
              <CheckCircle2 size={16}/> {status.message}
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'fcst' ? (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
                  <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-gray-700">
                    <ClipboardPaste className="w-4 h-4 text-blue-600" /> 신규 FCST 데이터 (복사/붙여넣기)
                  </h3>
                  <textarea className="w-full h-48 border border-gray-200 rounded-lg bg-gray-50 p-4 text-xs resize-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="새로운 요청이 있는 FCST 데이터를 붙여넣으세요..." onChange={(e) => setFcstInput(e.target.value)} value={fcstInput} />
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col">
                  <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-gray-700">
                    <ClipboardPaste className="w-4 h-4 text-green-600" /> 기존 SOMP 데이터 (마스터 파일 붙여넣기)
                  </h3>
                  <textarea className="w-full h-48 border border-gray-200 rounded-lg bg-gray-50 p-4 text-xs resize-none focus:ring-2 focus:ring-green-500 outline-none" placeholder="기존에 관리하던 SOMP 엑셀 데이터를 헤더 포함해서 붙여넣으세요..." onChange={(e) => setSompInput(e.target.value)} value={sompInput} />
                </div>
              </div>
              <div className="flex justify-center gap-4 py-2">
                <button onClick={processData} disabled={status.type === 'loading'} className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg font-bold text-white flex items-center gap-2 shadow-md">
                  {status.type === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />} 데이터 스캔 및 분석
                </button>
                {results.length > 0 && (
                  <button onClick={() => runOptimization()} className="px-8 py-3 bg-indigo-700 hover:bg-indigo-800 rounded-lg font-bold text-white flex items-center gap-2 shadow-md">
                    <AlertCircle className="w-5 h-5" /> LOT 최적화 분석
                  </button>
                )}
              </div>
              {status.message && status.type !== 'loading' && (
                <div className={`p-4 rounded-lg font-bold text-center border ${status.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>{status.message}</div>
              )}

              {/* ── 분석 메시지 패널 ── */}
              {analysisResult && (
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                  <div className="px-6 py-3 bg-gray-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-bold text-white">FCST 변경점 분석 결과</span>
                  </div>
                  <div className="grid grid-cols-4 divide-x text-sm">
                    {/* 신규 */}
                    <div className="p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                        <span className="font-bold text-blue-800">신규 추가</span>
                        <span className="ml-auto text-xl font-black text-blue-600">{analysisResult.newCount}</span>
                        <span className="text-blue-500 text-xs">건</span>
                      </div>
                      <p className="text-xs text-blue-600">SOMP에 없는 신규 설비로 LOT 자동배정됨</p>
                    </div>
                    {/* 납기변경 */}
                    <div className="p-4 bg-orange-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                        <span className="font-bold text-orange-800">납기 변경</span>
                        <span className="ml-auto text-xl font-black text-orange-600">{analysisResult.changedItems.length}</span>
                        <span className="text-orange-500 text-xs">건</span>
                      </div>
                      {analysisResult.changedItems.length > 0 ? (
                        <ul className="text-xs text-orange-700 space-y-1 max-h-28 overflow-y-auto">
                          {analysisResult.changedItems.map((item, i) => (
                            <li key={i} className="flex gap-1 items-center">
                              <span className="font-bold shrink-0">S/N {item.sn}</span>
                              <span className="text-orange-400">|</span>
                              <span className="line-through text-orange-400">{item.oldDate}</span>
                              <span>→</span>
                              <span className="font-bold">{item.newDate}</span>
                            </li>
                          ))}
                        </ul>
                      ) : <p className="text-xs text-orange-500">변경 없음</p>}
                    </div>
                    {/* 변경없음 */}
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
                        <span className="font-bold text-gray-700">변경 없음</span>
                        <span className="ml-auto text-xl font-black text-gray-500">{analysisResult.unchangedCount}</span>
                        <span className="text-gray-400 text-xs">건</span>
                      </div>
                      <p className="text-xs text-gray-500">S/N 및 납기일 동일 → 중복 추가 없이 유지</p>
                    </div>
                    {/* 삭제 후보 */}
                    <div className="p-4 bg-red-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                        <span className="font-bold text-red-800">삭제 후보</span>
                        <span className="ml-auto text-xl font-black text-red-600">{analysisResult.deletedCandidates.length}</span>
                        <span className="text-red-500 text-xs">건</span>
                      </div>
                      {analysisResult.deletedCandidates.length > 0 ? (
                        <ul className="text-xs text-red-700 space-y-1 max-h-28 overflow-y-auto">
                          {analysisResult.deletedCandidates.map((item, i) => (
                            <li key={i} className="flex gap-1 items-center">
                              <span className="font-bold shrink-0">S/N {item.sn}</span>
                              <span className="text-red-300">|</span>
                              <span>{item.clientName}</span>
                              <span className="text-red-300">|</span>
                              <span className="text-red-500">{item.partDate}</span>
                            </li>
                          ))}
                        </ul>
                      ) : <p className="text-xs text-red-400">삭제 후보 없음</p>}
                      <p className="text-xs text-red-400 mt-2 border-t border-red-200 pt-1">* 이번 FCST에 미포함 — 직접 확인 후 삭제 여부 판단</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CAPA 초과 현황판 ── */}
              {results.length > 0 && (() => {
                const capaIssues = computeCapaIssues();
                if (capaIssues.length === 0) return null;
                const totalOver = capaIssues.reduce((s, l) => s + l.overCount, 0);
                return (
                  <div className="bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
                    <div className="px-6 py-3 bg-orange-600 flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-200" />
                        CAPA 초과 현황
                      </span>
                      <div className="flex gap-4 text-sm text-orange-100">
                        <span>초과 LOT <span className="font-black text-white">{capaIssues.length}</span>개</span>
                        <span>총 초과 <span className="font-black text-white">{totalOver}</span>건</span>
                      </div>
                    </div>

                    <div className="divide-y divide-orange-100">
                      {capaIssues.map(lot => (
                        <div key={lot.lotId}>
                          {/* LOT 헤더 */}
                          <button
                            onClick={() => toggleCapaLot(lot.lotId)}
                            className="w-full px-6 py-3 flex items-center justify-between hover:bg-orange-50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-black text-orange-700 text-sm">{lot.lotId}</span>
                              <span className="text-xs text-gray-500">출하가능일 {lot.shipDate}</span>
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full font-bold">
                                {lot.used}/{lot.maxCapa} — 초과 {lot.overCount}건
                              </span>
                            </div>
                            <span className="text-gray-400 text-xs">{expandedCapaLots[lot.lotId] ? '▲' : '▼'}</span>
                          </button>

                          {/* 배정 항목 목록 */}
                          {expandedCapaLots[lot.lotId] && (
                            <div className="bg-orange-50 px-6 py-3">
                              {/* 컬럼 헤더 */}
                              <div className="grid grid-cols-12 text-xs font-bold text-gray-500 px-3 pb-1 border-b border-orange-200 mb-2">
                                <span className="col-span-1">#</span>
                                <span className="col-span-2">S/N</span>
                                <span className="col-span-3">고객사</span>
                                <span className="col-span-3">모델</span>
                                <span className="col-span-2">납품일</span>
                                <span className="col-span-1 text-right">Gap</span>
                              </div>
                              {lot.items.map((item, idx) => {
                                const isOver = idx >= lot.maxCapa;
                                return (
                                  <div
                                    key={idx}
                                    className={`grid grid-cols-12 text-xs items-center px-3 py-1.5 rounded mb-1 ${
                                      isOver ? 'bg-red-100 border border-red-300' : 'bg-white border border-gray-100'
                                    }`}
                                  >
                                    <span className={`col-span-1 font-bold ${isOver ? 'text-red-600' : 'text-gray-400'}`}>
                                      {idx + 1}{isOver && ' ⚠'}
                                    </span>
                                    <span className="col-span-2 font-mono text-gray-700">{item.sn}</span>
                                    <span className="col-span-3 text-gray-700">{item.clientName}</span>
                                    <span className="col-span-3 text-gray-700">{item.model}</span>
                                    <span className="col-span-2 text-gray-600">{item.reqDate}</span>
                                    <span className={`col-span-1 text-right font-bold ${
                                      item.gap === 0 ? 'text-red-600' :
                                      item.gap <= 7 ? 'text-orange-600' : 'text-green-700'
                                    }`}>
                                      {item.gap !== null ? `${item.gap}일` : '-'}
                                    </span>
                                  </div>
                                );
                              })}
                              <p className="text-xs text-orange-500 mt-2">
                                * gap이 큰 항목(초록)이 다른 LOT 재배정 우선 검토 대상
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── LOT 최적화 분석 패널 ── */}
              {optimizationResult && (
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                  {/* 요약 헤더 */}
                  <div className="px-6 py-4 bg-indigo-900 flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-300" /> LOT 최적화 분석 결과
                    </span>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1 text-red-300 font-bold">
                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                        납기불가 {optimizationResult.totalInvalid}건
                      </span>
                      <span className="flex items-center gap-1 text-orange-300 font-bold">
                        <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
                        납기변경→LOT재검토 {optimizationResult.totalDateChange}건
                      </span>
                      <span className="flex items-center gap-1 text-yellow-300 font-bold">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
                        개선가능 {optimizationResult.totalImprovable}건
                      </span>
                      <span className="flex items-center gap-1 text-green-300 font-bold">
                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                        최적 {optimizationResult.totalOptimal}건
                      </span>
                    </div>
                  </div>

                  {/* 그룹별 상세 */}
                  <div className="divide-y">
                    {optimizationResult.groups.map((group) => (
                      <div key={group.key}>
                        {/* 그룹 헤더 (클릭으로 열기) */}
                        <button
                          onClick={() => toggleGroup(group.key)}
                          className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-800">{group.clientName}</span>
                            <span className="text-gray-400 text-xs">×</span>
                            <span className="text-sm font-bold text-indigo-700">{group.modelName}</span>
                            <span className="text-xs text-gray-400">({group.items.length}건)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {group.invalidCount > 0 && (
                              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full font-bold">
                                납기불가 {group.invalidCount}
                              </span>
                            )}
                            {group.dateChangeCount > 0 && (
                              <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full font-bold">
                                🔄 납기변경 {group.dateChangeCount}
                              </span>
                            )}
                            {group.improveCount > 0 && (
                              <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full font-bold">
                                ⚡ 개선가능 {group.improveCount}
                              </span>
                            )}
                            {group.optimalCount > 0 && (
                              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-bold">
                                ✅ 최적 {group.optimalCount}
                              </span>
                            )}
                            <span className="text-gray-400 text-xs ml-2">{expandedGroups[group.key] ? '▲' : '▼'}</span>
                          </div>
                        </button>

                        {/* 그룹 상세 항목 */}
                        {expandedGroups[group.key] && (
                          <div className="bg-gray-50 px-6 py-3 space-y-2">
                            {/* 컬럼 헤더 */}
                            <div className="grid grid-cols-12 text-xs font-bold text-gray-500 px-3 pb-1 border-b border-gray-200">
                              <span className="col-span-1">상태</span>
                              <span className="col-span-2">S/N</span>
                              <span className="col-span-2">납기일</span>
                              <span className="col-span-2">현재 LOT</span>
                              <span className="col-span-1 text-center">→</span>
                              <span className="col-span-2">제안 LOT</span>
                              <span className="col-span-1 text-right">Gap</span>
                              <span className="col-span-1 text-right">적용</span>
                            </div>
                            {group.items.map((r, i) => {
                              const isDateChanged = r.isDateChanged;
                              const rowBg =
                                r.type === 'invalid' ? 'bg-red-50 border-red-200' :
                                isDateChanged ? 'bg-orange-50 border-orange-300' :
                                r.type === 'improve' ? 'bg-yellow-50 border-yellow-200' :
                                'bg-white border-gray-100';
                              return (
                                <div key={i} className={`grid grid-cols-12 text-xs items-center px-3 py-2 rounded-lg border ${rowBg}`}>
                                  {/* 상태 아이콘 */}
                                  <span className="col-span-1 font-bold flex items-center gap-1">
                                    {r.type === 'invalid' && <span>❌</span>}
                                    {r.type === 'improve' && !isDateChanged && <span>⚡</span>}
                                    {r.type === 'improve' && isDateChanged && <span title="납기변경으로 LOT 재검토 필요">🔄</span>}
                                    {r.type === 'optimal' && !isDateChanged && <span>✅</span>}
                                    {r.type === 'optimal' && isDateChanged && <span title="납기변경됐지만 현재 LOT 유지 가능">🔄✅</span>}
                                  </span>
                                  {/* S/N */}
                                  <span className="col-span-2 font-mono text-gray-700 font-bold">{r.sn}</span>
                                  {/* 납기일 */}
                                  <span className={`col-span-2 ${isDateChanged ? 'text-orange-700 font-bold' : 'text-gray-600'}`}>
                                    {r.reqDate}
                                    {isDateChanged && <span className="ml-1 text-orange-500 text-[10px]">변경</span>}
                                  </span>
                                  {/* 현재 LOT */}
                                  <span className={`col-span-2 font-bold ${r.type === 'invalid' ? 'text-red-600 line-through' : 'text-gray-800'}`}>
                                    {r.currentLotId}
                                    {r.currentShipDate && (
                                      <span className="ml-1 text-gray-400 font-normal text-[10px]">({r.currentShipDate})</span>
                                    )}
                                  </span>
                                  {/* 화살표 */}
                                  <span className="col-span-1 text-center text-gray-400">
                                    {(r.type === 'improve' || r.type === 'invalid') ? '→' : ''}
                                  </span>
                                  {/* 제안 LOT / 메시지 */}
                                  <span className="col-span-2 font-bold text-indigo-700">
                                    {r.type === 'improve' && (
                                      <>
                                        {r.suggestedLotId}
                                        {r.suggestedShipDate && (
                                          <span className="ml-1 text-indigo-400 font-normal text-[10px]">({r.suggestedShipDate})</span>
                                        )}
                                      </>
                                    )}
                                    {r.type === 'invalid' && <span className="text-red-600 font-normal">{r.msg}</span>}
                                  </span>
                                  {/* Gap */}
                                  <span className="col-span-1 text-right">
                                    {r.type === 'improve' && (
                                      <span className="text-green-700 font-bold text-[10px]">
                                        {r.currentGap}→{r.optimalGap}일
                                      </span>
                                    )}
                                    {r.type === 'optimal' && (
                                      <span className="text-gray-500">{r.currentGap}일</span>
                                    )}
                                  </span>
                                  {/* 적용 버튼 */}
                                  <span className="col-span-1 text-right">
                                    {r.type === 'improve' && (
                                      <button
                                        onClick={() => applyLotChange(r.sn, r.suggestedLotId)}
                                        className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] rounded font-bold transition-colors"
                                      >
                                        적용
                                      </button>
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t text-xs text-gray-400">
                    * 제안은 참고용입니다. 같은 고객사+모델 범위 내에서만 검토된 결과이며, 실제 변경은 직접 확인 후 적용하세요.
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                  <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold flex items-center gap-2 text-gray-800">
                        <FileSpreadsheet className="w-5 h-5 text-gray-500" /> 병합 결과 확인
                      </h3>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold">■ 신규</span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded font-bold">■ 납기변경</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">□ 기존</span>
                      </div>
                    </div>
                    <button onClick={downloadExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4" /> 엑셀 다운로드
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#303387] text-white">
                        <tr>{getHeaders().map((h, i) => <th key={i} className="px-4 py-3 whitespace-nowrap">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {results.map((row, i) => {
                          let rowClass = 'bg-white';
                          const status = row._status;
                          if (status === '신규') {
                            rowClass = 'bg-blue-50/70';
                            if (row['비고'] && row['비고'].includes('CAPA초과')) rowClass = 'bg-orange-50';
                            if (row['비고'] && row['비고'].includes('ATM없음')) rowClass = 'bg-red-50';
                          } else if (status === '납기변경') {
                            rowClass = 'bg-amber-50';
                          }
                          return (
                            <tr key={i} className={`hover:brightness-95 transition-all ${rowClass}`}>
                              {getHeaders().map((key, j) => {
                                let tdClass = "px-4 py-2 whitespace-nowrap text-gray-700";
                                if (key === '비고') {
                                  if (row[key] && row[key].includes('CAPA초과')) tdClass += " text-orange-600 font-bold";
                                  if (row[key] && row[key].includes('ATM없음')) tdClass += " text-red-600 font-bold";
                                  if (row[key] && row[key].includes('납기변경')) tdClass += " text-amber-700 font-bold";
                                }
                                return <td key={j} className={tdClass}>{row[key] || '-'}</td>;
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">

              {/* 모델 매핑 */}
              <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><Cpu className="text-blue-600" /> 모델 매핑</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative"><Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" /><input placeholder="모델 검색..." className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 outline-none w-64" value={searchModel} onChange={e => setSearchModel(e.target.value)} /></div>
                    <button onClick={() => setShowBulkModel(!showBulkModel)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-700 transition"><Upload size={16}/> 대량 등록</button>
                  </div>
                </div>
                {showBulkModel && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold text-blue-900 flex items-center gap-2"><ClipboardPaste size={16}/> 엑셀 대량 복사/붙여넣기</span><button onClick={() => setShowBulkModel(false)} className="text-blue-500"><X size={16}/></button></div>
                    <textarea className="w-full h-32 border-0 bg-white p-3 text-sm rounded shadow-inner mb-3 outline-none" placeholder="SUPRA-N-M&#9;SUPRA Nm (J)&#9;0" value={bulkModelInput} onChange={e => setBulkModelInput(e.target.value)} />
                    <div className="flex justify-end"><button onClick={handleBulkModel} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700"><CheckCircle2 size={16}/> 일괄 등록 실행</button></div>
                  </div>
                )}
                <div className="flex gap-2 mb-6 bg-gray-50 p-3 rounded-lg border">
                  <input placeholder="Raw 모델 입력" className="border p-2 flex-1 rounded text-sm bg-white" value={newModel.raw} onChange={e => setNewModel({...newModel, raw: e.target.value})}/>
                  <input placeholder="변환 모델(SOMP) 입력" className="border p-2 flex-1 rounded text-sm bg-white" value={newModel.somp} onChange={e => setNewModel({...newModel, somp: e.target.value})}/>
                  <input placeholder="PM 수" type="number" className="border p-2 w-24 rounded text-sm bg-white" value={newModel.pm} onChange={e => setNewModel({...newModel, pm: e.target.value})}/>
                  <button onClick={addModelRule} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-bold flex items-center gap-1"><Plus size={16}/> 추가</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {filteredModels.map(([raw, info], idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm hover:border-blue-300 transition-colors group">
                      {editModelId === raw ? (
                        <div className="flex items-center gap-2 w-full">
                          <span className="font-bold text-gray-500 w-1/3 truncate text-sm">{raw}</span>
                          <input className="border p-1 w-1/3 text-xs rounded" value={editModelVal.somp} onChange={e => setEditModelVal({...editModelVal, somp: e.target.value})} placeholder="변환모델" />
                          <input className="border p-1 w-1/6 text-xs rounded" type="number" value={editModelVal.pm} onChange={e => setEditModelVal({...editModelVal, pm: e.target.value})} placeholder="PM" />
                          <div className="flex gap-1">
                            <button onClick={() => saveEditedModel(raw)} className="text-green-600 hover:bg-green-50 p-1 rounded"><CheckCircle2 size={16}/></button>
                            <button onClick={() => setEditModelId(null)} className="text-gray-400 hover:bg-gray-100 p-1 rounded"><X size={16}/></button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col truncate pr-2">
                            <span className="text-xs text-gray-500 font-medium">{raw}</span>
                            <span className="text-sm font-bold text-blue-700 truncate">{info.model} <span className="text-gray-400 font-normal text-xs ml-1">(PM: {info.pm})</span></span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditModelId(raw); setEditModelVal({ somp: info.model, pm: info.pm }); }} className="text-gray-400 hover:text-blue-600 p-1"><Edit size={16}/></button>
                            <button onClick={() => removeModelRule(raw)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {filteredModels.length === 0 && <div className="col-span-3 text-center py-4 text-gray-400 text-sm">검색 결과가 없습니다.</div>}
                </div>
              </div>

              {/* 라인 매핑 */}
              <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><Building2 className="text-indigo-600" /> 라인 매핑</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative"><Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" /><input placeholder="라인/FAB 검색..." className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 outline-none w-64" value={searchLine} onChange={e => setSearchLine(e.target.value)} /></div>
                    <button onClick={() => setShowBulkLine(!showBulkLine)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-700 transition"><Upload size={16}/> 대량 등록</button>
                  </div>
                </div>
                {showBulkLine && (
                  <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold text-indigo-900 flex items-center gap-2"><ClipboardPaste size={16}/> 엑셀 대량 복사/붙여넣기</span><button onClick={() => setShowBulkLine(false)} className="text-indigo-500"><X size={16}/></button></div>
                    <textarea className="w-full h-32 border-0 bg-white p-3 text-sm rounded shadow-inner mb-3 outline-none" value={bulkLineInput} onChange={e => setBulkLineInput(e.target.value)} />
                    <div className="flex justify-end"><button onClick={handleBulkLine} className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"><CheckCircle2 size={16}/> 일괄 등록 실행</button></div>
                  </div>
                )}
                <div className="flex gap-2 mb-6 bg-gray-50 p-3 rounded-lg border">
                  <input placeholder="고객사" className="border p-2 flex-1 rounded text-sm bg-white" value={newLine.client} onChange={e => setNewLine({...newLine, client: e.target.value})}/>
                  <input placeholder="입력 라인" className="border p-2 flex-1 rounded text-sm bg-white" value={newLine.line} onChange={e => setNewLine({...newLine, line: e.target.value})}/>
                  <input placeholder="변환 FAB" className="border p-2 flex-1 rounded text-sm bg-white" value={newLine.fab} onChange={e => setNewLine({...newLine, fab: e.target.value})}/>
                  <button onClick={addLineRule} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded text-sm font-bold flex items-center gap-1"><Plus size={16}/> 추가</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {filteredLines.map(([line, fab], idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm hover:border-indigo-300 transition-colors group">
                      {editLineId === line ? (
                        <div className="flex flex-col gap-1 w-full">
                          <span className="font-bold text-gray-500 text-xs mb-1">Line: {line}</span>
                          <input className="border p-1 text-xs rounded" value={editLineVal.client} onChange={e => setEditLineVal({...editLineVal, client: e.target.value})} placeholder="고객사" />
                          <input className="border p-1 text-xs rounded" value={editLineVal.fab} onChange={e => setEditLineVal({...editLineVal, fab: e.target.value})} placeholder="FAB" />
                          <div className="flex gap-1 justify-end mt-1">
                            <button onClick={() => saveEditedLine(line)} className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">저장</button>
                            <button onClick={() => setEditLineId(null)} className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">취소</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col truncate pr-2">
                            <span className="text-xs text-gray-400 font-medium">{mappingRules.fabClientMap[fab]}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-bold text-indigo-700">{line}</span>
                              <span className="text-gray-300 text-xs">▶</span>
                              <span className="text-sm text-gray-700 truncate">{fab}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={() => { setEditLineId(line); setEditLineVal({ fab, client: mappingRules.fabClientMap[fab] }); }} className="text-gray-400 hover:text-indigo-600 p-1"><Edit size={16}/></button>
                            <button onClick={() => removeLineRule(line)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {filteredLines.length === 0 && <div className="col-span-3 text-center py-4 text-gray-400 text-sm">검색 결과가 없습니다.</div>}
                </div>
              </div>

              {/* ATM 스케줄 */}
              <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><CalendarClock className="text-green-600" /> ATM 스케줄</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative"><Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" /><input placeholder="ATM ID 검색..." className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 outline-none w-64" value={searchAtm} onChange={e => setSearchAtm(e.target.value)} /></div>
                    <button onClick={() => setShowBulkAtm(!showBulkAtm)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-700 transition"><Upload size={16}/> 스마트 대량 등록</button>
                  </div>
                </div>
                {showBulkAtm && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold text-green-900 flex items-center gap-2"><ClipboardPaste size={16}/> 엑셀 표 그대로 복사/붙여넣기</span><button onClick={() => setShowBulkAtm(false)} className="text-green-500"><X size={16}/></button></div>
                    <textarea className="w-full h-32 border border-green-300 bg-white p-3 text-sm rounded shadow-inner mb-3 outline-none" placeholder="여기에 엑셀 표를 붙여넣으세요..." value={bulkAtmInput} onChange={e => setBulkAtmInput(e.target.value)} />
                    <div className="flex justify-end"><button onClick={handleBulkAtm} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700"><CheckCircle2 size={16}/> 스마트 등록 실행</button></div>
                  </div>
                )}
                <div className="flex gap-2 mb-6 bg-gray-50 p-3 rounded-lg border items-center">
                  <input placeholder="ATM ID" className="border p-2 flex-1 rounded text-sm bg-white" value={newAtm.id} onChange={e => setNewAtm({...newAtm, id: e.target.value})}/>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">Part 납품일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newAtm.partDate} onChange={e => setNewAtm({...newAtm, partDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">생산 완료일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newAtm.prodDate} onChange={e => setNewAtm({...newAtm, prodDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">출하 가능일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newAtm.shipDate} onChange={e => setNewAtm({...newAtm, shipDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">Capa</span><input type="number" className="border p-2 w-20 rounded text-sm bg-white" value={newAtm.capa} onChange={e => setNewAtm({...newAtm, capa: e.target.value})}/></div>
                  <div className="flex flex-col justify-end h-full mt-4"><button onClick={addAtmRule} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-bold flex items-center gap-1 h-[38px]"><Plus size={16}/> 추가</button></div>
                </div>
                {renderScheduleTable({
                  items: filteredAtms, editId: editAtmId, editVal: editAtmVal, setEditVal: setEditAtmVal,
                  onEdit: (item) => { setEditAtmId(item.id); setEditAtmVal({ partDate: item.partDate, prodDate: item.prodDate, shipDate: item.shipDate, capa: item.maxCapa }); },
                  onSave: saveEditedAtm, onCancel: () => setEditAtmId(null), onRemove: removeAtmRule
                })}
              </div>

              {/* VAC General 스케줄 */}
              <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><Layers className="text-teal-600" /> VAC General 스케줄</h4>
                    <p className="text-xs text-gray-400 mt-0.5 ml-7">SUPRA XP, INTEGER plus</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative"><Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" /><input placeholder="VAC ID 검색..." className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 outline-none w-64" value={searchVacGeneral} onChange={e => setSearchVacGeneral(e.target.value)} /></div>
                    <button onClick={() => setShowBulkVacGeneral(!showBulkVacGeneral)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-700 transition"><Upload size={16}/> 스마트 대량 등록</button>
                  </div>
                </div>
                {showBulkVacGeneral && (
                  <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold text-teal-900 flex items-center gap-2"><ClipboardPaste size={16}/> 엑셀 표 그대로 복사/붙여넣기</span><button onClick={() => setShowBulkVacGeneral(false)} className="text-teal-500"><X size={16}/></button></div>
                    <textarea className="w-full h-32 border border-teal-300 bg-white p-3 text-sm rounded shadow-inner mb-3 outline-none" placeholder="여기에 엑셀 표를 붙여넣으세요..." value={bulkVacGeneralInput} onChange={e => setBulkVacGeneralInput(e.target.value)} />
                    <div className="flex justify-end"><button onClick={handleBulkVacGeneral} className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-teal-700"><CheckCircle2 size={16}/> 스마트 등록 실행</button></div>
                  </div>
                )}
                <div className="flex gap-2 mb-6 bg-gray-50 p-3 rounded-lg border items-center">
                  <input placeholder="VAC ID" className="border p-2 flex-1 rounded text-sm bg-white" value={newVacGeneral.id} onChange={e => setNewVacGeneral({...newVacGeneral, id: e.target.value})}/>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">Part 납품일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newVacGeneral.partDate} onChange={e => setNewVacGeneral({...newVacGeneral, partDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">생산 완료일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newVacGeneral.prodDate} onChange={e => setNewVacGeneral({...newVacGeneral, prodDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">출하 가능일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newVacGeneral.shipDate} onChange={e => setNewVacGeneral({...newVacGeneral, shipDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">Capa</span><input type="number" className="border p-2 w-20 rounded text-sm bg-white" value={newVacGeneral.capa} onChange={e => setNewVacGeneral({...newVacGeneral, capa: e.target.value})}/></div>
                  <div className="flex flex-col justify-end h-full mt-4"><button onClick={addVacGeneralRule} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded text-sm font-bold flex items-center gap-1 h-[38px]"><Plus size={16}/> 추가</button></div>
                </div>
                {renderScheduleTable({
                  items: filteredVacGenerals, editId: editVacGeneralId, editVal: editVacGeneralVal, setEditVal: setEditVacGeneralVal,
                  onEdit: (item) => { setEditVacGeneralId(item.id); setEditVacGeneralVal({ partDate: item.partDate, prodDate: item.prodDate, shipDate: item.shipDate, capa: item.maxCapa }); },
                  onSave: saveEditedVacGeneral, onCancel: () => setEditVacGeneralId(null), onRemove: removeVacGeneralRule
                })}
              </div>

              {/* VAC DEC 스케줄 */}
              <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><Layers className="text-purple-600" /> VAC DEC 스케줄</h4>
                    <p className="text-xs text-gray-400 mt-0.5 ml-7">PRECIA, OMNIS plus, ZIVIS XP</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative"><Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" /><input placeholder="DEC ID 검색..." className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 outline-none w-64" value={searchVacDec} onChange={e => setSearchVacDec(e.target.value)} /></div>
                    <button onClick={() => setShowBulkVacDec(!showBulkVacDec)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-700 transition"><Upload size={16}/> 스마트 대량 등록</button>
                  </div>
                </div>
                {showBulkVacDec && (
                  <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2"><span className="text-sm font-bold text-purple-900 flex items-center gap-2"><ClipboardPaste size={16}/> 엑셀 표 그대로 복사/붙여넣기</span><button onClick={() => setShowBulkVacDec(false)} className="text-purple-500"><X size={16}/></button></div>
                    <textarea className="w-full h-32 border border-purple-300 bg-white p-3 text-sm rounded shadow-inner mb-3 outline-none" placeholder="여기에 엑셀 표를 붙여넣으세요..." value={bulkVacDecInput} onChange={e => setBulkVacDecInput(e.target.value)} />
                    <div className="flex justify-end"><button onClick={handleBulkVacDec} className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-purple-700"><CheckCircle2 size={16}/> 스마트 등록 실행</button></div>
                  </div>
                )}
                <div className="flex gap-2 mb-6 bg-gray-50 p-3 rounded-lg border items-center">
                  <input placeholder="DEC ID" className="border p-2 flex-1 rounded text-sm bg-white" value={newVacDec.id} onChange={e => setNewVacDec({...newVacDec, id: e.target.value})}/>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">Part 납품일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newVacDec.partDate} onChange={e => setNewVacDec({...newVacDec, partDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">생산 완료일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newVacDec.prodDate} onChange={e => setNewVacDec({...newVacDec, prodDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">출하 가능일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newVacDec.shipDate} onChange={e => setNewVacDec({...newVacDec, shipDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">Capa</span><input type="number" className="border p-2 w-20 rounded text-sm bg-white" value={newVacDec.capa} onChange={e => setNewVacDec({...newVacDec, capa: e.target.value})}/></div>
                  <div className="flex flex-col justify-end h-full mt-4"><button onClick={addVacDecRule} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded text-sm font-bold flex items-center gap-1 h-[38px]"><Plus size={16}/> 추가</button></div>
                </div>
                {renderScheduleTable({
                  items: filteredVacDecs, editId: editVacDecId, editVal: editVacDecVal, setEditVal: setEditVacDecVal,
                  onEdit: (item) => { setEditVacDecId(item.id); setEditVacDecVal({ partDate: item.partDate, prodDate: item.prodDate, shipDate: item.shipDate, capa: item.maxCapa }); },
                  onSave: saveEditedVacDec, onCancel: () => setEditVacDecId(null), onRemove: removeVacDecRule
                })}
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
