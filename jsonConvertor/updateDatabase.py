import os
import requests
import json
import cloudinary # type: ignore
import cloudinary.uploader # type: ignore
import pymongo # type: ignore
# from dotenv import load_dotenv

# Load environment variables
# load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name="dgelue5vg",
    api_key="227544533723446",
    api_secret="_lVmUTRhCX7LUyoTWr-14RInpsY"
)

# MongoDB Connection
MONGO_URI = "mongodb+srv://yash:1822@cluster-1.5faqh.mongodb.net/HMS"  # Change if your DB URI is different
client = pymongo.MongoClient(MONGO_URI)
db = client["HMS"]  # Change to your database name
hospitals_collection = db["hospitals"]  # Change to your collection name

# Path to the hospital images folder
image_folder = "C:/Users/yaswa/OneDrive/Desktop/HMS/backend/jsonConvertor/hospital_images"

# Default image path (if hospital image is missing)
default_image = "C:/Users/yaswa/OneDrive/Desktop/HMS/backend/jsonConvertor/hospital1.png"

# Upload preset from Cloudinary
UPLOAD_PRESET = "hospitals"

# Function to upload image to Cloudinary
def upload_to_cloudinary(image_path, hospital_id):
    try:
        response = cloudinary.uploader.upload(
            image_path, 
            upload_preset=UPLOAD_PRESET,  # Using upload preset
            public_id=hospital_id  # Set filename as hospital ID
        )
        return response["secure_url"]  # Return Cloudinary URL
    except Exception as e:
        print(f"❌ Error uploading {image_path}: {e}")
        return None

# Iterate over hospital records in MongoDB
hospitals = hospitals_collection.find({})  # Fetch all hospitals

for hospital in hospitals:
    # hospital_id = hospital["_id"]
    hospital_id = str(hospital["_id"])
    image_path = os.path.join(image_folder, f"{hospital_id}.jpg")

    if not os.path.exists(image_path):  # If image not found, use default
        print(f"⚠️ Image not found for {hospital_id}, using default image.")
        image_path = default_image

    print(f"📤 Uploading {hospital_id}.jpg to Cloudinary...")
    cloudinary_url = upload_to_cloudinary(image_path, hospital_id)

    if cloudinary_url:
        # Update MongoDB hospital record with Cloudinary URL
        result = hospitals_collection.update_one(
            {"_id": hospital["_id"]},  # Search by ObjectId
            {"$set": {"Featured_Image": cloudinary_url}}
        )

        if result.matched_count > 0:
            print(f"✅ Updated database for hospital ID: {hospital_id}")
        else:
            print(f"❌ Failed to update database for hospital ID: {hospital_id}")

print("🎉 All images uploaded & database updated!")
