// Student Transfer Period Utilities

export interface TransferPeriod {
  start: Date;
  end: Date;
  description: string;
}

// Define the allowed transfer period: February 15-28, 2026
export const STUDENT_TRANSFER_PERIOD: TransferPeriod = {
  start: new Date('2026-02-15T00:00:00'),
  end: new Date('2026-02-28T23:59:59'),
  description: 'Tempoh Pertukaran Murid (15 - 28 Februari 2026)'
};

/**
 * Check if current date is within the allowed student transfer period
 * @returns boolean - true if transfers are allowed, false otherwise
 */
export function isStudentTransferAllowed(): boolean {
  const now = new Date();
  return now >= STUDENT_TRANSFER_PERIOD.start && now <= STUDENT_TRANSFER_PERIOD.end;
}

/**
 * Get the transfer period status and relevant information
 * @returns object with status and message information
 */
export function getTransferPeriodStatus() {
  const now = new Date();
  const isAllowed = isStudentTransferAllowed();
  
  if (now < STUDENT_TRANSFER_PERIOD.start) {
    const daysUntilStart = Math.ceil((STUDENT_TRANSFER_PERIOD.start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: 'before' as const,
      isAllowed: false,
      message: `Tempoh pertukaran murid akan bermula pada ${STUDENT_TRANSFER_PERIOD.start.toLocaleDateString('ms-MY')}`,
      daysUntilStart,
      daysRemaining: 0
    };
  }
  
  if (now > STUDENT_TRANSFER_PERIOD.end) {
    return {
      status: 'after' as const,
      isAllowed: false,
      message: 'Tempoh pertukaran murid telah tamat. Tiada pertukaran dibenarkan sehingga analisis keputusan peperiksaan pertengahan tahun selesai.',
      daysUntilStart: 0,
      daysRemaining: 0
    };
  }
  
  const daysRemaining = Math.ceil((STUDENT_TRANSFER_PERIOD.end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return {
    status: 'active' as const,
    isAllowed: true,
    message: `Tempoh pertukaran murid aktif. Baki ${daysRemaining} hari lagi.`,
    daysUntilStart: 0,
    daysRemaining
  };
}

/**
 * Check if a user role is allowed to make student transfers
 * @param userRole - The user's role
 * @returns boolean - true if role can make transfers, false otherwise
 */
export function canUserMakeTransfers(userRole: string): boolean {
  const allowedRoles = ['operational_school', 'operational_teacher'];
  return allowedRoles.includes(userRole);
}

/**
 * Get formatted transfer period dates for display
 * @returns object with formatted start and end dates
 */
export function getFormattedTransferPeriod() {
  return {
    startDate: STUDENT_TRANSFER_PERIOD.start.toLocaleDateString('ms-MY'),
    endDate: STUDENT_TRANSFER_PERIOD.end.toLocaleDateString('ms-MY'),
    startDateTime: STUDENT_TRANSFER_PERIOD.start.toLocaleString('ms-MY'),
    endDateTime: STUDENT_TRANSFER_PERIOD.end.toLocaleString('ms-MY')
  };
}

/**
 * Generate a comprehensive transfer restriction message
 * @param userRole - The user's role
 * @returns string - Detailed message about transfer restrictions
 */
export function getTransferRestrictionMessage(userRole: string): string {
  const canTransfer = canUserMakeTransfers(userRole);
  const periodStatus = getTransferPeriodStatus();
  const dates = getFormattedTransferPeriod();
  
  if (!canTransfer) {
    return 'Peranan anda tidak dibenarkan untuk membuat pertukaran murid.';
  }
  
  if (periodStatus.status === 'before') {
    return `Pertukaran murid hanya dibenarkan dalam tempoh 2 minggu dari ${dates.startDate} hingga ${dates.endDate}. Tempoh pertukaran akan bermula dalam ${periodStatus.daysUntilStart} hari lagi.`;
  }
  
  if (periodStatus.status === 'after') {
    return `Tempoh pertukaran murid telah tamat pada ${dates.endDate}. Tiada pertukaran dibenarkan sehingga analisis keputusan peperiksaan pertengahan tahun selesai.`;
  }
  
  return `Pertukaran murid dibenarkan. Baki ${periodStatus.daysRemaining} hari dalam tempoh pertukaran (sehingga ${dates.endDate}).`;
}