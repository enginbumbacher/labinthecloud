# Euglena Modeling

## Getting Started

[Node](https://nodejs.org) and [npm](https://npmjs.org) are required for easy installation and development of this project.

Once both are installed, run the following from the project root to install all dependencies:

> $ npm install

To compile the code, run:

> $ npm run build

Local environment variables are set using a .env file. In the root of your project, create a file named .env, containing the following configurations:

```
RDS_HOSTNAME = <MySQL Host>
RDS_PORT = <MySQL Port>
RDS_DB_NAME = <MySQL database name>
RDS_USERNAME = <MySQL username>
RDS_PASSWORD = <MySQL password>

AWS_ACCESS_KEY_ID = <AWS key ID>
AWS_SECRET_ACCESS_KEY = <AWS key>
S3_BUCKET = <AWS S3 bucket name>

ADMIN_EMAIL = <admin user email address, presumably yours>
ADMIN_PASSWORD = <admin user password>

COOKIE_SECRET = <string used for securing cookies; can be any string>
```

If you just wish to run the server by itself, use the following command.  

> $ npm start

If running the above command, please make sure you have run the build for the project at least once.
