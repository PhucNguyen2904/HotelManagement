# Legacy WordPress Files

> **DO NOT MODIFY** - Archive only for reference

This folder contains the original WordPress installation that was migrated to the new NestJS + Next.js system.

## Contents

- `wp-admin/` - WordPress admin dashboard
- `wp-content/` - Themes, plugins, uploads
- `wp-includes/` - WordPress core files

## Why Kept?

1. **Data Reference** - Contains original room data, bookings structure
2. **Image Assets** - `wp-content/uploads/` may have images to migrate
3. **Plugin Logic** - Reference for booking logic implementation

## Migration Status

| Data | Status | Notes |
|------|--------|-------|
| Users | Migrated | See `backend/scripts/migrate.ts` |
| Room Types | Migrated | Mapped to new schema |
| Bookings | Migrated | Historical data preserved |
| Images | Pending | Need to copy to new CDN |

## Safe to Delete?

Only delete after confirming:
- [ ] All user data migrated
- [ ] All booking history migrated
- [ ] All images copied to new storage
- [ ] System running stable for 30+ days

---

*Last updated: March 2024*
