import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import "../styles/graficos.css"


ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export const EventTypesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('pie');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tipo/evento');
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
  
        const result = await response.json();
        
        // Maneja diferentes formatos de respuesta
        const data = Array.isArray(result) 
          ? result 
          : (result.data || result.eventos || []);
        
        if (!Array.isArray(data)) {
          throw new Error('Formato de datos no soportado');
        }
  
        const formattedData = {
          labels: data.map(item => item.tipo || item.nombre || 'Sin tipo'),
          datasets: [{
            label: 'Eventos por Tipo',
            data: data.map(item => item.cantidad || item.total || 0),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
              '#9966FF', '#FF9F40', '#8AC24A', '#F06292'
            ],
            borderWidth: 1
          }]
        };
        
        setChartData(formattedData);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError(err.message);
        setChartData({
          labels: [],
          datasets: [{
            label: 'Error al cargar datos',
            data: [],
            backgroundColor: [],
            borderWidth: 1
          }]
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  if (loading) return <div className="chart-loading">Cargando datos...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;

  return (
    <div className="event-types-chart">
      <div className="chart-toggle">
        <button 
          onClick={() => setChartType('pie')} 
          className={chartType === 'pie' ? 'active' : ''}
        >
          Gráfico de Pastel
        </button>
        <button 
          onClick={() => setChartType('bar')} 
          className={chartType === 'bar' ? 'active' : ''}
        >
          Gráfico de Barras
        </button>
      </div>

      <div className="chart-container">
        {chartType === 'pie' ? (
          <Pie data={chartData} options={{
            plugins: {
              legend: { position: 'right' },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((context.raw / total) * 100);
                    return `${context.label}: ${context.raw} (${percentage}%)`;
                  }
                }
              }
            }
          }} />
        ) : (
          <Bar data={chartData} options={{
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
          }} />
        )}
      </div>
    </div>
  );
};