-- CreateTable
CREATE TABLE `user_tb` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `userFullname` VARCHAR(100) NOT NULL,
    `userEmail` VARCHAR(50) NOT NULL,
    `userPassword` VARCHAR(50) NOT NULL,
    `userImage` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kinkun_tb` (
    `kinkunId` INTEGER NOT NULL AUTO_INCREMENT,
    `kinkunTitle` VARCHAR(100) NOT NULL,
    `kinkunState` VARCHAR(50) NOT NULL,
    `kinkunDate` VARCHAR(50) NOT NULL,
    `kinkunCost` FLOAT NOT NULL,
    `kinkunImage` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`kinkunId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
