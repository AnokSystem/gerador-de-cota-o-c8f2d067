import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CatalogData } from '@/types/catalog';

// Helper function to format currency values
const formatCurrency = (value: string): string => {
  // Remove any existing currency symbols and whitespace
  const cleanValue = value.replace(/[R$\s]/g, '');
  
  // If it's already formatted, return as is
  if (cleanValue.includes(',') || cleanValue.includes('.')) {
    // Ensure proper format: R$ 1.250,00
    const numStr = cleanValue.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(numStr);
    if (!isNaN(num)) {
      return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }
  
  // If it's a plain number, format it
  const num = parseFloat(cleanValue);
  if (!isNaN(num)) {
    return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  return value;
};

// Helper function to get last day of month
const getLastDayOfMonth = (monthName: string): string => {
  const months: { [key: string]: number } = {
    'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3,
    'Maio': 4, 'Junho': 5, 'Julho': 6, 'Agosto': 7,
    'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11
  };
  
  const currentYear = new Date().getFullYear();
  const monthIndex = months[monthName];
  
  if (monthIndex !== undefined) {
    const lastDay = new Date(currentYear, monthIndex + 1, 0).getDate();
    return `${lastDay} de ${monthName} de ${currentYear}`;
  }
  
  return monthName;
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  // Cover Page
  coverPage: {
    backgroundColor: '#0f1820',
    padding: 0,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  coverDiagonal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '40%',
    height: '100%',
    backgroundColor: '#00ff41',
  },
  coverContent: {
    flex: 1,
    padding: 60,
    display: 'flex',
    justifyContent: 'space-between',
  },
  yearBadge: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    border: '2px solid #00ff41',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
  },
  coverTitle: {
    position: 'absolute',
    right: 60,
    top: '35%',
    fontSize: 64,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.1,
  },
  coverSubtitle: {
    position: 'absolute',
    right: 60,
    bottom: 180,
    fontSize: 22,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    border: '2px solid #00ffff',
    textAlign: 'center',
  },
  coverTagline: {
    position: 'absolute',
    right: 60,
    bottom: 140,
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
  },
  logoBottom: {
    position: 'absolute',
    right: 60,
    bottom: 60,
    width: 200,
    height: 50,
  },
  // About Page
  aboutPage: {
    backgroundColor: '#0f1820',
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  greenCurve: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  aboutTitle: {
    fontSize: 56,
    color: '#00ff41',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 30,
  },
  aboutText: {
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 1.8,
    marginBottom: 20,
    maxWidth: '70%',
  },
  aboutHighlight: {
    fontFamily: 'Helvetica-Bold',
  },
  aboutTagline: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    marginTop: 40,
  },
  // Advantages Page
  advantagesPage: {
    backgroundColor: '#0f1820',
    padding: 60,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  advantagesLeft: {
    flex: 1,
    paddingRight: 40,
  },
  advantagesTitle: {
    fontSize: 32,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 40,
    lineHeight: 1.3,
  },
  advantageItem: {
    backgroundColor: 'transparent',
    border: '2px solid #00ffff',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
  },
  advantageText: {
    fontSize: 13,
    color: '#ffffff',
  },
  advantageHighlight: {
    fontFamily: 'Helvetica-Bold',
  },
  // Proposal Page
  proposalPage: {
    backgroundColor: '#ffffff',
    padding: 60,
  },
  proposalHeader: {
    marginBottom: 40,
  },
  proposalTitle: {
    fontSize: 32,
    color: '#0088aa',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 30,
  },
  proposalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  proposalLocation: {
    fontSize: 14,
    color: '#333',
  },
  proposalLocationHighlight: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
  },
  proposalValidity: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  proposalValidityLabel: {
    fontSize: 11,
    color: '#999',
  },
  proposalValidityDate: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
  },
  proposalValiditySection: {
    marginBottom: 30,
  },
  proposalValidityTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
    marginBottom: 5,
  },
  proposalNumber: {
    fontSize: 10,
    color: '#333',
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
  },
  // Table
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e8f4f8',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderBottom: '2px solid #0088aa',
  },
  tableHeaderCell: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0088aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderRadius: 6,
    border: '1px solid #e0e0e0',
  },
  tableCell: {
    fontSize: 11,
    color: '#333',
    lineHeight: 1.4,
  },
  tableCellBold: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#0088aa',
  },
  col1: { width: '15%', paddingRight: 8 },
  col2: { width: '40%', paddingRight: 8 },
  col3: { width: '20%', paddingRight: 8 },
  col4: { width: '25%', textAlign: 'right' },
  paymentMethods: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  // Thank You Page
  thanksPage: {
    backgroundColor: '#0f1820',
    padding: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thanksTitle: {
    fontSize: 64,
    color: '#00ff41',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  thanksText: {
    fontSize: 13,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 1.8,
    maxWidth: '80%',
    marginBottom: 40,
  },
  thanksHighlight: {
    fontFamily: 'Helvetica-Bold',
  },
  contactBox: {
    backgroundColor: 'transparent',
    border: '2px solid #00ff41',
    borderRadius: 30,
    padding: 20,
    marginBottom: 40,
  },
  contactText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  contactNumber: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  footer: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

interface PDFDocumentProps {
  data: CatalogData;
}

export const PDFDocument = ({ data }: PDFDocumentProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverDiagonal} />
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>{currentYear}</Text>
        </View>
        <View style={styles.coverContent}>
          <Text style={styles.coverTitle}>
            Proposta{'\n'}
            comercial
          </Text>
          <Text style={styles.coverSubtitle}>
            FOLHITA COMUNICAÇÃO VISUAL E LED
          </Text>
          <Text style={styles.coverTagline}>
            O MAIOR OUTDOOR DE LED DA BAHIA
          </Text>
        </View>
      </Page>

      {/* About Page */}
      <Page size="A4" style={styles.aboutPage}>
        <Text style={styles.aboutTitle}>Quem somos?</Text>
        <Text style={styles.aboutText}>
          <Text style={styles.aboutHighlight}>A Folhita Comunicação Visual</Text> é especialista em visibilidade para marcas e negócios, com os <Text style={styles.aboutHighlight}>maiores e mais impactantes outdoors de LED da Bahia.</Text> Nossa tecnologia de última geração em painéis de LED permite que sua mensagem se destaque, alcance mais pessoas e gere resultados reais. Quando se trata de comunicação visual de alto impacto, a Folhita é a escolha certa para transformar sua marca em uma referência.
        </Text>
        <Text style={styles.aboutTagline}>
          Folhita - Visibilidade que move seu negócio!
        </Text>
      </Page>

      {/* Advantages Page */}
      <Page size="A4" style={styles.advantagesPage}>
        <View style={styles.advantagesLeft}>
          <Text style={styles.advantagesTitle}>
            Vantagens de{'\n'}anunciar com a gente
          </Text>
          <View style={styles.advantageItem}>
            <Text style={styles.advantageText}>
              <Text style={styles.advantageHighlight}>10 mil pessoas</Text> alcançadas por dia
            </Text>
          </View>
          <View style={styles.advantageItem}>
            <Text style={styles.advantageText}>
              Exibição da sua marca <Text style={styles.advantageHighlight}>262 por dia</Text>
            </Text>
          </View>
          <View style={styles.advantageItem}>
            <Text style={styles.advantageText}>
              <Text style={styles.advantageHighlight}>Locais estratégico</Text>
            </Text>
          </View>
          <View style={styles.advantageItem}>
            <Text style={styles.advantageText}>
              Fortalecimento da sua marca
            </Text>
          </View>
          <View style={styles.advantageItem}>
            <Text style={styles.advantageText}>
              Aumento da sua taxa de vendas
            </Text>
          </View>
        </View>
      </Page>

      {/* Proposal Page */}
      <Page size="A4" style={styles.proposalPage}>
        <View style={styles.proposalHeader}>
          <Text style={styles.proposalTitle}>Proposta comercial</Text>
          
          <View style={styles.proposalInfo}>
            <View>
              <Text style={styles.proposalLocation}>
                Direcionada para: <Text style={styles.proposalLocationHighlight}>{data.location}</Text>
              </Text>
            </View>
            <View>
              <View style={styles.proposalValiditySection}>
                <Text style={styles.proposalValidityLabel}>Orçamento válido até</Text>
                <Text style={styles.proposalValidityDate}>{getLastDayOfMonth(data.validUntil)}</Text>
              </View>
              <Text style={styles.proposalNumber}>Número da proposta{'\n'}{data.proposalCode}</Text>
            </View>
          </View>

          <Text style={styles.proposalValidityTitle}>Validade da proposta</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>DURAÇÃO DO VÍDEO</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>LOCAL</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>TEMPO DE CONTRATO</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>VALOR</Text>
          </View>
          
          {data.plans.map((plan, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCellBold, styles.col1]}>{plan.duration}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{plan.location}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{plan.contractTime}</Text>
              <Text style={[styles.tableCellBold, styles.col4]}>{formatCurrency(plan.value)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.paymentMethods}>
          PIX (SEM JUROS) | CARTÃO DE CRÉDITO COM JUROS) | BOLETO (3,5% TAXA)
        </Text>
      </Page>

      {/* Thank You Page */}
      <Page size="A4" style={styles.thanksPage}>
        <Text style={styles.thanksTitle}>Obrigado</Text>
        <Text style={styles.thanksText}>
          Agradecemos imensamente por nos permitir apresentar a <Text style={styles.thanksHighlight}>Folhita Comunicação Visual E LED!</Text> Estamos prontos para transformar sua marca com nossa comunicação de impacto, seja nos maiores outdoors de LED da Bahia ou com nossos materiais personalizados que deixam sua marca presente no dia a dia do seu público.
        </Text>
        <View style={styles.contactBox}>
          <Text style={styles.contactText}>
            📱 <Text style={styles.contactNumber}>73 9982-7391</Text>
          </Text>
        </View>
        <Text style={styles.footer}>
          Copyright © 2024 @folhita_cv, all rights reserved.
        </Text>
      </Page>
    </Document>
  );
};
