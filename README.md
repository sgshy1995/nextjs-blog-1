这是一个 [Next.js](https://nextjs.org/) 项目，使用 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 快速构建和配置。

## Database Operations 数据库操作

默认你已经配置好了docker，无论是在各种环境系统中。

如果你需要清空之前的docker开发环境，请执行以下操作：

```bash
# 查看docker容器
docker ps -a

# 删除docker容器
docker kill <id>
docker rm <id>

# 删除本地数据库储存目录
rm -rf blog-data
```

如果你是旧版docker，可能需要执行以下命令来清空：

```bash
docker container prune
docker volume rm blog-data
```

重新配置开发环境：

```bash
# 创建 postgres 数据库 仓库
mkdir blog-data
docker run -v "$PWD/blog-data":/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_USER=blog -e POSTGRES_HOST_AUTH_METHOD=trust -d postgres:12.2
docker exec -it <id> bash
```

修改 `ormconfig.json` 来配置postgres数据库参数。

配置完成后，执行以下操作：

```bash
# postgres 创建数据库
psql -U blog -w
CREATE DATABASE blog_development ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';

# postgres 创建表
yarn m:run
```

## Getting Started 开始启动

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## 填充数据

```bash
# postgres 填充数据，基于实体
node dist/seed.js
```

## 浏览项目

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More 了解更多

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
