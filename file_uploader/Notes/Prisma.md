# Table Of Contents

- [About Prisma ORM](#prisma-orm)
- [About Prisma Relations](#prisma-relations)
- [About Prisma Migrate](#prisma-migrate)
- [About Prisma Seeding](#prisma--seeding)
- [Knowledge Check](#knowledge-check)

# Prisma ORM

Prisma is a ORM (Object Relational Mapping)
It helps us avoid writing raw SQL statemnts inside our code.
Its useful because you need to avoid manual writting it and creating duplicate code.
For example, we have Book model to fetch books or filter it. We would need to write it and what if we have Articles model then the logic is the same and we need to write it again!

Benefits of ORM are migrations.

**Migrations** - simply changes in the database table

If we did this manually, we can be error-prone. ORM helps simplify this process.

You can think of ORM Migrations as version control for your database files. If something breaks, we can roll back.

> What are the parts of the Prisma ORM?

1. Prisma Client - query builder for Node.js
2. Prisma Migrate - Migration System (Basically version control but for databases)

> What is Prisma Schema?

- Think of it like a model file. It defines the tables in Prisma langauge format (kinda of like SpringBoot @Entity for java classes)
  - Unlike SpringBoot, you can place multiple model/entity in one file
  - Unlike SpringBoot, this is where you also put your DB connnection/configuration here

> npx prisma generate

This command internally runs some code to create .js files of sql queries to query to your schema you created.

SO WHENEVER YOU UPDATE YOUR PRISMA MODELS, RUN THE GENERATE COMMAND TO GET THOSE CHANGES OR PRISMA MIGRATe

# Prisma Relations

To create relationships between tables. We have our two tables and the propeerty that identitfies the foreign-key to connect the two tables.

Since we use foreign-keys to represent the relationship, we use the following notation:

```
author     User        @relation(fields: [authorId], references: [id])
authorId   Int          // relation scalar field used in @relation
```

The @relation annotation says that the author references the id from the User table

# Prisma Migrate

Prisma Migrates helps you:

1. Keep DB schema in sync with your Prisma schema/models as you make changes to the table
2. Maintain existing data in your DB

Prisma Migrate creates multiple .sql migration files.

### Migration Files

Migrations files are a history of changes made to the SQL files

every time you run prisma migrate, it updates the prisma/migration folder.
Inside that folder, you will get:
subfolders for each date update with the sql files of those changes

# Prisma & Seeding

To seed into your database, Prisma ORM expects a command.

TO set up seeding data
Go into package.json, set up a prisma propeerty and create an object with "seed" key.

## Prisma & Schema Notations

Interestingly, if using Postgres, you will need to use quotation marks to access a table with capital case table name.

** Always name your Postgres tablees with lower-case**

Prisma seems to recommend to name your tables singluar rather than plural. This is just a team-by-team basis so for now, we will follow what Prisma wants.

If you want to keep the plural form for the table use --> \*\*@@map("<NAME OF YOUR TABLE>")

So using that notatin, Prisma will create a table with that inputted table name.
But the model you name inside your Prisma Schema will be use in the Prisma-Client generated code.

# Knowledge Check

> What are some of the challenges using raw sql?

- You will need to manually create raw sql to query. You would need to create a class that has functions for grabbing data. While that may be fine for one class, imagine if you have multiple models. This can be tedious to do. Also, the multiple models might have similar logic queries (ex. getting all books / articles).

> What is Prisma Schema and how is it useful?

- Prisma Schema is a file that contains several properties:

1. DB Connection - connecting to your databaase with username, password, database and which database system you are using (PSQL, MongoDB, etc.)
2. Generator - generator for your prisma models
3. Prisma Schema/Model - the model you write that will have its queries generate for you (queries generate are the common one (ex. get all) - you may write your own queries)

> What is the Prisma Client?

- Prisma Client allows you to make queries to your models. It access the generated SQL queries from the generator.

> What is Prisma Migrate?

- Helps keep track of the changes made to your schema. Think of it like version control but for your database tables
