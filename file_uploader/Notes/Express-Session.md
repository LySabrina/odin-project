# Express-Session & Prisma Session Store

Session has a proprty called "store" this dictates where to store the session data
Session Data such as the user's information like preferences or shopping cart data.

By default, it uses MemoryStore (in-memory).
Use cases:

- Only for debugging and testing

Cons:

- In-memory so it is inside RAM so if you restart your app, the session data is wiped out
- Can not share this data across multiple servers

Hence, how do we share the session data across multiple servers? We can use a shared database that holds the session data. By using a shared database, servers can read inside this database to know who is logged in.

To create a database with shared session data use: **Prisma Session Store**

**Prisma Session Store** - creates a table inside your DB that holds session data

Pros:

- Can scale horziontally so different servers can access and use the session data
- If servers app restart, the session-data is saved and not wiped out

> What's difference between Prisma Session Store & Connect-Pg-Simple?

- PG-Simple is for session-store with postgres. Prisma Session allows for session-store with postgres but also adds on with the version control for your database
