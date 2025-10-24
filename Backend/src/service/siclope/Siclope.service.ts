import { generarArchivoExcel, convertirFecha } from '../../utils';
import { QueryTypes } from 'sequelize';
import { sequelizeHCE } from '../../config/initDatabase';
import { response, Response } from 'express';
import { servicioPdf } from '../pdf/pdf.service';

export class SiclopeService {

   async ObtenerNominaPorFecha(fechaIni: string, fechaTermino: string, rut: string, res: Response) {
        try {
            // Tus fechas llegan como '01/10/2025' y '23/10/2025' → ya están en dd/MM/yyyy.
            // Si algún día cambian de formato, normalízalas tú (valídalas) y mantenlas en dd/MM/yyyy.
            const fechaInicio103 = fechaIni;       // '01/10/2025'
            const fechaFin103    = fechaTermino;   // '23/10/2025'

            const sql = `
            EXEC PRO_HCE_RPT_ConsultaNomina
                @NOM_Fecha_Ini   = :fechaInicio,
                @NOM_Fecha_Fin   = :fechaFin,
                @NOM_CodigProfe  = :rut
            `;

            const resultados = await sequelizeHCE.query(sql, {
            replacements: { fechaInicio: fechaInicio103, fechaFin: fechaFin103, rut },
            type: QueryTypes.SELECT
            });

            if (!resultados || (Array.isArray(resultados) && resultados.length === 0)) {
            return res.status(204).end();
            }

            const pdf = await servicioPdf.generarNominasDesdeResultados(resultados as any[], {
            periodo: { desde: fechaIni, hasta: fechaTermino },
            hospital: 'Hospital Dr. Carlos Cisternas de Calama',
            fechaImpresion: new Date().toLocaleDateString('es-CL'),
            horaImpresion: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
            }, {});

            console.log(resultados)

            const nombreArchivo = `nominas_${rut || 'sin-rut'}_${fechaIni}_a_${fechaTermino}.pdf`;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);
            res.setHeader('Cache-Control', 'no-store');
            return res.send(pdf);
        } catch (error: any) {
            console.error('[ObtenerNominaPorFecha] Error:', error?.parent ?? error);
            return res.status(500).json({ mensaje: 'No se pudo generar la nómina', detalle: error.message });
        }
    }

    async ObtenerListadoContrareferencia(fechaIni: string, fechaTermino: string, res: Response) {

    }

    async ObtenerDiagnosticosRealizados(fechaIni: string, fechaTermino: string, especialidad: string, res: Response) {

    }
}