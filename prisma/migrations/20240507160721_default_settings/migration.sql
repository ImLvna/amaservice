-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tweetId" TEXT,
    "prompt" TEXT NOT NULL DEFAULT 'Send Me Anything!',
    "color1" TEXT NOT NULL DEFAULT '#ad0091',
    "color2" TEXT NOT NULL DEFAULT '#3900ff',
    CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Settings" ("color1", "color2", "id", "prompt", "tweetId", "userId") SELECT coalesce("color1", '#ad0091') AS "color1", coalesce("color2", '#3900ff') AS "color2", "id", coalesce("prompt", 'Send Me Anything!') AS "prompt", "tweetId", "userId" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
