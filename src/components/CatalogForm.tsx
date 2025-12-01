import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiPlusCircle, FiTrash2, FiDownload } from "react-icons/fi";
import { PlanData, CatalogData } from "@/types/catalog";
import { toast } from "sonner";

interface CatalogFormProps {
  onGenerate: (data: CatalogData) => void;
}

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const CatalogForm = ({ onGenerate }: CatalogFormProps) => {
  const [validUntil, setValidUntil] = useState("");
  const [plans, setPlans] = useState<PlanData[]>([
    { id: "1", duration: "10 SEG", location: "", contractTime: "30 dias", value: "" }
  ]);

  const addPlan = () => {
    const newPlan: PlanData = {
      id: Date.now().toString(),
      duration: "10 SEG",
      location: "",
      contractTime: "30 dias",
      value: ""
    };
    setPlans([...plans, newPlan]);
  };

  const removePlan = (id: string) => {
    if (plans.length > 1) {
      setPlans(plans.filter(p => p.id !== id));
    } else {
      toast.error("Você deve ter pelo menos um plano");
    }
  };

  const updatePlan = (id: string, field: keyof PlanData, value: string) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const generateProposalCode = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `FCV${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  const extractLocation = (fullLocation: string) => {
    const locationMap: { [key: string]: string } = {
      'ITAMARAJÚ/BA - PRAÇA CASTELO BRANCO': 'Itamarajú - BA',
      'EUNÁPOLIS/BA - BR101': 'Eunápolis - BA',
      'EUNÁPOLIS/BA - BR367': 'Eunápolis - BA',
    };
    return locationMap[fullLocation] || 'Itamarajú - BA';
  };

  const formatValueWithCurrency = (value: string) => {
    if (value.trim().startsWith('R$')) {
      return value;
    }
    return `R$ ${value}`;
  };

  const handleGenerate = () => {
    if (!validUntil) {
      toast.error("Selecione o mês de validade");
      return;
    }

    const invalidPlan = plans.find(p => !p.location || !p.value);
    if (invalidPlan) {
      toast.error("Preencha todos os campos dos planos");
      return;
    }

    const proposalCode = generateProposalCode();
    const location = plans[0]?.location ? extractLocation(plans[0].location) : 'Itamarajú - BA';
    const formattedPlans = plans.map(plan => ({
      ...plan,
      value: formatValueWithCurrency(plan.value)
    }));

    onGenerate({ 
      validUntil, 
      plans: formattedPlans,
      proposalCode,
      location
    });
    toast.success(`Gerando catálogo PDF - Código: ${proposalCode}`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-green">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-primary rounded-full" />
            Configuração do Catálogo
          </CardTitle>
          <CardDescription>
            Preencha as informações para gerar a proposta comercial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="validUntil">Orçamento válido até</Label>
            <Select value={validUntil} onValueChange={setValidUntil}>
              <SelectTrigger id="validUntil" className="border-primary/20 focus:ring-primary">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 shadow-green">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="h-6 w-1 bg-gradient-secondary rounded-full" />
                Planos
              </CardTitle>
              <CardDescription>
                Adicione os planos e valores da proposta
              </CardDescription>
            </div>
            <Button onClick={addPlan} variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <FiPlusCircle className="h-4 w-4" />
              Adicionar Plano
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {plans.map((plan, index) => (
            <div key={plan.id} className="p-4 border border-border rounded-lg space-y-4 bg-muted/30 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">Plano {index + 1}</h4>
                {plans.length > 1 && (
                  <Button
                    onClick={() => removePlan(plan.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`duration-${plan.id}`}>Duração do vídeo</Label>
                  <Select 
                    value={plan.duration} 
                    onValueChange={(v) => updatePlan(plan.id, "duration", v)}
                  >
                    <SelectTrigger id={`duration-${plan.id}`} className="border-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10 SEG">10 SEG</SelectItem>
                      <SelectItem value="15 SEG">15 SEG</SelectItem>
                      <SelectItem value="20 SEG">20 SEG</SelectItem>
                      <SelectItem value="30 SEG">30 SEG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`location-${plan.id}`}>Local</Label>
                  <Select 
                    value={plan.location} 
                    onValueChange={(v) => updatePlan(plan.id, "location", v)}
                  >
                    <SelectTrigger id={`location-${plan.id}`} className="border-primary/20 bg-background">
                      <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="ITAMARAJÚ/BA - PRAÇA CASTELO BRANCO">Itamarajú/BA - Praça Castelo Branco</SelectItem>
                      <SelectItem value="EUNÁPOLIS/BA - BR101">Eunápolis/BA - BR101</SelectItem>
                      <SelectItem value="EUNÁPOLIS/BA - BR367">Eunápolis/BA - BR367</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`contractTime-${plan.id}`}>Tempo de contrato</Label>
                  <Select 
                    value={plan.contractTime} 
                    onValueChange={(v) => updatePlan(plan.id, "contractTime", v)}
                  >
                    <SelectTrigger id={`contractTime-${plan.id}`} className="border-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30 dias">30 dias</SelectItem>
                      <SelectItem value="6 meses">6 meses</SelectItem>
                      <SelectItem value="12 meses">12 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`value-${plan.id}`}>Valor</Label>
                  <Input
                    id={`value-${plan.id}`}
                    placeholder="Ex: R$1.650,00 ou R$1.200,00 /por mês"
                    value={plan.value}
                    onChange={(e) => updatePlan(plan.id, "value", e.target.value)}
                    className="border-primary/20 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button 
        onClick={handleGenerate} 
        className="w-full bg-gradient-primary hover:shadow-green transition-all duration-300 text-dark font-bold text-lg h-12 gap-2"
      >
        <FiDownload className="h-5 w-5" />
        Gerar Catálogo PDF
      </Button>
    </div>
  );
};
