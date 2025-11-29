# MongoDB Database Seed Files

This folder contains JSON seed files for populating your MongoDB database with initial data.

## Collections

| Collection | File | Description |
|------------|------|-------------|
| `personalinfos` | `personalInfo.json` | Your personal information (only one document) |
| `projects` | `projects.json` | Portfolio projects |
| `experiences` | `experiences.json` | Work experience entries |
| `educations` | `educations.json` | Education history |
| `skills` | `skills.json` | Technical and soft skills |
| `certifications` | `certifications.json` | Certifications and credentials |
| `quotes` | `quotes.json` | Inspirational quotes for universe view |

## How to Import Data

### Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Select your database (e.g., `portfolio`)
4. Click on a collection
5. Click "Add Data" → "Import File"
6. Select the corresponding JSON file

### Using mongoimport CLI
```bash
# Import all collections
mongoimport --uri "mongodb+srv://your-connection-string" --collection personalinfos --file personalInfo.json --jsonArray
mongoimport --uri "mongodb+srv://your-connection-string" --collection projects --file projects.json --jsonArray
mongoimport --uri "mongodb+srv://your-connection-string" --collection experiences --file experiences.json --jsonArray
mongoimport --uri "mongodb+srv://your-connection-string" --collection educations --file educations.json --jsonArray
mongoimport --uri "mongodb+srv://your-connection-string" --collection skills --file skills.json --jsonArray
mongoimport --uri "mongodb+srv://your-connection-string" --collection certifications --file certifications.json --jsonArray
mongoimport --uri "mongodb+srv://your-connection-string" --collection quotes --file quotes.json --jsonArray
```

### Using the Seed Script
```bash
cd backend
node scripts/seedFromJson.js
```

## Notes
- Edit the JSON files with your actual data before importing
- The `personalInfo.json` should only have ONE document (singleton pattern)
- Dates should be in "Month Year" format (e.g., "January 2024")
- Order field determines display order (lower numbers appear first)

