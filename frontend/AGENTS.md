# Build & Run
- Dev: `npm run dev` (Vite, http://localhost:5173)
- Build: `npm run build`
- Preview: `npm run preview`

# Conventions
- Vue 3 + TypeScript + Ant Design Vue
- `<script setup lang="ts">` for components
- Store: Pinia (`src/stores/`)
- API: `src/services/api.js` (gatewayApi, medicalApi, pharmacyApi)
- Styles: scoped or imported from `src/styles/`

# Routes
- `/medical-records` — MedicalRecordsListView (full, for Admin/Patient)
- `/my-medical-records` → redirects to `/medical-records`
- `/pharmacy/my-invoices` — MyInvoicesView (invoices + prescriptions tab)
