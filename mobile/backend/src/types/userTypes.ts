// types/userTypes.ts
export interface UserData {
    id: string;
    nombre: string;
    matricula: string;
    carrera: string;
    fotoPerfil?: string;
    rango?: string;
  }
  
  export interface Publicacion {
    id: string;
    texto: string;
    fecha?: Date;
  }
  
  export interface Respuesta {
    id: string;
    texto: string;
    publicacionId: string;
    fecha?: Date;
  }
  
  export interface Grupo {
    id: string;
    nombre: string;
    carrera: string;
  }