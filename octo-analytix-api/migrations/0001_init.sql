-- Migration number: 0001 	 2024-04-08T14:41:32.942Z
CREATE TABLE Users(
    UserId ROWID,
    EmailAddress TEXT UNIQUE NOT NULL,
    OctopusApiKey TEXT UNIQUE NOT NULL,
    OctopusAccountNumber TEXT UNIQUE NOT NULL,
    Auth0UserId TEXT,
    DateCreated DATE NOT NULL,
    DateUpdated DATE
);