/** 创建用户表 */
const user =
  "CREATE TABLE IF NOT EXISTS users(id int PRIMARY KEY auto_increment,username varchar(32),password varchar(32), time DATETIME)";

const user_login_history =
  "CREATE TABLE IF NOT EXISTS user_login_history(id int PRIMARY KEY auto_increment, user_id int, login_time DATETIME, FOREIGN KEY (user_id) REFERENCES users(id))";

const history_cleaner =
  "CREATE EVENT IF NOT EXISTS history_cleaner ON SCHEDULE EVERY 3 MONTH DO DELETE FROM user_login_history WHERE login_time < DATE_SUB(NOW(), INTERVAL 3 MONTH)";

export { user, user_login_history, history_cleaner };