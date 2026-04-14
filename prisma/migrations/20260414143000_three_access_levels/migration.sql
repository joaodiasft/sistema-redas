-- Três níveis: ADMIN, PROFESSOR, ALUNO (remove COORDENADOR e RECEPCAO)
UPDATE "Usuario" SET "perfil" = 'ADMIN' WHERE "perfil"::text IN ('COORDENADOR', 'RECEPCAO');

CREATE TYPE "PerfilUsuario_new" AS ENUM ('ADMIN', 'PROFESSOR', 'ALUNO');

ALTER TABLE "Usuario" ALTER COLUMN "perfil" DROP DEFAULT;
ALTER TABLE "Usuario" ALTER COLUMN "perfil" TYPE "PerfilUsuario_new" USING ("perfil"::text::"PerfilUsuario_new");
ALTER TABLE "Usuario" ALTER COLUMN "perfil" SET DEFAULT 'ALUNO'::"PerfilUsuario_new";

DROP TYPE "PerfilUsuario";
ALTER TYPE "PerfilUsuario_new" RENAME TO "PerfilUsuario";
