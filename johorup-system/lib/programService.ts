// Program Service - Integration between Programs and Calendar
import { Program } from './types';

export interface ProgramEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  phase: 'Phase 1' | 'Phase 2' | 'Phase 3';
  sector: string;
  color: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  programType?: string;
  targetSubject?: string;
  targetStudents?: number;
  budget?: number;
  createdBy?: number;
}

// Convert Program to ProgramEvent for calendar display
export const programToEvent = (program: Program): ProgramEvent => {
  // Determine phase based on dates
  const startDate = new Date(program.start_date);
  const phase = getPhaseFromDate(startDate);
  
  // Determine sector based on program type
  const sector = getSectorFromProgramType(program.program_type);
  
  // Determine color based on sector
  const color = getColorFromSector(sector);
  
  // Determine status based on dates
  const status = getStatusFromDates(program.start_date, program.end_date);

  return {
    id: `program-${program.id}`,
    title: program.title,
    description: program.description,
    startDate: program.start_date,
    endDate: program.end_date,
    phase,
    sector,
    color,
    status,
    programType: program.program_type,
    targetSubject: program.target_subject_id?.toString(),
    targetStudents: program.target_students,
    createdBy: program.created_by
  };
};

// Convert ProgramEvent back to Program for saving
export const eventToProgram = (event: ProgramEvent, id?: number): Partial<Program> => {
  return {
    id: id || parseInt(event.id.replace('program-', '')),
    title: event.title,
    description: event.description,
    program_type: event.programType || 'Bimbingan',
    target_subject_id: event.targetSubject ? parseInt(event.targetSubject) : 1,
    start_date: event.startDate,
    end_date: event.endDate,
    created_by: event.createdBy || 1,
    target_students: event.targetStudents
  };
};

// Helper functions
const getPhaseFromDate = (date: Date): 'Phase 1' | 'Phase 2' | 'Phase 3' => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  
  if (year === 2026) {
    if (month >= 1 && month <= 4) return 'Phase 1';
    if (month >= 5 && month <= 9) return 'Phase 2';
    if (month >= 10 && month <= 12) return 'Phase 3';
  }
  
  if (year === 2027 && month <= 4) return 'Phase 3';
  
  return 'Phase 1'; // Default
};

const getSectorFromProgramType = (programType: string): string => {
  const typeMapping: { [key: string]: string } = {
    'Bimbingan': 'SEKTOR PEMBELAJARAN',
    'Kem': 'SEKTOR PEMBANGUNAN MURID',
    'Kelas Tambahan': 'SEKTOR PEMBANGUNAN MURID',
    'Workshop': 'SEKTOR PEMBELAJARAN',
    'Latihan': 'SEKTOR PEMBELAJARAN',
    'Motivasi': 'SEKTOR PEMBANGUNAN MURID',
    'Kerjaya': 'SEKTOR PEMBANGUNAN MURID',
    'Peperiksaan': 'PENILAIAN',
    'Laporan': 'PELAPORAN'
  };
  
  return typeMapping[programType] || 'SEKTOR PEMBELAJARAN';
};

const getColorFromSector = (sector: string): string => {
  const colorMapping: { [key: string]: string } = {
    'SEKTOR PERANCANGAN': 'bg-yellow-200 border-yellow-400',
    'SEKTOR PERANCANGAN DAN PENGURUSAN PPD': 'bg-yellow-200 border-yellow-400',
    'SEKTOR PEMBELAJARAN': 'bg-green-200 border-green-400',
    'SEKTOR PEMBANGUNAN MURID': 'bg-orange-200 border-orange-400',
    'PENILAIAN': 'bg-purple-200 border-purple-400',
    'PELAPORAN': 'bg-red-200 border-red-400'
  };
  
  return colorMapping[sector] || 'bg-blue-200 border-blue-400';
};

const getStatusFromDates = (startDate: string, endDate: string): 'upcoming' | 'ongoing' | 'completed' => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'ongoing';
};

// Sample programs that will appear in calendar (cleared for production)
export const samplePrograms: Program[] = [];

// Get all program events for calendar
export const getProgramEvents = (): ProgramEvent[] => {
  return samplePrograms.map(programToEvent);
};

// Add new program
export const addProgram = (programData: Partial<Program>): Program => {
  const newId = Math.max(...samplePrograms.map(p => p.id), 0) + 1;
  const newProgram: Program = {
    id: newId,
    title: programData.title || '',
    description: programData.description || '',
    program_type: programData.program_type || 'Bimbingan',
    target_subject_id: programData.target_subject_id || 1,
    start_date: programData.start_date || new Date().toISOString().split('T')[0],
    end_date: programData.end_date || new Date().toISOString().split('T')[0],
    created_by: programData.created_by || 1,
    target_students: programData.target_students
  };
  
  samplePrograms.push(newProgram);
  return newProgram;
};

// Get programs by date range
export const getProgramsByDateRange = (startDate: string, endDate: string): Program[] => {
  return samplePrograms.filter(program => {
    const programStart = new Date(program.start_date);
    const programEnd = new Date(program.end_date);
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);
    
    return (programStart <= rangeEnd && programEnd >= rangeStart);
  });
};

// Get programs by phase
export const getProgramsByPhase = (phase: 'Phase 1' | 'Phase 2' | 'Phase 3'): Program[] => {
  return samplePrograms.filter(program => {
    const programPhase = getPhaseFromDate(new Date(program.start_date));
    return programPhase === phase;
  });
};