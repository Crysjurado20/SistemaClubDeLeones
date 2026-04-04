import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  generarComprobanteCitaPdf(data: {
    medico: string;
    especialidad: string;
    paciente: string;
    cedula: string;
    historiaClinica: string;
    fecha: string;
    metodoPago: string;
    qrDataUrl?: string | null;
  }) {
    const docDefinition: any = {
      pageMargins: [30, 40, 30, 40],
      content: [
        { text: 'COMPROBANTE DE CITA', fontSize: 14, bold: true, alignment: 'center' },
        { text: 'CLUB DE LEONES - AMBATO', fontSize: 10, alignment: 'center', margin: [0, 2, 0, 14] },

        {
          table: {
            widths: ['30%', '*'],
            body: [
              [{ text: 'Paciente', bold: true }, data.paciente],
              [{ text: 'Cédula', bold: true }, data.cedula],
              [{ text: 'Historia clínica', bold: true }, data.historiaClinica],
              [{ text: 'Médico', bold: true }, data.medico],
              [{ text: 'Especialidad', bold: true }, data.especialidad],
              [{ text: 'Fecha / hora', bold: true }, data.fecha],
              [{ text: 'Método de pago', bold: true }, data.metodoPago],
            ],
          },
          layout: 'lightHorizontalLines',
        },

        data.qrDataUrl
          ? {
              text: 'Código QR',
              bold: true,
              alignment: 'center',
              margin: [0, 12, 0, 6],
            }
          : { text: '' },

        data.qrDataUrl
          ? {
              image: data.qrDataUrl,
              width: 160,
              alignment: 'center',
              margin: [0, 0, 0, 0],
            }
          : { text: '' },

        {
          text: 'Documento generado por el sistema de agendamiento.',
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
    return pdfMakeInstance.createPdf(docDefinition, undefined, undefined, vfs);
  }

  generarFacturaPdf(factura: any, nombrePaciente: string) {
    const docDefinition: any = {
      pageMargins: [30, 40, 30, 40],
      
      content: [

        {
          columns: [
            // Izquierda: Datos de la Empresa
            {
              width: '*',
              stack: [
                { text: 'CLUB DE LEONES - AMBATO', style: 'empresaTitulo' },
                { text: 'RUC: 1790000000001', style: 'empresaDatos' },
                { text: 'Dir: Av. Atahualpa y Av. Víctor Hugo', style: 'empresaDatos' },
                { text: 'Teléfono: (03) 299-9999', style: 'empresaDatos' },
                { text: 'OBLIGADO A LLEVAR CONTABILIDAD: SÍ', style: 'empresaDatos', margin: [0, 5, 0, 0] }
              ]
            },
            {
              width: 220,
              table: {
                widths: ['*'],
                body: [
                  [
                    {
                      border: [true, true, true, true],
                      stack: [
                        { text: 'FACTURA', style: 'facturaTitulo', alignment: 'center' },
                        { text: `No. ${factura.numeroFactura}`, style: 'facturaNumero', alignment: 'center' },
                        { text: `Fecha de Emisión: ${factura.fechaEmision}`, style: 'facturaDatos', alignment: 'center', margin: [0, 5, 0, 0] },
                        { text: 'CLAVE DE ACCESO:', style: 'facturaDatos', alignment: 'center', margin: [0, 5, 0, 0], bold: true },
                        { text: '15032026011790000000001...', style: 'facturaDatos', alignment: 'center', fontSize: 7 }
                      ],
                      margin: [5, 5, 5, 5]
                    }
                  ]
                ]
              }
            }
          ],
          margin: [0, 0, 0, 15]
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  border: [true, true, true, true],
                  stack: [
                    {
                      columns: [
                        { width: '15%', text: 'Cliente:', bold: true, fontSize: 10 },
                        { width: '45%', text: nombrePaciente, fontSize: 10 },
                        { width: '15%', text: 'Cédula/RUC:', bold: true, fontSize: 10 },
                        { width: '25%', text: '1800000000', fontSize: 10 }
                      ],
                      margin: [2, 2, 2, 2]
                    },
                    {
                      columns: [
                        { width: '15%', text: 'Dirección:', bold: true, fontSize: 10 },
                        { width: '45%', text: 'Centro de Ambato', fontSize: 10 },
                        { width: '15%', text: 'Teléfono:', bold: true, fontSize: 10 },
                        { width: '25%', text: '0999999999', fontSize: 10 }
                      ],
                      margin: [2, 2, 2, 2]
                    }
                  ]
                }
              ]
            ]
          },
          margin: [0, 0, 0, 15]
        },
        {
          style: 'tablaDetalles',
          table: {
            headerRows: 1,
            widths: [50, '*', 70, 70], 
            body: [
              [
                { text: 'CANTIDAD', style: 'tablaCabecera', alignment: 'center' },
                { text: 'DESCRIPCIÓN', style: 'tablaCabecera', alignment: 'center' },
                { text: 'V. UNITARIO', style: 'tablaCabecera', alignment: 'center' },
                { text: 'VALOR TOTAL', style: 'tablaCabecera', alignment: 'center' }
              ],
              // Datos
              [
                { text: '1', alignment: 'center', margin: [0, 5, 0, 5] },
                { text: `${factura.especialidad}\n(Médico: ${factura.medico})`, margin: [0, 5, 0, 5] },
                { text: `$${factura.total.toFixed(2)}`, alignment: 'right', margin: [0, 5, 0, 5] },
                { text: `$${factura.total.toFixed(2)}`, alignment: 'right', margin: [0, 5, 0, 5] }
              ]
            ]
          }
        },

        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  table: {
                    widths: [150, 70],
                    body: [
                      [{ text: 'FORMA DE PAGO', style: 'tablaCabecera', alignment: 'center' }, { text: 'VALOR', style: 'tablaCabecera', alignment: 'center' }],
                      [{ text: 'EFECTIVO - SIN UTILIZACIÓN DEL SISTEMA FINANCIERO', fontSize: 8, margin: [2, 2] }, { text: `$${factura.total.toFixed(2)}`, fontSize: 9, alignment: 'right', margin: [2, 2] }]
                    ]
                  },
                  margin: [0, 0, 20, 10]
                },
                { text: 'OBSERVACIONES:', bold: true, fontSize: 9 },
                { text: 'Consulta médica de especialidad. Documento sin valor tributario impreso, válido únicamente en su versión electrónica XML.', fontSize: 8, color: '#333333' }
              ],
              margin: [0, 15, 0, 0]
            },
            {
              width: 180,
              table: {
                widths: ['*', 70],
                body: [
                  [{ text: 'SUBTOTAL 15%', fontSize: 9, margin: [2, 2] }, { text: '$0.00', fontSize: 9, alignment: 'right', margin: [2, 2] }],
                  [{ text: 'SUBTOTAL 0%', fontSize: 9, margin: [2, 2] }, { text: `$${factura.total.toFixed(2)}`, fontSize: 9, alignment: 'right', margin: [2, 2] }],
                  [{ text: 'SUBTOTAL No objeto de IVA', fontSize: 9, margin: [2, 2] }, { text: '$0.00', fontSize: 9, alignment: 'right', margin: [2, 2] }],
                  [{ text: 'DESCUENTO', fontSize: 9, margin: [2, 2] }, { text: '$0.00', fontSize: 9, alignment: 'right', margin: [2, 2] }],
                  [{ text: 'IVA 15%', fontSize: 9, margin: [2, 2] }, { text: '$0.00', fontSize: 9, alignment: 'right', margin: [2, 2] }],
                  [
                    { text: 'VALOR TOTAL', bold: true, fontSize: 10, margin: [2, 2] }, 
                    { text: `$${factura.total.toFixed(2)}`, bold: true, fontSize: 10, alignment: 'right', margin: [2, 2] }
                  ]
                ]
              },
              margin: [0, 15, 0, 0]
            }
          ]
        }
      ],

      styles: {
        empresaTitulo: { fontSize: 14, bold: true, color: '#000000', marginBottom: 2 },
        empresaDatos: { fontSize: 9, color: '#000000', lineHeight: 1.2 },
        facturaTitulo: { fontSize: 12, bold: true, color: '#000000', marginBottom: 2 },
        facturaNumero: { fontSize: 11, bold: true, color: '#000000' },
        facturaDatos: { fontSize: 9, color: '#000000', lineHeight: 1.1 },
        tablaCabecera: {
          bold: true,
          fontSize: 9,
          color: '#000000',
          fillColor: '#eeeeee', 
          margin: [0, 4, 0, 4]
        },
        tablaDetalles: { fontSize: 9, margin: [0, 0, 0, 0] }
      },
      defaultStyle: {
        font: 'Roboto', 
        color: '#000000' 
      }
    };

    const pdfMakeInstance = (pdfMake as any).default || pdfMake;
    const fontsInstance = (pdfFonts as any).default || pdfFonts;
    const vfs = fontsInstance.pdfMake ? fontsInstance.pdfMake.vfs : fontsInstance.vfs;
        return pdfMakeInstance.createPdf(docDefinition, undefined, undefined, vfs);
  }
}