# File Uploader Component

A modern, feature-rich file uploader component built with React, TypeScript, and Tailwind CSS. This component provides a beautiful and intuitive interface for file uploads with drag-and-drop support, progress tracking, and validation.

## Features

- 🎨 Modern UI with animated background patterns
- 📁 Drag & Drop file upload
- 📊 Real-time upload progress tracking
- ✅ File validation (size and format)
- 🔄 Upload retry functionality
- ❌ Upload cancellation
- 🎯 Configurable file restrictions
- 📱 Responsive design

## Architecture

### Core Components

1. **FileUploader**
   - Main component handling file selection and drag-drop
   - Manages file validation and upload initiation
   - Provides visual feedback during uploads

2. **UploadItem**
   - Displays individual file upload status
   - Shows progress, success, or error states
   - Handles retry and cancel actions

3. **FormatToggle**
   - UI component for toggling allowed file formats
   - Provides visual feedback for selected formats

### State Management

- Uses Zustand for state management
- Tracks upload progress, file status, and error states

### API Integration

- Built with Axios for HTTP requests
- Uses React Query for data fetching and caching
- Implements proper error handling and retry logic

## Setup

### Prerequisites

- Node.js (v14 or newer)
- pnpm or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd file-uploader
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm run dev
# or
npm run dev
```

## Usage

### Basic Implementation

```tsx
import { FileUploader } from './components/FileUploader';

function App() {
  const handleUpload = (file: File) => {
    // Your upload logic here
  };

  const validateFile = (file: File) => {
    return {
      valid: file.size <= 5 * 1024 * 1024, // 5MB limit
      error: file.size > 5 * 1024 * 1024 ? 'File too large' : undefined
    };
  };

  return (
    <FileUploader
      maxSize={5} // 5MB
      allowedFormats={['.JPG', '.PNG']}
      onUpload={handleUpload}
      validateFile={validateFile}
      variant="illustration"
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxSize` | `number` | `5` | Maximum file size in MB |
| `allowedFormats` | `string[]` | `[]` | Array of allowed file extensions |
| `onUpload` | `(file: File) => void` | - | Function to handle file upload |
| `validateFile` | `(file: File) => { valid: boolean; error?: string }` | - | Function to validate files |
| `variant` | `'simple' \| 'illustration'` | `'simple'` | Visual variant of the uploader |
| `isInProgress` | `boolean` | `false` | Whether an upload is in progress |

### Styling

The component uses Tailwind CSS for styling and includes:
- Custom color palette with grey scale
- Responsive design
- Animated background patterns
- Custom fonts (Manrope and InterTight)

### File Validation

The component supports custom file validation through the `validateFile` prop. Example:

```tsx
const validateFile = (file: File) => {
  // Check file size
  if (file.size > maxSize * 1024 * 1024) {
    return { valid: false, error: 'File too large' };
  }

  // Check file format
  const extension = file.name.split('.').pop()?.toUpperCase();
  if (!allowedFormats.includes(`.${extension}`)) {
    return { valid: false, error: 'Unsupported format' };
  }

  return { valid: true };
};
```