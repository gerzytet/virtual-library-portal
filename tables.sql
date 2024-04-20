CREATE TABLE Books (
    BookID SERIAL PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    Publisher VARCHAR(100) NOT NULL,
    YearPublished INTEGER NOT NULL,
    ISBN VARCHAR(20) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    UserID INTEGER,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    Password VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Authentication CHAR(1) CHECK (Authentication IN ('Y', 'N'))
);
