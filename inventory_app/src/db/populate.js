import { Client } from "pg";
import * as credentials from "./credentials.js";

const client = new Client({
  host: credentials.DB_HOST,
  database: credentials.DB_NAME,
  user: credentials.DB_USER,
  password: credentials.DB_PASSWORD,
  port: credentials.DB_PORT,
});

const SQL = `
    Drop table if exists Game cascade;
    Drop table if exists Developer cascade;
    Drop table if exists Genre cascade;
    Drop table if exists Game_Developer;
    Drop table if exists Game_Genre;

    Create table Game(
        id Int primary key GENERATED ALWAYS AS IDENTITY,
        name varchar(255),
        release_date DATE
    );

    create table Developer(
        id int primary key GENERATED ALWAYS AS IDENTITY,
        first_name varchar(255),
        last_name varchar(255),
        role_level varchar(255)
    );

    create table Genre(
        id int primary key GENERATED ALWAYS AS IDENTITY,
        name varchar(255) unique
    );

    create table Game_Developer(
        game_id int,
        developer_id int,
        primary key(game_id, developer_id),
        foreign key (game_id) references Game(id) on delete cascade on update cascade,
        foreign key (developer_id) references Developer(id) on delete cascade on update cascade
    );

    create table Game_Genre(
        game_id int,
        genre_name varchar(255),
        primary key (game_id, genre_name),
        foreign key (game_id) references Game(id) on delete cascade on update cascade,
        foreign key (genre_name) references Genre(name) on delete cascade on update cascade
    );

    INSERT INTO Game (name, release_date) VALUES
    ('Sekiro', '2019/03/22'),
    ('Clair Obscur: Expedition 33', '2025-04-24'),
    ('Stardew Valley', '2016-02-26');

    INSERT INTO Developer (first_name, last_name, role_level) VALUES
    ('Liam', 'Reynolds', 'Lead'),
    ('Sofia', 'Martinez', 'Senior'),
    ('Ethan', 'Nguyen', 'Mid'),
    ('John', 'Smith', 'Junior')
    ;

    INSERT INTO Genre (name) VALUES
        ('RPG'),
        ('Action'),
        ('Simulation'),
        ('Farming');

    INSERT INTO Game_Developer (game_id, developer_id) VALUES
        (1, 1),  
        (2, 2),  
        (3, 3),  

        -- Cross-collaboration:
        (2, 1),  
        (3, 2);  

    INSERT INTO Game_Genre (game_id, genre_name) VALUES
        (1, 'RPG'), 
        (1, 'Action'), 
        (2, 'Action'), 
        (2, 'Simulation'), 
        (3, 'Farming');



`;

await client.connect();
console.log("populating DB....");
await client.query(SQL);
await client.end();
console.log("finished...");
