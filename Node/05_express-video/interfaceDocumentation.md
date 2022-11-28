# express-video 接口文档

## 接口说明

- 基于 RESTful API 接口规范
- 基于 JWT 身份认证
- 使用 CORS 跨域处理
- 接口基础请求地址：`http://127.0.0.1:3000/api/v1`
- 使用 JSON 格式进行数据通信

## 用户注册

path：`/users/registers`

method：`POST`

是否认证：否

| 字段     | 类型   | 是否必需 |
| -------- | ------ | -------- |
| username | string | 是       |
| password | string | 是       |
| email    | string | 是       |
| phone    | string | 是       |

请求示例：

```json
{
  "username": "mochi",
  "password": "123456",
  "email": "123456@qq.com",
  "phone": "18112345678"
}
```

响应示例：

```json
// successed
{
  "username": "mochi",
  "email": "123456@qq.com",
  "phone": "@18112345678",
  "avatar": null,
  "createAt": "2022-11-25T12:02:29.081Z",
  "updateAt": "2022-11-25T12:02:29.081Z",
  "_id": "6380b2af18ff0d787a914d98",
  "__v": 0
}
```

```json
// error
{
  "errors": [
    {
      "value": "123456@qq.com",
      "msg": "邮箱已被注册",
      "param": "email",
      "location": "body"
    }
  ]
}
```

