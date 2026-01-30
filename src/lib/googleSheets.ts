import Papa from 'papaparse';
import { parse } from 'date-fns';

export interface CalendarEvent {
  startDate: Date;
  endDate: Date;
  formattedStartDate: string;
  formattedEndDate: string;
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
              const startDateStr = row['Data inicial'];
              const endDateStr = row['Data final'];
              const sector = row['Setor / Área'];
              const responsible = row['Responsável'];
              const activity = row['Atividade'];
              const status = row['Status'];

              // Skip rows without critical data
              if (!startDateStr || !endDateStr || !sector) return null;

              // Parse dates "DD/MM/YYYY"
              let startDate: Date;
              let endDate: Date;

              try {
                // Parse start date
                if (startDateStr.includes('/')) {
                  startDate = parse(startDateStr, 'dd/MM/yyyy', new Date());
                } else {
                  startDate = new Date(startDateStr);
                }

                // Parse end date
                if (endDateStr.includes('/')) {
                  endDate = parse(endDateStr, 'dd/MM/yyyy', new Date());
                } else {
                  endDate = new Date(endDateStr);
                }
              } catch (e) {
                console.error('Error parsing dates:', startDateStr, endDateStr, e);
                return null;
              }

              return {
                startDate,
                endDate,
                formattedStartDate: startDateStr,
                formattedEndDate: endDateStr,
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
