# Project Inventory

Inventory app should have categories and items

Users can go to home-page and choose a category to view. Then get a list of items in that category.

CRUD for both items and categories

Game Managment App
Game, genre, developer
Game can have one or more developers
Game can have one or more genre
Developer can work on multiple games

Tables:
Game(id:Integer, name:Varchar(255), release_date:Date);
Developer(id:integer, fname:varchar, lname:varchar, role_level:Enum);
Genres(id:integer, name:varchar(255));
Game_Developer(game_id: FK, developer_id: FK);
Game_Genres(game_id: FK, genre:FK);

I was thinking of whether to make the genre an enum. Since our genre is the category, and we can allow our user to remove genres - then its better to have it as a stored varchar. Enums are best when we avoid deleting values.

I think in this case, role_level shall be an enum. We are certain in a company to have the following levels:

- intern
- junior
- middle
- senior

Issue I found, I made a game_genre table where it references the id of both tables.

When I am doing: /genre[]=Action&genre[]=Adventure

It becomes annoying because I will need to find the genre_id to then do the sql statement: select game_id from game_genre where genre_name in (...)


