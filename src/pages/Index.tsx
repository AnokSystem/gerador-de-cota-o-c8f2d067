import { useState } from "react";
import { CatalogForm } from "@/components/CatalogForm";
import { PDFDocument } from "@/components/PDFDocument";
import { CatalogData } from "@/types/catalog";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import logoFolhita from "@/assets/logo-folhita.png";
import { toast } from "sonner";

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGenerate = async (data: CatalogData) => {
    setIsGenerating(true);
    try {
      const doc = <PDFDocument data={data} />;
      const blob = await pdf(doc).toBlob();
      
      // Limpar URL anterior se existir
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      // Criar novo URL para visualização
      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);
      
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfBlob) {
      saveAs(pdfBlob, `proposta-comercial-folhita-${Date.now()}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-3xl" />
      
      {/* Diagonal Accent */}
      <div className="absolute top-0 left-0 w-96 h-full bg-gradient-to-br from-primary/10 to-transparent" 
           style={{ clipPath: 'polygon(0 0, 100% 0, 40% 100%, 0% 100%)' }} />
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12 space-y-6">
          <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-top duration-700">
            <img 
              src={logoFolhita} 
              alt="Folhita Comunicação Visual" 
              className="h-16 w-auto drop-shadow-[0_0_20px_rgba(0,255,65,0.3)]"
            />
          </div>
          
          <div className="space-y-3 animate-in fade-in slide-in-from-top duration-700 delay-150">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-primary drop-shadow-lg">
              Gerador de Cotação
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie propostas comerciais profissionais em PDF para a{" "}
              <span className="text-primary font-semibold">Folhita Comunicação Visual</span>
            </p>
          </div>
        </header>

        {/* Form */}
        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-lg text-muted-foreground">Gerando seu catálogo...</p>
            </div>
          ) : (
            <CatalogForm onGenerate={handleGenerate} />
          )}
        </div>

        {/* PDF Viewer */}
        {pdfUrl && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Visualizar PDF</h2>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Baixar PDF
                </button>
              </div>
              <div className="w-full h-[600px] border border-border rounded-lg overflow-hidden bg-background">
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 text-center">
                    <svg className="w-16 h-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-muted-foreground">
                      Seu navegador não pode exibir o PDF.
                    </p>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Clique aqui para baixar
                    </button>
                  </div>
                </object>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground space-y-2 animate-in fade-in duration-700 delay-500">
          <p className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-primary/30" />
            O maior outdoor de LED da Bahia
            <span className="h-px w-8 bg-primary/30" />
          </p>
          <p>73 9982-7391</p>
          <p className="text-xs">© 2024 Folhita Comunicação Visual E LED. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
