// Paleta única do app. Qualquer cor usada em uma tela deve vir daqui —
// isso evita hexadecimais espalhados e mantém o visual consistente.

export const colors = {
  // Marca / ações principais — extraído de pop-rs.rnp.br: #1E695D é a
  // "Global Color 0" do tema do site (cor de links/CTA), usada aqui como
  // cor primária do app.
  primary: '#1E695D',
  primaryDark: '#154A41',
  primarySoft: '#DCEEEA',

  // Textos e ícones sobre fundo escuro (navy)
  onDarkTitle: '#FFFFFF',
  onDarkEyebrow: '#7FD9C4',
  onDarkBody: '#CBD5E1',
  onDarkMuted: '#94A3B8',
  onDarkLink: '#9FE6D3',
  overlayOnDark: 'rgba(255, 255, 255, 0.08)',

  // Fundo escuro (hero / headers) — mesmo cinza-chumbo do cabeçalho de
  // pop-rs.rnp.br (#3A3A3A), em vez do azul-marinho anterior.
  navy: '#3A3A3A',

  // Fundos
  background: '#F1F5F9',
  backgroundSoft: '#F8FAFC',
  surface: '#FFFFFF',

  // Bordas e divisores
  border: '#CBD5E1',
  borderSoft: '#E2E8F0',

  // Texto sobre fundo claro
  textTitle: '#0F172A',
  textBody: '#334155',
  textSecondary: '#475569',
  textMuted: '#64748B',
  placeholder: '#94A3B8',

  // Estados semânticos
  success: '#15803D',
  successBg: '#DCFCE7',
  successText: '#166534',

  warning: '#B45309',
  warningBg: '#FEF3C7',
  warningText: '#92400E',

  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  dangerBorder: '#FCA5A5',
  dangerText: '#991B1B',
  dangerTextStrong: '#B91C1C',

  white: '#FFFFFF',
};
