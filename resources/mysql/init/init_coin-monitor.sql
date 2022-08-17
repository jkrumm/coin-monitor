# create databases
CREATE DATABASE IF NOT EXISTS `user` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci*/;
# CREATE DATABASE IF NOT EXISTS `analytics` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci*/;

# create root user and grant rights
CREATE USER 'root'@'localhost' IDENTIFIED BY 'local';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
