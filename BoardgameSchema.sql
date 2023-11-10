DROP SCHEMA IF EXISTS BoardgameData;
CREATE SCHEMA BoardgameData;
USE BoardgameData;

DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Designers;
DROP TABLE IF EXISTS Artists;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Mechanics;
DROP TABLE IF EXISTS Publishers;
DROP TABLE IF EXISTS Paints;
DROP TABLE IF EXISTS Designs;
DROP TABLE IF EXISTS Catagorizes;
DROP TABLE IF EXISTS HaveMechanic;
DROP TABLE IF EXISTS Publishes;

CREATE TABLE Games(
    GameID VARCHAR(10),
    GameName VARCHAR(100),
    GameType VARCHAR(30),
    Rating FLOAT NULL,
    Complexity FLOAT NULL,
    YearPub VARCHAR(4),
    MinPlayer INT NULL, 
    MaxPlayer INT NULL, 
    MinTime INT NULL, 
    MaxTime INT NULL, 
    PRIMARY KEY (GameID)
);

CREATE TABLE Designers(
    DesignerID VARCHAR(10),
    DesignerName VARCHAR(50),
    PRIMARY KEY (DesignerID)
);

CREATE TABLE Artists(
    ArtistID VARCHAR(10),
    ArtistName VARCHAR(50),
    PRIMARY KEY (ArtistID)    
);

CREATE TABLE Categories(
    CategoryID VARCHAR(10), 
    CategoryName VARCHAR(50),
    PRIMARY KEY (CategoryID)
);

CREATE TABLE Mechanics(
    MechanicID VARCHAR(10), 
    MechanicName VARCHAR(50),
    PRIMARY KEY (MechanicID)
);

CREATE TABLE Publishers(
    PublisherID VARCHAR(10), 
    PublisherName VARCHAR(50),
    PRIMARY KEY (PublisherID)
);

CREATE TABLE Paints(
    ArtistID VARCHAR(10), 
    GameID VARCHAR(10),
    FOREIGN KEY (ArtistID) REFERENCES Artists(ArtistID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);

CREATE TABLE Designs(
    DesignerID VARCHAR(10), 
    GameID VARCHAR(10),
    FOREIGN KEY (DesignerID) REFERENCES Designers(DesignerID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);

CREATE TABLE Categorizes (
    CategoryID VARCHAR(10), 
    GameID VARCHAR(10),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);

CREATE TABLE HaveMechanic (
    MechanicID VARCHAR(10), 
    GameID VARCHAR(10),
    FOREIGN KEY (MechanicID) REFERENCES Mechanics(MechanicID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);

CREATE TABLE Publishes (
    PublisherID VARCHAR(10), 
    GameID VARCHAR(10),
    FOREIGN KEY (PublisherID) REFERENCES Publishers(PublisherID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);