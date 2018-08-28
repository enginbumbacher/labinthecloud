module.exports = {
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "mysql": {
    "host": process.env.RDS_HOSTNAME,
    "port": process.env.RDS_PORT,
    "url": "",
    "database": process.env.RDS_DB_NAME,
    "password": process.env.RDS_PASSWORD,
    "name": "mysql",
    "user": process.env.RDS_USERNAME,
    "connector": "mysql"
  },
  "emailDs": {
    "name": "emailDs",
    "connector": "mail",
    "transports": [
      {
        "type": "smtp",
        "host": "smtp.gmail.com",
        "secure": true,
        "port": 465,
        // "tls": {
        //   "rejectUnauthorized": false
        // },
        "auth": {
          "user": process.env.SCRIPT_EMAIL,
          "pass": process.env.SCRIPT_EMAIL_PASSWORD
        }
      }
    ]
  }
}