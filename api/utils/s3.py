import boto3
import os
import uuid
from fastapi import UploadFile
from botocore.exceptions import NoCredentialsError

# Load AWS credentials from environment
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET = os.getenv("AWS_S3_BUCKET_NAME")

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

async def upload_image_to_s3(file: UploadFile, folder: str = "products") -> str:
    """
    Uploads a file to AWS S3 and returns the public URL.
    """
    try:
        # Generate a unique filename to prevent overwriting
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{folder}/{uuid.uuid4()}.{file_extension}"

        # Upload to S3
        s3_client.upload_fileobj(
            file.file,
            AWS_BUCKET,
            unique_filename,
            ExtraArgs={'ACL': 'public-read', 'ContentType': file.content_type}
        )

        # Construct the public URL
        url = f"https://{AWS_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"
        return url

    except NoCredentialsError:
        raise Exception("AWS credentials not found.")
    except Exception as e:
        raise Exception(f"S3 Upload Error: {str(e)}")
