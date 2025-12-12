# Feature: Logo dan Header Sistem

## Ringkasan
Sistem sekarang mempunyai logo dan header yang konsisten di seluruh aplikasi untuk branding dan user experience yang lebih baik.

## Components Yang Dibuat

### 1. Logo Component (`components/Logo.tsx`)
**Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `showText`: boolean (default: true)
- `className`: string (optional)

**Features:**
- Logo icon dengan gradient blue (mewakili Johor)
- Text "JohorUP" dengan subtitle "Program SPM 2026"
- Responsive sizing (sm/md/lg)
- Option untuk hide/show text

**Usage:**
```tsx
<Logo size="lg" />                    // Large logo with text
<Logo size="sm" showText={false} />   // Small icon only
```

### 2. DashboardHeader Component (`components/DashboardHeader.tsx`)
**Props:**
- `title`: string (required)
- `subtitle`: string (optional)
- `user`: user object (optional)
- `onLogout`: function (optional)
- `children`: React.ReactNode (optional - for buttons/actions)

**Features:**
- Logo di sebelah kiri
- Title dan subtitle
- User info dengan role detection
- Logout button
- Slot untuk additional buttons (Excel download, etc.)

**Usage:**
```tsx
<DashboardHeader 
  title="JohorUP Dashboard"
  subtitle="Program Pemantauan SPM 2026"
  user={user}
  onLogout={handleLogout}
>
  <button>Download Excel</button>
</DashboardHeader>
```

## Lokasi Logo/Header

### 1. **Login Page** (`app/login/page.tsx`)
- Logo besar (size="lg") di tengah
- Branding "JohorUP" dengan subtitle
- "Jabatan Pendidikan Negeri Johor"

### 2. **Main Dashboard** (`app/dashboard/page.tsx`)
- DashboardHeader dengan logo kecil
- Title: "JohorUP Dashboard"
- Excel download buttons
- User info dan logout

### 3. **School Dashboard** (`app/dashboard/school/page.tsx`)
- DashboardHeader dengan nama sekolah
- Logo kecil di header

### 4. **Layout Metadata** (`app/layout.tsx`)
- Updated page title: "JohorUP - Sistem Pemantauan Program SPM 2026"
- SEO-friendly description

## Design Elements

### Logo Design:
- **Shape:** Rounded square dengan gradient
- **Colors:** Blue gradient (from-blue-600 to-blue-800)
- **Text:** White text inside logo
- **Sizes:** 
  - Small: 32x32px (w-8 h-8)
  - Medium: 48x48px (w-12 h-12)
  - Large: 64x64px (w-16 h-16)

### Header Design:
- **Background:** White dengan shadow
- **Border:** Bottom border untuk separation
- **Layout:** Flexbox dengan space-between
- **Responsive:** Adapts to screen size

## Branding Consistency

### Color Scheme:
- **Primary Blue:** #2563eb (blue-600)
- **Dark Blue:** #1e40af (blue-800)
- **Text:** #1f2937 (gray-800)
- **Subtitle:** #6b7280 (gray-600)

### Typography:
- **Logo Text:** Bold, clean font
- **Headers:** 2xl font-bold
- **Subtitles:** sm text-gray-600

## User Role Detection

Header automatically detects user role based on email:
- `sekolah` → "Sekolah"
- `ppd` → "PPD"
- `pembelajaran` → "Sektor Pembelajaran"
- `perancangan` → "Sektor Perancangan"
- Default → "Koordinator"

## Future Enhancements

1. **Real Logo Upload**
   - Allow admin to upload custom logo
   - Support PNG/SVG formats
   - Logo management interface

2. **Theme Customization**
   - Multiple color themes
   - Dark mode support
   - Custom branding per district

3. **Advanced Header**
   - Breadcrumb navigation
   - Quick search functionality
   - Notification bell
   - User avatar/profile picture

4. **Mobile Optimization**
   - Collapsible header on mobile
   - Hamburger menu
   - Touch-friendly buttons

## Implementation Notes

- Logo component is reusable across all pages
- Header component accepts children for custom buttons
- Consistent spacing and styling
- Accessible design with proper contrast
- SEO optimized with proper meta tags