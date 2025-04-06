//https://github.com/mFerr1010/Practica_json.git

//Si al clonar el repositorio salen errores, habria que descargar de nuevo el ajv dentro de la carpeta de tsx, no se porque pasa eso

/*La pagina web consiste en mostrar los datos del Covid-19 en Estados Unidos durante el 2020, de manera que en cada casilla este los datos de cada mes, y que 
estos tambien funcionen como un boton, el cual al pulsarlo, se extienda la cailla y salgan los datos de cada dia del mes*/


import React, { useEffect, useState } from 'react';
import './web.css';
import Ajv from 'ajv';
import { MesData } from './SchemaCovidDadesMes';
import { DiaData } from './SchemaCovidDades';

const CovidDades2020: React.FC = () => {
  //Para establecer los datos de los meses y dias de manera que se utilicen todos los datos de los archivos JSON
  const [meses, setMeses] = useState<MesData[]>([]);
  const [dias, setDias] = useState<DiaData[]>([]);
  //Para mostrar los datos de cada dia en cada mes de manera que no se puedan repetir
  const [expandedMes, setExpandedMes] = useState<Set<string>>(new Set());
  const [,setValidationErrors] = useState<string[]>([]);

  //Validador
  const ajv = new Ajv();
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

  // Compilar los esquemas con AJV solo cuando estén cargados
  const validarMes = mesSchema ? ajv.compile(mesSchema) : null;
  const validarDia = diaSchema ? ajv.compile(diaSchema) : null;

  useEffect(() => {
    // Cargar los datos de Mes y validarlos
    fetch('CovidDadesMes.json')
      .then((res) => res.json())
      .then((data) => {
        let hayError = false;
        if (validarMes) {
          // Validar cada objeto de MesData recorriendo los datos de los meses
          for (let i of data) {
            if (!validarMes(i)) {
              // Si se encuentra un error, se marca hasError como true
              hayError = true; 
              break;
            }
          }
        }       
        if (hayError) {
           // Si hay un error, mostrar el siguiente mensaje
          setValidationErrors(["Error en los datos de los meses"]);
        } else {
          // Si no hay errores, guardamos los datos de los meses
          setMeses(data);
        }
      });
  
    // Misma estructura de los meses para los dias
    fetch('CovidDades.json')
      .then((res) => res.json())
      .then((data) => {
        let hayError = false;
        if (validarDia) {
          for (let i of data) {
            if (!validarDia(i)) {
              hayError = true;
              break;
            }
          }
        }
        if (hayError) {
          setValidationErrors(["Error en los datos de los días"]);
        } else {
          setDias(data);
        }
      });
  }, [validarMes, validarDia]);
  
  //Implementacion del la funcion del boton dentro de la casilla del mes
  const botonExpand = (mes: string) => {
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
      <table>
        <thead>
          <tr>
            <th>Mes i Dades</th>
          </tr>
        </thead>
        <tbody>
          {/*Colocar los datos de los dias correspondientes a su mes*/}
          {meses.map((mes) => {
            const diasMes = dias.filter((dia) => dia.month === mes.month);
            const isExpanded = expandedMes.has(mes.month);
  
            return (
              <tr key={mes.month}>
                <td>
                  <button className="expandible" onClick={() => botonExpand(mes.month)}>
                    <strong>Mes:</strong> {mes.month}<br />
                    {/*el "toLocaleString" sirve para poner las comas de miles en los numeros, ej: 1,000 (mil)*/}
                    <strong>Positius:</strong> {mes.positive.toLocaleString()}<br />
                    <strong>Negatius:</strong> {mes.negative.toLocaleString()}<br />
                    <strong>Defuncions:</strong> {mes.death.toLocaleString()}<br />
                    <strong>Hospitalitzats:</strong> {mes.hospitalized.toLocaleString()}<br />
                    <strong>Total de Tests Fets:</strong> {mes.totalTestResults.toLocaleString()}
                  </button>
  
                  {/*Mostrar los datos de los días si la casilla está expandida*/}
                  {isExpanded && (
                    <div className="datos-dia">
                      {diasMes.map((dia) => (
                        <div key={dia.date} className="info-dia">
                          <strong>Fecha:</strong> {dia.date}<br />
                          <strong>Estados:</strong> {dia.states}<br />
                          <strong>Positivos:</strong> {dia.positive.toLocaleString()}<br />
                          <strong>Negativos:</strong> {dia.negative.toLocaleString()}<br />
                          <strong>Pendientes:</strong> {dia.pending.toLocaleString()}<br />
                          <strong>Hospitalizados Hoy:</strong> {dia.hospitalizedCurrently.toLocaleString()}<br />
                          <strong>Muertes:</strong> {dia.death.toLocaleString()}<br />
                          <strong>Total de Tests Fets:</strong> {dia.totalTestResults.toLocaleString()}
                        </div>
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
