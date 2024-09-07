# 我的博客

基于 Vue3 + TypeScript + naive-ui 快速搭建轻量级博客页面

预览：[https://blog.sanyer.top/](https://blog.sanyer.top/)

后端项目：[myblog-server](https://github.com/sanyers/myblog-server)

依赖：

- vue v3.2.47
- naive-ui 2.38.2

功能：

- [x] 用户管理（管理员登录、注册）
- [x] 类别管理（博客分类，二级分类）
- [x] 博客管理（博客列表、全文搜索、最近更新、置顶博客、发布与取消博客、上传图片）
- [x] 评论管理（博客评论列表、删除评论、审核评论）

## 1、安装

```bash
pnpm install
```

## 2、运行

```bash
npm run dev
```

## 3、打包

```bash
npm run build
```

## 4、nginx 部署

```bash
server {
    listen 443 ssl http2;
    server_name  blog.sanyer.top;

    ssl_certificate "/home/sanyer/cert/_.sanyer.top.crt";
    ssl_certificate_key "/home/sanyer/_.sanyer.top.key";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    gzip on;
    gzip_static on;
    gzip_min_length 1k;
    gzip_comp_level 5;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";
    gzip_buffers 32 4k;
    gzip_http_version 1.1;

    charset 'utf-8';
    location / {
        root   /home/sanyer/myblog-web;
        try_files $uri $uri/ @router;
        index  index.html index.htm;
    }

    location /myblog_api {
        proxy_pass http://localhost:8001;
    }

    location /imgs {
        proxy_pass http://localhost:8001;
    }

    location @router {
        rewrite ^.*$ /index.html last;
    }
}
```
