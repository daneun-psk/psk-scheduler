import React from 'react';
import {
  ClipboardPaste, Building2, Cpu, CalendarClock, Plus, Trash2, Edit, X, Search, Upload, Layers, CheckCircle2
} from 'lucide-react';
import ScheduleTable from './ScheduleTable';

export default function MasterTab({
  mappingRules, displayLotId,

  newLine, setNewLine, searchLine, setSearchLine, editLineId, setEditLineId, editLineVal, setEditLineVal,
  showBulkLine, setShowBulkLine, bulkLineInput, setBulkLineInput,
  filteredLines, addLineRule, saveEditedLine, removeLineRule, handleBulkLine,

  newModel, setNewModel, searchModel, setSearchModel, editModelId, setEditModelId, editModelVal, setEditModelVal,
  showBulkModel, setShowBulkModel, bulkModelInput, setBulkModelInput,
  filteredModels, addModelRule, saveEditedModel, removeModelRule, handleBulkModel,

  newAtm, setNewAtm, searchAtm, setSearchAtm, atmYearFilter, setAtmYearFilter,
  editAtmId, setEditAtmId, editAtmVal, setEditAtmVal,
  showBulkAtm, setShowBulkAtm, bulkAtmInput, setBulkAtmInput,
  filteredAtms, addAtmRule, saveEditedAtm, removeAtmRule, handleBulkAtm,

  newVacGeneral, setNewVacGeneral, searchVacGeneral, setSearchVacGeneral, vacGeneralYearFilter, setVacGeneralYearFilter,
  editVacGeneralId, setEditVacGeneralId, editVacGeneralVal, setEditVacGeneralVal,
  showBulkVacGeneral, setShowBulkVacGeneral, bulkVacGeneralInput, setBulkVacGeneralInput,
  filteredVacGenerals, addVacGeneralRule, saveEditedVacGeneral, removeVacGeneralRule, handleBulkVacGeneral,

  newVacDec, setNewVacDec, searchVacDec, setSearchVacDec, vacDecYearFilter, setVacDecYearFilter,
  editVacDecId, setEditVacDecId, editVacDecVal, setEditVacDecVal,
  showBulkVacDec, setShowBulkVacDec, bulkVacDecInput, setBulkVacDecInput,
  filteredVacDecs, addVacDecRule, saveEditedVacDec, removeVacDecRule, handleBulkVacDec,
}) {
  return (
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
          <div className="flex items-center gap-3">
            <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><CalendarClock className="text-green-600" /> ATM 스케줄</h4>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['2026','2027'].map(y => (
                <button key={y} onClick={() => setAtmYearFilter(y)} className={`px-3 py-1 rounded-md text-xs font-bold transition ${atmYearFilter===y ? 'bg-green-600 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}>{y}</button>
              ))}
            </div>
          </div>
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
        <ScheduleTable
          items={filteredAtms} editId={editAtmId} editVal={editAtmVal} setEditVal={setEditAtmVal}
          onEdit={(item) => { setEditAtmId(item.id); setEditAtmVal({ partDate: item.partDate, prodDate: item.prodDate, shipDate: item.shipDate, capa: item.maxCapa }); }}
          onSave={saveEditedAtm} onCancel={() => setEditAtmId(null)} onRemove={removeAtmRule}
          displayLotId={displayLotId}
        />
      </div>

      {/* VAC General 스케줄 */}
      <div className="bg-white rounded-xl shadow border p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><Layers className="text-teal-600" /> VAC General 스케줄</h4>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {['2026','2027'].map(y => (
                  <button key={y} onClick={() => setVacGeneralYearFilter(y)} className={`px-3 py-1 rounded-md text-xs font-bold transition ${vacGeneralYearFilter===y ? 'bg-teal-600 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}>{y}</button>
                ))}
              </div>
            </div>
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
        <ScheduleTable
          items={filteredVacGenerals} editId={editVacGeneralId} editVal={editVacGeneralVal} setEditVal={setEditVacGeneralVal}
          onEdit={(item) => { setEditVacGeneralId(item.id); setEditVacGeneralVal({ partDate: item.partDate, prodDate: item.prodDate, shipDate: item.shipDate, capa: item.maxCapa }); }}
          onSave={saveEditedVacGeneral} onCancel={() => setEditVacGeneralId(null)} onRemove={removeVacGeneralRule}
          displayLotId={displayLotId}
        />
      </div>

      {/* VAC DEC 스케줄 */}
      <div className="bg-white rounded-xl shadow border p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h4 className="font-bold flex items-center gap-2 text-lg text-gray-800"><Layers className="text-purple-600" /> VAC DEC 스케줄</h4>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {['2026','2027'].map(y => (
                  <button key={y} onClick={() => setVacDecYearFilter(y)} className={`px-3 py-1 rounded-md text-xs font-bold transition ${vacDecYearFilter===y ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:bg-gray-200'}`}>{y}</button>
                ))}
              </div>
            </div>
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
        <ScheduleTable
          items={filteredVacDecs} editId={editVacDecId} editVal={editVacDecVal} setEditVal={setEditVacDecVal}
          onEdit={(item) => { setEditVacDecId(item.id); setEditVacDecVal({ partDate: item.partDate, prodDate: item.prodDate, shipDate: item.shipDate, capa: item.maxCapa }); }}
          onSave={saveEditedVacDec} onCancel={() => setEditVacDecId(null)} onRemove={removeVacDecRule}
          displayLotId={displayLotId}
        />
      </div>

    </div>
  );
}
