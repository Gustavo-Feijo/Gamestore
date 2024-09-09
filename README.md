# GameStore

---

This project is a e-commerce project.
It uses Next.js, alongside with ShadcnUI components, Auth.js and Prisma.
The main goal of the project is to create a good looking UI, while developing a working product.
Most of the main functionalities will be using mocking systems, like payment.
Seeding will be used for providing the bare minimum for the UI.
Aiming to mantain the scope, management pages will not be added, such as adding new entries of games, categories, etc.

---

## Functionalities

The expected functionalities are as follow:
- Mocking sales system, with shopping cart, sales history, etc.
- Authentication for each user.
- Review system.

---

## Technologies

The currently employed technologies are as follow:
-Next.js
-React.js
-TailwindCss
-ShadcnUI
-Auth.js
-Prisma (PostgreSQL)

---

## RUNNING

For running the project some few steps are required.
Node.js and PostgreSQL must be installed.

1. Run `npm install`.
2. Setup .env, required env's bellow..
3. Run `npx prisma migrate deploy`
4. Run `npm run seed`.
5. Run `npm run deploy`
6. Optional: Run `npm run seedReview` after at least a user login.
   
.env example:
DATABASE_URL=""
AUTH_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
NEXT_PUBLIC_APPLICATION_URL=""
NEXTAUTH_URL= 
AUTH_TRUST_HOST=

---

## TODO

- [X] Initiate the project.
- [X] Implement Auth.js.
- [X] Create initial database setup.
- [X] Create basic UI starting point.
- [X] Implement fully functional TopBar with SideBar menu.
- [X] Create starting page.
- [X] Create functional Games page.
- [X] Add functional Shopping Cart.
- [X] Seeding for the database.
- [X] Create pseudo payment process.
- [X] Add responsivity.
