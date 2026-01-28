import Papa from 'papaparse';
import { parse } from 'date-fns';

export interface CalendarEvent {
  date: Date;
  formattedDate: string; // for easier debugging/display
  sector: string;
  responsible: string;
  activity: string;
  status: 'Não Iniciada' | 'Em Andamento' | 'Cancelada' | 'Finalizada' | string;
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/12CGeY7acJRrVg05eYoNOY7TrO6tg2-FxqKAdnx0s7MU/export?format=csv&gid=0';

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const response = await fetch(SHEET_URL, { cache: 'no-store' });
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const events: CalendarEvent[] = results.data
            .map((row: any) => {
              const dateStr = row['Data final'];
              const sector = row['Setor / Área'];
              const responsible = row['Responsável'];
              const activity = row['Atividade'];
              const status = row['Status'];

              // Skip rows without critical data
              if (!dateStr || !sector) return null;

              // Parse date "DD/MM/YYYY"
              // Adjust format string if needed based on locale, but "dd/MM/yyyy" is standard for BR
              let date: Date;
              try {
                // If the sheet uses slashes
                if (dateStr.includes('/')) {
                   date = parse(dateStr, 'dd/MM/yyyy', new Date());
                } else {
                   // Fallback or generic parser if format varies? 
                   // The prompt said "29/01/2026", so dd/MM/yyyy is expected.
                   date = new Date(dateStr); 
                }
              } catch (e) {
                console.error('Error parsing date:', dateStr, e);
                return null;
              }

              return {
                date,
                formattedDate: dateStr,
                sector,
                responsible,
                activity,
                status,
              };
            })
            .filter((e): e is CalendarEvent => e !== null);

          resolve(events);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Failed to fetch events', error);
    return [];
  } // End try/catch
}
