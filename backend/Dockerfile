# Dockerfile for deaify

# Use the official AWS Lambda Python base image
FROM public.ecr.aws/lambda/python:3.9

# Copy the requirements file
COPY requirements.txt ./

# Install the Python dependencies
RUN pip install -r requirements.txt

# Copy your application code into the container
COPY main.py ./

# Set the command to run when the Lambda function is invoked
# It tells Lambda your handler is in the 'main.py' file and is named 'handler'
CMD [ "main.handler" ]
