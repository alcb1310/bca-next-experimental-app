-- CreateTable
CREATE TABLE "actual" (
    "uuid" UUID NOT NULL,
    "date" DATE NOT NULL,
    "initial_quantity" DOUBLE PRECISION,
    "initial_cost" DOUBLE PRECISION,
    "initial_total" DOUBLE PRECISION NOT NULL,
    "spent_quantity" DOUBLE PRECISION,
    "spent_total" DOUBLE PRECISION NOT NULL,
    "to_spend_quantity" DOUBLE PRECISION,
    "to_spend_cost" DOUBLE PRECISION,
    "to_spend_total" DOUBLE PRECISION NOT NULL,
    "updated_budget" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUuid" UUID NOT NULL,
    "companyUuid" UUID NOT NULL,
    "budgetItemUuid" UUID NOT NULL,
    "projectUuid" UUID NOT NULL,

    CONSTRAINT "PK_7edbc27cf247dfe1b6dc89909d6" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "budget" (
    "uuid" UUID NOT NULL,
    "initial_quantity" DOUBLE PRECISION,
    "initial_cost" DOUBLE PRECISION,
    "initial_total" DOUBLE PRECISION NOT NULL,
    "spent_quantity" DOUBLE PRECISION,
    "spent_total" DOUBLE PRECISION NOT NULL,
    "to_spend_quantity" DOUBLE PRECISION,
    "to_spend_cost" DOUBLE PRECISION,
    "to_spend_total" DOUBLE PRECISION NOT NULL,
    "updated_budget" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUuid" UUID NOT NULL,
    "companyUuid" UUID NOT NULL,
    "budgetItemUuid" UUID NOT NULL,
    "projectUuid" UUID NOT NULL,

    CONSTRAINT "PK_35003e86ae314e9a9bf61175c8e" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "budget_item" (
    "uuid" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "accumulates" BOOLEAN NOT NULL,
    "level" INTEGER NOT NULL,
    "parentUuid" UUID,
    "companyUuid" UUID NOT NULL,
    "userUuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_9d18eae52de29ce245aa5f5f892" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "company" (
    "uuid" UUID NOT NULL,
    "ruc" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "employees" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PK_3fa0b2af99d910864a56bb10c9e" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "historic" (
    "uuid" UUID NOT NULL,
    "date" DATE NOT NULL,
    "initial_quantity" DOUBLE PRECISION,
    "initial_cost" DOUBLE PRECISION,
    "initial_total" DOUBLE PRECISION NOT NULL,
    "spent_quantity" DOUBLE PRECISION,
    "spent_total" DOUBLE PRECISION NOT NULL,
    "to_spend_quantity" DOUBLE PRECISION,
    "to_spend_cost" DOUBLE PRECISION,
    "to_spend_total" DOUBLE PRECISION NOT NULL,
    "updated_budget" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUuid" UUID NOT NULL,
    "companyUuid" UUID NOT NULL,
    "budgetItemUuid" UUID NOT NULL,
    "projectUuid" UUID NOT NULL,

    CONSTRAINT "PK_7c2d796432a8f721f015e317d01" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "invoice" (
    "uuid" UUID NOT NULL,
    "invoice_number" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyUuid" UUID NOT NULL,
    "userUuid" UUID NOT NULL,
    "projectUuid" UUID NOT NULL,
    "supplierUuid" UUID NOT NULL,

    CONSTRAINT "PK_1b1d3a15ed53945d408170cecac" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "invoice_detail" (
    "uuid" UUID NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyUuid" UUID NOT NULL,
    "userUuid" UUID NOT NULL,
    "invoiceUuid" UUID NOT NULL,
    "budgetItemUuid" UUID NOT NULL,

    CONSTRAINT "PK_44db6c5023868cc3a4ba113cc59" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "project" (
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyUuid" UUID NOT NULL,
    "userUuid" UUID NOT NULL,

    CONSTRAINT "PK_bcbc9244374131f3ccb908aa616" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "supplier" (
    "uuid" UUID NOT NULL,
    "supplier_id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "contact_name" VARCHAR(255),
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyUuid" UUID NOT NULL,
    "userUuid" UUID NOT NULL,

    CONSTRAINT "PK_62ac7616a6c42e0a4791ebcbc0b" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "user" (
    "uuid" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(70) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyUuid" UUID NOT NULL,

    CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_b8f062edbaae5b4790233194b38" ON "actual"("companyUuid", "budgetItemUuid", "projectUuid", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_d465c5c453b817365b87356b222" ON "budget"("companyUuid", "budgetItemUuid", "projectUuid");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_1427fdbe24638da548245e2798c" ON "budget_item"("companyUuid", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_fdf44d6ec7a045d6cfd8d4f2c23" ON "budget_item"("companyUuid", "code");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_ff7cf4a7fea3ee1088f54b8845f" ON "company"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_a76c5cd486f7779bd9c319afd27" ON "company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_6b3da41aeaaac2ea0ff9063613d" ON "historic"("companyUuid", "budgetItemUuid", "projectUuid", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_58cac7655d671763fe362193ee1" ON "invoice"("companyUuid", "supplierUuid", "invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_e1145d74c2bc5c363f03f578312" ON "invoice_detail"("companyUuid", "invoiceUuid", "budgetItemUuid");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_61ce21107868524097971f71910" ON "project"("companyUuid", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_1930e0158781fc62c874cb9afa7" ON "supplier"("name", "companyUuid");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_9f57ed8a5a42a044198913aaa59" ON "supplier"("supplier_id", "companyUuid");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_e12875dfb3b1d92d7d7c5377e22" ON "user"("email");

-- AddForeignKey
ALTER TABLE "actual" ADD CONSTRAINT "FK_02bed64c2c1872db6f45b98f230" FOREIGN KEY ("projectUuid") REFERENCES "project"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "actual" ADD CONSTRAINT "FK_456392568b79e1486a33d2dec0f" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "actual" ADD CONSTRAINT "FK_75033ed0f74128723e077a26426" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "actual" ADD CONSTRAINT "FK_ba20a50b524acd2d3585e37ccc7" FOREIGN KEY ("budgetItemUuid") REFERENCES "budget_item"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "FK_52c877a5fe37edb91c3f47e627d" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "FK_656ef245a9ca4a5af03446a250e" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "FK_e07a6bbacc6f5d89ef95e51d824" FOREIGN KEY ("projectUuid") REFERENCES "project"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "FK_e6fbe3f575219c8ade814c6dc96" FOREIGN KEY ("budgetItemUuid") REFERENCES "budget_item"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "budget_item" ADD CONSTRAINT "FK_a23b85c6764b8dfe2085b25cc73" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "budget_item" ADD CONSTRAINT "FK_a4fbfdd8f791dacff590e5ed9c7" FOREIGN KEY ("parentUuid") REFERENCES "budget_item"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "budget_item" ADD CONSTRAINT "FK_dae1c48d1ec9c22078c242c0140" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historic" ADD CONSTRAINT "FK_1b8b8e8f110cbf6e1d67c3a86c6" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historic" ADD CONSTRAINT "FK_5f741e2738d9ba0e73fd767062d" FOREIGN KEY ("projectUuid") REFERENCES "project"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historic" ADD CONSTRAINT "FK_a07b488758a3b4fc3ba051f9b39" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historic" ADD CONSTRAINT "FK_f0323e1bdf089a7cdf6043ec9ab" FOREIGN KEY ("budgetItemUuid") REFERENCES "budget_item"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "FK_27dd439067c11b483c48b4a694f" FOREIGN KEY ("projectUuid") REFERENCES "project"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "FK_2eb1bbce9f556ac6d4da9e58483" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "FK_801d708d207c5411da32c00c8bd" FOREIGN KEY ("supplierUuid") REFERENCES "supplier"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "FK_a6ce41def95254e11eddb2d4f7c" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_detail" ADD CONSTRAINT "FK_3f8a5edcb6c041d6d26edb6afb2" FOREIGN KEY ("budgetItemUuid") REFERENCES "budget_item"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_detail" ADD CONSTRAINT "FK_5e20c0c0447108815afe267c154" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_detail" ADD CONSTRAINT "FK_808915c75bb73c93f2b3411d96c" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_detail" ADD CONSTRAINT "FK_ca6166dfcb4eb139f9e9de09fc5" FOREIGN KEY ("invoiceUuid") REFERENCES "invoice"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "FK_1a0f1c7c38d3b95ebb085dcd886" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "FK_e7657038cf2af0ac02bcaf375d3" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "supplier" ADD CONSTRAINT "FK_9bfbb75370f133c1181d076254a" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "supplier" ADD CONSTRAINT "FK_b8912ad1081a620d0f397b57136" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "FK_476e1fb6a4f7a62a9e5d0eed19c" FOREIGN KEY ("companyUuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

