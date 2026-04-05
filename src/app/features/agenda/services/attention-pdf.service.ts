import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

export type FichaAtencionPdfData = {
  hospital?: string;
  historiaClinica: string;
  paciente: string;
  cedula: string;
  edad?: string | null;
  medico: string;
  especialidad: string;
  fechaHora: string;
  tipoConsulta?: string | null;
  observaciones?: string | null;
  diagnosticos?: string[] | null;
  medicacion?: Array<{ medicamento: string; dosis: string }> | null;
};

@Injectable({ providedIn: 'root' })
export class AttentionPdfService {
  descargarFichaAtencionPdf(data: FichaAtencionPdfData): void {
    const diagnosticos = (data.diagnosticos ?? []).filter((x) => !!(x ?? '').trim());
    const medicacion = (data.medicacion ?? []).filter((m) => !!(m?.medicamento ?? '').trim() || !!(m?.dosis ?? '').trim());

    const docDefinition: any = {
      pageMargins: [30, 40, 30, 40],
      content: [
        { text: 'FICHA DE ATENCIÓN', fontSize: 14, bold: true, alignment: 'center' },
        {
          text: (data.hospital ?? '').trim() || 'CLUB DE LEONES - AMBATO',
          fontSize: 10,
          alignment: 'center',
          margin: [0, 2, 0, 14],
        },

        { text: 'Datos del paciente', fontSize: 11, bold: true, margin: [0, 0, 0, 6] },
        {
          table: {
            widths: ['30%', '*'],
            body: [
              [{ text: 'Historia clínica', bold: true }, data.historiaClinica || '—'],
              [{ text: 'Paciente', bold: true }, data.paciente || '—'],
              [{ text: 'Cédula', bold: true }, data.cedula || '—'],
              [{ text: 'Edad', bold: true }, (data.edad ?? '').trim() || '—'],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 12],
        },

        { text: 'Atención', fontSize: 11, bold: true, margin: [0, 0, 0, 6] },
        {
          table: {
            widths: ['30%', '*'],
            body: [
              [{ text: 'Médico', bold: true }, data.medico || '—'],
              [{ text: 'Especialidad', bold: true }, data.especialidad || '—'],
              [{ text: 'Fecha / hora', bold: true }, data.fechaHora || '—'],
              [{ text: 'Tipo de consulta', bold: true }, (data.tipoConsulta ?? '').trim() || '—'],
              [{ text: 'Observaciones', bold: true }, (data.observaciones ?? '').trim() || '—'],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 12],
        },

        { text: 'Diagnósticos', fontSize: 11, bold: true, margin: [0, 0, 0, 6] },
        diagnosticos.length
          ? { ul: diagnosticos.map((d) => ({ text: d, fontSize: 10 })) }
          : { text: '—', fontSize: 10, color: '#444444' },

        { text: 'Medicación', fontSize: 11, bold: true, margin: [0, 12, 0, 6] },
        medicacion.length
          ? {
              table: {
                widths: ['60%', '*'],
                body: [
                  [
                    { text: 'Medicamento', bold: true, fillColor: '#eeeeee' },
                    { text: 'Dosis', bold: true, fillColor: '#eeeeee' },
                  ],
                  ...medicacion.map((m) => [m.medicamento || '—', m.dosis || '—']),
                ],
              },
              layout: 'lightHorizontalLines',
            }
          : { text: '—', fontSize: 10, color: '#444444' },

        {
          text: 'Documento generado por el sistema.',
          fontSize: 9,
          color: '#333333',
          margin: [0, 14, 0, 0],
        },
      ],
      defaultStyle: {
        font: 'Roboto',
        color: '#000000',
      },
    };

    const pdfMakeInstance = (pdfMake as any).default || pdfMake;
    const fontsInstance = (pdfFonts as any).default || pdfFonts;
    const vfs = fontsInstance.pdfMake ? fontsInstance.pdfMake.vfs : fontsInstance.vfs;

    const filenameBase = `ficha-atencion-${(data.historiaClinica || 'hc').replaceAll(/\s+/g, '-')}`;
    pdfMakeInstance.createPdf(docDefinition, undefined, undefined, vfs).download(`${filenameBase}.pdf`);
  }
}
