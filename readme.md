setup prisma with database new backend folder
npx prisma migrate reset

npx prisma migrate dev
npx prisma generate
npx @better-auth/cli migrate
npx @better-auth/cli generate

TODO:
post user , want to see which post only he/she create(one or more can be possible or no post be possible)

Order You Should Write APIs
1️⃣ GET → Read (Safe)
2️⃣ POST → Create
3️⃣ PATCH → Update (Preferred)
4️⃣ DELETE → Remove (Dangerous)
