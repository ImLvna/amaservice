-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetUserName" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_targetUserName_fkey" FOREIGN KEY ("targetUserName") REFERENCES "User" ("username") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("createdAt", "id", "ip", "message", "targetUserName", "userAgent") SELECT "createdAt", "id", "ip", "message", "targetUserName", "userAgent" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE TABLE "new_MessageResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MessageResponse_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MessageResponse" ("createdAt", "id", "messageId", "response") SELECT "createdAt", "id", "messageId", "response" FROM "MessageResponse";
DROP TABLE "MessageResponse";
ALTER TABLE "new_MessageResponse" RENAME TO "MessageResponse";
CREATE UNIQUE INDEX "MessageResponse_messageId_key" ON "MessageResponse"("messageId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
