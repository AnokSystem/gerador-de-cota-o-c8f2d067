export interface PlanData {
  id: string;
  duration: string;
  location: string;
  contractTime: string;
  value: string;
}

export interface CatalogData {
  validUntil: string;
  plans: PlanData[];
  proposalCode: string;
  location: string;
}
