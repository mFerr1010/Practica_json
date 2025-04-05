import React, { useEffect, useState } from 'react';
import './web.css';
import Ajv from 'ajv';  // Importamos AJV
import { MesData } from './SchemaCovidDadesMes';  // Importamos el tipo para los meses
import { DiaData } from './SchemaCovidDades';  // Importamos el tipo para los días

const CovidDades2020: React.FC = () => {
  const [meses, setMeses] = useState<MesData[]>([]);
  const [dias, setDias] = useState<DiaData[]>([]);
  const [expandedMes, setExpandedMes] = useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = useState<string[]>([]);  // Para los errores de validación

  // Inicializamos AJV
  const ajv = new Ajv();
  
  // Creamos los validadores para los esquemas
  const [mesSchema, setMesSchema] = useState<any>(null);
  const [diaSchema, setDiaSchema] = useState<any>(null);

  // Cargar los esquemas desde los archivos JSON
  useEffect(() => {
    fetch('SchemaCovidDadesMes.json')
      .then((res) => res.json())
      .then((data) => setMesSchema(data));

    fetch('SchemaCovidDades.json')
      .then((res) => res.json())
      .then((data) => setDiaSchema(data));
  }, []);

  // Compilamos los esquemas con AJV solo cuando estén cargados
  const validateMes = mesSchema ? ajv.compile(mesSchema) : null;
  const validateDia = diaSchema ? ajv.compile(diaSchema) : null;

  useEffect(() => {
    // Cargar los datos de Mes y validarlos
    fetch('CovidDadesMes.json')
      .then((res) => res.json())
      .then((data) => {
        const errors: string[] = [];
        if (validateMes) {
          // Validamos cada objeto de MesData
          data.forEach((item: MesData, index: number) => {
            if (!validateMes(item)) {
              // Guardamos el mensaje de error en el estado
              errors.push(`Error en MesData en índice ${index}: ${validateMes.errors?.map(e => e.message).join(', ')}`);
            }
          });
        }
        if (errors.length > 0) {
          setValidationErrors(errors);  // Si hay errores de validación, los mostramos
        } else {
          setMeses(data);  // Si es válido, los guardamos en el estado
        }
      });

    // Cargar los datos de Día y validarlos
    fetch('CovidDades.json')
      .then((res) => res.json())
      .then((data) => {
        const errors: string[] = [];
        if (validateDia) {
          // Validamos cada objeto de DiaData
          data.forEach((item: DiaData, index: number) => {
            if (!validateDia(item)) {
              errors.push(`Error en DiaData en índice ${index}: ${validateDia.errors?.map(e => e.message).join(', ')}`);
            }
          });
        }
        if (errors.length > 0) {
          setValidationErrors(errors);  // Si hay errores de validación, los mostramos
        } else {
          setDias(data);  // Si es válido, los guardamos en el estado
        }
      });
  }, [validateMes, validateDia]);

  const toggleExpand = (mes: string) => {
    const newExpanded = new Set(expandedMes);
    if (newExpanded.has(mes)) {
      newExpanded.delete(mes);
    } else {
      newExpanded.add(mes);
    }
    setExpandedMes(newExpanded);
  };

  return (
    <div>
      <h1>Covid Dades 2020</h1>
      
      {/* Mostrar errores de validación */}
      {validationErrors.length > 0 && (
        <div style={{ color: 'red' }}>
          <h3>Errores de Validación:</h3>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Mes i Dades</th>
          </tr>
        </thead>
        <tbody>
          {meses.map((mes) => {
            const diasMes = dias.filter((dia) => dia.month === mes.month);
            const isExpanded = expandedMes.has(mes.month);

            return (
              <tr key={mes.month}>
                <td>
                  <button className="expandible" onClick={() => toggleExpand(mes.month)}>
                    <strong>Mes:</strong> {mes.month}<br />
                    <strong>Positius:</strong> {mes.positive.toLocaleString()}<br />
                    <strong>Negatius:</strong> {mes.negative.toLocaleString()}<br />
                    <strong>Defuncions:</strong> {mes.death.toLocaleString()}<br />
                    <strong>Hospitalitzats:</strong> {mes.hospitalized.toLocaleString()}<br />
                    <strong>Total de Tests Fets:</strong> {mes.totalTestResults.toLocaleString()}
                  </button>

                  {isExpanded && (
                    <div className="datos-dia">
                      {diasMes.map((dia, index) => (
                        <tr key={index}>
                          <td>
                            <div className="info-dia">
                              <strong>Fecha:</strong> {dia.date}<br />
                              <strong>Estados:</strong> {dia.states}<br />
                              <strong>Positivos:</strong> {dia.positive.toLocaleString()}<br />
                              <strong>Negativos:</strong> {dia.negative.toLocaleString()}<br />
                              <strong>Pendientes:</strong> {dia.pending.toLocaleString()}<br />
                              <strong>Hospitalizados Hoy:</strong> {dia.hospitalizedCurrently.toLocaleString()}<br />
                              <strong>Muertes:</strong> {dia.death.toLocaleString()}<br />
                              <strong>Total de Tests Fets:</strong> {dia.totalTestResults.toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CovidDades2020;
