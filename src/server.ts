import app from "./app";
// import * as open from "open";
import config from "./config";
import * as dayjs from "dayjs";
import * as multer from "multer";
import { user, user_login_history, history_cleaner } from "./models/mysql";
import Logger from "./loaders/logger";
import { queryTable } from "./utils/mysql";
const expressSwagger = require("express-swagger-generator")(app);
expressSwagger(config.options);

queryTable("SET GLOBAL event_scheduler = ON", "开启定时器");
queryTable(user, "用户表创建成功");
queryTable(user_login_history, "用户登录历史表创建成功");
queryTable(history_cleaner, "用户登录历史表定时清理器创建成功");

import {
  login,
  register,
  updateList,
  deleteList,
  searchPage,
  searchVague,
  upload,
  captcha,
  insertUserLoginHistory,
  verifyToken,
  getUserLoginHistory,
} from "./router/http";

app.post("/login", (req, res) => {
  login(req, res);
  if (res.statusCode === 200) {
    insertUserLoginHistory(req, res);
  }
});

app.post("/register", (req, res) => {
  register(req, res);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get("/verifyToken", (req, res) => {
  verifyToken(req, res);
});

app.put("/updateList/:id", (req, res) => {
  updateList(req, res);
});

app.delete("/deleteList/:id", (req, res) => {
  deleteList(req, res);
});

app.post("/searchPage", (req, res) => {
  searchPage(req, res);
});

app.post("/searchVague", (req, res) => {
  searchVague(req, res);
});

app.get("/loginHistory", (req, res) => {
  getUserLoginHistory(req, res);
});

// 新建存放临时文件的文件夹
const upload_tmp = multer({ dest: "upload_tmp/" });
app.post("/upload", upload_tmp.any(), (req, res) => {
  upload(req, res);
});

app.get("/captcha", (req, res) => {
  captcha(req, res);
});


app.ws("/socket", function (ws, req) {
  ws.send(
    `${dayjs(new Date()).format("YYYY年MM月DD日HH时mm分ss秒")}成功连接socket`
  );

  // 监听客户端是否关闭socket
  ws.on("close", function (msg) {
    console.log("客户端已关闭socket", msg);
    ws.close();
  });

  // 监听客户端发送的消息
  ws.on("message", function (msg) {
    // 如果客户端发送close，服务端主动关闭该socket
    if (msg === "close") ws.close();

    ws.send(
      `${dayjs(new Date()).format(
        "YYYY年MM月DD日HH时mm分ss秒"
      )}接收到客户端发送的信息，服务端返回信息：${msg}`
    );
  });
});

app
  .listen(config.port, () => {
    Logger.info(`
    ################################################
    🛡️  Swagger文档地址: http://localhost:${config.port} 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    Logger.error(err);
    process.exit(1);
  });

// open(`http://localhost:${config.port}`); // 自动打开默认浏览器
