FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install necessary build tools
RUN apk add --no-cache git

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the entire project
COPY . .

# Build the application with the correct path
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main ./cmd/server/main.go

# Final stage
FROM alpine:latest

WORKDIR /app

# Install necessary runtime dependencies
RUN apk --no-cache add ca-certificates

# Copy the binary from builder
COPY --from=builder /app/main .

# Copy any additional necessary files (if needed)
# COPY --from=builder /app/config ./config

# Expose the port
EXPOSE 8080

# Run the binary
CMD ["/app/main"]