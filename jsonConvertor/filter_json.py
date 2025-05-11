import json
import os

# Get the current script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
json_file_path = os.path.join(script_dir, "hospitals.json")

# Open the JSON file
with open(json_file_path, "r", encoding="utf-8") as file:
    data = json.load(file)

# Extract only the required fields
filtered_data = [
    {
        "Place_name": hospital["Place_name"],
        "Address1": hospital["Address1"],
        "Hours": hospital["Hours"],
        "Phone": hospital["Phone"],
        "Email": hospital["emails"],
        "Location": hospital["Location"],
        "Total_score": hospital["Total_score"],
        "Featured_Image": hospital["Featured_Image"]
    }
    for hospital in data
]

# Save the new filtered data into a new JSON file
with open("filtered_hospitals.json", "w", encoding="utf-8") as file:
    json.dump(filtered_data, file, indent=4, ensure_ascii=False)

print("Filtered JSON file saved as 'filtered_hospitals.json'")
