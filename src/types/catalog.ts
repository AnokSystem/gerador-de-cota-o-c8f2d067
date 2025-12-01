export interface PlanData {
  id: string;
  duration: string;
  location: string;
  contractTime: string;
  value: string;
}

export interface ClientData {
  cnpj: string;
  nome: string;
  fantasia: string;
  email: string;
  telefone: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

export interface CatalogData {
  validUntil: string;
  plans: PlanData[];
  proposalCode: string;
  location: string;
  client?: ClientData;
}
