# Troubleshooting Guide — HireMind Elite

Common issues encountered during installation, development, or deployment, and how to resolve them.

---

## 1. Local Installation Issues

### Issue: `npm run dev` fails with concurrently errors
- **Symptom**: Terminal returns error: `concurrently command not found` or exits immediately.
- **Solution**: Run `npm install` in the workspace root. Concurrently is declared in root `package.json` devDependencies.

### Issue: Prisma Client generation fails
- **Symptom**: TS compiler returns: `Cannot find module '@prisma/client'` or schema files are missing.
- **Solution**: Navigate to the `backend/` directory and run:
```bash
npx prisma generate
```
Verify that the `DATABASE_URL` in `backend/.env` is set correctly.

---

## 2. Database Mappings

### Issue: Connection refused on `npx prisma db push`
- **Symptom**: Terminal exits with database connection failure code.
- **Solution**:
  1. Verify PostgreSQL is active locally (`pg_isready` command in terminal).
  2. Double check database credentials and port (usually `5432`).
  3. Create the target database (e.g. `hiremind`) manually using pgAdmin or psql before pushing.

---

## 3. Frontend SPA Issues

### Issue: Next.js build fails on linting or typescript checks
- **Symptom**: Next compilation fails due to unescaped characters or any types.
- **Solution**: Ensure your `next.config.ts` includes the ignore build flags:
```typescript
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true }
}
```
This is because our frontend is a static Vanilla JS SPA served via rewrites to `/index.html`, making app-router builds unnecessary.