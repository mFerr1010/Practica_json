import json
from collections import defaultdict

# Leer el archivo JSON original
with open("CovidDades.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Diccionario para almacenar los datos agrupados por mes
monthly_data = defaultdict(lambda: {"positive": 0, "negative": 0, "death": 0, "hospitalized": 0, "totalTestResults": 0})

# Procesar cada registro y agrupar por mes
for entry in data:
    # Extraer el mes del campo "date"
    date_str = str(entry["date"])
    year_month = date_str[:6]  # Los primeros 6 caracteres representan el año y el mes (YYYYMM)

    # Sumar los valores al mes correspondiente, manejando valores None como 0
    monthly_data[year_month]["positive"] += entry.get("positive", 0) or 0
    monthly_data[year_month]["negative"] += entry.get("negative", 0) or 0
    monthly_data[year_month]["death"] += entry.get("death", 0) or 0
    monthly_data[year_month]["hospitalized"] += entry.get("hospitalized", 0) or 0
    monthly_data[year_month]["totalTestResults"] += entry.get("totalTestResults", 0) or 0

# Convertir el diccionario a una lista de registros
result = [{"month": month, **values} for month, values in monthly_data.items()]

# Guardar los datos agrupados en un nuevo archivo JSON
with open("CovidDadesMes.json", "w", encoding="utf-8") as file:
    json.dump(result, file, indent=4)

print("Archivo CovidDadesMes.json creado con éxito.")