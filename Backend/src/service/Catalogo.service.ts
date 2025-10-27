import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/initDatabase';
import { obtenerEspecialidadAmbulatoria } from '../controller/Catalogo.controller';
import type { 
  Especialidad, 
  SubEspecialidad, 
  EstadisticasEspecialidades, 
  PpvServicio,
  EspecialidadAmbulatoria
} from '../interfaces/Catalogos.interface';

/**
 * Servicio para el manejo de especialidades y sub-especialidades
 * Basado en las queries del sistema legacy
 */
export class CatalogoService {
  
  /**
   * Obtener todas las especialidades activas
   * Basado en el legacy 'servP'
   */
  async obtenerEspecialidades(busqueda?: string): Promise<Especialidad[]> {
    let whereClause = "WHERE e.SER_SER_Vigencia = 'S'";
    
    if (busqueda) {
      const busquedaUpper = busqueda.toUpperCase();
      whereClause += ` AND e.SER_SER_Descripcio LIKE '%${busquedaUpper}%'`;
    }

    const query = `
      SELECT DISTINCT
        RTRIM(LTRIM(e.SER_SER_Codigo)) as id,
        e.SER_SER_Descripcio as nombre,
        RTRIM(LTRIM(e.SER_SER_Codigo)) as codigo
      FROM BD_ENTI_CORPORATIVA.dbo.SER_Servicios as e
      INNER JOIN BD_PROCEDIMIENTOS.dbo.TAB_Activos as a 
        ON a.TAB_Codigo = e.SER_SER_Codigo
      INNER JOIN BD_PROCEDIMIENTOS.dbo.NET_ActivoTipoProg as p 
        ON a.TAB_Codigo = p.PROC_COD_Activo
      ${whereClause}
      ORDER BY e.SER_SER_Descripcio ASC
    `;

    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  }

  /**
   * Obtener sub-especialidades por especialidad
   * Basado en el legacy 'servH'
   */
  async obtenerSubEspecialidadesPorEspecialidad(
    especialidadId: string, 
    busqueda?: string
  ): Promise<SubEspecialidad[]> {
    let whereClause = `WHERE e.SER_ESP_Codigo = '${especialidadId}' AND e.TAB_Vigencia = 'S'`;
    
    if (busqueda) {
      const busquedaUpper = busqueda.toUpperCase();
      whereClause += ` AND e.TAB_Descripcion LIKE '%${busquedaUpper}%'`;
    }

    const query = `
      SELECT 
        e.TAB_Codigo as id,
        e.TAB_Descripcion as nombre,
        RTRIM(LTRIM(e.TAB_Codigo)) as codigo,
        '${especialidadId}' as especialidadId
      FROM BD_PROCEDIMIENTOS.dbo.TAB_Equipamiento as e
      ${whereClause}
      ORDER BY e.TAB_Descripcion ASC
    `;

    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  }

  async obtenerServicios(): Promise<PpvServicio[]>{
    let whereClause = "WHERE vigente = 'V' AND cod_rel_servicio IS NOT NULL";
    const query = `SELECT servicio.ID as id, 
        servicio.servicio as serv
        FROM BD_PPV.dbo.PPV_Servicios AS servicio
        ${whereClause}`
    return await sequelize.query(query, {
          type: QueryTypes.SELECT,
      });
  }

  async obtenerServicioPorNombre(nombre: string): Promise<PpvServicio | null> {

    // La BD usa Latin1_General_CS_AS (Case Sensitive, Accent Sensitive)
    // Necesitamos convertir a CI_AI (Case Insensitive, Accent Insensitive)
    const nombreLimpio = nombre.trim();
    
    const query = `SELECT servicio.ID as id, 
        servicio.servicio as serv,
        servicio.cod_rel_servicio,
        servicio.ambito_id
      FROM BD_PPV.dbo.PPV_Servicios AS servicio
      WHERE vigente = 'V' 
      AND servicio.servicio COLLATE Latin1_General_CI_AI = '${nombreLimpio}' COLLATE Latin1_General_CI_AI`;
      
 
    
    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    }) as any[];

    console.log(`📊 Resultados encontrados: ${result.length}`);
    
    if (result.length > 0) {
      const row = result[0];

      return {
        ID: row.id,
        Servicio: row.serv,
        Vigente: 'V',
        Cod_Rel_Servicio: row.cod_rel_servicio ?? null,
        Ambito_Id: row.ambito_id ?? null
      } as PpvServicio;
    }
    
    console.log(`❌ No se encontró el servicio "${nombreLimpio}"`);
    return null;
  }



  /**
   * Obtener todas las sub-especialidades para múltiples especialidades
   * Útil para análisis o reportes masivos
   */
  async obtenerTodasSubEspecialidades(especialidadIds: string[]): Promise<SubEspecialidad[]> {
    if (especialidadIds.length === 0) {
      return [];
    }

    const idsString = especialidadIds.map(id => `'${id}'`).join(',');
    
    const query = `
      SELECT 
        e.TAB_Codigo as id,
        e.TAB_Descripcion as nombre,
        RTRIM(LTRIM(e.TAB_Codigo)) as codigo,
        e.SER_ESP_Codigo as especialidadId
      FROM BD_PROCEDIMIENTOS.dbo.TAB_Equipamiento as e
      WHERE e.TAB_Vigencia = 'S'
        AND e.SER_ESP_Codigo IN (${idsString})
      ORDER BY e.SER_ESP_Codigo, e.TAB_Descripcion ASC
    `;

    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  }

  /**
   * Validar que una especialidad existe y está activa
   */
  async validarEspecialidad(especialidadId: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM BD_ENTI_CORPORATIVA.dbo.SER_Servicios as e
      INNER JOIN BD_PROCEDIMIENTOS.dbo.TAB_Activos as a 
        ON a.TAB_Codigo = e.SER_SER_Codigo
      WHERE RTRIM(LTRIM(e.SER_SER_Codigo)) = '${especialidadId.trim()}'
        AND e.SER_SER_Vigencia = 'S'
    `;

    const result: any[] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    return result[0]?.count > 0;
  }

  /**
   * Obtener estadísticas de especialidades y sub-especialidades
   */
  async obtenerEstadisticas(): Promise<EstadisticasEspecialidades> {
    const especialidades = await this.obtenerEspecialidades();
    const especialidadIds = especialidades.map(e => e.id);
    const subEspecialidades = await this.obtenerTodasSubEspecialidades(especialidadIds);
    
    const especialidadesConSub = new Set(subEspecialidades.map(s => s.especialidadId)).size;

    return {
      totalEspecialidades: especialidades.length,
      totalSubEspecialidades: subEspecialidades.length,
      especialidadesConSubEspecialidades: especialidadesConSub,
    };
  }


  async obtenerEspecialidadAmbulatoria(): Promise<EspecialidadAmbulatoria[]> {
    // Usar el procedimiento almacenado para obtener los servicios ambulatorios
    const query = `exec BD_ENTI_CORPORATIVA..CITA_ListaServiciosAmbulatorios`;

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    }) as any[];

    // El procedimiento retorna exactamente SER_ESP_Codigo y SER_ESP_Descripcio
    return result.map(row => ({
      SER_ESP_Codigo: row.SER_ESP_Codigo,
      SER_ESP_Descripcio: row.SER_ESP_Descripcio
    }));
  }
}