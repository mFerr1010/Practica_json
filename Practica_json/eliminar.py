import json

# Leer el archivo JSON
with open("CovidDades.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Lista de claves a eliminar
keys_to_remove = [
    "negativeIncrease", "hospitalizedCumulative", "inIcuCurrently", 
    "inIcuCumulative", "onVentilatorCurrently", "onVentilatorCumulative", 
    "dateChecked", "lastModified", "recovered", "total", "posNeg", 
    "deathIncrease", "hospitalizedIncrease", "totalTestResultsIncrease", "hash"
]

# Eliminar las claves especificadas de cada objeto
for entry in data:
    for key in keys_to_remove:
        if key in entry:
            del entry[key]

# Guardar el archivo modificado
with open("CovidDades.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4)