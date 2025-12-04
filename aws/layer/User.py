from pydantic import BaseModel, EmailStr
from datetime import datetime

class User(BaseModel):
    username: str
    password_hash: str
    email: EmailStr
    transcriptions: list[dict[int, datetime]]

if __name__ == "__main__":
    user = User(
        username="example_user",
        password_hash="hashed_password",
        email="test@example.com",
        transcriptions=[{1: datetime.now()}]
    )
    
    print(f"User created successfully: {user}")
    
    try:
        invalid_user = User(
            username="invalid_user",
            password_hash="hashed_password",
            email="invalid-email",  # This will cause a validation error
            transcriptions=['invalid transcription']  # This will also cause a validation error
        )
    except Exception as e:
        print(f"Successfully caught expected error for invalid email: {e}")
