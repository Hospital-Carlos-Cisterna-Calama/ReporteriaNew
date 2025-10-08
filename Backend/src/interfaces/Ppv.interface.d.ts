export interface IPacienteEnti {
  PAC_PAC_Rut: string;
  PAC_PAC_Nombre: string;
  PAC_PAC_ApellPater: string;
  PAC_PAC_ApellMater: string;
  PAC_PAC_Sexo: string;
  PAC_PAC_FechaNacim: Date;
  PAC_PAC_Prevision: string;
  PAC_PAC_TelefonoMovil: string;
  PAC_PAC_Fono: string;
  PAC_PAC_DireccionGralHabit: string;
  PAC_PAC_NumerHabit: string;
}

export interface IProfesionalEnti {
  SER_PRO_Rut: string;
  SER_PRO_Nombres: string;
  SER_PRO_ApellPater: string;
  SER_PRO_ApellMater: string;
}

export interface IEspecialidadEnti {
  SER_SER_CodigoIfl: string;
  SER_SER_DescripcioIfl: string;
}
