-- CreateEnum
CREATE TYPE "profession" AS ENUM ('roi_des_pirates', 'empereur', 'capitaine', 'second', 'navigateur', 'cuisinier', 'medecin', 'tireur_d_elite', 'charpentier', 'musicien', 'archeologue', 'timonier', 'mousse', 'combattant', 'amiral_en_chef', 'amiral', 'vice_amiral', 'contre_amiral', 'commodore', 'colonel', 'lieutenant', 'enseigne', 'matelot', 'agent_du_cp', 'gardien_de_prison', 'chef_supreme', 'commandant_en_chef', 'commandant_d_armee', 'officier_revolutionnaire', 'agent_d_infiltration', 'stratege', 'inventeur', 'tenancier_de_bar', 'journaliste', 'scientifique', 'forgeron', 'chasseur_de_primes', 'marchand', 'roi', 'reine', 'prince', 'princesse', 'citoyen', 'pecheur', 'voleur', 'esclave', 'courtier_de_l_ombre', 'dragon_celeste');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arcs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "arcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onePieceCharacter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isAlive" BOOLEAN NOT NULL,
    "devilFruit_id" INTEGER,
    "organisationId" INTEGER,
    "equipageId" INTEGER,
    "profession" "profession" NOT NULL,
    "arcId" INTEGER,

    CONSTRAINT "onePieceCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devilFruit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER,

    CONSTRAINT "devilFruit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faction" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "equipageId" INTEGER,

    CONSTRAINT "faction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Equipages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "devilFruitId" INTEGER,
    "onePieceCharacterId" INTEGER,
    "arcId" INTEGER,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "page_slug_key" ON "page"("slug");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_devilFruit_id_fkey" FOREIGN KEY ("devilFruit_id") REFERENCES "devilFruit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "faction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_equipageId_fkey" FOREIGN KEY ("equipageId") REFERENCES "Equipages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onePieceCharacter" ADD CONSTRAINT "onePieceCharacter_arcId_fkey" FOREIGN KEY ("arcId") REFERENCES "arcs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devilFruit" ADD CONSTRAINT "devilFruit_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faction" ADD CONSTRAINT "faction_equipageId_fkey" FOREIGN KEY ("equipageId") REFERENCES "Equipages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_devilFruitId_fkey" FOREIGN KEY ("devilFruitId") REFERENCES "devilFruit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_onePieceCharacterId_fkey" FOREIGN KEY ("onePieceCharacterId") REFERENCES "onePieceCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_arcId_fkey" FOREIGN KEY ("arcId") REFERENCES "arcs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
