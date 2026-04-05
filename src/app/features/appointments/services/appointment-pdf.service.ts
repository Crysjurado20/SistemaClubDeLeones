import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

type TurnoPdfData = {
  idCita: number;
  paciente: string;
  cedula: string;
  medico: string;
  especialidad: string;
  fecha: string;
  consultorio: string;
};

@Injectable({ providedIn: 'root' })
export class AppointmentPdfService {
  descargarTurnoPdf(data: TurnoPdfData): void {
    const docDefinition: any = {
      pageMargins: [30, 40, 30, 40],
      content: [
        { text: 'COMPROBANTE DE CITA', fontSize: 14, bold: true, alignment: 'center' },
        {
          text: 'HOSPITAL CLUB DE LEONES - AMBATO',
          fontSize: 10,
          alignment: 'center',
          margin: [0, 2, 0, 14],
        },

        {
          table: {
            widths: ['32%', '*'],
            body: [
              [{ text: 'No. Cita', bold: true }, String(data.idCita)],
              [{ text: 'Paciente', bold: true }, data.paciente || '—'],
              [{ text: 'Cédula', bold: true }, data.cedula || '—'],
              [{ text: 'Médico', bold: true }, data.medico || '—'],
              [{ text: 'Especialidad', bold: true }, data.especialidad || '—'],
              [{ text: 'Fecha / hora', bold: true }, data.fecha || '—'],
              [{ text: 'Consultorio', bold: true }, data.consultorio || '—'],
            ],
          },
          layout: 'lightHorizontalLines',
        },

        {
          text: 'Presenta este comprobante el día de tu cita.',
          fontSize: 9,
          margin: [0, 14, 0, 0],
        },
      ],
      styles: {
        label: { bold: true, fontSize: 10 },
      },
      defaultStyle: {
        font: 'Roboto',
        color: '#000000',
      },
    };

    const pdfMakeInstance = (pdfMake as any).default || pdfMake;
    const fontsInstance = (pdfFonts as any).default || pdfFonts;
    const vfs = fontsInstance.pdfMake ? fontsInstance.pdfMake.vfs : fontsInstance.vfs;

    pdfMakeInstance
      .createPdf(docDefinition, undefined, undefined, vfs)
      .download(`turno-cita-${data.idCita}.pdf`);
  }
}
