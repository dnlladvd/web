# Setting Up XAMPP for Construction IMS

## Prerequisites
1. Download and install XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)

## Database Setup

1. Start XAMPP Control Panel and start Apache and MySQL services
2. Open phpMyAdmin by clicking "Admin" button next to MySQL or navigate to http://localhost/phpmyadmin
3. Create a new database:
   - Click on "New" in the left sidebar
   - Enter "construction_ims" as the database name
   - Select "utf8mb4_general_ci" as the collation
   - Click "Create"

## Application Configuration

1. Make sure your .env.local file has the correct MySQL configuration:
```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=construction_ims
MYSQL_PORT=3306
```

2. Initialize the database by visiting:
   - http://localhost:3000/api/db/init

3. Seed the database with sample data by visiting:
   - http://localhost:3000/api/db/seed

4. You can now log in with:
   - Email: admin@example.com
   - Password: admin123

## Troubleshooting

- If you encounter connection issues, make sure XAMPP MySQL service is running
- If you have a custom MySQL password set in XAMPP, update the MYSQL_PASSWORD in .env.local
- If MySQL is running on a different port, update the MYSQL_PORT in .env.local
