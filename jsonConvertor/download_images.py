import os
import json
import requests

# Define the path to the JSON file
json_file_path = "databaseHospitals.json"

# Load hospital data from JSON
with open(json_file_path, "r", encoding="utf-8") as f:
    hospitals = json.load(f)

print(f"Loaded {len(hospitals)} hospital records.")    

# Create a directory to store images inside jsonConvertor
image_folder = "hospital_images"
os.makedirs(image_folder, exist_ok=True)

# Function to download images
def download_image(url, hospital_id):
    try:
        response = requests.get(url, stream=True, timeout=10)
        if response.status_code == 200:
            # Save the image using hospital ID as filename
            filename = os.path.join(image_folder, f"{hospital_id}.jpg")
            with open(filename, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            print(f"✅ Downloaded: {filename}")
        else:
            print(f"❌ Failed to download {url} - Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error downloading {url}: {e}")

# Iterate through hospital records and download images
for hospital in hospitals:
    image_url = hospital.get("Featured_Image")
    hospital_id = hospital.get("_id")

    if image_url and hospital_id:
        # print("yash")
        download_image(image_url, hospital_id)

print("🎉 All images downloaded!")
