# CamSave

一个简单的，通过手机摄像头向电脑快速传输图片的node项目。

## 准备工作

安装依赖

```shell
pnpm install
```

在certs文件夹准备自签名证书（浏览器只能在https下调用摄像头）。

```shell
openssl req -x509 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes
```

## 启动项目并访问

```shell
node server.js
```
