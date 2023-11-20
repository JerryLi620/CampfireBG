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
    GameID INT,
    GameName VARCHAR(300),
    GameType VARCHAR(30),
    Rating FLOAT NULL,
    Complexity FLOAT NULL,
    YearPub VARCHAR(10),
    MinPlayer INT NULL, 
    MaxPlayer INT NULL, 
    MinTime INT NULL, 
    MaxTime INT NULL, 
    PRIMARY KEY (GameID)
);

CREATE INDEX idx_rating ON Games (Rating);
CREATE INDEX idx_complexity ON Games (Complexity);
CREATE INDEX idx_minPlayer ON Games (MinPlayer);
CREATE INDEX idx_maxPlayer ON Games (MaxPlayer);
CREATE INDEX idx_minTime ON Games (MinTime);
CREATE INDEX idx_maxTime ON Games (MaxTime);


CREATE TABLE Designers(
    DesignerID INT,
    DesignerName VARCHAR(200),
    PRIMARY KEY (DesignerID)
);

CREATE TABLE Artists(
    ArtistID INT,
    ArtistName VARCHAR(200),
    PRIMARY KEY (ArtistID)    
);

CREATE TABLE Categories(
    CategoryID INT, 
    CategoryName VARCHAR(200),
    PRIMARY KEY (CategoryID)
);

CREATE TABLE Mechanics(
    MechanicID INT, 
    MechanicName VARCHAR(200),
    PRIMARY KEY (MechanicID)
);

CREATE TABLE Publishers(
    PublisherID INT, 
    PublisherName VARCHAR(200),
    PRIMARY KEY (PublisherID)
);

CREATE TABLE Paints(
    ArtistID INT, 
    GameID INT,
    FOREIGN KEY (ArtistID) REFERENCES Artists(ArtistID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);

CREATE TABLE Designs(
    DesignerID INT, 
    GameID INT,
    FOREIGN KEY (DesignerID) REFERENCES Designers(DesignerID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);

CREATE TABLE Categorizes (
    CategoryID INT, 
    GameID INT,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);

CREATE TABLE HaveMechanic (
    MechanicID INT, 
    GameID INT,
    FOREIGN KEY (MechanicID) REFERENCES Mechanics(MechanicID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);

CREATE TABLE Publishes (
    PublisherID INT, 
    GameID INT,
    FOREIGN KEY (PublisherID) REFERENCES Publishers(PublisherID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);