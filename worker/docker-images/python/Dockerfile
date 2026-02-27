FROM python:3.11-slim

# Security: Create non-root user
RUN useradd -m -u 1000 coderunner

# Set working directory
WORKDIR /app

# Install common libraries (optional)
RUN pip install --no-cache-dir numpy pandas

# Switch to non-root user
USER coderunner

# Default command (will be overridden)
CMD ["python", "solution.py"]
