import React, { useState } from 'react';
import { 
  FileSpreadsheet, Bot, Play, Download, AlertCircle, CheckCircle2, 
  CalendarDays, ClipboardPaste, Loader2, Database, Building2, Cpu, 
  CalendarClock, Plus, Trash2, Save, Edit, X, Search, Upload, Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('master'); // 확인하기 쉽게 초기탭을 마스터로 변경
  const [fcstInput, setFcstInput] = useState('');
  const [sompInput, setSompInput] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  // 💡 올려주신 이미지 데이터 일부를 초기값으로 미리 입력해두었습니다. (년도는 2026년으로 세팅)
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
    vacMaster: [
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
    ]
  };

  const [mappingRules, setMappingRules] = useState(() => {
    const saved = localStorage.getItem('pskMasterData_v3'); // 스키마 변경으로 키 업데이트
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

  // ==========================================
  // 배정 로직 (FCST 스케줄러 탭)
  // ==========================================
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
        let failCount = 0;
        
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

            const fabName = rawLine ? mappingRules.lineMap[rawLine] : '';
            const clientName = fabName ? (mappingRules.fabClientMap[fabName] || '') : '';
            const modelInfo = rawModel ? mappingRules.modelMap[rawModel] : { model: '', pm: '' };

            if (!rawLine || !rawModel) failCount++;

            let reqDateObj = reqDate ? new Date(reqDate) : null;

            for(let i=0; i<qty; i++) {
              let assignedAtm = ''; 
              let prodEndDate = ''; 
              let shipAvailableDate = ''; 
              let finalReqDate = reqDate; 
              let remarksArr = [];

              if (!rawLine) remarksArr.push('라인 미등록');
              if (!rawModel) remarksArr.push('모델 미등록');
              if (!reqDate) remarksArr.push('납품일 누락');
              
              if (isDateChanged) remarksArr.push(`납기변경(${prevReqDate} ➡️ ${reqDate})`);

              // ATM 배정 매칭 조건 변경: 출하가능일 <= 필요납기 (가장 인접한 일정 찾기)
              if (reqDateObj) {
                let matchedAtm = null;
                const targetReqDate = new Date(reqDateObj);
                targetReqDate.setHours(0, 0, 0, 0); // 시간 오차 무시하고 날짜만 비교

                // atmMaster는 날짜순으로 오름차순 정렬되어 있으므로, 배열의 뒤에서부터 찾으면
                // 필요납기보다 빠르면서 가장 가까운(최적의) 출하가능일을 가진 ATM을 바로 찾을 수 있습니다.
                for (let j = mappingRules.atmMaster.length - 1; j >= 0; j--) {
                  const atm = mappingRules.atmMaster[j];
                  if (!atm.shipDate) continue;

                  const shipDateObj = new Date(atm.shipDate);
                  shipDateObj.setHours(0, 0, 0, 0);

                  if (shipDateObj <= targetReqDate) {
                    matchedAtm = atm;
                    break; // 가장 최적의 ATM을 찾았으므로 탐색 종료
                  }
                }

                if (matchedAtm) {
                  // 조건 1 & 2: 납기에 맞는 ATM이 있으면 무조건 배정 후 Capa 검증
                  assignedAtm = matchedAtm.id; 
                  prodEndDate = matchedAtm.prodDate; 
                  shipAvailableDate = matchedAtm.shipDate; 
                  
                  const currentLoad = atmLoad[matchedAtm.id] + 1;
                  if (currentLoad > matchedAtm.maxCapa) { 
                    remarksArr.push(`CAPA초과 (${currentLoad}/${matchedAtm.maxCapa})`); 
                  }
                  atmLoad[matchedAtm.id] = currentLoad;
                } else {
                  // 조건 3: 적합한 ATM이 없을 경우 공란 유지 및 비고란 작성
                  remarksArr.push('적합한 ATM없음');
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
                '출하가능일': shipAvailableDate,
                '_isNew': true 
              });
              successCount++;
            }
          }
        });

        const combinedResults = [...existingData, ...processed];

        if (combinedResults.length === 0) {
          setStatus({ type: 'error', message: '출력할 데이터가 없습니다.' });
        } else {
          setResults(combinedResults);
          setStatus({ type: 'success', message: `배정 완료 (기존 ${existingData.length}건 + 신규 ${successCount}건 추가됨)` });
        }
      } catch (err) {
        setStatus({ type: 'error', message: '데이터 파싱 중 오류가 발생했습니다.' });
      }
    }, 800);
  };

  const getHeaders = () => {
    if (results.length === 0) return [];
    const headerSet = new Set();
    results.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key !== '_isNew') headerSet.add(key);
      });
    });
    return Array.from(headerSet);
  };

  const downloadExcel = async () => {
    if (results.length === 0) return;

    setStatus({ type: 'loading', message: '엑셀 파일 생성 중...' });

    try {
      // 동적 임포트: 라이브러리가 없을 때 앱 전체가 강제 종료되는 것을 방지합니다.
      // 사용 전 반드시 터미널에서 npm install exceljs file-saver 를 실행해야 합니다.
      const ExcelJS = await import('exceljs');
      const { saveAs } = await import('file-saver');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('FCST 배정결과');

      const headers = getHeaders();

      // 1. 헤더(컬럼) 설정 및 너비 최적화
      worksheet.columns = headers.map(h => ({
        header: h,
        key: h,
        width: h === '비고' ? 35 : (h === '모델' || h === '고객사' ? 20 : 15)
      }));

      // 2. 데이터 삽입
      results.forEach(row => {
        const rowData = {};
        headers.forEach(h => {
          rowData[h] = row[h] || '';
        });
        worksheet.addRow(rowData);
      });

      // 3. 스타일링: 연두색 헤더 및 폰트 강조
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC6E0B4' } // 엑셀 표준 연두색 (올려주신 이미지 색상)
        };
        cell.font = { bold: true, color: { argb: 'FF000000' } };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      // 4. 일반 데이터 셀 테두리 및 정렬
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' }, left: { style: 'thin' },
              bottom: { style: 'thin' }, right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          });
        }
      });

      // 5. 자동 필터(AutoFilter) 적용
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: results.length + 1, column: headers.length }
      };

      // 6. 파일 생성 및 다운로드 실행 (.xlsx 형식)
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `FCST_Merged_Result_${new Date().toISOString().split('T')[0]}.xlsx`);

      setStatus({ type: 'success', message: '엑셀(.xlsx) 다운로드가 완료되었습니다.' });
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);

    } catch (error) {
      console.error("Excel export error:", error);
      setStatus({ type: 'error', message: '엑셀 다운로드 실패. 터미널에서 npm install exceljs file-saver 실행 요망' });
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
    }
  };

  // ==========================================
  // 마스터 데이터 관리 상태 및 로직
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

  // 💡 ATM/VAC 날짜 형식을 3가지로 변경 (partDate, prodDate, shipDate)
  const [newAtm, setNewAtm] = useState({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 6 });
  const [searchAtm, setSearchAtm] = useState('');
  const [editAtmId, setEditAtmId] = useState(null);
  const [editAtmVal, setEditAtmVal] = useState({ partDate: '', prodDate: '', shipDate: '', capa: 6 });
  const [showBulkAtm, setShowBulkAtm] = useState(false);
  const [bulkAtmInput, setBulkAtmInput] = useState('');

  const [newVac, setNewVac] = useState({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 4 });
  const [searchVac, setSearchVac] = useState('');
  const [editVacId, setEditVacId] = useState(null);
  const [editVacVal, setEditVacVal] = useState({ partDate: '', prodDate: '', shipDate: '', capa: 4 });
  const [showBulkVac, setShowBulkVac] = useState(false);
  const [bulkVacInput, setBulkVacInput] = useState('');

  // 모델/라인 함수들
  const addLineRule = () => {
    if(!newLine.line || !newLine.fab || !newLine.client) return;
    const updated = { ...mappingRules };
    updated.lineMap[newLine.line] = newLine.fab;
    updated.fabClientMap[newLine.fab] = newLine.client;
    saveRules(updated);
    setNewLine({ client: '', line: '', fab: '' });
    showNotification('라인이 성공적으로 등록되었습니다.');
  };
  const saveEditedLine = (line) => {
    const updated = { ...mappingRules };
    updated.lineMap[line] = editLineVal.fab;
    updated.fabClientMap[editLineVal.fab] = editLineVal.client;
    saveRules(updated);
    setEditLineId(null);
    showNotification('라인 정보가 수정되었습니다.');
  };
  const removeLineRule = (line) => { 
    const updated = { ...mappingRules }; 
    delete updated.lineMap[line]; 
    saveRules(updated); 
    showNotification('라인이 삭제되었습니다.');
  };
  const handleBulkLine = () => {
    const rows = bulkLineInput.trim().split('\n');
    const updated = { ...mappingRules };
    let count = 0;
    rows.forEach(row => {
      const cols = row.split('\t').map(c => c.trim());
      if(cols.length >= 3) {
        const [client, line, fab] = cols;
        if(line && fab) { updated.lineMap[line] = fab; updated.fabClientMap[fab] = client; count++; }
      }
    });
    saveRules(updated);
    setBulkLineInput('');
    setShowBulkLine(false);
    showNotification(`${count}건의 라인이 일괄 등록되었습니다.`);
  };

  const addModelRule = () => {
    if(!newModel.raw || !newModel.somp) return;
    const updated = { ...mappingRules };
    updated.modelMap[newModel.raw] = { model: newModel.somp, pm: parseInt(newModel.pm) || 0 };
    saveRules(updated);
    setNewModel({ raw: '', somp: '', pm: 0 });
    showNotification('모델이 등록되었습니다.');
  };
  const saveEditedModel = (raw) => {
    const updated = { ...mappingRules };
    updated.modelMap[raw] = { model: editModelVal.somp, pm: parseInt(editModelVal.pm) || 0 };
    saveRules(updated);
    setEditModelId(null);
    showNotification('모델 정보가 수정되었습니다.');
  };
  const removeModelRule = (raw) => { 
    const updated = { ...mappingRules }; delete updated.modelMap[raw]; saveRules(updated); showNotification('모델이 삭제되었습니다.');
  };
  const handleBulkModel = () => {
    const rows = bulkModelInput.trim().split('\n');
    const updated = { ...mappingRules };
    let count = 0;
    rows.forEach(row => {
      const cols = row.split('\t').map(c => c.trim());
      if(cols.length >= 2) {
        if(cols[0] && cols[1]) { updated.modelMap[cols[0]] = { model: cols[1], pm: parseInt(cols[2]) || 0 }; count++; }
      }
    });
    saveRules(updated); setBulkModelInput(''); setShowBulkModel(false); showNotification(`${count}건의 모델이 일괄 등록되었습니다.`);
  };

  // 💡 스마트 엑셀 날짜 파싱 헬퍼함수 (01월 06일 -> 2026-01-06)
  const parseSmartDate = (val) => {
    if (!val) return '';
    const match = val.match(/(\d+)월\s*(\d+)일/);
    if (match) return `2026-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
    if (/\d{4}-\d{2}-\d{2}/.test(val)) return val;
    return val;
  };

  // 💡 가로/세로 양방향 스마트 대량 등록 엔진 (ATM)
  const handleSmartBulkSchedule = (inputData, targetKey, defaultCapa = 6) => {
    const rows = inputData.trim().split('\n').map(r => r.split('\t').map(c => c.trim()));
    const updated = { ...mappingRules };
    let count = 0;

    // 가로형 배열(엑셀 구조) 인지 파악
    const isTransposed = rows.some(r => r[0] && (r[0].includes('내부관리번호') || r[0].includes('ATM') || r[0].includes('VAC')));

    if (isTransposed) {
      const idRow = rows.find(r => r[0].includes('내부관리번호'));
      const partRow = rows.find(r => r[0].includes('Part 납품일'));
      const prodRow = rows.find(r => r[0].includes('생산 완료일'));
      const shipRow = rows.find(r => r[0].includes('출하 가능일'));
      const capaRow = rows.find(r => r[0].includes('Capa'));

      if (idRow) {
        for (let i = 1; i < idRow.length; i++) {
          const id = idRow[i];
          if (!id || (!id.startsWith('ATM') && !id.startsWith('VAC'))) continue;

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
      // 일반 세로형 배열
      rows.forEach(cols => {
        if(cols.length >= 4) {
          const [id, part, prod, ship, capa] = cols;
          if(id && part) {
            updated[targetKey] = updated[targetKey].filter(item => item.id !== id);
            updated[targetKey].push({
              id, partDate: parseSmartDate(part), prodDate: parseSmartDate(prod), 
              shipDate: parseSmartDate(ship), maxCapa: parseInt(capa) || defaultCapa
            });
            count++;
          }
        }
      });
    }

    updated[targetKey].sort((a, b) => new Date(a.partDate || 0) - new Date(b.partDate || 0));
    saveRules(updated);
    return count;
  };

  const handleBulkAtm = () => {
    const count = handleSmartBulkSchedule(bulkAtmInput, 'atmMaster', 6);
    setBulkAtmInput(''); setShowBulkAtm(false); showNotification(`스마트 파싱 완료: ${count}건 ATM 등록`);
  };

  const handleBulkVac = () => {
    const count = handleSmartBulkSchedule(bulkVacInput, 'vacMaster', 4);
    setBulkVacInput(''); setShowBulkVac(false); showNotification(`스마트 파싱 완료: ${count}건 VAC 등록`);
  };

  const addAtmRule = () => {
    if(!newAtm.id || !newAtm.partDate) return;
    const updated = { ...mappingRules };
    updated.atmMaster = [...updated.atmMaster, { ...newAtm, maxCapa: parseInt(newAtm.capa) || 6 }]
      .sort((a, b) => new Date(a.partDate) - new Date(b.partDate)); 
    saveRules(updated); setNewAtm({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 6 }); showNotification('ATM 일정이 등록되었습니다.');
  };
  const saveEditedAtm = (id) => {
    const updated = { ...mappingRules };
    updated.atmMaster = updated.atmMaster.map(atm => 
      atm.id === id ? { ...atm, partDate: editAtmVal.partDate, prodDate: editAtmVal.prodDate, shipDate: editAtmVal.shipDate, maxCapa: parseInt(editAtmVal.capa) } : atm
    ).sort((a, b) => new Date(a.partDate) - new Date(b.partDate));
    saveRules(updated); setEditAtmId(null); showNotification('ATM 수정 완료');
  };
  const removeAtmRule = (id) => { 
    const updated = { ...mappingRules }; updated.atmMaster = updated.atmMaster.filter(atm => atm.id !== id); saveRules(updated); showNotification('ATM 삭제됨');
  };

  const addVacRule = () => {
    if(!newVac.id || !newVac.partDate) return;
    const updated = { ...mappingRules };
    updated.vacMaster = [...updated.vacMaster, { ...newVac, maxCapa: parseInt(newVac.capa) || 4 }]
      .sort((a, b) => new Date(a.partDate) - new Date(b.partDate)); 
    saveRules(updated); setNewVac({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 4 }); showNotification('VAC 일정이 등록되었습니다.');
  };
  const saveEditedVac = (id) => {
    const updated = { ...mappingRules };
    updated.vacMaster = updated.vacMaster.map(vac => 
      vac.id === id ? { ...vac, partDate: editVacVal.partDate, prodDate: editVacVal.prodDate, shipDate: editVacVal.shipDate, maxCapa: parseInt(editVacVal.capa) } : vac
    ).sort((a, b) => new Date(a.partDate) - new Date(b.partDate));
    saveRules(updated); setEditVacId(null); showNotification('VAC 수정 완료');
  };
  const removeVacRule = (id) => { 
    const updated = { ...mappingRules }; updated.vacMaster = updated.vacMaster.filter(vac => vac.id !== id); saveRules(updated); showNotification('VAC 삭제됨');
  };

  // 필터링
  const filteredLines = Object.entries(mappingRules.lineMap).filter(([line, fab]) => 
    line.toLowerCase().includes(searchLine.toLowerCase()) || 
    fab.toLowerCase().includes(searchLine.toLowerCase()) ||
    (mappingRules.fabClientMap[fab] || '').toLowerCase().includes(searchLine.toLowerCase())
  );
  const filteredModels = Object.entries(mappingRules.modelMap).filter(([raw, info]) => 
    raw.toLowerCase().includes(searchModel.toLowerCase()) || info.model.toLowerCase().includes(searchModel.toLowerCase())
  );
  const filteredAtms = mappingRules.atmMaster.filter(atm => atm.id.toLowerCase().includes(searchAtm.toLowerCase()));
  const filteredVacs = (mappingRules.vacMaster || []).filter(vac => vac.id.toLowerCase().includes(searchVac.toLowerCase()));

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
            // ... FCST 탭 UI (기존 동일)
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

              <div className="flex justify-center py-2">
                <button onClick={processData} disabled={status.type === 'loading'} className="px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg font-bold text-white flex items-center gap-2 shadow-md">
                  {status.type === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />} 데이터 스캔 및 하단에 추가하기
                </button>
              </div>

              {status.message && status.type !== 'loading' && (
                <div className={`p-4 rounded-lg font-bold text-center border ${status.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>{status.message}</div>
              )}

              {results.length > 0 && (
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                  <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold flex items-center gap-2 text-gray-800">
                      <FileSpreadsheet className="w-5 h-5 text-gray-500" /> 병합 결과 확인 
                      <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">파란색 배경이 새로 추가된 데이터입니다</span>
                    </h3>
                    <button onClick={downloadExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4" /> CSV 다운로드
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#303387] text-white">
                        <tr>{getHeaders().map((h, i) => <th key={i} className="px-4 py-3 whitespace-nowrap">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {results.map((row, i) => {
                          // UI/UX 개선: 비고란의 상태에 따라 행(Row)의 배경색을 다르게 강조
                          let rowClass = 'bg-white';
                          if (row._isNew) {
                            rowClass = 'bg-blue-50/70'; // 정상 배정 (연한 파란색)
                            if (row['비고'] && row['비고'].includes('CAPA초과')) rowClass = 'bg-orange-50'; // Capa 초과 (주황색)
                            if (row['비고'] && row['비고'].includes('없음')) rowClass = 'bg-red-50'; // 배정 실패 (빨간색)
                          }
                          
                          return (
                            <tr key={i} className={`hover:bg-gray-50 transition-colors ${rowClass}`}>
                              {getHeaders().map((key, j) => {
                                let tdClass = "px-4 py-2 whitespace-nowrap text-gray-700";
                                // 비고란의 텍스트 색상 포인트 추가
                                if (key === '비고') {
                                  if (row[key].includes('CAPA초과')) tdClass += " text-orange-600 font-bold";
                                  if (row[key].includes('ATM없음')) tdClass += " text-red-600 font-bold";
                                }
                                return <td key={j} className={tdClass}>{row[key] || '-'}</td>
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
               
               {/* ================= 모델 매핑 설정 ================= */}
               <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><Cpu className="text-blue-600" /> 모델 매핑</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input placeholder="모델 검색..." className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 outline-none w-64" value={searchModel} onChange={e => setSearchModel(e.target.value)} />
                    </div>
                    <button onClick={() => setShowBulkModel(!showBulkModel)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-700 transition">
                      <Upload size={16}/> 대량 등록
                    </button>
                  </div>
                </div>

                {showBulkModel && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-blue-900 flex items-center gap-2"><ClipboardPaste size={16}/> 엑셀 대량 복사/붙여넣기</span>
                      <button onClick={() => setShowBulkModel(false)} className="text-blue-500 hover:text-blue-800"><X size={16}/></button>
                    </div>
                    <textarea className="w-full h-32 border-0 bg-white p-3 text-sm rounded shadow-inner mb-3 outline-none" placeholder="SUPRA-N-M&#9;SUPRA Nm (J)&#9;0&#10;SUPRA-N&#9;SUPRA N&#9;0" value={bulkModelInput} onChange={e => setBulkModelInput(e.target.value)} />
                    <div className="flex justify-end">
                      <button onClick={handleBulkModel} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700"><CheckCircle2 size={16}/> 일괄 등록 실행</button>
                    </div>
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
                          <span className="font-bold text-gray-500 w-1/3 truncate text-sm" title={raw}>{raw}</span>
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

              {/* ================= 라인 매핑 설정 ================= */}
              <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><Building2 className="text-indigo-600" /> 라인 매핑</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input placeholder="라인/FAB 검색..." className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 outline-none w-64" value={searchLine} onChange={e => setSearchLine(e.target.value)} />
                    </div>
                    <button onClick={() => setShowBulkLine(!showBulkLine)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-700 transition">
                      <Upload size={16}/> 대량 등록
                    </button>
                  </div>
                </div>

                {showBulkLine && (
                  <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-indigo-900 flex items-center gap-2"><ClipboardPaste size={16}/> 엑셀 대량 복사/붙여넣기</span>
                      <button onClick={() => setShowBulkLine(false)} className="text-indigo-500 hover:text-indigo-800"><X size={16}/></button>
                    </div>
                    <textarea className="w-full h-32 border-0 bg-white p-3 text-sm rounded shadow-inner mb-3 outline-none" value={bulkLineInput} onChange={e => setBulkLineInput(e.target.value)} />
                    <div className="flex justify-end">
                      <button onClick={handleBulkLine} className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"><CheckCircle2 size={16}/> 일괄 등록 실행</button>
                    </div>
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

              {/* ================= ATM 스케줄 설정 ================= */}
              <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><CalendarClock className="text-green-600" /> ATM 스케줄</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input placeholder="ATM ID 검색..." className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 outline-none w-64" value={searchAtm} onChange={e => setSearchAtm(e.target.value)} />
                    </div>
                    <button onClick={() => setShowBulkAtm(!showBulkAtm)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-700 transition">
                      <Upload size={16}/> 스마트 대량 등록
                    </button>
                  </div>
                </div>

                {/* ATM 대량 등록 패널 */}
                {showBulkAtm && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-green-900 flex items-center gap-2"><ClipboardPaste size={16}/> 엑셀 표 그대로 복사/붙여넣기</span>
                      <button onClick={() => setShowBulkAtm(false)} className="text-green-500 hover:text-green-800"><X size={16}/></button>
                    </div>
                    <p className="text-xs text-green-700 mb-3">
                      엑셀에서 관리하시는 <b>가로형 표(행: Part납품일/생산완료일..., 열: ATM-101...)</b> 또는 일반 세로형 표를 <b>그대로 드래그해서</b> 붙여넣으세요. 스마트 파서가 '01월 06일' 형태의 날짜도 알아서 변환합니다.
                    </p>
                    <textarea 
                      className="w-full h-32 border border-green-300 bg-white p-3 text-sm rounded shadow-inner mb-3 outline-none" 
                      placeholder="여기에 엑셀 표를 붙여넣으세요..."
                      value={bulkAtmInput} onChange={e => setBulkAtmInput(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button onClick={handleBulkAtm} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700"><CheckCircle2 size={16}/> 스마트 등록 실행</button>
                    </div>
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

                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 border-b">
                      <tr><th className="px-4 py-3 text-gray-600">ID</th><th className="px-4 py-3 text-gray-600">Part 납품일</th><th className="px-4 py-3 text-gray-600">생산 완료일</th><th className="px-4 py-3 text-gray-600">출하 가능일</th><th className="px-4 py-3 text-gray-600">최대 Capa</th><th className="px-4 py-3 text-center text-gray-600">관리</th></tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredAtms.map((atm, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 group transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-800">{atm.id}</td>
                          {editAtmId === atm.id ? (
                            <>
                              <td className="px-2 py-2"><input type="date" className="border p-1 text-xs rounded w-full" value={editAtmVal.partDate} onChange={e => setEditAtmVal({...editAtmVal, partDate: e.target.value})} /></td>
                              <td className="px-2 py-2"><input type="date" className="border p-1 text-xs rounded w-full" value={editAtmVal.prodDate} onChange={e => setEditAtmVal({...editAtmVal, prodDate: e.target.value})} /></td>
                              <td className="px-2 py-2"><input type="date" className="border p-1 text-xs rounded w-full" value={editAtmVal.shipDate} onChange={e => setEditAtmVal({...editAtmVal, shipDate: e.target.value})} /></td>
                              <td className="px-2 py-2"><input type="number" className="border p-1 text-xs rounded w-16" value={editAtmVal.capa} onChange={e => setEditAtmVal({...editAtmVal, capa: e.target.value})} /></td>
                              <td className="px-4 py-2 flex justify-center gap-2">
                                <button onClick={() => saveEditedAtm(atm.id)} className="text-green-600 hover:text-green-800"><CheckCircle2 size={18}/></button>
                                <button onClick={() => setEditAtmId(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3 text-gray-600">{atm.partDate}</td>
                              <td className="px-4 py-3 text-gray-600">{atm.prodDate}</td>
                              <td className="px-4 py-3 text-gray-600">{atm.shipDate}</td>
                              <td className="px-4 py-3 text-green-700 font-bold">{atm.maxCapa}</td>
                              <td className="px-4 py-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditAtmId(atm.id); setEditAtmVal({ partDate: atm.partDate, prodDate: atm.prodDate, shipDate: atm.shipDate, capa: atm.maxCapa }); }} className="text-gray-400 hover:text-blue-600"><Edit size={16}/></button>
                                <button onClick={() => removeAtmRule(atm.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      {filteredAtms.length === 0 && <tr><td colSpan="6" className="text-center py-6 text-gray-400">검색 결과가 없습니다.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ================= VAC 스케줄 설정 ================= */}
              <div className="bg-white rounded-xl shadow border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><Layers className="text-teal-600" /> VAC 스케줄</h4>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input placeholder="VAC ID 검색..." className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 outline-none w-64" value={searchVac} onChange={e => setSearchVac(e.target.value)} />
                    </div>
                    <button onClick={() => setShowBulkVac(!showBulkVac)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-700 transition">
                      <Upload size={16}/> 스마트 대량 등록
                    </button>
                  </div>
                </div>

                {/* VAC 대량 등록 패널 */}
                {showBulkVac && (
                  <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-teal-900 flex items-center gap-2"><ClipboardPaste size={16}/> 엑셀 표 그대로 복사/붙여넣기</span>
                      <button onClick={() => setShowBulkVac(false)} className="text-teal-500 hover:text-teal-800"><X size={16}/></button>
                    </div>
                    <p className="text-xs text-teal-700 mb-3">
                      가로형(Transposed) 엑셀 표를 통째로 복사해서 붙여넣으세요! 날짜 텍스트까지 시스템이 완벽하게 식별합니다.
                    </p>
                    <textarea 
                      className="w-full h-32 border border-teal-300 bg-white p-3 text-sm rounded shadow-inner mb-3 outline-none" 
                      placeholder="여기에 엑셀 표를 붙여넣으세요..."
                      value={bulkVacInput} onChange={e => setBulkVacInput(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button onClick={handleBulkVac} className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-teal-700"><CheckCircle2 size={16}/> 스마트 등록 실행</button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mb-6 bg-gray-50 p-3 rounded-lg border items-center">
                  <input placeholder="VAC ID" className="border p-2 flex-1 rounded text-sm bg-white" value={newVac.id} onChange={e => setNewVac({...newVac, id: e.target.value})}/>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">Part 납품일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newVac.partDate} onChange={e => setNewVac({...newVac, partDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">생산 완료일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newVac.prodDate} onChange={e => setNewVac({...newVac, prodDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">출하 가능일</span><input type="date" className="border p-2 w-32 rounded text-sm bg-white" value={newVac.shipDate} onChange={e => setNewVac({...newVac, shipDate: e.target.value})}/></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold ml-1">Capa</span><input type="number" className="border p-2 w-20 rounded text-sm bg-white" value={newVac.capa} onChange={e => setNewVac({...newVac, capa: e.target.value})}/></div>
                  <div className="flex flex-col justify-end h-full mt-4"><button onClick={addVacRule} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded text-sm font-bold flex items-center gap-1 h-[38px]"><Plus size={16}/> 추가</button></div>
                </div>

                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 border-b">
                      <tr><th className="px-4 py-3 text-gray-600">ID</th><th className="px-4 py-3 text-gray-600">Part 납품일</th><th className="px-4 py-3 text-gray-600">생산 완료일</th><th className="px-4 py-3 text-gray-600">출하 가능일</th><th className="px-4 py-3 text-gray-600">최대 Capa</th><th className="px-4 py-3 text-center text-gray-600">관리</th></tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredVacs.map((vac, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 group transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-800">{vac.id}</td>
                          {editVacId === vac.id ? (
                            <>
                              <td className="px-2 py-2"><input type="date" className="border p-1 text-xs rounded w-full" value={editVacVal.partDate} onChange={e => setEditVacVal({...editVacVal, partDate: e.target.value})} /></td>
                              <td className="px-2 py-2"><input type="date" className="border p-1 text-xs rounded w-full" value={editVacVal.prodDate} onChange={e => setEditVacVal({...editVacVal, prodDate: e.target.value})} /></td>
                              <td className="px-2 py-2"><input type="date" className="border p-1 text-xs rounded w-full" value={editVacVal.shipDate} onChange={e => setEditVacVal({...editVacVal, shipDate: e.target.value})} /></td>
                              <td className="px-2 py-2"><input type="number" className="border p-1 text-xs rounded w-16" value={editVacVal.capa} onChange={e => setEditVacVal({...editVacVal, capa: e.target.value})} /></td>
                              <td className="px-4 py-2 flex justify-center gap-2">
                                <button onClick={() => saveEditedVac(vac.id)} className="text-teal-600 hover:text-teal-800"><CheckCircle2 size={18}/></button>
                                <button onClick={() => setEditVacId(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3 text-gray-600">{vac.partDate}</td>
                              <td className="px-4 py-3 text-gray-600">{vac.prodDate}</td>
                              <td className="px-4 py-3 text-gray-600">{vac.shipDate}</td>
                              <td className="px-4 py-3 text-teal-700 font-bold">{vac.maxCapa}</td>
                              <td className="px-4 py-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditVacId(vac.id); setEditVacVal({ partDate: vac.partDate, prodDate: vac.prodDate, shipDate: vac.shipDate, capa: vac.maxCapa }); }} className="text-gray-400 hover:text-teal-600"><Edit size={16}/></button>
                                <button onClick={() => removeVacRule(vac.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      {filteredVacs.length === 0 && <tr><td colSpan="6" className="text-center py-6 text-gray-400">검색 결과가 없습니다.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}