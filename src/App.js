import React, { useState } from 'react';
import { Bot, CalendarDays, Database, CheckCircle2 } from 'lucide-react';
import FcstTab from './components/FcstTab';
import MasterTab from './components/MasterTab';

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
      { id: 'ATM-140', partDate: '2026-12-17', prodDate: '2027-01-06', shipDate: '2027-01-07', maxCapa: 6 },
      { id: 'ATM-27-101', partDate: '2027-01-05', prodDate: '2027-01-21', shipDate: '2027-01-22', maxCapa: 6 },
      { id: 'ATM-27-102', partDate: '2027-01-13', prodDate: '2027-01-29', shipDate: '2027-02-01', maxCapa: 6 },
      { id: 'ATM-27-103', partDate: '2027-01-21', prodDate: '2027-02-10', shipDate: '2027-02-11', maxCapa: 6 },
      { id: 'ATM-27-104', partDate: '2027-01-29', prodDate: '2027-02-18', shipDate: '2027-02-19', maxCapa: 6 },
      { id: 'ATM-27-105', partDate: '2027-02-10', prodDate: '2027-02-26', shipDate: '2027-03-02', maxCapa: 6 },
      { id: 'ATM-27-106', partDate: '2027-02-18', prodDate: '2027-03-09', shipDate: '2027-03-10', maxCapa: 6 },
      { id: 'ATM-27-107', partDate: '2027-02-26', prodDate: '2027-03-17', shipDate: '2027-03-18', maxCapa: 6 },
      { id: 'ATM-27-108', partDate: '2027-03-09', prodDate: '2027-03-25', shipDate: '2027-03-26', maxCapa: 6 },
      { id: 'ATM-27-109', partDate: '2027-03-17', prodDate: '2027-04-02', shipDate: '2027-04-05', maxCapa: 6 },
      { id: 'ATM-27-110', partDate: '2027-03-25', prodDate: '2027-04-12', shipDate: '2027-04-13', maxCapa: 6 },
      { id: 'ATM-27-111', partDate: '2027-04-02', prodDate: '2027-04-20', shipDate: '2027-04-21', maxCapa: 6 },
      { id: 'ATM-27-112', partDate: '2027-04-12', prodDate: '2027-04-28', shipDate: '2027-04-29', maxCapa: 6 },
      { id: 'ATM-27-113', partDate: '2027-04-20', prodDate: '2027-05-07', shipDate: '2027-05-10', maxCapa: 6 },
      { id: 'ATM-27-114', partDate: '2027-04-28', prodDate: '2027-05-18', shipDate: '2027-05-19', maxCapa: 6 },
      { id: 'ATM-27-115', partDate: '2027-05-07', prodDate: '2027-05-26', shipDate: '2027-05-27', maxCapa: 6 },
      { id: 'ATM-27-116', partDate: '2027-05-18', prodDate: '2027-06-03', shipDate: '2027-06-04', maxCapa: 6 },
      { id: 'ATM-27-117', partDate: '2027-05-26', prodDate: '2027-06-11', shipDate: '2027-06-14', maxCapa: 6 },
      { id: 'ATM-27-118', partDate: '2027-06-03', prodDate: '2027-06-21', shipDate: '2027-06-22', maxCapa: 6 },
      { id: 'ATM-27-119', partDate: '2027-06-11', prodDate: '2027-06-29', shipDate: '2027-06-30', maxCapa: 6 },
      { id: 'ATM-27-120', partDate: '2027-06-21', prodDate: '2027-07-07', shipDate: '2027-07-08', maxCapa: 6 },
      { id: 'ATM-27-121', partDate: '2027-06-29', prodDate: '2027-07-15', shipDate: '2027-07-16', maxCapa: 6 },
      { id: 'ATM-27-122', partDate: '2027-07-07', prodDate: '2027-07-23', shipDate: '2027-07-26', maxCapa: 6 },
      { id: 'ATM-27-123', partDate: '2027-07-15', prodDate: '2027-08-02', shipDate: '2027-08-03', maxCapa: 6 },
      { id: 'ATM-27-124', partDate: '2027-07-23', prodDate: '2027-08-10', shipDate: '2027-08-11', maxCapa: 6 },
      { id: 'ATM-27-125', partDate: '2027-08-02', prodDate: '2027-08-19', shipDate: '2027-08-20', maxCapa: 6 },
      { id: 'ATM-27-126', partDate: '2027-08-10', prodDate: '2027-08-27', shipDate: '2027-08-30', maxCapa: 6 },
      { id: 'ATM-27-127', partDate: '2027-08-19', prodDate: '2027-09-06', shipDate: '2027-09-07', maxCapa: 6 },
      { id: 'ATM-27-128', partDate: '2027-08-27', prodDate: '2027-09-17', shipDate: '2027-09-20', maxCapa: 6 },
      { id: 'ATM-27-129', partDate: '2027-09-06', prodDate: '2027-09-27', shipDate: '2027-09-28', maxCapa: 6 },
      { id: 'ATM-27-130', partDate: '2027-09-17', prodDate: '2027-10-06', shipDate: '2027-10-07', maxCapa: 6 },
      { id: 'ATM-27-131', partDate: '2027-09-27', prodDate: '2027-10-15', shipDate: '2027-10-18', maxCapa: 6 },
      { id: 'ATM-27-132', partDate: '2027-10-06', prodDate: '2027-10-25', shipDate: '2027-10-26', maxCapa: 6 },
      { id: 'ATM-27-133', partDate: '2027-10-15', prodDate: '2027-11-02', shipDate: '2027-11-03', maxCapa: 6 },
      { id: 'ATM-27-134', partDate: '2027-10-25', prodDate: '2027-11-10', shipDate: '2027-11-11', maxCapa: 6 },
      { id: 'ATM-27-135', partDate: '2027-11-02', prodDate: '2027-11-18', shipDate: '2027-11-19', maxCapa: 6 },
      { id: 'ATM-27-136', partDate: '2027-11-10', prodDate: '2027-11-26', shipDate: '2027-11-29', maxCapa: 6 },
      { id: 'ATM-27-137', partDate: '2027-11-18', prodDate: '2027-12-06', shipDate: '2027-12-07', maxCapa: 6 },
      { id: 'ATM-27-138', partDate: '2027-11-26', prodDate: '2027-12-14', shipDate: '2027-12-15', maxCapa: 6 },
      { id: 'ATM-27-139', partDate: '2027-12-06', prodDate: '2027-12-22', shipDate: '2027-12-23', maxCapa: 6 },
      { id: 'ATM-27-140', partDate: '2027-12-14', prodDate: '2027-12-31', shipDate: '2028-01-03', maxCapa: 6 }
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
      { id: 'VAC-226', partDate: '2026-12-04', prodDate: '2026-12-31', shipDate: '2027-01-04', maxCapa: 4 },
      { id: 'VAC-27-201', partDate: '2027-01-05', prodDate: '2027-01-29', shipDate: '2027-02-01', maxCapa: 4 },
      { id: 'VAC-27-202', partDate: '2027-01-18', prodDate: '2027-02-15', shipDate: '2027-02-16', maxCapa: 4 },
      { id: 'VAC-27-203', partDate: '2027-01-29', prodDate: '2027-02-26', shipDate: '2027-03-02', maxCapa: 4 },
      { id: 'VAC-27-204', partDate: '2027-02-15', prodDate: '2027-03-12', shipDate: '2027-03-15', maxCapa: 4 },
      { id: 'VAC-27-205', partDate: '2027-02-26', prodDate: '2027-03-25', shipDate: '2027-03-26', maxCapa: 4 },
      { id: 'VAC-27-206', partDate: '2027-03-12', prodDate: '2027-04-07', shipDate: '2027-04-08', maxCapa: 4 },
      { id: 'VAC-27-207', partDate: '2027-03-25', prodDate: '2027-04-20', shipDate: '2027-04-21', maxCapa: 4 },
      { id: 'VAC-27-208', partDate: '2027-04-07', prodDate: '2027-05-03', shipDate: '2027-05-04', maxCapa: 4 },
      { id: 'VAC-27-209', partDate: '2027-04-20', prodDate: '2027-05-18', shipDate: '2027-05-19', maxCapa: 4 },
      { id: 'VAC-27-210', partDate: '2027-05-03', prodDate: '2027-05-31', shipDate: '2027-06-01', maxCapa: 4 },
      { id: 'VAC-27-211', partDate: '2027-05-18', prodDate: '2027-06-11', shipDate: '2027-06-14', maxCapa: 4 },
      { id: 'VAC-27-212', partDate: '2027-05-31', prodDate: '2027-06-24', shipDate: '2027-06-25', maxCapa: 4 },
      { id: 'VAC-27-213', partDate: '2027-06-11', prodDate: '2027-07-07', shipDate: '2027-07-08', maxCapa: 4 },
      { id: 'VAC-27-214', partDate: '2027-06-24', prodDate: '2027-07-20', shipDate: '2027-07-21', maxCapa: 4 },
      { id: 'VAC-27-215', partDate: '2027-07-07', prodDate: '2027-08-02', shipDate: '2027-08-03', maxCapa: 4 },
      { id: 'VAC-27-216', partDate: '2027-07-20', prodDate: '2027-08-13', shipDate: '2027-08-17', maxCapa: 4 },
      { id: 'VAC-27-217', partDate: '2027-08-02', prodDate: '2027-08-27', shipDate: '2027-08-30', maxCapa: 4 },
      { id: 'VAC-27-218', partDate: '2027-08-13', prodDate: '2027-09-09', shipDate: '2027-09-10', maxCapa: 4 },
      { id: 'VAC-27-219', partDate: '2027-08-27', prodDate: '2027-09-27', shipDate: '2027-09-28', maxCapa: 4 },
      { id: 'VAC-27-220', partDate: '2027-09-09', prodDate: '2027-10-12', shipDate: '2027-10-13', maxCapa: 4 },
      { id: 'VAC-27-221', partDate: '2027-09-27', prodDate: '2027-10-25', shipDate: '2027-10-26', maxCapa: 4 },
      { id: 'VAC-27-222', partDate: '2027-10-12', prodDate: '2027-11-05', shipDate: '2027-11-08', maxCapa: 4 },
      { id: 'VAC-27-223', partDate: '2027-10-25', prodDate: '2027-11-18', shipDate: '2027-11-19', maxCapa: 4 },
      { id: 'VAC-27-224', partDate: '2027-11-05', prodDate: '2027-12-01', shipDate: '2027-12-02', maxCapa: 4 },
      { id: 'VAC-27-225', partDate: '2027-11-18', prodDate: '2027-12-14', shipDate: '2027-12-15', maxCapa: 4 },
      { id: 'VAC-27-226', partDate: '2027-12-01', prodDate: '2027-12-28', shipDate: '2027-12-29', maxCapa: 4 },
      { id: 'VAC-27-227', partDate: '2027-12-14', prodDate: '2028-01-10', shipDate: '2028-01-11', maxCapa: 4 }
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
      { id: 'DEC-225', partDate: '2026-11-23', prodDate: '2027-01-07', shipDate: '2027-01-08', maxCapa: 4 },
      { id: 'DEC-27-201', partDate: '2027-01-05', prodDate: '2027-02-19', shipDate: '2027-02-22', maxCapa: 4 },
      { id: 'DEC-27-203', partDate: '2027-01-29', prodDate: '2027-03-18', shipDate: '2027-03-19', maxCapa: 4 },
      { id: 'DEC-27-205', partDate: '2027-02-26', prodDate: '2027-04-13', shipDate: '2027-04-14', maxCapa: 4 },
      { id: 'DEC-27-207', partDate: '2027-03-25', prodDate: '2027-05-10', shipDate: '2027-05-11', maxCapa: 4 },
      { id: 'DEC-27-209', partDate: '2027-04-20', prodDate: '2027-06-04', shipDate: '2027-06-07', maxCapa: 4 },
      { id: 'DEC-27-211', partDate: '2027-05-18', prodDate: '2027-06-30', shipDate: '2027-07-01', maxCapa: 4 },
      { id: 'DEC-27-213', partDate: '2027-06-11', prodDate: '2027-07-26', shipDate: '2027-07-27', maxCapa: 4 },
      { id: 'DEC-27-215', partDate: '2027-07-07', prodDate: '2027-08-20', shipDate: '2027-08-23', maxCapa: 4 },
      { id: 'DEC-27-217', partDate: '2027-08-02', prodDate: '2027-09-20', shipDate: '2027-09-21', maxCapa: 4 },
      { id: 'DEC-27-219', partDate: '2027-08-27', prodDate: '2027-10-18', shipDate: '2027-10-19', maxCapa: 4 },
      { id: 'DEC-27-221', partDate: '2027-09-27', prodDate: '2027-11-11', shipDate: '2027-11-12', maxCapa: 4 },
      { id: 'DEC-27-223', partDate: '2027-10-25', prodDate: '2027-12-07', shipDate: '2027-12-08', maxCapa: 4 },
      { id: 'DEC-27-225', partDate: '2027-11-18', prodDate: '2027-12-31', shipDate: '2028-01-03', maxCapa: 4 }
    ]
  };

  const mergeLots = (saved, defaults) => {
    const savedIds = new Set((saved || []).map(l => l.id));
    const newFromDefaults = defaults.filter(l => !savedIds.has(l.id));
    return [...(saved || []), ...newFromDefaults].sort((a, b) => new Date(a.partDate) - new Date(b.partDate));
  };

  const [mappingRules, setMappingRules] = useState(() => {
    const saved = localStorage.getItem('pskMasterData_v4');
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed) {
      return {
        ...defaultRules,
        ...parsed,
        atmMaster: mergeLots(parsed.atmMaster, defaultRules.atmMaster),
        vacGeneralMaster: mergeLots(parsed.vacGeneralMaster, defaultRules.vacGeneralMaster),
        vacDecMaster: mergeLots(parsed.vacDecMaster, defaultRules.vacDecMaster),
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
  const displayLotId = (id) => id ? id.replace(/^(ATM|VAC|DEC)-27-/, '$1-') : id;

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

          // 날짜 유효성 확인 — TBD, -, 미정 등 비날짜 값은 미지정 처리
          const isValidDate = (d) => d && /^\d{4}[-./]\d{1,2}[-./]\d{1,2}/.test(d.trim());
          const rawDateNorm = rawDate.replace(/\./g, '-');
          const reqDate = isValidDate(rawDateNorm) ? rawDateNorm : '';
          const isDateUnspecified = rawDate.trim() !== '' && !reqDate; // TBD 등 값은 있지만 날짜 아님
          const prevReqDate = prevDateRaw.replace(/\./g, '-');
          if (inputSN) fcstSNSet.add(inputSN);

          // ── S/N 기반 분류 ──────────────────────────────
          const existingEntries = inputSN ? sompSNMap[inputSN] : null;

          if (existingEntries && existingEntries.length > 0) {
            const existingDate = existingEntries[0].partDate;
            const normExisting = normDate(existingDate);
            const normReq = normDate(reqDate);
            const existingWasUnspecified = !normExisting || existingDate === '미지정';

            // 기존 행의 LOT을 납기 기준으로 재배정 (연도 교체 대응)
            const reassignLotIfNeeded = (eRow, rDate) => {
              if (!rDate) return;
              const currentLotId = eRow['배정 LOT'] || '';
              const allLotPool = [
                ...mappingRules.atmMaster,
                ...(mappingRules.vacGeneralMaster || []),
                ...(mappingRules.vacDecMaster || []),
              ];
              const currentLot = allLotPool.find(l => l.id === currentLotId);
              if (!currentLot) return;
              // 어떤 pool인지 판단
              let pool = null;
              if (currentLotId.startsWith('ATM-')) pool = mappingRules.atmMaster;
              else if (currentLotId.startsWith('VAC-')) pool = mappingRules.vacGeneralMaster || [];
              else if (currentLotId.startsWith('DEC-')) pool = mappingRules.vacDecMaster || [];
              if (!pool) return;
              const rdObj = new Date(rDate); rdObj.setHours(0,0,0,0);
              let bestLot = null;
              for (let j = pool.length - 1; j >= 0; j--) {
                const l = pool[j];
                if (!l.shipDate) continue;
                const sd = new Date(l.shipDate); sd.setHours(0,0,0,0);
                if (sd <= rdObj) { bestLot = l; break; }
              }
              if (bestLot && bestLot.id !== currentLotId) {
                eRow['배정 LOT'] = bestLot.id;
                eRow['납품일'] = bestLot.partDate;
                eRow['생산완료일'] = bestLot.prodDate;
                eRow['출하가능일'] = bestLot.shipDate;
              }
            };

            if (normExisting === normReq) {
              // 완전 유지 (날짜 동일) — LOT은 납기 기준 최적으로 재배정
              unchangedCount += qty;
              existingEntries.forEach(e => {
                existingData[e.idx]._status = '유지';
                const bigo = existingData[e.idx]['비고'] || '';
                if (!bigo.includes('[납기:') && reqDate) {
                  existingData[e.idx]['비고'] = `[납기:${reqDate}]` + (bigo.trim() ? ` ${bigo}` : '');
                }
                reassignLotIfNeeded(existingData[e.idx], reqDate);
              });
            } else if (existingWasUnspecified && reqDate) {
              // 미지정 → 날짜 확정: 기존 행에 LOT 배정 및 날짜 업데이트
              const reqDateObj = new Date(reqDate);
              reqDateObj.setHours(0, 0, 0, 0);
              let matchedAtm = null;
              for (let j = mappingRules.atmMaster.length - 1; j >= 0; j--) {
                const atm = mappingRules.atmMaster[j];
                if (!atm.shipDate) continue;
                const shipObj = new Date(atm.shipDate);
                shipObj.setHours(0, 0, 0, 0);
                if (shipObj <= reqDateObj) { matchedAtm = atm; break; }
              }
              existingEntries.forEach(e => {
                existingData[e.idx]._status = '납기변경';
                let prevBigo = existingData[e.idx]['비고'] || '';
                prevBigo = prevBigo.replace(/\[납기:[^\]]*\]/, `[납기:${reqDate}]`);
                if (!prevBigo.includes('[납기:')) prevBigo = `[납기:${reqDate}]` + (prevBigo.trim() ? ` ${prevBigo}` : '');
                existingData[e.idx]['비고'] = prevBigo;
                if (matchedAtm) {
                  existingData[e.idx]['배정 LOT'] = matchedAtm.id;
                  existingData[e.idx]['납품일'] = matchedAtm.partDate;
                  existingData[e.idx]['생산완료일'] = matchedAtm.prodDate;
                  existingData[e.idx]['출하가능일'] = matchedAtm.shipDate;
                  const currentLoad = atmLoad[matchedAtm.id] + 1;
                  atmLoad[matchedAtm.id] = currentLoad;
                }
              });
              changedItems.push({ sn: inputSN, oldDate: '미지정', newDate: normReq, clientName, fabName, model: modelInfo.model });
            } else if (!normExisting && !reqDate) {
              // 양쪽 모두 날짜 없음 → 유지
              unchangedCount += qty;
              existingEntries.forEach(e => { existingData[e.idx]._status = '유지'; });
            } else if (normExisting && normReq && normExisting !== normReq) {
              // 실제 납기변경 — LOT도 새 납기 기준으로 재배정
              changedItems.push({ sn: inputSN, oldDate: normExisting, newDate: normReq, clientName, fabName, model: modelInfo.model });
              existingEntries.forEach(e => {
                existingData[e.idx]._status = '납기변경';
                let prevBigo = existingData[e.idx]['비고'] || '';
                if (prevBigo.includes('[납기:')) {
                  prevBigo = prevBigo.replace(/\[납기:[^\]]*\]/, `[납기:${reqDate}]`);
                } else {
                  prevBigo = `[납기:${reqDate}]` + (prevBigo.trim() ? ` ${prevBigo}` : '');
                }
                existingData[e.idx]['비고'] = prevBigo;
                reassignLotIfNeeded(existingData[e.idx], reqDate);
              });
            } else {
              // normExisting 있고 reqDate 없음(미지정으로 변경) → 유지
              unchangedCount += qty;
              existingEntries.forEach(e => { existingData[e.idx]._status = '유지'; });
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

            // 비고: [S/N:xxx] [납기:YYYY-MM-DD 또는 미지정] (나머지는 대시보드)
            const bigoArr = [];
            if (inputSN) bigoArr.push(`[S/N:${inputSN}]`);
            if (reqDate) bigoArr.push(`[납기:${reqDate}]`);
            else bigoArr.push('[납기:미지정]'); // TBD 등 날짜 미확정
            if (capaWarning) bigoArr.push(capaWarning);

            newItems.push({
              'W/O': '', 'OEC 상': '', 'Ref.Tool': '', '수정일시': '', '수정자': '',
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
        items: lot.items.map(item => {
          const customerReqDate = extractNakgi(item['비고']) || '';
          const gap = (lot.shipDate && customerReqDate)
            ? Math.floor((new Date(customerReqDate) - new Date(lot.shipDate)) / 86400000)
            : null;
          return {
            clientName: item['고객사'] || '-',
            model: item['모델'] || '-',
            reqDate: customerReqDate || item['납품일'] || '-',
            sn: extractSN(item['비고']),
            gap,
          };
        }).sort((a, b) => (a.gap ?? 0) - (b.gap ?? 0)),
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

  const deleteCandidate = (sn) => {
    setResults(prev => prev.filter(row => extractSN(row['비고']) !== sn));
    setAnalysisResult(prev => prev ? {
      ...prev,
      deletedCandidates: prev.deletedCandidates.filter(c => c.sn !== sn),
    } : prev);
  };

  const applyLotChange = (sn, suggestedLotId) => {
    const allLots = [
      ...mappingRules.atmMaster,
      ...(mappingRules.vacGeneralMaster || []),
      ...(mappingRules.vacDecMaster || []),
    ];
    const newLot = allLots.find(l => l.id === suggestedLotId);
    if (!newLot) return;

    const movedResults = results.map(row => {
      const rowSN = extractSN(row['비고']);
      if (rowSN !== sn) return row;
      const prevBigo = row['비고'] || '';
      return {
        ...row,
        '배정 LOT': suggestedLotId,
        '납품일': newLot.partDate,
        '생산완료일': newLot.prodDate,
        '출하가능일': newLot.shipDate,
        '비고': prevBigo.replace(/\s*CAPA초과\(\d+\/\d+\)/g, '').trim(),
        _status: row._status === '납기변경' ? '납기변경' : '재배정',
      };
    });

    // LOT별 실제 load 재계산 후 비고의 CAPA초과 텍스트 전체 동기화
    const lotMap = {};
    allLots.forEach(l => { lotMap[l.id] = { maxCapa: l.maxCapa, used: 0 }; });
    movedResults.forEach(row => {
      const lid = row['배정 LOT'] || row['배정LOT'];
      if (lid && lotMap[lid]) lotMap[lid].used++;
    });
    // 순서대로 순회하며 누적 카운트로 비고 재기록
    const lotCounter = {};
    const updatedResults = movedResults.map(row => {
      const lid = row['배정 LOT'] || row['배정LOT'];
      if (!lid || !lotMap[lid]) return row;
      lotCounter[lid] = (lotCounter[lid] || 0) + 1;
      const { maxCapa } = lotMap[lid];
      const bigo = (row['비고'] || '').replace(/\s*CAPA초과\(\d+\/\d+\)/g, '').trim();
      if (lotCounter[lid] > maxCapa) {
        return { ...row, '비고': `${bigo} CAPA초과(${lotCounter[lid]}/${maxCapa})`.trim() };
      }
      return { ...row, '비고': bigo };
    });

    setResults(updatedResults);
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

        const currentLoad = loadMap[currentLotId];
        const isCapaOver = currentLoad && currentLoad.used > (currentLot?.maxCapa || 0);
        const currentGap = currentShipObj
          ? Math.floor((reqDateObj - currentShipObj) / 86400000) : null;

        // 현재 LOT 납기 초과
        if (currentShipObj && currentShipObj > reqDateObj) {
          const altInTime = pool.filter(lot => {
            const sd = new Date(lot.shipDate);
            return sd <= reqDateObj && lot.id !== currentLotId && loadMap[lot.id] && loadMap[lot.id].used < lot.maxCapa;
          });
          if (altInTime.length > 0) {
            const altLot = altInTime.reduce((best, lot) =>
              new Date(lot.shipDate) > new Date(best.shipDate) ? lot : best
            );
            return {
              type: 'improve', capaFlag: false, sn, currentLotId, currentShipDate,
              suggestedLotId: altLot.id, suggestedShipDate: altLot.shipDate,
              currentGap, optimalGap: Math.floor((reqDateObj - new Date(altLot.shipDate)) / 86400000),
              reqDate, isDateChanged,
            };
          }
          return { type: 'invalid', sn, currentLotId, currentShipDate, reqDate, isDateChanged,
            msg: `출하일(${currentShipDate}) > 납기(${reqDate}) — 대안 LOT 없음` };
        }

        // CAPA 초과 → 여유 있는 LOT으로 이동 필요
        if (isCapaOver) {
          // 납기 내 여유 LOT 우선
          const altInTime = pool.filter(lot => {
            const sd = new Date(lot.shipDate);
            return sd <= reqDateObj && lot.id !== currentLotId && loadMap[lot.id] && loadMap[lot.id].used < lot.maxCapa;
          });
          if (altInTime.length > 0) {
            const altLot = altInTime.reduce((best, lot) =>
              new Date(lot.shipDate) > new Date(best.shipDate) ? lot : best
            );
            return {
              type: 'improve', capaFlag: true, sn, currentLotId, currentShipDate,
              suggestedLotId: altLot.id, suggestedShipDate: altLot.shipDate,
              currentGap, optimalGap: Math.floor((reqDateObj - new Date(altLot.shipDate)) / 86400000),
              reqDate, isDateChanged,
            };
          }
          // 납기 내 여유 없음 → 다음 LOT (납기 이후라도)
          const altAfter = pool.filter(lot =>
            lot.id !== currentLotId && loadMap[lot.id] && loadMap[lot.id].used < lot.maxCapa
          );
          if (altAfter.length > 0) {
            const altLot = altAfter.reduce((best, lot) =>
              Math.abs(new Date(lot.shipDate) - reqDateObj) < Math.abs(new Date(best.shipDate) - reqDateObj) ? lot : best
            );
            const altGap = Math.floor((reqDateObj - new Date(altLot.shipDate)) / 86400000);
            return {
              type: 'improve', capaFlag: true, sn, currentLotId, currentShipDate,
              suggestedLotId: altLot.id, suggestedShipDate: altLot.shipDate,
              currentGap, optimalGap: altGap,
              reqDate, isDateChanged,
            };
          }
          return { type: 'invalid', sn, currentLotId, currentShipDate, reqDate, isDateChanged,
            msg: 'CAPA 초과 — 여유 LOT 없음' };
        }

        // 납기 내 여유 있는 LOT 중 최적 탐색
        const eligible = pool.filter(lot => {
          const sd = new Date(lot.shipDate);
          const hasRoom = loadMap[lot.id] && (lot.id === currentLotId || loadMap[lot.id].used < lot.maxCapa);
          return sd <= reqDateObj && hasRoom;
        });

        if (eligible.length === 0) {
          return { type: 'invalid', sn, currentLotId, currentShipDate, reqDate, isDateChanged, msg: '가용 LOT 없음' };
        }

        const optimalLot = eligible.reduce((best, lot) =>
          new Date(lot.shipDate) > new Date(best.shipDate) ? lot : best
        );
        const optimalGap = Math.floor((reqDateObj - new Date(optimalLot.shipDate)) / 86400000);

        if (optimalLot.id !== currentLotId) {
          return {
            type: 'improve', capaFlag: false, sn, currentLotId, currentShipDate,
            suggestedLotId: optimalLot.id, suggestedShipDate: optimalLot.shipDate,
            currentGap, optimalGap, gapReduction: (currentGap ?? 0) - optimalGap,
            reqDate, isDateChanged,
          };
        }

        return { type: 'optimal', sn, currentLotId, currentShipDate, currentGap, reqDate, isDateChanged };
      });

      return {
        key, clientName, modelName, items: itemResults,
        invalidCount: itemResults.filter(r => r.type === 'invalid').length,
        improveCount: itemResults.filter(r => r.type === 'improve').length,
        capaCount: itemResults.filter(r => r.type === 'improve' && r.capaFlag).length,
        dateChangeCount: itemResults.filter(r => r.isDateChanged && r.type !== 'optimal').length,
        optimalCount: itemResults.filter(r => r.type === 'optimal').length,
      };
    }).sort((a, b) => (b.invalidCount * 100 + b.dateChangeCount * 10 + b.improveCount) - (a.invalidCount * 100 + a.dateChangeCount * 10 + a.improveCount));

    setOptimizationResult({
      groups: groupResults,
      totalInvalid: groupResults.reduce((s, g) => s + g.invalidCount, 0),
      totalImprovable: groupResults.reduce((s, g) => s + g.improveCount, 0),
      totalCapa: groupResults.reduce((s, g) => s + g.capaCount, 0),
      totalDateChange: groupResults.reduce((s, g) => s + g.dateChangeCount, 0),
      totalOptimal: groupResults.reduce((s, g) => s + g.optimalCount, 0),
    });
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

      const fixedCols = [
        { header: 'W/O',       key: 'W/O',       width: 18 },
        { header: 'S/N',       key: 'S/N',        width: 14 },
        { header: '그룹',      key: '그룹',       width: 8  },
        { header: '고객사',    key: '고객사',     width: 22 },
        { header: 'FAB',       key: 'FAB',        width: 20 },
        { header: 'PM',        key: 'PM',         width: 10 },
        { header: '모델',      key: '모델',       width: 20 },
        { header: '배정 LOT',  key: '배정 LOT',   width: 12 },
        { header: 'OEC 상',    key: 'OEC 상',     width: 10 },
        { header: 'Ref.Tool',  key: 'Ref.Tool',   width: 12 },
        { header: '비고',      key: '비고',       width: 35 },
        { header: '납품일',    key: '납품일',     width: 13 },
        { header: '생산완료일', key: '생산완료일', width: 13 },
        { header: '출하가능일', key: '출하가능일', width: 13 },
        { header: '수정일시',  key: '수정일시',   width: 16 },
        { header: '수정자',    key: '수정자',     width: 10 },
      ];
      worksheet.columns = fixedCols;

      results.forEach(row => {
        worksheet.addRow({
          'W/O':       row['W/O'] || '',
          'S/N':       '',
          '그룹':      row['그룹'] || '',
          '고객사':    row['고객사'] || '',
          'FAB':       row['FAB'] || '',
          'PM':        row['PM'] || '',
          '모델':      row['모델'] || '',
          '배정 LOT':  displayLotId(row['배정 LOT'] || row['배정LOT'] || ''),
          'OEC 상':    row['OEC 상'] || '',
          'Ref.Tool':  row['Ref.Tool'] || '',
          '비고':      row['비고'] || '',
          '납품일':    row['납품일'] || '',
          '생산완료일': row['생산완료일'] || '',
          '출하가능일': row['출하가능일'] || '',
          '수정일시':  row['수정일시'] || '',
          '수정자':    row['수정자'] || '',
        });
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

      worksheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: results.length + 1, column: fixedCols.length } };

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
  const [atmYearFilter, setAtmYearFilter] = useState('2027');
  const [editAtmId, setEditAtmId] = useState(null);
  const [editAtmVal, setEditAtmVal] = useState({ partDate: '', prodDate: '', shipDate: '', capa: 6 });
  const [showBulkAtm, setShowBulkAtm] = useState(false);
  const [bulkAtmInput, setBulkAtmInput] = useState('');

  // VAC General
  const [newVacGeneral, setNewVacGeneral] = useState({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 4 });
  const [searchVacGeneral, setSearchVacGeneral] = useState('');
  const [vacGeneralYearFilter, setVacGeneralYearFilter] = useState('2027');
  const [editVacGeneralId, setEditVacGeneralId] = useState(null);
  const [editVacGeneralVal, setEditVacGeneralVal] = useState({ partDate: '', prodDate: '', shipDate: '', capa: 4 });
  const [showBulkVacGeneral, setShowBulkVacGeneral] = useState(false);
  const [bulkVacGeneralInput, setBulkVacGeneralInput] = useState('');

  // VAC DEC
  const [newVacDec, setNewVacDec] = useState({ id: '', partDate: '', prodDate: '', shipDate: '', capa: 4 });
  const [searchVacDec, setSearchVacDec] = useState('');
  const [vacDecYearFilter, setVacDecYearFilter] = useState('2027');
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
  const applyYearFilter = (items, yearFilter) => {
    if (yearFilter === '2026') return items.filter(i => !i.id.includes('-27-'));
    return items.filter(i => i.id.includes('-27-'));
  };
  const filteredAtms = applyYearFilter(mappingRules.atmMaster, atmYearFilter).filter(atm => atm.id.toLowerCase().includes(searchAtm.toLowerCase()));
  const filteredVacGenerals = applyYearFilter(mappingRules.vacGeneralMaster || [], vacGeneralYearFilter).filter(v => v.id.toLowerCase().includes(searchVacGeneral.toLowerCase()));
  const filteredVacDecs = applyYearFilter(mappingRules.vacDecMaster || [], vacDecYearFilter).filter(v => v.id.toLowerCase().includes(searchVacDec.toLowerCase()));

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
            <FcstTab
              fcstInput={fcstInput} setFcstInput={setFcstInput}
              sompInput={sompInput} setSompInput={setSompInput}
              status={status} results={results} analysisResult={analysisResult} optimizationResult={optimizationResult}
              expandedGroups={expandedGroups} toggleGroup={toggleGroup}
              expandedCapaLots={expandedCapaLots} toggleCapaLot={toggleCapaLot}
              processData={processData} runOptimization={runOptimization} downloadExcel={downloadExcel}
              deleteCandidate={deleteCandidate} applyLotChange={applyLotChange}
              computeCapaIssues={computeCapaIssues} getHeaders={getHeaders} displayLotId={displayLotId}
            />
          ) : (
            <MasterTab
              mappingRules={mappingRules} displayLotId={displayLotId}

              newLine={newLine} setNewLine={setNewLine} searchLine={searchLine} setSearchLine={setSearchLine}
              editLineId={editLineId} setEditLineId={setEditLineId} editLineVal={editLineVal} setEditLineVal={setEditLineVal}
              showBulkLine={showBulkLine} setShowBulkLine={setShowBulkLine} bulkLineInput={bulkLineInput} setBulkLineInput={setBulkLineInput}
              filteredLines={filteredLines} addLineRule={addLineRule} saveEditedLine={saveEditedLine} removeLineRule={removeLineRule} handleBulkLine={handleBulkLine}

              newModel={newModel} setNewModel={setNewModel} searchModel={searchModel} setSearchModel={setSearchModel}
              editModelId={editModelId} setEditModelId={setEditModelId} editModelVal={editModelVal} setEditModelVal={setEditModelVal}
              showBulkModel={showBulkModel} setShowBulkModel={setShowBulkModel} bulkModelInput={bulkModelInput} setBulkModelInput={setBulkModelInput}
              filteredModels={filteredModels} addModelRule={addModelRule} saveEditedModel={saveEditedModel} removeModelRule={removeModelRule} handleBulkModel={handleBulkModel}

              newAtm={newAtm} setNewAtm={setNewAtm} searchAtm={searchAtm} setSearchAtm={setSearchAtm}
              atmYearFilter={atmYearFilter} setAtmYearFilter={setAtmYearFilter}
              editAtmId={editAtmId} setEditAtmId={setEditAtmId} editAtmVal={editAtmVal} setEditAtmVal={setEditAtmVal}
              showBulkAtm={showBulkAtm} setShowBulkAtm={setShowBulkAtm} bulkAtmInput={bulkAtmInput} setBulkAtmInput={setBulkAtmInput}
              filteredAtms={filteredAtms} addAtmRule={addAtmRule} saveEditedAtm={saveEditedAtm} removeAtmRule={removeAtmRule} handleBulkAtm={handleBulkAtm}

              newVacGeneral={newVacGeneral} setNewVacGeneral={setNewVacGeneral} searchVacGeneral={searchVacGeneral} setSearchVacGeneral={setSearchVacGeneral}
              vacGeneralYearFilter={vacGeneralYearFilter} setVacGeneralYearFilter={setVacGeneralYearFilter}
              editVacGeneralId={editVacGeneralId} setEditVacGeneralId={setEditVacGeneralId} editVacGeneralVal={editVacGeneralVal} setEditVacGeneralVal={setEditVacGeneralVal}
              showBulkVacGeneral={showBulkVacGeneral} setShowBulkVacGeneral={setShowBulkVacGeneral} bulkVacGeneralInput={bulkVacGeneralInput} setBulkVacGeneralInput={setBulkVacGeneralInput}
              filteredVacGenerals={filteredVacGenerals} addVacGeneralRule={addVacGeneralRule} saveEditedVacGeneral={saveEditedVacGeneral} removeVacGeneralRule={removeVacGeneralRule} handleBulkVacGeneral={handleBulkVacGeneral}

              newVacDec={newVacDec} setNewVacDec={setNewVacDec} searchVacDec={searchVacDec} setSearchVacDec={setSearchVacDec}
              vacDecYearFilter={vacDecYearFilter} setVacDecYearFilter={setVacDecYearFilter}
              editVacDecId={editVacDecId} setEditVacDecId={setEditVacDecId} editVacDecVal={editVacDecVal} setEditVacDecVal={setEditVacDecVal}
              showBulkVacDec={showBulkVacDec} setShowBulkVacDec={setShowBulkVacDec} bulkVacDecInput={bulkVacDecInput} setBulkVacDecInput={setBulkVacDecInput}
              filteredVacDecs={filteredVacDecs} addVacDecRule={addVacDecRule} saveEditedVacDec={saveEditedVacDec} removeVacDecRule={removeVacDecRule} handleBulkVacDec={handleBulkVacDec}
            />
          )}
        </div>
      </main>
    </div>
  );
}
