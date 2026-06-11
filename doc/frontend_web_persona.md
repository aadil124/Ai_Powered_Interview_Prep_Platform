# Frontend Web Persona (Admin Dashboard)

## Persona Profile
- **Platform:** Web / Desktop Browser
- **Framework:** React.js + TypeScript
- **UI library:** Material UI (MUI)
- **User type:** Content Admin, Super Admin

## Screen Wireframes (Admin screens)

### 1. Admin Login & OTP Screen
- **Primary goal:** Secure authentication for high-privilege access.
- **Layout structure:** Centered Login Card -> Credentials Input -> OTP Verification -> Error/Success Banners.
- **Data flow:** User Credentials -> JWT Token -> Encrypted LocalStorage -> Redux/Context Auth State.
- **Mermaid diagram:**
  ```mermaid
  graph TD
      A[Enter Credentials] --> B[Validate]
      B --> C[OTP Prompt]
      C --> D[Exchange JWT]
      D --> E[Load Dashboard]
  ```

### 2. Main Dashboard & Telemetry
- **Primary goal:** High-level overview of system usage and Q&A counts.
- **Layout structure:** Sidebar Navigation | Top App Bar (Profile/Logout) | Grid of KPI Widgets (Completed Sessions, Total Questions, Errors).
- **Data flow:** Backend Metrics Endpoint -> React Query -> Recharts/MUI Charts.
- **Mermaid diagram:**
  ```mermaid
  graph TD
      A[Dashboard Mount] --> B[Fetch Telemetry Data]
      B --> C[Render KPIs]
      B --> D[Render Charts]
  ```

### 3. Department & Subdomain Manager
- **Primary goal:** Create, edit, and organize domains of knowledge.
- **Layout structure:** DataGrid Table (List Departments) -> Floating Action Button (Add) -> Dialog Modal (Edit/Create fields).
- **Data flow:** API GET Departments -> MUI DataGrid -> Edit Modal -> API PUT/POST -> Refresh Grid.
- **Mermaid diagram:**
  ```mermaid
  graph TD
      A[View Departments] --> B[Click Add/Edit]
      B --> C[Fill Form Data]
      C --> D[Submit to API]
      D --> A
  ```

### 4. Bulk Question Ingestion Console
- **Primary goal:** Upload Q&A documents and monitor extraction status.
- **Layout structure:** Drag-and-Drop Zone (File Upload) -> Progress Bars -> Parsed Results Table -> Approve/Reject Actions.
- **Data flow:** File Object -> FormData POST -> Receive Task ID -> Poll Status -> Display Extracted Items.
- **Mermaid diagram:**
  ```mermaid
  graph TD
      A[Upload PDF/DOCX] --> B[Backend Processing]
      B --> C[Poll Status]
      C --> D[Review Extracted Q&A]
      D --> E[Save to Database]
  ```

## Styling System
- **Colors:** Clean, enterprise look. Primary (Navy Blue), Secondary (Grey/Silver), Success (Green), Error (Red), Background (Very Light Grey #F5F5F5).
- **Typography:** Inter or Roboto. Standard sizing (14px body, 16px table headers, 24px section titles).

## Component States
- **Table:** Loading (Skeleton rows), Sorted (Arrow indicator), Selected (Highlight row background), Empty (Illustration).
- **Modal:** Opening (Fade in), Background (Dimmed backdrop), Actions (Cancel/Submit buttons).
- **Button:** Contained (Primary action), Outlined (Secondary action), Disabled (Greyed out), Loading (Circular spinner inside).

## Empty States
- **No records:** "No departments configured yet." (Show in DataGrid).
- **No results:** "No search results match your query."
- **Empty dashboards:** "Not enough telemetry data to display metrics."

## Error States
- **400 Bad Request:** Form validation errors displayed inline below the offending text field.
- **401/403 Unauthorized:** "Session expired or access denied." -> Force logout / redirect to login screen.
- **404 Not Found:** Dedicated "Page Not Found" illustration screen.
- **500 Server Error:** Global Snackbar alert: "An unexpected error occurred. Please contact system support."

## Responsive Breakpoints
- **Mobile (<600px):** Sidebar collapses into a Hamburger menu. Tables collapse to stacked cards.
- **Tablet (600px - 960px):** Fluid grids, reduced margins.
- **Desktop (>960px):** Fixed persistent sidebar, multi-column KPI dashboard.

## Accessibility
- **ARIA roles:** Explicit roles for modals (`role="dialog"`), navigation (`role="navigation"`), and dynamic alerts (`role="alert"`).
- **Keyboard navigation:** Full support for `Tab` indexing through forms, DataGrids, and sidebar links. Escape key support to close modals.
- **Focus management:** Auto-focus on the first input field when a modal opens. Trap focus inside modals until closed.
