import cloudinary
import cloudinary.api

cloudinary.config(
  cloud_name = "bakery",
  api_key = "195973412447394",
  api_secret = "CftBF44Jh6JNPWTBb2oZ5bsYQR0"
)

try:
    res = cloudinary.api.ping()
    print("SUCCESS:", res)
except Exception as e:
    print("ERROR:", e)
