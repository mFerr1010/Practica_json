import json

# Leer el archivo JSON existente
with open("CovidDadesMes.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Modificar el campo "month" para eliminar el año
for entry in data:
    entry["month"] = entry["month"][4:]  # Mantener solo los últimos dos caracteres (el mes)

# Guardar los cambios en el mismo archivo
with open("CovidDadesMes.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4)

print("El archivo CovidDadesMes.json ha sido actualizado con éxito.")