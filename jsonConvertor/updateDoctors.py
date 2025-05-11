# import os
# import cloudinary
# import cloudinary.uploader
# import pymongo

# # Configure Cloudinary
# cloudinary.config(
#     cloud_name="dgelue5vg",
#     api_key="227544533723446",
#     api_secret="_lVmUTRhCX7LUyoTWr-14RInpsY"
# )

# # MongoDB Connection
# MONGO_URI = "mongodb+srv://yash:1822@cluster-1.5faqh.mongodb.net/HMS"
# client = pymongo.MongoClient(MONGO_URI)
# db = client["HMS"]
# doctors_collection = db["doctors"]  # Change collection to 'doctors'

# # Path to the updated doctors' images folder
# base_folder = "C:/Users/yaswa/OneDrive/Desktop/HMS/backend/jsonConvertor/updated-doctors"

# # Cloudinary upload preset
# UPLOAD_PRESET = "doctors"

# # Function to upload an image to Cloudinary
# def upload_to_cloudinary(image_path, doctor_name):
#     try:
#         response = cloudinary.uploader.upload(
#             image_path, 
#             upload_preset=UPLOAD_PRESET, 
#             public_id=f"doctors/{doctor_name}"  # Organize in 'doctors/' folder
#         )
#         return response["secure_url"]  # Return Cloudinary URL
#     except Exception as e:
#         print(f"❌ Error uploading {image_path}: {e}")
#         return None

# # Loop through specialties
# for specialty in os.listdir(base_folder):
#     specialty_folder = os.path.join(base_folder, specialty)
    
#     if not os.path.isdir(specialty_folder):
#         continue  # Skip if not a folder
    
#     print(f"📂 Processing specialty: {specialty}")

#     # Loop through doctor images inside specialty folder
#     for filename in os.listdir(specialty_folder):
#         if not filename.endswith(".jpg"):  # Process only JPG images
#             continue
        
#         doctor_name = os.path.splitext(filename)[0]  # Extract name from filename
#         image_path = os.path.join(specialty_folder, filename)
        
#         print(f"📤 Uploading {doctor_name}.jpg to Cloudinary...")
#         cloudinary_url = upload_to_cloudinary(image_path, doctor_name)

#         if cloudinary_url:
#             # Update MongoDB doctor record with Cloudinary URL
#             result = doctors_collection.update_one(
#                 {"name": doctor_name, "speciality": specialty},  # Match by name & specialty
#                 {"$set": {"doctor_image": cloudinary_url}}
#             )

#             if result.matched_count > 0:
#                 print(f"✅ Updated database for Dr. {doctor_name}")
#             else:
#                 print(f"⚠️ No matching record found for Dr. {doctor_name} in {specialty}")

# print("🎉 All doctor images uploaded & database updated!")



import os
import cloudinary
import cloudinary.uploader
import pymongo

# Configure Cloudinary
cloudinary.config(
    cloud_name="dgelue5vg",
    api_key="227544533723446",
    api_secret="_lVmUTRhCX7LUyoTWr-14RInpsY"
)

# MongoDB Connection
MONGO_URI = "mongodb+srv://yash:1822@cluster-1.5faqh.mongodb.net/HMS"
client = pymongo.MongoClient(MONGO_URI)
db = client["HMS"]
doctors_collection = db["doctors"]  # Ensure correct collection name

# Path to the updated doctors' images folder
base_folder = "C:/Users/yaswa/OneDrive/Desktop/HMS/backend/jsonConvertor/updated-doctors"

# Cloudinary upload preset
UPLOAD_PRESET = "doctors"

# Function to upload an image to Cloudinary
def upload_to_cloudinary(image_path, doctor_name):
    try:
        response = cloudinary.uploader.upload(
            image_path, 
            upload_preset=UPLOAD_PRESET, 
            public_id=f"doctors/{doctor_name}"  # Organize in 'doctors/' folder
        )
        return response["secure_url"]  # Return Cloudinary URL
    except Exception as e:
        print(f"❌ Error uploading {image_path}: {e}")
        return None

# Loop through specialties
for specialty in os.listdir(base_folder):
    specialty_folder = os.path.join(base_folder, specialty)
    
    if not os.path.isdir(specialty_folder):
        continue  # Skip if not a folder
    
    print(f"📂 Processing specialty: {specialty}")
    
    # Loop through doctor images inside specialty folder
    for filename in os.listdir(specialty_folder):
        if not filename.lower().endswith(".jpg"):  # Process only JPG images
            continue
        
        doctor_name = os.path.splitext(filename)[0].strip()  # Extract doctor name from filename
        image_path = os.path.join(specialty_folder, filename)
        
        print(f"📤 Uploading {doctor_name}.jpg to Cloudinary...")
        cloudinary_url = upload_to_cloudinary(image_path, doctor_name)

        if cloudinary_url:
            # Update MongoDB doctor record with Cloudinary URL
            result = doctors_collection.update_one(
                {
                    "name": {"$regex": f"^{doctor_name}$", "$options": "i"},  # Case-insensitive match
                    "specialty": {"$regex": f"^{specialty}$", "$options": "i"}  # Case-insensitive match
                },
                {"$set": {"doctor_image": cloudinary_url}}
            )
            print("result is:", result)

            if result.matched_count > 0:
                print(f"✅ Updated database for Dr. {doctor_name}")
            else:
                print(f"⚠️ No matching record found for Dr. {doctor_name} in {specialty}")

print("🎉 All doctor images uploaded & database updated!")
