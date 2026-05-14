import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 48,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: '2px solid #000000',
    paddingBottom: 16,
  },
  company: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  label: {
    fontSize: 9,
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 11,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    borderBottom: '1px solid #000000',
    paddingBottom: 6,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    padding: '6 8',
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #cccccc',
    padding: '6 8',
  },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colUnit: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 8,
    borderTop: '2px solid #000000',
  },
  totalLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    marginRight: 24,
  },
  totalValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
  },
})

interface DevisLine {
  description: string
  quantity: number
  unitPrice: number
}

interface DevisTemplateProps {
  reference: string
  date: string
  clientName: string
  clientAddress: string
  lines: DevisLine[]
}

export default function DevisTemplate({
  reference,
  date,
  clientName,
  clientAddress,
  lines,
}: DevisTemplateProps) {
  const total = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0)

  return (
    <Document title={`Devis ${reference}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.company}>VK Tooling</Text>
          </View>
          <View>
            <Text style={styles.label}>Référence</Text>
            <Text style={styles.value}>{reference}</Text>
            <Text style={[styles.label, { marginTop: 8 }]}>Date</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text style={styles.value}>{clientName}</Text>
          <Text style={[styles.value, { color: '#555555' }]}>{clientAddress}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qté</Text>
            <Text style={[styles.tableHeaderCell, styles.colUnit]}>P.U. (€)</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total (€)</Text>
          </View>
          {lines.map((line, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDescription}>{line.description}</Text>
              <Text style={styles.colQty}>{line.quantity}</Text>
              <Text style={styles.colUnit}>{line.unitPrice.toFixed(2)}</Text>
              <Text style={styles.colTotal}>{(line.quantity * line.unitPrice).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} €</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
