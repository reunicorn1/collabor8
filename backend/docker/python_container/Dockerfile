# Use an official Python image from the Docker library
FROM python:3.12-slim

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Copy requirements file
COPY requirements.txt /app/

# Install any necessary libraries
# RUN python -m pip cache purge && \
RUN pip install --upgrade pip && \
	pip install --no-cache-dir --no-deps -r requirements.txt

	# Copy the application files into the container (optional step if you want to load initial scripts)
COPY . /app/

# Command to run the Python code (this will be replaced or customized in practice)
CMD ["python3"]
# FROM python:3.9-slim

# # Set the working directory
# WORKDIR /app

# # Copy the requirements file
# COPY requirements.txt .

# # Upgrade pip and install requirements
# RUN pip install --upgrade pip && \
#     pip install --no-cache-dir -r requirements.txt

# # Copy the rest of the application code
# COPY . .

# # Define the command to run the application
# CMD ["python", "app.py"]

