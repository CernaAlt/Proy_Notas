import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apuesta } from '../../../interface/apuesta';

@Component({
  selector: 'app-gestor-apuestas',
  imports: [FormsModule, NgClass, NgFor],
  templateUrl: './gestor-apuestas.component.html',
  styleUrl: './gestor-apuestas.component.css'
})
export class GestorApuestasComponent {

  apuestas: Apuesta[] = [];
  contadorId: number = 1;

  // campos del formulario
  descripcion: string = '';
  monto: number | null = null;
  ganancia: number | null = null;
  resultado: string = '';

  constructor() {}

  ngOnInit(): void {
    this.cargarDatos();
    this.actualizarEstadisticas();
  }

  agregarApuesta() {
    if (!this.descripcion || !this.monto || !this.ganancia || !this.resultado) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const saldo = this.resultado === 'si' ? this.ganancia - this.monto : -this.monto;
    const fecha = new Date().toLocaleDateString('es-ES');

    const nuevaApuesta: Apuesta = {
      id: this.contadorId++,
      descripcion: this.descripcion,
      monto: this.monto,
      ganancia: this.ganancia,
      resultado: this.resultado as 'si' | 'no',
      saldo: saldo,
      fecha: fecha
    };

    this.apuestas.push(nuevaApuesta);
    this.guardarDatos();
    this.limpiarFormulario();
  }

  eliminarApuesta(id: number) {
    if (confirm('¿Está seguro de que desea eliminar esta apuesta?')) {
      this.apuestas = this.apuestas.filter(a => a.id !== id);
      this.guardarDatos();
    }
  }

  limpiarTodo() {
    if (confirm('¿Está seguro de que desea eliminar todas las apuestas?')) {
      this.apuestas = [];
      this.contadorId = 1;
      this.guardarDatos();
    }
  }

  get balanceTotal(): number {
    return this.apuestas.reduce((sum, a) => sum + a.saldo, 0);
  }

  get gananciasTotales(): number {
    return this.apuestas.filter(a => a.saldo > 0).reduce((s, a) => s + a.saldo, 0);
  }

  get perdidasTotales(): number {
    return Math.abs(this.apuestas.filter(a => a.saldo < 0).reduce((s, a) => s + a.saldo, 0));
  }

  get totalApuestas(): number {
    return this.apuestas.length;
  }

  limpiarFormulario() {
    this.descripcion = '';
    this.monto = null;
    this.ganancia = null;
    this.resultado = '';
  }

  guardarDatos() {
    localStorage.setItem('apuestasData', JSON.stringify({
      apuestas: this.apuestas,
      contadorId: this.contadorId
    }));
  }

  cargarDatos() {
    const data = localStorage.getItem('apuestasData');
    if (data) {
      const obj = JSON.parse(data);
      this.apuestas = obj.apuestas || [];
      this.contadorId = obj.contadorId || 1;
    }
  }

  exportarCSV() {
    if (this.apuestas.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const headers = ['Descripción', 'Monto Apostado', 'Ganancia Potencial', '¿Salió?', 'Saldo', 'Fecha'];
    const rows = this.apuestas.map(a => [
      `"${a.descripcion}"`,
      a.monto.toFixed(2),
      a.ganancia.toFixed(2),
      a.resultado === 'si' ? 'Sí' : 'No',
      a.saldo.toFixed(2),
      a.fecha
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registro_apuestas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  actualizarEstadisticas() {
    // Forzado a recalcular (los getters ya se encargan de mostrar valores actualizados)
  }

}
