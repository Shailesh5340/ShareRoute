# MongoDB Atlas Setup Guide

Complete guide to set up MongoDB Atlas for the ShareRoute backend.

## Step 1: Create MongoDB Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Sign up with email, Google, or GitHub
4. Verify your email
5. Accept the service agreement

## Step 2: Create Organization & Project

1. Create a new organization (or use default)
2. Create a new project named "ShareRoute"
3. Click "Create Project"

## Step 3: Create a Cluster

1. Click "Build a Database"
2. Select "M0 Free" (always free)
3. Choose cloud provider (AWS recommended)
4. Choose region (closest to you)
5. Click "Create Deployment"
6. Wait ~10 minutes for cluster to deploy

## Step 4: Create Database User

1. In the cluster view, go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Select "Password" authentication
4. Enter username (e.g., `shareroute_user`)
5. Generate secure password (or create your own)
6. **Save the password - you'll need it**
7. Select role: "Built-in Role" → "Atlas Admin"
8. Click "Add User"

## Step 5: Configure Network Access

1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (for development)
   - For production: Add specific IP addresses
4. Enter description: "Development"
5. Click "Confirm"

## Step 6: Get Connection String

1. Go to "Database" (main view)
2. Click "Connect" button
3. Select "Drivers"
4. Choose Node.js driver
5. Copy the connection string

Example format:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shareroute?retryWrites=true&w=majority
```

## Step 7: Update Backend Configuration

1. Open `backend/.env`
2. Replace `MONGODB_URI` value with your connection string
3. Replace:
   - `username` with your database user
   - `password` with your database password
   - Keep the rest of the URI as-is

Example:
```
MONGODB_URI=mongodb+srv://shareroute_user:MySecurePassword123@cluster0.abc123.mongodb.net/shareroute?retryWrites=true&w=majority
```

## Step 8: Test Connection

1. Start the backend: `npm run dev`
2. You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.abc123.mongodb.net
```

If you see an error:
- Check username/password are correct
- Ensure IP address is whitelisted
- Verify cluster is running

## Using MongoDB Atlas Dashboard

### View Data
1. Go to "Database" → "Browse Collections"
2. Select your database → collection
3. View, search, and filter documents

### Backup & Recovery
1. Automated backups happen daily
2. Go to "Backup" to restore or download

### Monitoring
1. Go to "Monitoring" to view metrics
2. Check connection count, operations, etc.

## Production Best Practices

### 1. Use Dedicated User for Application
```
Do not use admin account for application
Create user with minimal required permissions
```

### 2. Network Security
```
Only allow IPs that need to access
For backend on DigitalOcean, add that IP
For serverless functions, enable "Serverless"
```

### 3. Connection Pooling
MongoDB Atlas handles this automatically

### 4. Backup Strategy
```
Enable continuous backups
Test restore procedures
Keep backups in different regions
```

### 5. Monitoring & Alerts
```
Enable alerts for:
- Failed authentication attempts
- High connection count
- Slow queries
- Disk usage
```

## Free Tier Limits

- **Storage**: 512 MB per project
- **Data Transfer**: 0.5 GB/month
- **Connections**: Up to 100 concurrent
- **Operations**: Shared resources

⚠️ **Note**: If you exceed limits, you must upgrade to paid tier. To avoid this:
1. Delete old test data
2. Implement data cleanup
3. Monitor storage usage

## Upgrade to Paid Tier

1. Go to "Database"
2. Click three dots → "Upgrade to M2 or above"
3. Select desired tier
4. Update billing information
5. Confirm upgrade

## Troubleshooting

### Connection Refused
```
Issue: MongoNetworkError: connect ECONNREFUSED
Solutions:
1. Check MONGODB_URI in .env
2. Verify IP address is whitelisted
3. Check cluster is running
4. Wait if cluster is still deploying
```

### Authentication Failed
```
Issue: MongoAuthenticationError: authentication failed
Solutions:
1. Check username/password in connection string
2. Verify special characters are URL-encoded
3. Ensure user exists in database
4. Check user has correct permissions
```

### Cluster Inactive
```
Issue: Cluster appears to be paused or inactive
Solution:
1. Go to Database → Cluster Settings
2. Look for "Pause this Cluster" option
3. If paused, click "Resume"
```

### Too Many Connections
```
Issue: Can't create new connections
Solutions:
1. Check app isn't creating multiple connections
2. Implement connection pooling
3. Restart backend application
4. Check if data transfer limit exceeded
```

## MongoDB Atlas Pricing

### Free Tier (M0)
- ✅ 512 MB storage
- ✅ Shared resources
- ✅ Basic monitoring
- ✅ Perfect for development & small projects

### Paid Tiers (M2+)
- M2: 2 GB storage - ~$9/month
- M5: 5 GB storage - ~$57/month
- M10+: Dedicated resources

## Security Checklist

- ✅ Use strong password (16+ characters)
- ✅ Enable IP whitelist
- ✅ Use separate database user (not admin)
- ✅ Regularly review access logs
- ✅ Keep connection string secret
- ✅ Use environment variables for secrets
- ✅ Enable backup
- ✅ Monitor unusual activities

## Sample Databases & Collections

### Create Sample Database

1. In "Browse Collections", click "Create Database"
2. Database name: `shareroute`
3. Collection name: `bookings`
4. Click "Create"

### Collection Structure

**bookings**
```javascript
{
  pickupLocation: "123 Main St",
  destination: "456 Oak Ave",
  passengerName: "John Doe",
  passengerEmail: "john@example.com",
  passengerPhone: "+1234567890",
  status: "pending",
  fare: null,
  distance: null,
  estimatedDuration: null,
  createdAt: ISODate("2025-11-18T10:30:00.000Z"),
  updatedAt: ISODate("2025-11-18T10:30:00.000Z")
}
```

## Useful Links

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string)
- [MongoDB University](https://university.mongodb.com) - Free courses
- [Atlas CLI](https://www.mongodb.com/docs/mongodb-atlas/cli) - Command-line tool

## Next Steps

After setup:
1. ✅ Start backend: `cd backend && npm run dev`
2. ✅ Verify connection in console
3. ✅ Test API endpoints with Postman
4. ✅ Connect frontend to backend
5. ✅ Create test bookings
6. ✅ Monitor in Atlas dashboard

## Support

Having issues?
1. Check this guide thoroughly
2. Check backend README.md
3. Check MongoDB Atlas documentation
4. Enable debug logging: `DEBUG=* npm run dev`
5. Check MongoDB Atlas support

---

You're all set! Your MongoDB Atlas cluster is ready for the ShareRoute backend.
