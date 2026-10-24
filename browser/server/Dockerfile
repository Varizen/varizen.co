# Eye AI Gateway — production image.
# Secrets are NEVER baked in. Inject at runtime via your platform's secret store.
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Only the gateway files — the browser source is not part of this image.
COPY index.js policy.js keypool.js package.json ./

# Run as a non-root user.
USER node

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8787/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "index.js"]
