import React from 'react';
import { FileSpreadsheet, Play, Download, AlertCircle, ClipboardPaste, Loader2 } from 'lucide-react';

export default function FcstTab({
  fcstInput, setFcstInput,
  sompInput, setSompInput,
  status, results, analysisResult, optimizationResult,
  expandedGroups, toggleGroup,
  expandedCapaLots, toggleCapaLot,
  processData, runOptimization, downloadExcel,
  deleteCandidate, applyLotChange,
  computeCapaIssues, getHeaders, displayLotId,
}) {
  return (
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
                <ul className="text-xs text-red-700 space-y-1 max-h-40 overflow-y-auto">
                  {analysisResult.deletedCandidates.map((item, i) => (
                    <li key={i} className="flex gap-1 items-center bg-white rounded px-2 py-1 border border-red-100">
                      <span className="font-bold shrink-0">S/N {item.sn}</span>
                      <span className="text-red-300">|</span>
                      <span className="truncate">{item.clientName}</span>
                      <span className="text-red-300">|</span>
                      <span className="text-red-500 shrink-0">{item.partDate || '-'}</span>
                      <button
                        onClick={() => deleteCandidate(item.sn)}
                        className="ml-auto shrink-0 px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold"
                      >삭제</button>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-xs text-red-400">삭제 후보 없음</p>}
              <p className="text-xs text-red-400 mt-2 border-t border-red-200 pt-1">* 이번 FCST에 미포함 — 삭제 버튼으로 즉시 제거 가능</p>
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
              {optimizationResult.totalCapa > 0 && (
                <span className="flex items-center gap-1 text-red-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                  🔴 CAPA초과이동 {optimizationResult.totalCapa}건
                </span>
              )}
              <span className="flex items-center gap-1 text-yellow-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
                개선가능 {optimizationResult.totalImprovable - (optimizationResult.totalCapa || 0)}건
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
                    {group.capaCount > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full font-bold">
                        🔴 CAPA초과이동 {group.capaCount}
                      </span>
                    )}
                    {(group.improveCount - (group.capaCount || 0)) > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full font-bold">
                        ⚡ 개선가능 {group.improveCount - (group.capaCount || 0)}
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
                            {r.type === 'improve' && r.capaFlag && <span title="CAPA 초과 — LOT 이동 필요">🔴</span>}
                            {r.type === 'improve' && !r.capaFlag && !isDateChanged && <span>⚡</span>}
                            {r.type === 'improve' && !r.capaFlag && isDateChanged && <span title="납기변경으로 LOT 재검토 필요">🔄</span>}
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
                            {displayLotId(r.currentLotId)}
                            {r.currentLotId && r.currentLotId.includes('-27-') && <span className="ml-1 text-[9px] bg-blue-100 text-blue-700 rounded px-1 font-bold">'27</span>}
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
                                {displayLotId(r.suggestedLotId)}
                                {r.suggestedLotId && r.suggestedLotId.includes('-27-') && <span className="ml-1 text-[9px] bg-blue-100 text-blue-700 rounded px-1 font-bold">'27</span>}
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
                  const rowStatus = row._status;
                  if (rowStatus === '신규') {
                    rowClass = 'bg-blue-50/70';
                    if (row['비고'] && row['비고'].includes('CAPA초과')) rowClass = 'bg-orange-50';
                    if (row['비고'] && row['비고'].includes('ATM없음')) rowClass = 'bg-red-50';
                  } else if (rowStatus === '납기변경') {
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
                        const cellVal = (key === '배정 LOT' || key === '배정LOT') ? displayLotId(row[key] || '') : (row[key] || '-');
                        return <td key={j} className={tdClass}>{cellVal || '-'}</td>;
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
  );
}
