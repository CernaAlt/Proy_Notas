export interface Apuesta {
  id: number;
  descripcion: string;
  monto: number;
  ganancia: number;
  resultado: 'si' | 'no';
  saldo: number;
  fecha: string;
}