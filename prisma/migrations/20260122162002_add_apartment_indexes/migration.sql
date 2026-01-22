-- CreateIndex
CREATE INDEX "apartments_status_idx" ON "apartments"("status");

-- CreateIndex
CREATE INDEX "apartments_deal_date_idx" ON "apartments"("deal_date");

-- CreateIndex
CREATE INDEX "apartments_building_id_status_idx" ON "apartments"("building_id", "status");
