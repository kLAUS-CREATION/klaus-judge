FROM gcc:latest

# Security: Create non-root user
RUN useradd -m -u 1000 coderunner

# Set working directory
WORKDIR /app

# Switch to non-root user
USER coderunner

# Default command (will be overridden)
CMD ["./solution"]
