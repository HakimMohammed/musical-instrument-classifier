# =============================================================================
# Musical Instrument Classifier - Backend Dockerfile
# Multi-stage build for optimized image size
# Uses uv for fast dependency installation
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Builder - Install dependencies with uv
# -----------------------------------------------------------------------------
FROM python:3.13-slim AS builder

WORKDIR /app

# Install uv (fast Python package manager)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Set uv environment variables
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

# Install dependencies using uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

# -----------------------------------------------------------------------------
# Stage 2: Runtime - Slim production image
# -----------------------------------------------------------------------------
FROM python:3.13-slim AS runtime

WORKDIR /app

# Install runtime dependencies for audio processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy virtual environment from builder (uv creates .venv)
COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Set Python environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Copy application code (models are mounted as volume)
COPY config/ ./config/
COPY src/ ./src/
COPY utils/ ./utils/

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/')" || exit 1

# Run the API
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
