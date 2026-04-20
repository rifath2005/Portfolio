# CV Download Button Setup 📄

## How to Add Your Google Drive CV Link

### Step 1: Upload Your CV to Google Drive
1. Go to [Google Drive](https://drive.google.com)
2. Upload your CV/Resume PDF file
3. Right-click on the file → Click "Share"
4. Click "Change to anyone with the link"
5. Make sure it's set to "Viewer" permission
6. Copy the link

### Step 2: Get the File ID
Your Google Drive link looks like this:
```
https://drive.google.com/file/d/1ABC123xyz456DEF789/view?usp=sharing
```

The File ID is the part between `/d/` and `/view`:
```
1ABC123xyz456DEF789
```

### Step 3: Update the HTML
In `index.html`, find this line (around line 70):
```html
<a href="https://drive.google.com/file/d/YOUR_GOOGLE_DRIVE_FILE_ID/view?usp=sharing"
```

Replace `YOUR_GOOGLE_DRIVE_FILE_ID` with your actual File ID:
```html
<a href="https://drive.google.com/file/d/1ABC123xyz456DEF789/view?usp=sharing"
```

### Alternative: Direct Download Link
If you want the file to download directly instead of opening in browser, use this format:
```html
<a href="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
```

## Button Features

### Visual Design
- **Default State**: Shows "Download" with down arrow (↓)
- **Hover State**: Text changes to "CV"
- **Border**: 2px solid black
- **Animation**: Smooth text transition

### Hover Effect
1. "Download" text slides up and fades out
2. "CV" text slides up from bottom and fades in
3. Down arrow (↓) moves down slightly
4. Button scales up (1.05x)
5. Shadow appears

### Mobile Behavior
- Hidden on mobile (<768px)
- Only visible on desktop
- Keeps navbar clean on small screens

## Button Placement
Located in navbar between navigation links and Contact Me button:
```
[Logo] [Nav Links] [Download CV] [Contact Me] [Hamburger]
```

## Customization Options

### Change Button Text
In `index.html`:
```html
<span class="download-btn-text">Download</span>  <!-- Default text -->
<span class="download-btn-hover">CV</span>       <!-- Hover text -->
```

You can change to:
- Download → Resume
- Get → CV
- View → Resume
- Download → Portfolio

### Change Button Color
In `style.css`, find `.download-btn` and modify:
```css
border: 2px solid #000000;  /* Border color */
color: #000000;             /* Text color */
```

### Change Hover Background
```css
.download-btn:hover {
  background: rgba(0, 0, 0, 0.05);  /* Light gray */
}
```

### Change Arrow Icon
In `style.css`, find `.download-btn::after`:
```css
content: '↓';  /* Change to: ⬇ 📥 ⤓ */
```

## Testing Checklist

- [ ] Upload CV to Google Drive
- [ ] Set sharing to "Anyone with the link"
- [ ] Copy File ID
- [ ] Update HTML with File ID
- [ ] Test button hover effect
- [ ] Test download functionality
- [ ] Verify mobile responsiveness
- [ ] Check button alignment

## Troubleshooting

### Button Not Downloading
**Problem**: File opens in browser instead of downloading
**Solution**: Use the direct download link format:
```html
href="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
```

### "Access Denied" Error
**Problem**: File is not publicly accessible
**Solution**: 
1. Go to Google Drive
2. Right-click file → Share
3. Change to "Anyone with the link"
4. Set permission to "Viewer"

### Button Not Visible
**Problem**: Button doesn't appear
**Solution**: Check if you're on mobile - button is hidden on screens <768px

### Hover Effect Not Working
**Problem**: Text doesn't change on hover
**Solution**: Clear browser cache and refresh (Ctrl+Shift+R)

## Example CV Links

### Google Drive (View in Browser)
```html
href="https://drive.google.com/file/d/1ABC123xyz456DEF789/view?usp=sharing"
```

### Google Drive (Direct Download)
```html
href="https://drive.google.com/uc?export=download&id=1ABC123xyz456DEF789"
```

### Dropbox
```html
href="https://www.dropbox.com/s/abc123xyz/resume.pdf?dl=1"
```

### OneDrive
```html
href="https://onedrive.live.com/download?cid=ABC123&resid=XYZ789&authkey=KEY"
```

---

**Status**: ✅ Button added and styled
**Next Step**: Add your Google Drive CV link
**Mobile**: Hidden on mobile devices
**Desktop**: Visible with hover animation
