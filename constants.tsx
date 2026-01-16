
export const DEFAULT_AREAS = [
  "Portaria / Guarita", "Hall de entrada", "Recepção", "Elevadores", "Escadas",
  "Corrimãos", "Garagens", "Rampas de acesso", "Pátio / Área externa",
  "Jardim / Paisagismo", "Área de lazer", "Piscina", "Vestiários",
  "Banheiros comuns", "Salão de festas", "Churrasqueira", "Playground",
  "Academia", "Brinquedoteca", "Depósitos", "Casa de bombas", "Casa de máquinas",
  "Lixeira / Central de resíduos", "Abrigo de gás", "Quadra esportiva",
  "Telhado / Cobertura", "Iluminação das áreas comuns", "Portas corta-fogo",
  "Sinalização de segurança"
];

export const MOCK_CONDOMINIUMS = [
  {
    id: "1",
    name: "Residencial Jardins",
    address: "Av. das Palmeiras, 100",
    blocks: 2,
    floors: 12,
    commonAreas: DEFAULT_AREAS.slice(0, 10)
  },
  {
    id: "2",
    name: "Condomínio Blue Sky",
    address: "Rua do Horizonte, 500",
    blocks: 4,
    floors: 15,
    commonAreas: DEFAULT_AREAS
  }
];
