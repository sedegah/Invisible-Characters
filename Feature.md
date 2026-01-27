# DOCX Unicode Scanner Feature

## Overview
The Unicode Scanner now includes the ability to upload and analyze Microsoft Word (.docx) documents for invisible and suspicious Unicode characters while preserving the document's formatting.

## Features

### 1. **Document Upload**
- Drag-and-drop or click to upload .docx files
- File size limit: 10MB
- Validates file type before processing
- Visual feedback during processing

### 2. **Unicode Detection**
- Scans the entire document for invisible/suspicious characters
- Detects characters like:
  - Zero-width spaces (U+200B)
  - Zero-width joiners/non-joiners (U+200C, U+200D)
  - Non-breaking spaces (U+00A0)
  - Various control characters and formatting marks
  - Direction override characters
  - And many more...

### 3. **Character Analysis**
- Shows the number of different character types found
- Displays total occurrences of suspicious characters
- Provides detailed information for each character:
  - Unicode code point (hex and decimal)
  - Character name
  - Number of occurrences in the document
  - Position information

### 4. **Document Cleaning**
- Removes all detected invisible/suspicious characters
- Preserves document formatting:
  - Text styling (bold, italic, underline)
  - Font sizes
  - Paragraph structure
  - Line breaks
- Generates a cleaned .docx file for download

### 5. **Text Analysis**
- All uploaded document text is displayed in the text area
- Can be further analyzed with the existing Unicode Scanner tools
- Highlighted view shows invisible character positions
- Side-by-side comparison of original and cleaned text

## Usage

### Uploading a Document
1. Navigate to the Unicode Scanner page
2. Click the upload area or drag a .docx file into it
3. Wait for the document to be processed
4. Review the analysis results

### Viewing Results
- **File Info**: See the uploaded filename and file size
- **Detection Summary**: View the count of suspicious character types found
- **Character Grid**: Browse all detected characters with detailed information
- **Occurrence Count**: See how many times each character appears

### Downloading Cleaned Document
1. After upload and analysis, click "Download Cleaned Document"
2. The cleaned file will be saved with "_cleaned" suffix
3. The cleaned document maintains all original formatting except for the removed invisible characters

### Clearing and Starting Over
- Click the "X" button next to the file info to clear the uploaded document
- Or use the "Clear" button to reset the entire scanner

## Technical Details

### Supported Invisible Characters
The scanner detects 70+ types of invisible and suspicious Unicode characters including:
- Control characters (NULL, BACKSPACE, etc.)
- Zero-width characters (ZWSP, ZWJ, ZWNJ)
- Directional formatting marks (LRM, RLM, etc.)
- Non-breaking and zero-width spaces
- Mathematical formatting characters
- And many more...

### Libraries Used
- **mammoth**: For reading .docx files and extracting text
- **docx**: For creating cleaned .docx files with preserved formatting

### File Format Support
- **Supported**: .docx (Microsoft Word 2007+)
- **Not Supported**: .doc (legacy Word format), .pdf, .rtf

## Error Handling
The feature includes comprehensive error handling for:
- Invalid file types
- Files exceeding size limit
- Corrupted or malformed documents
- Processing failures

## Privacy & Security
- All document processing happens client-side in the browser
- No documents are uploaded to any server
- No data is stored or transmitted
- Complete privacy and security for sensitive documents

## Use Cases

### 1. **Document Cleaning**
Clean documents received from external sources that may contain hidden characters.

### 2. **Security Analysis**
Identify potentially malicious invisible characters that could be used for:
- Text spoofing
- Direction override attacks
- Hidden content insertion

### 3. **Document Debugging**
Find and fix formatting issues caused by invisible characters copied from:
- Web pages
- PDFs
- Other documents

### 4. **Quality Control**
Ensure documents are clean before:
- Publishing
- Sharing with clients
- Submitting to systems that reject special characters

## Browser Compatibility
- Chrome/Edge:  Full support
- Firefox:  Full support
- Safari:  Full support
- Mobile browsers:  Supported (with file picker)

## Future Enhancements
Potential improvements for future versions:
- Batch processing of multiple documents
- More advanced formatting preservation
- Support for additional file formats (.doc, .rtf, .pdf)
- Custom character filtering rules
- Document comparison features
- Export analysis reports
